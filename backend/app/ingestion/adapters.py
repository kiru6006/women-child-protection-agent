import os
from typing import List
from backend.app.ingestion.base import BaseSourceAdapter, DiscoveredDataset


class LGDAdapter(BaseSourceAdapter):
    source_id = "SRC-LGD"
    source_name = "Local Government Directory (LGD)"
    base_url = "https://lgdirectory.gov.in/"

    def discover(self) -> List[DiscoveredDataset]:
        return [
            DiscoveredDataset(
                dataset_code="DS-LGD-MASTER",
                name="LGD State, District & Block Master Codes",
                publishing_department="Ministry of Panchayati Raj / NIC",
                protection_domain="SHARED",
                category="Geographic Master",
                geographic_coverage="All India (States/UTs/Districts/Blocks)",
                reporting_period="2025–2026 (Current)",
                publication_date="2026-01-15",
                available_format="CSV / API",
                source_url="https://lgdirectory.gov.in/",
                license_terms="Government Open Data License — India (GODL)",
                limitations="Requires live portal CSV download or NIC API whitelisting.",
                status="DISCOVERED",
            )
        ]


class CensusAdapter(BaseSourceAdapter):
    source_id = "SRC-CENSUS"
    source_name = "Office of the Registrar General & Census Commissioner"
    base_url = "https://censusindia.gov.in/"

    def discover(self) -> List[DiscoveredDataset]:
        return [
            DiscoveredDataset(
                dataset_code="DS-CENSUS-2011",
                name="Census 2011 District Population & Demographic Baseline",
                publishing_department="Ministry of Home Affairs (ORGI)",
                protection_domain="SHARED",
                category="Demographics",
                geographic_coverage="All India (640 Districts, 2011 boundaries)",
                reporting_period="2011 (Latest decennial baseline)",
                publication_date="2013-04-30",
                available_format="XLS / CSV",
                source_url="https://censusindia.gov.in/",
                license_terms="Public Government Reference Data",
                limitations="2011 administrative boundaries require LGD crosswalk for newly carved districts.",
                status="DISCOVERED",
            )
        ]


class NFHSAdapter(BaseSourceAdapter):
    source_id = "SRC-NFHS"
    source_name = "National Family Health Survey (NFHS-5)"
    base_url = "https://www.mospi.gov.in/"

    def discover(self) -> List[DiscoveredDataset]:
        return [
            DiscoveredDataset(
                dataset_code="DS-NFHS5-DIST",
                name="NFHS-5 District Factsheets (Anaemia, Maternal Health, Child Marriage, DV)",
                publishing_department="Ministry of Health & Family Welfare (IIPS)",
                protection_domain="SHARED",
                category="Health & Protection Survey",
                geographic_coverage="All States, UTs & 707 Districts",
                reporting_period="2019–2021",
                publication_date="2022-05-05",
                available_format="PDF / CSV",
                source_url="https://www.mospi.gov.in/",
                license_terms="Public Government Survey Data",
                limitations="Survey period 2019–2021; sample-based estimates with confidence intervals.",
                status="DISCOVERED",
            )
        ]


class NCRBAdapter(BaseSourceAdapter):
    source_id = "SRC-NCRB"
    source_name = "National Crime Records Bureau (NCRB)"
    base_url = "https://ncrb.gov.in/"

    def discover(self) -> List[DiscoveredDataset]:
        return [
            DiscoveredDataset(
                dataset_code="DS-NCRB-CAW",
                name="Crime in India — Crimes Against Women & Children (State/UT/City)",
                publishing_department="Ministry of Home Affairs (NCRB)",
                protection_domain="WOMEN",
                category="Crime & Violence",
                geographic_coverage="All States, UTs & 19 Metropolitan Cities",
                reporting_period="2022 (Latest published annual volume)",
                publication_date="2023-12-03",
                available_format="PDF / XLS",
                source_url="https://ncrb.gov.in/",
                license_terms="Public Government Statistical Report",
                limitations="Reported FIR counts only; does not equal actual prevalence due to under-reporting.",
                status="DISCOVERED",
            )
        ]


class MWCDAdapter(BaseSourceAdapter):
    source_id = "SRC-MWCD"
    source_name = "Ministry of Women & Child Development Portals"
    base_url = "https://www.wcd.gov.in/"

    def discover(self) -> List[DiscoveredDataset]:
        return [
            DiscoveredDataset(
                dataset_code="DS-MWCD-OSC",
                name="Mission Shakti — One Stop Centres (OSC) & Women Helpline 181 Statistics",
                publishing_department="Ministry of Women & Child Development",
                protection_domain="WOMEN",
                category="Mission Shakti / OSC",
                geographic_coverage="All States & UTs",
                reporting_period="2024–2025",
                publication_date="2025-03-01",
                available_format="HTML / PDF",
                source_url="https://www.wcd.gov.in/osc-dashboard",
                license_terms="Public Government Dashboard / Annual Report",
                limitations="Aggregate centre & beneficiary counts only; outcome quality not published.",
                status="DISCOVERED",
            ),
            DiscoveredDataset(
                dataset_code="DS-MWCD-VATSALYA",
                name="Mission Vatsalya — CWC, JJB, DCPU & CCI Institutional Statistics",
                publishing_department="Ministry of Women & Child Development",
                protection_domain="CHILD",
                category="Mission Vatsalya",
                geographic_coverage="All States & UTs",
                reporting_period="2024–2025",
                publication_date="2025-03-01",
                available_format="PDF",
                source_url="https://www.wcd.gov.in/",
                license_terms="Public Government Annual Report",
                limitations="Aggregate institutional counts only; no child-level records.",
                status="DISCOVERED",
            ),
        ]


