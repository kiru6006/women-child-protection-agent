import base64
import hashlib
import hmac
import json
import time
from dataclasses import dataclass
from typing import Optional
from fastapi import Header, HTTPException, status
from backend.app.core.config import settings

ALLOWED_ROLES = {
    "DISTRICT_COLLECTOR",
    "WCD_SECRETARY",
    "OSC_ADMIN",
    "PROTECTION_OFFICER",
    "DLSA_LAWYER",
    "AUDITOR",
    "AI_AGENT",
    "NGO_PARTNER",
    "TREASURY_OFFICER",
    "POLICE_COORDINATOR",
    "DWCD_OFFICER",
}

HUMAN_VALIDATOR_ROLES = {"DISTRICT_COLLECTOR", "WCD_SECRETARY", "PROTECTION_OFFICER"}


@dataclass(frozen=True)
class ActorContext:
    role: str
    district: str
    domain: str


def _b64url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode("ascii")


def _b64url_decode(data: str) -> bytes:
    padding = "=" * (-len(data) % 4)
    return base64.urlsafe_b64decode(data + padding)


def issue_access_token(role: str, district: str = "Patna", domain: str = "WOMEN", ttl_seconds: int = 3600) -> str:
    role_clean = role.upper().strip()
    if role_clean not in ALLOWED_ROLES:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"Unknown role '{role_clean}'.")
    header = _b64url_encode(json.dumps({"alg": "HS256", "typ": "JWT"}).encode("utf-8"))
    payload = _b64url_encode(
        json.dumps(
            {
                "role": role_clean,
                "district": district.strip(),
                "domain": domain.upper().strip(),
                "exp": int(time.time()) + ttl_seconds,
            }
        ).encode("utf-8")
    )
    signing_input = f"{header}.{payload}".encode("ascii")
    sig = hmac.new(settings.SECRET_SALT.encode("utf-8"), signing_input, hashlib.sha256).digest()
    return f"{header}.{payload}.{_b64url_encode(sig)}"


def verify_access_token(token: str) -> ActorContext:
    try:
        header_b64, payload_b64, sig_b64 = token.split(".")
        signing_input = f"{header_b64}.{payload_b64}".encode("ascii")
        expected_sig = hmac.new(settings.SECRET_SALT.encode("utf-8"), signing_input, hashlib.sha256).digest()
        if not hmac.compare_digest(_b64url_encode(expected_sig), sig_b64):
            raise ValueError("Invalid signature")
        claims = json.loads(_b64url_decode(payload_b64))
        if claims.get("exp", 0) < int(time.time()):
            raise ValueError("Token expired")
        role = str(claims["role"]).upper().strip()
        if role not in ALLOWED_ROLES:
            raise ValueError("Invalid role")
        return ActorContext(
            role=role,
            district=str(claims.get("district", "Patna")).strip(),
            domain=str(claims.get("domain", "WOMEN")).upper().strip(),
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid or expired Bearer token: {exc}",
        )


def get_actor_context(
    authorization: Optional[str] = Header(default=None),
    x_user_role: Optional[str] = Header(default=None),
    x_district: str = Header(default="Patna"),
    x_domain: str = Header(default="WOMEN"),
) -> ActorContext:
    if authorization and authorization.lower().startswith("bearer "):
        return verify_access_token(authorization.split(" ", 1)[1].strip())

    if not settings.DEV_HEADER_AUTH_ENABLED:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Bearer token required when DEV_HEADER_AUTH_ENABLED is false.",
        )

    role = (x_user_role or "DISTRICT_COLLECTOR").upper().strip()
    if role not in ALLOWED_ROLES:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Unknown role '{role}' rejected by RBAC policy.",
        )
    return ActorContext(role=role, district=x_district.strip(), domain=x_domain.upper().strip())


def enforce_domain_a_write(domain: str) -> None:
    if domain.upper() == "CHILD":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Domain B (Child Protection) live writes are locked in Phase 1 MVP pending statutory/DPDP review.",
        )
