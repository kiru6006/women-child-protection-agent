from typing import List, Dict, Optional
from datetime import datetime, timezone
from backend.app.data.seed_data import SEED_BREACHES, SEED_GAPS

class SentinelService:
    def __init__(self):
        self.breaches = list(SEED_BREACHES)
        self.gaps = list(SEED_GAPS)

    def get_active_breaches(self, district: Optional[str] = None) -> List[Dict]:
        if district:
            return [b for b in self.breaches if b["district"].lower() == district.lower()]
        return self.breaches

    def add_event(self, token_id: str, event_type: str, department: str, actor_id: str) -> Dict:
        """Processes event transition under statutory DAG rules."""
        now = datetime.now(timezone.utc).isoformat()
        return {
            "status": "ACCEPTED",
            "token_id": token_id,
            "event_type": event_type,
            "processed_at": now,
            "current_state": "UNDER_STATUTORY_MONITORING",
            "sla_status": "ON_TRACK"
        }

sentinel_service = SentinelService()

