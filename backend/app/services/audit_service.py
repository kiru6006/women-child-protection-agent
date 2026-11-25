import hashlib
from datetime import datetime, timezone
from typing import Dict, List
from backend.app.db.database import SessionLocal
from backend.app.db.models import AuditChainDB


def _compute_hash(
    event_id: str,
    timestamp: str,
    actor_role: str,
    action: str,
    entity_type: str,
    entity_id: str,
    details: str,
    previous_hash: str,
) -> str:
    payload = f"{event_id}|{timestamp}|{actor_role}|{action}|{entity_type}|{entity_id}|{details}|{previous_hash}"
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()


def _row_to_dict(row: AuditChainDB) -> Dict:
    return {
        "id": row.id,
        "timestamp": row.timestamp,
        "actor_role": row.actor_role,
        "action": row.action,
        "entity_type": row.entity_type,
        "entity_id": row.entity_id,
        "details": row.details,
        "previous_hash": row.previous_hash,
        "sha256_hash": row.sha256_hash,
    }


class AuditService:
    def _ensure_genesis(self, db) -> None:
        if db.query(AuditChainDB).count() == 0:
            genesis = AuditChainDB(
                id="AUD-GENESIS",
                timestamp="2026-01-01T00:00:00Z",
                actor_role="SYSTEM_GENESIS",
                action="INIT_LEDGER",
                entity_type="SYSTEM",
                entity_id="SURAKSHA-SENTINEL-ROOT",
                details="Genesis block for MoWCD Suraksha Sentinel WORM Cryptographic Ledger.",
                previous_hash="0" * 64,
                sha256_hash=hashlib.sha256(b"SURAKSHA-SENTINEL-GENESIS-2026").hexdigest(),
            )
            db.add(genesis)
            db.commit()

    @property
    def chain(self) -> List[Dict]:
        with SessionLocal() as db:
            self._ensure_genesis(db)
            rows = db.query(AuditChainDB).order_by(AuditChainDB.block_index.asc()).all()
            return [_row_to_dict(r) for r in rows]

    def append_event(self, actor_role: str, action: str, entity_type: str, entity_id: str, details: str) -> Dict:
        with SessionLocal() as db:
            self._ensure_genesis(db)
            last = db.query(AuditChainDB).order_by(AuditChainDB.block_index.desc()).first()
            count = db.query(AuditChainDB).count()
            prev_hash = last.sha256_hash
            now = datetime.now(timezone.utc).isoformat()
            event_id = f"AUD-{count + 900}"
            block_hash = _compute_hash(event_id, now, actor_role, action, entity_type, entity_id, details, prev_hash)

            entry = AuditChainDB(
                id=event_id,
                timestamp=now,
                actor_role=actor_role,
                action=action,
                entity_type=entity_type,
                entity_id=entity_id,
                details=details,
                previous_hash=prev_hash,
                sha256_hash=block_hash,
            )
            db.add(entry)
            db.commit()
            db.refresh(entry)
            return _row_to_dict(entry)

    def verify_integrity(self) -> Dict:
        with SessionLocal() as db:
            self._ensure_genesis(db)
            rows = db.query(AuditChainDB).order_by(AuditChainDB.block_index.asc()).all()
            for i in range(1, len(rows)):
                curr = rows[i]
                prev = rows[i - 1]
                if curr.previous_hash != prev.sha256_hash:
                    return {"valid": False, "compromised_block_index": i, "reason": "broken_prev_hash"}
                expected = _compute_hash(
                    curr.id,
                    curr.timestamp,
                    curr.actor_role,
                    curr.action,
                    curr.entity_type,
                    curr.entity_id,
                    curr.details,
                    curr.previous_hash,
                )
                if curr.sha256_hash != expected:
                    return {"valid": False, "compromised_block_index": i, "reason": "hash_mismatch"}
            return {"valid": True, "total_blocks": len(rows)}


audit_service = AuditService()
