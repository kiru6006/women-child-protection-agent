export interface OfficialRecord {
  id: string;
  designation: string;
  officeholderName: string;
  verificationStatus: 'VERIFIED' | 'UNVERIFIED_OFFICEHOLDER';
  hierarchyLevel:
    | 'Central Ministry'
    | 'National Institutions'
    | 'State WCD Departments'
    | 'District Administration'
    | 'District Programme Authorities'
    | 'Women Protection Institutions'
    | 'Child Protection Institutions'
    | 'Local Service Providers';
  department: string;
  organisation: string;
  jurisdiction: string;
  domain: 'WOMEN' | 'CHILD' | 'SHARED';
  responsibilities: string;
  associatedSchemes: string[];
  officialEmail?: string;
  officialPhone?: string;
  sourceUrl: string;
  lastVerifiedDate: string;
}

export interface AlertItem {
  id: string;
  title: string;
  category:
    | 'Operational Alert'
    | 'Protection Service Alert'
    | 'Government Action Alert'
    | 'Capacity Alert'
    | 'Coordination Alert'
    | 'Data Quality Alert'
    | 'AI Candidate Finding'
    | 'Legal Update';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFORMATIONAL';
  domain: 'WOMEN' | 'CHILD' | 'SHARED';
  geography: string;
  source: string;
  reason: string;
  responsibleRole: string;
  status: 'NEW' | 'ACKNOWLEDGED' | 'ASSIGNED' | 'UNDER_REVIEW' | 'ACTION_REQUIRED' | 'RESOLVED' | 'REJECTED';
  linkedPath: string;
  createdAt: string;
}

export interface DatasetEntry {
  datasetCode: string;
  name: string;
  publishingDepartment: string;
  protectionDomain: 'WOMEN' | 'CHILD' | 'SHARED';
  category: string;
  geographicCoverage: string;
  reportingPeriod: string;
  publicationDate: string;
  retrievalDate: string | null;
  availableFormat: string;
  recordCount: number;
  sourceUrl: string;
  licenseTerms: string;
  status: 'DISCOVERED' | 'DOWNLOADED' | 'PARSED' | 'VALIDATED' | 'REQUIRES REVIEW' | 'FAILED' | 'ACCESS RESTRICTED';
  limitations: string;
  version: string;
}

export interface SchemeInfo {
  id: string;
  name: string;
  domain: 'WOMEN' | 'CHILD' | 'SHARED';
  category: string;
  department: string;
  purpose: string;
  services: string[];
  sourceUrl: string;
  reportingPeriod: string;
  classification: 'OFFICIAL_PUBLIC';
}

export interface ActivityFeedItem {
  id: string;
  title: string;
  category: string;
  source: string;
  date: string;
  verificationStatus: 'VERIFIED_FACT' | 'INFERENCE' | 'HYPOTHESIS' | 'SYNTHETIC';
  path: string;
}

