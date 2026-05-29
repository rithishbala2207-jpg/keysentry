import re
from typing import List, Dict, Any
from .base_detector import BaseDetector


class APIKeyDetector(BaseDetector):
    def __init__(self):
        super().__init__("API Key Detector")
        self.patterns = {
            "AWS Access Key": {
                "regex": r"\bAKIA[0-9A-Z]{16}\b",
                "severity": "High",
                "confidence": 0.95,
                "explanation": "Detected a possible AWS Access Key ID in client-side code.",
                "remediation": "Revoke the access key and replace it with restricted IAM-backed backend access."
            },
            "Google API Key": {
                "regex": r"\bAIza[0-9A-Za-z_-]{35}\b",
                "severity": "Medium",
                "confidence": 0.9,
                "explanation": "Detected a Google API key. Browser keys may be intended for frontend use, but should be restricted by referrer and API scope.",
                "remediation": "Restrict the Google API key by domain/referrer and allowed APIs."
            },
            "Stripe Key": {
                "regex": r"\b(?:sk|pk)_(?:test|live)_[0-9a-zA-Z]{16,}\b",
                "severity": "Critical",
                "confidence": 0.95,
                "explanation": "Detected a Stripe key in client code.",
                "remediation": "Move Stripe secret keys to the backend. Publishable keys may remain client-side if used correctly."
            },
            "OpenAI Key": {
                "regex": r"\bsk-[A-Za-z0-9_-]{20,}\b",
                "severity": "Critical",
                "confidence": 0.85,
                "explanation": "Detected a possible OpenAI-style secret key in client-side code.",
                "remediation": "Move the key to a secure backend and rotate the exposed credential."
            },
            "GitHub Token": {
                "regex": r"\bgh[ps]_[A-Za-z0-9]{30,}\b",
                "severity": "Critical",
                "confidence": 0.9,
                "explanation": "Detected a possible GitHub token in client-side code.",
                "remediation": "Revoke the token and remove it from frontend assets."
            },
            "Slack Webhook": {
                "regex": r"https://hooks\.slack\.com/services/[A-Za-z0-9]+/[A-Za-z0-9]+/[A-Za-z0-9]+",
                "severity": "High",
                "confidence": 0.95,
                "explanation": "Detected a Slack webhook URL. Exposed webhooks can be abused to post messages.",
                "remediation": "Rotate the webhook and proxy Slack messaging through a backend."
            },
            "Firebase API Key": {
                "regex": r'["\']?apiKey["\']?\s*:\s*["\']([A-Za-z0-9_-]{35,45})["\']',
                "severity": "Low",
                "confidence": 0.75,
                "explanation": "Detected a Firebase API key-like value. Firebase API keys are often public identifiers, but backend rules must still be secure.",
                "remediation": "Verify Firebase Security Rules and ensure no sensitive operations depend only on the key."
            },
            "JWT Token": {
                "regex": r"\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b",
                "severity": "Medium",
                "confidence": 0.8,
                "explanation": "Detected a JWT-like token in client-side code.",
                "remediation": "Avoid hardcoding JWTs. Use secure session handling and short-lived tokens."
            },
            "Bearer Token": {
                "regex": r"\bBearer\s+[A-Za-z0-9\-._~+/]+=*\b",
                "severity": "High",
                "confidence": 0.75,
                "explanation": "Detected a Bearer token-like value in client code.",
                "remediation": "Do not expose bearer tokens in frontend bundles. Use backend handling or secure cookies."
            },
            "Basic Auth": {
                "regex": r"\bBasic\s+[A-Za-z0-9+/=]{8,}\b",
                "severity": "Critical",
                "confidence": 0.7,
                "explanation": "Detected a Basic Auth credential pattern. This should only be considered valid when it appears in authentication/header context.",
                "remediation": "Do not expose Basic Auth credentials in frontend code."
            },
            "EmailJS Key": {
                "regex": r"emailjs\.init\(['\"]([A-Za-z0-9\-_]{10,25})['\"]",
                "severity": "Low",
                "confidence": 0.8,
                "explanation": "Detected an EmailJS public key. This is usually intended for frontend initialization.",
                "remediation": "Ensure EmailJS usage has abuse protections such as domain restrictions and CAPTCHA."
            },
            "Generic Init Key": {
                "regex": r"\.(?:init|setup|authorize|config)\s*\(\s*['\"]([A-Za-z0-9\-_]{16,})['\"]",
                "severity": "Medium",
                "confidence": 0.5,
                "explanation": "Detected a key-like string passed into an initialization/config function.",
                "remediation": "Review whether this value is intended to be public or should be handled by a backend."
            },
            "Sensitive Variable Assignment": {
                "regex": r'(?i)\b(?:secret|password|passwd|token|api[_-]?key|client[_-]?secret|access[_-]?token|db[_-]?password)\b\s*[:=]\s*["\']([^"\']{8,})["\']',
                "severity": "High",
                "confidence": 0.85,
                "explanation": "Detected a sensitive-looking variable assignment in client-side code.",
                "remediation": "Move secrets to backend-managed environment variables or a secret manager."
            }
        }

    def detect(self, content: str, source_url: str) -> List[Dict[str, Any]]:
        findings = []
        seen = set()

        for title, config in self.patterns.items():
            matches = re.finditer(config["regex"], content, re.IGNORECASE)

            for match in matches:
                value = match.group(0)
                dedupe_key = (title, value, source_url)
                if dedupe_key in seen:
                    continue
                seen.add(dedupe_key)

                severity = config["severity"]
                explanation = config["explanation"]
                confidence = config["confidence"]

                if title == "Stripe Key" and value.startswith("pk_"):
                    severity = "Low"
                    explanation = "Detected a Stripe publishable key. Publishable keys are usually intended for frontend use."
                    confidence = 0.95

                start = max(0, match.start() - 50)
                end = min(len(content), match.end() + 50)
                evidence = content[start:end].replace("\n", " ").strip()

                findings.append({
                    "title": title,
                    "category": "Secret Leak",
                    "severity": severity,
                    "masked_value": self.mask(value),
                    "evidence": f"...{evidence}...",
                    "source_file": source_url,
                    "explanation": explanation,
                    "remediation": config["remediation"],
                    "confidence": confidence
                })

        return findings