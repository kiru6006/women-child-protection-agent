import re
from fastapi import HTTPException, status

PII_PATTERNS = [
    ("AADHAAR_NUMBER", re.compile(r"\b\d{4}[\s-]?\d{4}[\s-]?\d{4}\b")),
    ("INDIAN_PHONE", re.compile(r"\b(?:\+91[\s-]?)?[6-9]\d{9}\b")),
    ("EMAIL_ADDRESS", re.compile(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b")),
]


def reject_raw_pii(*texts: str) -> None:
    """Blocks raw Aadhaar, phone numbers, or emails from entering central/AI storage."""
    combined = " ".join(t for t in texts if t)
    for label, pattern in PII_PATTERNS:
        if pattern.search(combined):
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"ZERO-PII POLICY VIOLATION (DPDP Act 2023): Detected {label}. Use pseudonymous tokens only.",
            )