export const officialDirectory: OfficialRecord[] = [
  {
    id: 'OFF-MWCD-JS-SHAKTI',
    designation: 'Joint Secretary (Mission Shakti)',
    officeholderName: 'UNVERIFIED (Designation Only)',
    verificationStatus: 'UNVERIFIED_OFFICEHOLDER',
    hierarchyLevel: 'Central Ministry',
    department: 'Ministry of Women & Child Development',
    organisation: 'Government of India (Shastri Bhawan, New Delhi)',
    jurisdiction: 'National (All States & UTs)',
    domain: 'WOMEN',
    responsibilities: 'National policy oversight, fund release & convergence for One Stop Centres and Women Helpline 181.',
    associatedSchemes: ['Mission Shakti (Sambal & Samarthya)', 'One Stop Centres', 'Women Helpline 181'],
    officialEmail: 'min-wcd@nic.in',
    officialPhone: '181 (Public Women Helpline)',
    sourceUrl: 'https://www.wcd.gov.in/',
    lastVerifiedDate: '2026-11-25',
  },
  {
    id: 'OFF-MWCD-JS-VATSALYA',
    designation: 'Joint Secretary (Mission Vatsalya)',
    officeholderName: 'UNVERIFIED (Designation Only)',
    verificationStatus: 'UNVERIFIED_OFFICEHOLDER',
    hierarchyLevel: 'Central Ministry',
    department: 'Ministry of Women & Child Development',
    organisation: 'Government of India (Shastri Bhawan, New Delhi)',
    jurisdiction: 'National (All States & UTs)',
    domain: 'CHILD',
    responsibilities: 'Statutory child protection policy, Mission Vatsalya norms, CWC/JJB/CCI oversight.',
    associatedSchemes: ['Mission Vatsalya', 'Child Helpline 1098', 'CARA'],
    officialEmail: 'min-wcd@nic.in',
    officialPhone: '1098 (Public Child Helpline)',
    sourceUrl: 'https://www.wcd.gov.in/',
    lastVerifiedDate: '2026-11-25',
  },
  {
    id: 'OFF-NCW-CHAIR',
    designation: 'Chairperson, National Commission for Women (NCW)',
    officeholderName: 'UNVERIFIED (Designation Only)',
    verificationStatus: 'UNVERIFIED_OFFICEHOLDER',
    hierarchyLevel: 'National Institutions',
    department: 'Statutory Commission',
    organisation: 'National Commission for Women',
    jurisdiction: 'National',
    domain: 'WOMEN',
    responsibilities: 'Constitutional/statutory review of safeguards for women, complaint inquiry & policy recommendations.',
    associatedSchemes: ['NCW 24x7 Helpline', 'Legal Awareness Programmes'],
    officialPhone: '7827170170 (Public NCW Helpline)',
    sourceUrl: 'https://ncw.nic.in/',
    lastVerifiedDate: '2026-11-25',
  },
  {
    id: 'OFF-NCPCR-CHAIR',
    designation: 'Chairperson, NCPCR',
    officeholderName: 'UNVERIFIED (Designation Only)',
    verificationStatus: 'UNVERIFIED_OFFICEHOLDER',
    hierarchyLevel: 'National Institutions',
    department: 'Statutory Commission',
    organisation: 'National Commission for Protection of Child Rights',
    jurisdiction: 'National',
    domain: 'CHILD',
    responsibilities: 'Monitoring POCSO Act 2012, JJ Act 2015, RTE Act compliance & CCI inspections.',
    associatedSchemes: ['POCSO e-Box', 'Mission Vatsalya Monitoring'],
    officialPhone: '1098 (Child Helpline)',
    sourceUrl: 'https://ncpcr.gov.in/',
    lastVerifiedDate: '2026-11-25',
  },
  {
    id: 'OFF-PAT-DM',
    designation: 'District Magistrate & Collector',
    officeholderName: 'UNVERIFIED (Designation Only)',
    verificationStatus: 'UNVERIFIED_OFFICEHOLDER',
    hierarchyLevel: 'District Administration',
    department: 'District Administration',
    organisation: 'Office of the District Magistrate, Patna',
    jurisdiction: 'Patna District, Bihar',
    domain: 'SHARED',
    responsibilities: 'District convergence reviews, statutory escalation enforcement, OSC & DCPU oversight.',
    associatedSchemes: ['Mission Shakti', 'Mission Vatsalya', 'Saksham Anganwadi & POSHAN 2.0'],
    officialEmail: 'dm-patna.bih@nic.in',
    officialPhone: '0612-2219810 (Public District Control Room)',
    sourceUrl: 'https://patna.nic.in/',
    lastVerifiedDate: '2026-11-25',
  },
  {
    id: 'OFF-PAT-DLSA-SEC',
    designation: 'Secretary, District Legal Services Authority (DLSA)',
    officeholderName: 'UNVERIFIED (Designation Only)',
    verificationStatus: 'UNVERIFIED_OFFICEHOLDER',
    hierarchyLevel: 'District Programme Authorities',
    department: 'Legal Services Authority',
    organisation: 'DLSA Patna (Civil Court Campus)',
    jurisdiction: 'Patna District, Bihar',
    domain: 'WOMEN',
    responsibilities: 'Panel lawyer assignment under Section 12(c) LSA Act & timely legal aid representation.',
    associatedSchemes: ['Free Legal Aid (NALSA / DLSA)', 'PWDVA 2005 Legal Support'],
    officialEmail: 'dlsa.patna@aij.gov.in',
    officialPhone: '15100 (NALSA Public Legal Aid Helpline)',
    sourceUrl: 'https://nalsa.gov.in/',
    lastVerifiedDate: '2026-11-25',
  },
  {
    id: 'OFF-PAT-OSC-ADMIN',
    designation: 'Centre Administrator, Sakhi One Stop Centre',
    officeholderName: 'UNVERIFIED (Designation Only)',
    verificationStatus: 'UNVERIFIED_OFFICEHOLDER',
    hierarchyLevel: 'Women Protection Institutions',
    department: 'State WCD / Social Welfare',
    organisation: 'Sakhi One Stop Centre, Patna',
    jurisdiction: 'Patna District, Bihar',
    domain: 'WOMEN',
    responsibilities: '24x7 intake, emergency shelter, medical/police/legal referral coordination.',
    associatedSchemes: ['Mission Shakti — One Stop Centre'],
    officialPhone: '181 (Women Helpline)',
    sourceUrl: 'https://www.wcd.gov.in/osc-dashboard',
    lastVerifiedDate: '2026-11-25',
  },
  {
    id: 'OFF-PAT-CWC-CHAIR',
    designation: 'Chairperson, Child Welfare Committee (CWC)',
    officeholderName: 'UNVERIFIED (Designation Only)',
    verificationStatus: 'UNVERIFIED_OFFICEHOLDER',
    hierarchyLevel: 'Child Protection Institutions',
    department: 'State WCD / DCPU',
    organisation: 'Child Welfare Committee, Patna',
    jurisdiction: 'Patna District, Bihar',
    domain: 'CHILD',
    responsibilities: 'Statutory orders under JJ Act 2015 Section 31 & Individual Care Plan oversight.',
    associatedSchemes: ['Mission Vatsalya — CWC & CCI'],
    officialPhone: '1098 (Child Helpline)',
    sourceUrl: 'https://ncpcr.gov.in/',
    lastVerifiedDate: '2026-11-25',
  },
];

