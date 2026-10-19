import re

PROHIBITED_CLAIM_PATTERNS = [
    r"\bguarantee[ds]?\b",
    r"\bwill definitely work\b",
    r"\b100% safe\b",
    r"\bcompletely safe\b",
    r"\bzero risk\b",
    r"\bperfect\b[^.!?]{0,40}\bfor you\b",
    r"\bcure[sd]?\b",
    r"\bwill clear your\b",
]

DIAGNOSTIC_PATTERNS = [
    r"\byou have\b",
    r"\bdiagnos(is|e|ed|ing)\b",
    r"\bis suffering from\b",
    r"\bprescrib(e|ed|es|ing)\b",
    r"\bcondition\b",
]

PROHIBITED_PATTERNS = PROHIBITED_CLAIM_PATTERNS + DIAGNOSTIC_PATTERNS


def find_prohibited_language(text: str) -> list[str]:
    findings: list[str] = []

    for pattern in PROHIBITED_PATTERNS:
        for match in re.finditer(pattern, text, flags=re.IGNORECASE):
            findings.append(match.group(0))

    return findings


def contains_prohibited_language(text: str) -> bool:
    return len(find_prohibited_language(text)) > 0
