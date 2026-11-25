from typing import Dict, Set
from fastapi import HTTPException, status
from backend.app.core.auth import HUMAN_VALIDATOR_ROLES

ALLOWED_GAP_TRANSITIONS: Dict[str, Set[str]] = {
    "CANDIDATE": {"UNDER_INVESTIGATION", "REJECTED"},
    "UNDER_INVESTIGATION": {"VALIDATED", "REJECTED"},
    "VALIDATED": {"INTERVENTION_PLANNED", "REJECTED"},
    "INTERVENTION_PLANNED": {"INTERVENTION_ACTIVE", "REJECTED"},
    "INTERVENTION_ACTIVE": {"VERIFIED"},
    "VERIFIED": {"CLOSED"},
    "CLOSED": set(),
    "REJECTED": set(),
}

HUMAN_GATED_STATES: Set[str] = {
    "VALIDATED",
    "INTERVENTION_PLANNED",
    "INTERVENTION_ACTIVE",
    "VERIFIED",
    "CLOSED",
}


def validate_gap_transition(current_status: str, target_status: str, actor_role: str) -> None:
    if target_status not in ALLOWED_GAP_TRANSITIONS.get(current_status, set()):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid Gap Contract transition: {current_status} -> {target_status}",
        )
    if target_status in HUMAN_GATED_STATES and actor_role not in HUMAN_VALIDATOR_ROLES:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Role '{actor_role}' cannot perform human-gated transition to '{target_status}'.",
        )
