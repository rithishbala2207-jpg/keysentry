import re
from typing import List, Dict, Any

class BaseDetector:
    def __init__(self, name: str):
        self.name = name

    def detect(self, content: str, source_url: str) -> List[Dict[str, Any]]:
        """
        Runs detection on the given content.
        Must return a list of findings with keys:
        - title
        - category
        - severity
        - masked_value
        - evidence
        - source_file
        - explanation
        - remediation
        - confidence
        """
        raise NotImplementedError

    def mask(self, value: str, mask_char: str = "*", show_start: int = 4, show_end: int = 4) -> str:
        """Masks sensitive strings."""
        if len(value) <= show_start + show_end:
            return mask_char * len(value)
        return value[:show_start] + (mask_char * 8) + value[-show_end:]
