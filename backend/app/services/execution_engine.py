from datetime import datetime, timezone
from typing import Dict, List, Set
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from backend.app.db.models import ActionItemDB, DependencyDB, MatterDB, NotificationDB

ACTION_STATES: Set[str] = {
    "DRAFT",
    "AWAITING_APPROVAL",
    "APPROVED",
    "ASSIGNED",
    "ACKNOWLEDGED",
    "IN_PROGRESS",
    "WAITING_FOR_DEPENDENCY",
    "COMPLETION_REPORTED",
    "VERIFICATION_REQUIRED",
    "VERIFIED",
    "CANCELLED",
    "REOPENED",
}

ACTION_TRANSITIONS: Dict[str, Set[str]] = {
    "DRAFT": {"AWAITING_APPROVAL", "CANCELLED"},
    "AWAITING_APPROVAL": {"APPROVED", "DRAFT", "CANCELLED"},
    "APPROVED": {"ASSIGNED", "CANCELLED"},
    "ASSIGNED": {"ACKNOWLEDGED", "WAITING_FOR_DEPENDENCY", "DRAFT", "CANCELLED"},
    "ACKNOWLEDGED": {"IN_PROGRESS", "WAITING_FOR_DEPENDENCY", "DRAFT", "CANCELLED"},
    "IN_PROGRESS": {"WAITING_FOR_DEPENDENCY", "COMPLETION_REPORTED", "CANCELLED"},
    "WAITING_FOR_DEPENDENCY": {"IN_PROGRESS", "ACKNOWLEDGED", "CANCELLED"},
    "COMPLETION_REPORTED": {"VERIFICATION_REQUIRED", "IN_PROGRESS"},
    "VERIFICATION_REQUIRED": {"VERIFIED", "REOPENED"},
    "VERIFIED": {"REOPENED"},
    "REOPENED": {"ASSIGNED", "IN_PROGRESS", "CANCELLED"},
    "CANCELLED": set(),
}


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def emit_notification_dedup(
    db: Session,
    dedup_key: str,
    target_role: str,
    event_type: str,
    message: str,
    matter_id: str | None = None,
    action_id: str | None = None,
) -> NotificationDB:
    existing = db.query(NotificationDB).filter(NotificationDB.dedup_key == dedup_key).first()
    if existing:
        return existing
    notif = NotificationDB(
        id=f"NTF-{int(datetime.now(timezone.utc).timestamp() * 1000) % 1000000}",
        dedup_key=dedup_key,
        matter_id=matter_id,
        action_id=action_id,
        target_role=target_role,
        event_type=event_type,
        message=message,
        is_read=0,
        created_at=now_iso(),
    )
    db.add(notif)
    return notif


def detect_dependency_cycles(deps: List[DependencyDB]) -> List[List[str]]:
    active = [d for d in deps if d.status not in {"RESOLVED", "CANCELLED", "NOT_APPLICABLE"}]
    adj: Dict[str, List[str]] = {}
    for d in active:
        adj.setdefault(d.predecessor_node, []).append(d.dependent_node)

    cycles: List[List[str]] = []
    visited: Set[str] = set()
    stack: Set[str] = set()

    def dfs(node: str, path: List[str]) -> None:
        visited.add(node)
        stack.add(node)
        for nxt in adj.get(node, []):
            if nxt not in visited:
                dfs(nxt, path + [nxt])
            elif nxt in stack:
                idx = path.index(nxt)
                cycles.append(path[idx:] + [nxt])
        stack.remove(node)

    for node in list(adj.keys()):
        if node not in visited:
            dfs(node, [node])
    return cycles


def validate_action_transition(
    db: Session,
    action: ActionItemDB,
    target_status: str,
    completion_evidence_ref: str | None = None,
) -> None:
    if target_status not in ACTION_STATES:
        raise HTTPException(status_code=422, detail=f"Invalid action state: {target_status}")

    allowed = ACTION_TRANSITIONS.get(action.status, set())
    if target_status not in allowed:
        raise HTTPException(
            status_code=422,
            detail=f"Invalid transition {action.status} -> {target_status}",
        )

    if target_status == "IN_PROGRESS" and action.dependency_ids:
        unresolved = (
            db.query(DependencyDB)
            .filter(
                DependencyDB.id.in_(action.dependency_ids),
                DependencyDB.status.notin_(["RESOLVED", "NOT_APPLICABLE", "CANCELLED"]),
            )
            .all()
        )
        if unresolved:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Action blocked by unresolved dependencies: {[d.id for d in unresolved]}",
            )

    if target_status in {"VERIFICATION_REQUIRED", "VERIFIED"}:
        evidence = completion_evidence_ref or action.completion_evidence_ref
        if not evidence or not evidence.strip():
            raise HTTPException(
                status_code=422,
                detail="Completion evidence reference is required before verification.",
            )


def validate_matter_closure(matter: MatterDB, target_status: str, db: Session) -> None:
    if target_status != "CLOSED":
        return
    if matter.outcome_status != "ACHIEVED":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Cannot close Matter while outcome_status is not ACHIEVED (completing tasks != achieving outcome).",
        )
    open_actions = (
        db.query(ActionItemDB)
        .filter(ActionItemDB.matter_id == matter.id, ActionItemDB.status.notin_(["VERIFIED", "CANCELLED"]))
        .count()
    )
    if open_actions > 0:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Cannot close Matter with {open_actions} unverified actions.",
        )


def detect_recurring_problems(db: Session) -> List[Dict]:
    matters = db.query(MatterDB).all()
    grouped: Dict[str, List[MatterDB]] = {}
    for m in matters:
        key = f"{m.jurisdiction.split(',')[0].strip()}:{m.domain}"
        grouped.setdefault(key, []).append(m)

    patterns: List[Dict] = []
    for key, items in grouped.items():
        if len(items) >= 2:
            patterns.append(
                {
                    "pattern_id": f"REC-PAT-{len(patterns) + 1}",
                    "scope": key,
                    "matter_count": len(items),
                    "matter_ids": [i.id for i in items],
                    "recommendation": "Systemic process/capacity review recommended instead of isolated alerts.",
                }
            )
    return patterns
