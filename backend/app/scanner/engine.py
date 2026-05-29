import asyncio
import aiohttp
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import re
from typing import List, Dict, Any, Set
from ..detectors.api_key_detector import APIKeyDetector
from ..detectors.info_leak_detector import InfoLeakDetector
from ..detectors.ai_code_smell_detector import AICodeSmellDetector
from .risk_scorer import RiskScorer

class ScannerEngine:
    def __init__(self):
        self.detectors = [APIKeyDetector(), InfoLeakDetector(), AICodeSmellDetector()]
        self.scorer = RiskScorer()
        self.session = None

    async def _fetch(self, url: str) -> str:
        try:
            async with self.session.get(url, timeout=10) as response:
                if response.status == 200:
                    return await response.text()
                return ""
        except Exception:
            return ""

    async def scan_url(self, target_url: str) -> Dict[str, Any]:
        async with aiohttp.ClientSession(headers={"User-Agent": "KeySentry-Scanner/1.0"}) as session:
            self.session = session
            report = {
                "target_url": target_url,
                "assets_scanned": 0,
                "findings": [],
                "score": 100,
                "status": "Safe"
            }
            
            # Step 1: Fetch HTML
            html_content = await self._fetch(target_url)
            if not html_content:
                return {"error": "Could not reach target URL"}
            
            report["assets_scanned"] += 1
            
            # Run detectors on HTML
            for detector in self.detectors:
                report["findings"].extend(detector.detect(html_content, target_url))
            
            # Step 2: Extract Scripts
            soup = BeautifulSoup(html_content, 'html.parser')
            script_urls = set()
            inline_scripts = []
            
            for script in soup.find_all('script'):
                src = script.get('src')
                if src:
                    full_src = urljoin(target_url, src)
                    # Only scan scripts from same origin or common CDNs to avoid bloat
                    if urlparse(full_src).netloc == urlparse(target_url).netloc or any(cdn in full_src for cdn in ["cdnjs", "unpkg", "jsdelivr"]):
                         script_urls.add(full_src)
                else:
                    if script.string:
                        inline_scripts.append(script.string)

            # Detect in inline scripts
            for code in inline_scripts:
                for detector in self.detectors:
                    report["findings"].extend(detector.detect(code, f"{target_url}#inline"))

            # Step 3: Fetch and Scan External Scripts
            for url in script_urls:
                js_content = await self._fetch(url)
                if js_content:
                    report["assets_scanned"] += 1
                    for detector in self.detectors:
                        report["findings"].extend(detector.detect(js_content, url))
                    
                    # Try to check if source map exists
                    # Logic: if script ends in //# sourceMappingURL=XYZ, try fetch urljoin(url, XYZ)
                    map_match = re.search(r"//#\s*sourceMappingURL=([^\s]+)", js_content)
                    if map_match:
                         map_url = urljoin(url, map_match.group(1))
                         map_content = await self._fetch(map_url)
                         if map_content:
                              # Scanning source maps directly because they are JSON
                              for detector in self.detectors:
                                   report["findings"].extend(detector.detect(map_content, map_url))
            
            # Final scoring
            report["score"] = self.scorer.calculate_score(report["findings"])
            report["status"] = self.scorer.get_status(report["score"])
            
            return report