export const initialAlerts: AlertItem[] = [
  {
    id: 'ALT-2026-001',
    title: 'Hospital Medical Exam SLA Breach > 18.5h (CASE-DV-2026-PAT-0842)',
    category: 'Operational Alert',
    severity: 'CRITICAL',
    domain: 'WOMEN',
    geography: 'Patna, Bihar',
    source: 'Suraksha Sentinel SLA Monitor (Synthetic)',
    reason: 'Pending medical examination beyond 24h statutory limit under PWDVA Sec. 7.',
    responsibleRole: 'Chief Medical Officer / Duty MO',
    status: 'ACTION_REQUIRED',
    linkedPath: '/knowledge-assistant?token=CASE-DV-2026-PAT-0842&breach=MEDICAL_EXAM_24H&officer=Duty%20MO',
    createdAt: '2026-11-25T06:30:00Z',
  },
  {
    id: 'ALT-2026-002',
    title: 'DIR Form 1 Filing Overdue > 11h (CASE-DV-2026-PAT-0839)',
    category: 'Protection Service Alert',
    severity: 'HIGH',
    domain: 'WOMEN',
    geography: 'Patna, Bihar',
    source: 'Protection Officer Queue (Synthetic)',
    reason: 'Domestic Incident Report pending submission to Judicial Magistrate (PWDVA Sec. 9(1)(b)).',
    responsibleRole: 'Protection Officer (PWDVA)',
    status: 'ASSIGNED',
    linkedPath: '/investigation?gapId=GAP-W-PATNA-001',
    createdAt: '2026-11-25T07:15:00Z',
  },
  {
    id: 'ALT-2026-003',
    title: '64% DLSA Legal-Aid Drop-Off Pattern Flagged',
    category: 'AI Candidate Finding',
    severity: 'HIGH',
    domain: 'WOMEN',
    geography: 'Patna, Bihar',
    source: 'MoWCD OSC Audit + NCRB Cross-Check (Synthetic)',
    reason: 'Absence of co-located DLSA duty lawyer roster at Sakhi OSC Patna.',
    responsibleRole: 'Secretary, DLSA Patna',
    status: 'UNDER_REVIEW',
    linkedPath: '/investigation?gapId=GAP-W-PATNA-001',
    createdAt: '2026-11-24T14:00:00Z',
  },
  {
    id: 'ALT-2026-004',
    title: 'data.gov.in API Key Not Configured — Automated Ingestion Restricted',
    category: 'Data Quality Alert',
    severity: 'MEDIUM',
    domain: 'SHARED',
    geography: 'National',
    source: 'DataGovInAdapter',
    reason: 'DATA_GOV_IN_API_KEY env var absent; dataset marked ACCESS RESTRICTED.',
    responsibleRole: 'Data Engineering Lead',
    status: 'NEW',
    linkedPath: '/knowledge?tab=catalogue',
    createdAt: '2026-11-25T08:00:00Z',
  },
];

