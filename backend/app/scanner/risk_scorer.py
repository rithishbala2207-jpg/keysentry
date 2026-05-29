from typing import List, Dict, Any

class RiskScorer:
    def calculate_score(self, findings: List[Dict[str, Any]]) -> int:
        score = 100
        for finding in findings:
            severity = finding.get("severity", "Low")
            if severity == "Critical":
                score -= 20
            elif severity == "High":
                score -= 12
            elif severity == "Medium":
                score -= 6
            elif severity == "Low":
                score -= 2
        return max(0, score)

    def get_status(self, score: int) -> str:
        if score >= 90:
            return "Safe"
        elif score >= 75:
            return "Needs Review"
        elif score >= 50:
            return "Risky"
        else:
            return "Critical Exposure"
