import hashlib
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional


@dataclass
class DiscoveredDataset:
    dataset_code: str
    name: str
    publishing_department: str
    protection_domain: str  # WOMEN | CHILD | SHARED
    category: str
    geographic_coverage: str
    reporting_period: str
    publication_date: str
    available_format: str
    source_url: str
    license_terms: str
    limitations: str
    status: str = "DISCOVERED"  # DISCOVERED | DOWNLOADED | PARSED | VALIDATED | REQUIRES REVIEW | FAILED | ACCESS RESTRICTED


@dataclass
class IngestionResult:
    dataset_code: str
    status: str
    records_discovered: int = 0
    records_imported: int = 0
    checksum_sha256: Optional[str] = None
    quality_issues: List[str] = field(default_factory=list)
    executed_at: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class BaseSourceAdapter(ABC):
    """Modular base adapter enforcing: DISCOVER -> DOWNLOAD -> PRESERVE -> PARSE -> VALIDATE -> NORMALISE -> STORE."""

    source_id: str
    source_name: str
    base_url: str

    @staticmethod
    def compute_sha256(raw_bytes: bytes) -> str:
        return hashlib.sha256(raw_bytes).hexdigest()

    @abstractmethod
    def discover(self) -> List[DiscoveredDataset]:
        """Return official dataset metadata discovered from authoritative URL."""

    def validate_records(self, records: List[Dict[str, Any]]) -> List[str]:
        issues: List[str] = []
        if not records:
            issues.append("No records parsed; missing values must not be converted to zero.")
        return issues

    def run_discovery_only(self) -> List[DiscoveredDataset]:
        """Safe non-fabricating discovery: catalogs official sources without claiming import."""
        return self.discover()
