import hashlib
import json
from typing import List, Dict
from datetime import datetime, timezone

class AuditService:
    def __init__(self):
        self.chain: List[Dict] = []
        self._init_genesis_block()

    def _init_genesis_block(self):
        genesis = {
            "id": "AUD-GENESIS",
            "timestamp": "2026-01-01T00:00:00Z",
            "actor_role": "SYSTEM_GENESIS",
            "action": "INIT_LEDGER",
            "entity_type": "SYSTEM",
            "entity_id": "SURAKSHA-SENTINEL-ROOT",
            "details": "Genesis block for MoWCD Suraksha Sentinel WORM Cryptographic Ledger.",
            "previous_hash": "0" * 64,
            "sha256_hash": hashlib.sha256(b"SURAKSHA-SENTINEL-GENESIS-2026").hexdigest()
        }
        self.chain.append(genesis)

    def append_event(self, actor_role: str, action: str, entity_type: str, entity_id: str, details: str) -> Dict:
        prev_hash = self.chain[-1]["sha256_hash"]
        now = datetime.now(timezone.utc).isoformat()
        event_id = f"AUD-{len(self.chain) + 900}"
        
        payload = f"{event_id}|{now}|{actor_role}|{action}|{entity_type}|{entity_id}|{details}|{prev_hash}"
        block_hash = hashlib.sha256(payload.encode("utf-8")).hexdigest()

        entry = {
            "id": event_id,
            "timestamp": now,
            "actor_role": actor_role,
            "action": action,
            "entity_type": entity_type,
            "entity_id": entity_id,
            "details": details,
            "previous_hash": prev_hash,
            "sha256_hash": block_hash
        }
        self.chain.append(entry)
        return entry

    def verify_integrity(self) -> Dict:
        for i in range(1, len(self.chain)):
            curr = self.chain[i]
            prev = self.chain[i - 1]
            if curr["previous_hash"] != prev["sha256_hash"]:
                return {"valid": False, "compromised_block_index": i}
        return {"valid": True, "total_blocks": len(self.chain)}

audit_service = AuditService()