export const officialDatasetCatalog: DatasetEntry[] = [
  {
    datasetCode: 'DS-LGD-MASTER',
    name: 'LGD State, District & Block Master Codes',
    publishingDepartment: 'Ministry of Panchayati Raj / NIC',
    protectionDomain: 'SHARED',
    category: 'Geographic Master',
    geographicCoverage: 'All India (States/UTs/Districts/Blocks)',
    reportingPeriod: '2025–2026',
    publicationDate: '2026-01-15',
    retrievalDate: null,
    availableFormat: 'CSV / API',
    recordCount: 0,
    sourceUrl: 'https://lgdirectory.gov.in/',
    licenseTerms: 'GODL India',
    status: 'DISCOVERED',
    limitations: 'Requires live portal CSV download or NIC API whitelisting.',
    version: 'v1.0',
  },
  {
    datasetCode: 'DS-CENSUS-2011',
    name: 'Census 2011 District Population & Demographic Baseline',
    publishingDepartment: 'Ministry of Home Affairs (ORGI)',
    protectionDomain: 'SHARED',
    category: 'Demographics',
    geographicCoverage: 'All India (640 Districts)',
    reportingPeriod: '2011',
    publicationDate: '2013-04-30',
    retrievalDate: null,
    availableFormat: 'XLS / CSV',
    recordCount: 0,
    sourceUrl: 'https://censusindia.gov.in/',
    licenseTerms: 'Public Government Reference Data',
    status: 'DISCOVERED',
    limitations: '2011 boundaries require LGD crosswalk for newly created districts.',
    version: 'v1.0',
  },
  {
    datasetCode: 'DS-NFHS5-DIST',
    name: 'NFHS-5 District Factsheets (Anaemia, Maternal Health, Child Marriage, DV)',
    publishingDepartment: 'MoHFW / IIPS',
    protectionDomain: 'SHARED',
    category: 'Health & Protection Survey',
    geographicCoverage: '707 Districts',
    reportingPeriod: '2019–2021',
    publicationDate: '2022-05-05',
    retrievalDate: null,
    availableFormat: 'PDF / CSV',
    recordCount: 0,
    sourceUrl: 'https://www.mospi.gov.in/',
    licenseTerms: 'Public Government Survey Data',
    status: 'DISCOVERED',
    limitations: 'Sample-based estimates; 2019–2021 survey window.',
    version: 'v1.0',
  },
  {
    datasetCode: 'DS-NCRB-CAW',
    name: 'Crime in India — Crimes Against Women & Children',
    publishingDepartment: 'MHA / NCRB',
    protectionDomain: 'WOMEN',
    category: 'Crime & Violence',
    geographicCoverage: 'All States, UTs & 19 Cities',
    reportingPeriod: '2022',
    publicationDate: '2023-12-03',
    retrievalDate: null,
    availableFormat: 'PDF / XLS',
    recordCount: 0,
    sourceUrl: 'https://ncrb.gov.in/',
    licenseTerms: 'Public Government Statistical Report',
    status: 'DISCOVERED',
    limitations: 'Reported FIRs only; does not equal true prevalence.',
    version: 'v1.0',
  },
  {
    datasetCode: 'DS-MWCD-OSC',
    name: 'Mission Shakti — One Stop Centres (OSC) & Women Helpline 181',
    publishingDepartment: 'Ministry of Women & Child Development',
    protectionDomain: 'WOMEN',
    category: 'Mission Shakti / OSC',
    geographicCoverage: 'All States & UTs',
    reportingPeriod: '2024–2025',
    publicationDate: '2025-03-01',
    retrievalDate: null,
    availableFormat: 'HTML / PDF',
    recordCount: 0,
    sourceUrl: 'https://www.wcd.gov.in/osc-dashboard',
    licenseTerms: 'Public Government Dashboard',
    status: 'DISCOVERED',
    limitations: 'Aggregate counts only; outcome quality not published.',
    version: 'v1.0',
  },
  {
    datasetCode: 'DS-MWCD-VATSALYA',
    name: 'Mission Vatsalya — CWC, JJB, DCPU & CCI Institutional Statistics',
    publishingDepartment: 'Ministry of Women & Child Development',
    protectionDomain: 'CHILD',
    category: 'Mission Vatsalya',
    geographicCoverage: 'All States & UTs',
    reportingPeriod: '2024–2025',
    publicationDate: '2025-03-01',
    retrievalDate: null,
    availableFormat: 'PDF',
    recordCount: 0,
    sourceUrl: 'https://www.wcd.gov.in/',
    licenseTerms: 'Public Government Annual Report',
    status: 'DISCOVERED',
    limitations: 'Aggregate institutional counts only; no child-level records.',
    version: 'v1.0',
  },
  {
    datasetCode: 'DS-OGD-WCD-SCHEMES',
    name: 'data.gov.in — State-wise WCD Scheme Fund Releases & Expenditure',
    publishingDepartment: 'MeitY / MoWCD',
    protectionDomain: 'SHARED',
    category: 'Budget & Expenditure',
    geographicCoverage: 'All States & UTs',
    reportingPeriod: '2021–2025',
    publicationDate: '2025-02-15',
    retrievalDate: null,
    availableFormat: 'JSON / CSV API',
    recordCount: 0,
    sourceUrl: 'https://data.gov.in/',
    licenseTerms: 'GODL India',
    status: 'ACCESS RESTRICTED',
    limitations: 'Requires DATA_GOV_IN_API_KEY env var for live API ingestion.',
    version: 'v1.0',
  },
  {
    datasetCode: 'DS-UDISE-DROPOUT',
    name: 'UDISE+ Girl School Dropout & Enrolment Rates',
    publishingDepartment: 'Ministry of Education',
    protectionDomain: 'CHILD',
    category: 'Education & Dropout',
    geographicCoverage: 'All States, UTs & Districts',
    reportingPeriod: '2023–2024',
    publicationDate: '2024-12-10',
    retrievalDate: null,
    availableFormat: 'CSV / PDF',
    recordCount: 0,
    sourceUrl: 'https://udiseplus.gov.in/',
    licenseTerms: 'Public Government Education Data',
    status: 'DISCOVERED',
    limitations: 'Annual school-reported enrolment.',
    version: 'v1.0',
  },
  {
    datasetCode: 'DS-DOJ-FTSC',
    name: 'Fast Track Special Courts (FTSC) & POCSO Disposal / Pendency',
    publishingDepartment: 'Department of Justice',
    protectionDomain: 'CHILD',
    category: 'Courts & POCSO Pendency',
    geographicCoverage: 'All States & UTs',
    reportingPeriod: '2024–2025',
    publicationDate: '2025-01-31',
    retrievalDate: null,
    availableFormat: 'HTML / PDF',
    recordCount: 0,
    sourceUrl: 'https://dashboard.doj.gov.in/',
    licenseTerms: 'Public Government Justice Dashboard',
    status: 'DISCOVERED',
    limitations: 'Aggregate court pendency only.',
    version: 'v1.0',
  },
];