class DataGovInAdapter(BaseSourceAdapter):
    source_id = "SRC-DATAGOVIN"
    source_name = "Open Government Data (OGD) Platform India"
    base_url = "https://data.gov.in/"

    def discover(self) -> List[DiscoveredDataset]:
        has_key = bool(os.getenv("DATA_GOV_IN_API_KEY"))
        return [
            DiscoveredDataset(
                dataset_code="DS-OGD-WCD-SCHEMES",
                name="data.gov.in — State-wise WCD Scheme Fund Releases & Expenditure",
                publishing_department="MeitY / MoWCD via data.gov.in",
                protection_domain="SHARED",
                category="Budget & Expenditure",
                geographic_coverage="All States & UTs",
                reporting_period="2021–2025",
                publication_date="2025-02-15",
                available_format="JSON / CSV API",
                source_url="https://data.gov.in/",
                license_terms="GODL India",
                limitations="Requires DATA_GOV_IN_API_KEY env var for automated JSON ingestion.",
                status="DISCOVERED" if has_key else "ACCESS RESTRICTED",
            )
        ]


class PoshanAdapter(BaseSourceAdapter):
    source_id = "SRC-POSHAN"
    source_name = "Saksham Anganwadi & POSHAN 2.0"
    base_url = "https://wcd.gov.in/home-dashboard"

    def discover(self) -> List[DiscoveredDataset]:
        return [
            DiscoveredDataset(
                dataset_code="DS-POSHAN-AGG",
                name="POSHAN Tracker — State-wise Anganwadi Centres & Nutrition Aggregate",
                publishing_department="Ministry of Women & Child Development",
                protection_domain="CHILD",
                category="Nutrition & Anganwadi",
                geographic_coverage="All States & UTs",
                reporting_period="2025–2026",
                publication_date="2026-02-01",
                available_format="HTML Dashboard",
                source_url="https://wcd.gov.in/home-dashboard",
                license_terms="Public Dashboard Aggregate",
                limitations="Aggregate operational counts; CAG noted ICDS-CAS transition gaps.",
                status="DISCOVERED",
            )
        ]


class UDISEAdapter(BaseSourceAdapter):
    source_id = "SRC-UDISE"
    source_name = "UDISE+ Education Statistics"
    base_url = "https://udiseplus.gov.in/"

    def discover(self) -> List[DiscoveredDataset]:
        return [
            DiscoveredDataset(
                dataset_code="DS-UDISE-DROPOUT",
                name="UDISE+ State & District Girl School Dropout & Enrolment Rates",
                publishing_department="Ministry of Education",
                protection_domain="CHILD",
                category="Education & Dropout",
                geographic_coverage="All States, UTs & Districts",
                reporting_period="2023–2024",
                publication_date="2024-12-10",
                available_format="CSV / PDF",
                source_url="https://udiseplus.gov.in/",
                license_terms="Public Government Education Data",
                limitations="Annual school-reported enrolment; migration tracking limited.",
                status="DISCOVERED",
            )
        ]


class DOJAdapter(BaseSourceAdapter):
    source_id = "SRC-DOJ"
    source_name = "Department of Justice Dashboard (FTSC / POCSO)"
    base_url = "https://dashboard.doj.gov.in/"

    def discover(self) -> List[DiscoveredDataset]:
        return [
            DiscoveredDataset(
                dataset_code="DS-DOJ-FTSC",
                name="Fast Track Special Courts (FTSC) & POCSO Case Disposal / Pendency",
                publishing_department="Ministry of Law & Justice (DoJ)",
                protection_domain="CHILD",
                category="Courts & POCSO Pendency",
                geographic_coverage="All States & UTs",
                reporting_period="2024–2025",
                publication_date="2025-01-31",
                available_format="HTML / PDF",
                source_url="https://dashboard.doj.gov.in/",
                license_terms="Public Government Justice Dashboard",
                limitations="Aggregate court pendency only; excludes case-level details.",
                status="DISCOVERED",
            )
        ]


ALL_ADAPTERS: List[BaseSourceAdapter] = [
    LGDAdapter(),
    CensusAdapter(),
    NFHSAdapter(),
    NCRBAdapter(),
    MWCDAdapter(),
    DataGovInAdapter(),
    PoshanAdapter(),
    UDISEAdapter(),
    DOJAdapter(),
]


def discover_all_official_datasets() -> List[DiscoveredDataset]:
    datasets: List[DiscoveredDataset] = []
    for adapter in ALL_ADAPTERS:
        datasets.extend(adapter.run_discovery_only())
    return datasets
