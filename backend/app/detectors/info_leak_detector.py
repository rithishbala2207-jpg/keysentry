import re
from typing import List, Dict, Any
from .base_detector import BaseDetector


class InfoLeakDetector(BaseDetector):
    def __init__(self):
        super().__init__("Information Leak Detector")
        self.patterns = {
            "Source Map Reference": {
                "regex": r"//# sourceMappingURL=(\S+)",
                "severity": "High",
                "confidence": 0.95,
                "explanation": "A source map reference was found. Source maps can reveal original source structure and internal logic.",
                "remediation": "Disable source maps in production builds or restrict access to them."
            },
            "Internal IP Address": {
                "regex": r"\b(?:127\.0\.0\.1|localhost(?::\d+)?|192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(?:1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3})\b",
                "severity": "Medium",
                "confidence": 0.9,
                "explanation": "An internal IP address or localhost reference was found.",
                "remediation": "Avoid exposing internal infrastructure details in frontend assets."
            },
            "Admin Panel Route": {
                "regex": r"['\"]/(?:admin|dashboard|management|internal|private)(?:/[^'\"]*)?['\"]",
                "severity": "Medium",
                "confidence": 0.75,
                "explanation": "Detected a route that looks like an administrative or internal entry point.",
                "remediation": "Ensure admin routes are properly protected and not exposed unnecessarily in client-side code."
            },
            "Console Debug": {
                "regex": r"console\.(?:log|debug|info)\s*\((.*?)\)",
                "severity": "Low",
                "confidence": 0.65,
                "explanation": "Found console logging/debug statements that may expose sensitive runtime information.",
                "remediation": "Strip debug logging from production builds."
            },
            "Stack Trace Leak": {
                "regex": r"(?:\w+Exception|\w+Error|Traceback).*?(?:at\s+\S+|\n\s+at\s+\S+)",
                "severity": "High",
                "confidence": 0.8,
                "explanation": "Possible stack trace or verbose error leak detected.",
                "remediation": "Sanitize error output and avoid exposing raw stack traces to users."
            },
            "Suspicious Comment": {
                "regex": r"//.*\b(?:todo|fixme|temp|temporary|secret|token|password|passwd|pwd|api[_-]?key|client[_-]?secret|bearer|auth)\b.*",
                "severity": "Medium",
                "confidence": 0.6,
                "explanation": "Found a comment containing sensitive or security-relevant keywords.",
                "remediation": "Review and remove sensitive comments before production deployment."
            }
        }

    def detect(self, content: str, source_url: str) -> List[Dict[str, Any]]:
        findings = []
        seen = set()

        for name, config in self.patterns.items():
            flags = re.IGNORECASE
            if name == "Stack Trace Leak":
                flags |= re.DOTALL

            matches = re.finditer(config["regex"], content, flags)

            for match in matches:
                value = match.group(0)
                dedupe_key = (name, value, source_url)
                if dedupe_key in seen:
                    continue
                seen.add(dedupe_key)

                start = max(0, match.start() - 50)
                end = min(len(content), match.end() + 50)
                evidence = content[start:end].replace("\n", " ").strip()

                findings.append({
                    "title": name,
                    "category": "Info Leak / Hygiene",
                    "severity": config["severity"],
                    "masked_value": self.mask(value),
                    "evidence": f"...{evidence}...",
                    "source_file": source_url,
                    "explanation": config["explanation"],
                    "remediation": config["remediation"],
                    "confidence": config["confidence"]
                })

        return findings