export const governmentSchemes: SchemeInfo[] = [
  {
    id: 'SCH-SHAKTI',
    name: 'Mission Shakti (Sambal & Samarthya)',
    domain: 'WOMEN',
    category: 'Mission Shakti',
    department: 'Ministry of Women & Child Development',
    purpose: 'Integrated safety, security and empowerment continuum for women across crisis response and livelihood.',
    services: ['One Stop Centres (OSC)', 'Women Helpline 181', 'Beti Bachao Beti Padhao (BBBP)', 'Shakti Sadan', 'Sakhi Niwas', 'Palna', 'PMMVY', 'SANKALP'],
    sourceUrl: 'https://missionshakti.wcd.gov.in/',
    reportingPeriod: '2024–2025 Guidelines',
    classification: 'OFFICIAL_PUBLIC',
  },
  {
    id: 'SCH-VATSALYA',
    name: 'Mission Vatsalya',
    domain: 'CHILD',
    category: 'Mission Vatsalya',
    department: 'Ministry of Women & Child Development',
    purpose: 'Statutory child protection services, institutional & non-institutional care, and family reintegration under JJ Act 2015.',
    services: ['Child Helpline 1098', 'DCPU', 'Child Welfare Committees (CWC)', 'Juvenile Justice Boards (JJB)', 'Child Care Institutions (CCI)', 'Foster Care & Sponsorship', 'CARA Adoption'],
    sourceUrl: 'https://www.wcd.gov.in/',
    reportingPeriod: '2024–2025 Guidelines',
    classification: 'OFFICIAL_PUBLIC',
  },
  {
    id: 'SCH-POSHAN',
    name: 'Saksham Anganwadi & POSHAN 2.0',
    domain: 'CHILD',
    category: 'Saksham Anganwadi and POSHAN',
    department: 'Ministry of Women & Child Development',
    purpose: 'Maternal and child nutrition, anaemia reduction, early childhood care and Anganwadi infrastructure.',
    services: ['Anganwadi Centres (AWC)', 'Supplementary Nutrition', 'Growth Monitoring', 'Adolescent Girls Scheme'],
    sourceUrl: 'https://wcd.gov.in/home-dashboard',
    reportingPeriod: '2025–2026',
    classification: 'OFFICIAL_PUBLIC',
  },
  {
    id: 'SCH-NALSA',
    name: 'Free Legal Aid (NALSA / DLSA Sec. 12)',
    domain: 'SHARED',
    category: 'Legal Aid Services',
    department: 'National & District Legal Services Authorities',
    purpose: 'Free legal representation for all women and children under Section 12 of Legal Services Authorities Act, 1987.',
    services: ['Panel Lawyers at OSC/Courts', 'NALSA Helpline 15100', 'Victim Compensation Support'],
    sourceUrl: 'https://nalsa.gov.in/',
    reportingPeriod: 'Statutory Mandate',
    classification: 'OFFICIAL_PUBLIC',
  },
];

