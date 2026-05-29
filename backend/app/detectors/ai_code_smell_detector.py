import re
from typing import List, Dict, Any
from .base_detector import BaseDetector


class AICodeSmellDetector(BaseDetector):
    def __init__(self):
        super().__init__("AI-Generated Code Smell Detector")
        self.smells = {
            "Insecure Placeholder": {
                "regex": r"""['"](?:YOUR_API_KEY|INSERT_SECRET_HERE|REPLACE_ME|YOUR_TOKEN|ENTER_KEY_HERE)['"]""",
                "severity": "Medium",
                "confidence": 0.75,
                "explanation": "Detected a template-like placeholder suggesting copied tutorial or AI-generated code that may be incomplete or insecure.",
                "remediation": "Replace placeholders with secure backend-managed environment variables."
            },
            "Temporary Secret Comment": {
                "regex": r"""//\s*(?:temp|temporary|demo|test|local)(?:\s+\w+){0,3}\s+(?:api\s+key|key|secret|token|auth|credential|cred)""",
                "severity": "High",
                "confidence": 0.85,
                "explanation": "Found a comment indicating a temporary/demo/local credential may have been left in code.",
                "remediation": "Remove temporary credentials from frontend code and move them to secure backend storage."
            },
            "LLM-Style Code Comment": {
                "regex": r"""//\s*(?:the follow(?:ing)? code|here is a simple example|you can replace this with|note:\s*this key is widely used)""",
                "severity": "Low",
                "confidence": 0.45,
                "explanation": "Comment resembles common AI/tutorial boilerplate. This is not automatically dangerous, but may indicate unreviewed code.",
                "remediation": "Review AI-generated or tutorial-derived code manually for security issues."
            },
            "Direct Database Call": {
                "regex": r"""(?:mongodb|mongoose|postgres|mysql|redis)\.(?:connect|query)\s*\(|(?:firebase|supabase)\.(?:collection|doc|from|rpc|auth|database)\s*\(""",
                "severity": "Critical",
                "confidence": 0.9,
                "explanation": "Detected frontend code that appears to directly access database or backend data services.",
                "remediation": "Do not expose direct database operations in client-side code. Route all sensitive operations through a secure backend."
            }
        }

    def _get_line_number(self, content: str, position: int) -> int:
        return content.count("\n", 0, position) + 1

    def detect(self, content: str, source_url: str) -> List[Dict[str, Any]]:
        findings = []
        seen = set()

        for title, config in self.smells.items():
            matches = re.finditer(config["regex"], content, re.IGNORECASE)

            for match in matches:
                value = match.group(0)
                dedupe_key = (title, value, source_url)
                if dedupe_key in seen:
                    continue
                seen.add(dedupe_key)

                start = max(0, match.start() - 60)
                end = min(len(content), match.end() + 60)
                evidence = content[start:end].replace("\n", " ").strip()
                line_number = self._get_line_number(content, match.start())

                findings.append({
                    "title": title,
                    "category": "AI Code Smell",
                    "severity": config["severity"],
                    "confidence": config["confidence"],
                    "masked_value": self.mask(value),
                    "evidence": f"...{evidence}...",
                    "source_file": source_url,
                    "line_number": line_number,
                    "explanation": config["explanation"],
                    "remediation": config["remediation"],
                })

        return findings