export const recentHappenings: ActivityFeedItem[] = [
  {
    id: 'ACT-01',
    title: 'Candidate Gap GAP-W-PATNA-001 (DLSA Co-location) Validated in Patna Pilot',
    category: 'Validated Gap',
    source: 'District Convergence Review (Synthetic)',
    date: '2026-11-25',
    verificationStatus: 'SYNTHETIC',
    path: '/investigation?gapId=GAP-W-PATNA-001',
  },
  {
    id: 'ACT-02',
    title: '9 Authoritative GoI Data Sources Cataloged in Data Repository',
    category: 'Dataset Discovery',
    source: 'LGD / Census / NFHS-5 / NCRB / MWCD / UDISE+ / DoJ',
    date: '2026-11-25',
    verificationStatus: 'VERIFIED_FACT',
    path: '/knowledge?tab=catalogue',
  },
  {
    id: 'ACT-03',
    title: 'CAG Performance Audit on Mission Shakti Contractual Vacancies Indexed',
    category: 'Audit Report',
    source: 'CAG Report No. 14 of 2024',
    date: '2024-08-20',
    verificationStatus: 'VERIFIED_FACT',
    path: '/knowledge?tab=evidence',
  },
  {
    id: 'ACT-04',
    title: 'Outcome Verification OUT-PAT-001 Marked Partially Effective (62% vs 85% Target)',
    category: 'Outcome Verification',
    source: '90-Day Field Audit (Synthetic)',
    date: '2026-09-30',
    verificationStatus: 'SYNTHETIC',
    path: '/outcomes',
  },
];
