/**
 * Centralized synthetic workflow seed datasets for interactive demonstration screens.
 * Keeps UI page components free of inline mock arrays and avoids duplicate seed definitions.
 * All records are synthetic (`SYNTHETIC DEMONSTRATION`) with zero real beneficiary PII.
 */

export interface DecisionQueueItem {
  id: string;
  matterId: string;
  queue: string;
  title: string;
  authority: string;
  risk: string;
  benefit: string;
  status: string;
}

export const DECISION_QUEUES = [
  { id: 'ALL', label: 'All Queues' },
  { id: 'ADMINISTRATIVE', label: 'Administrative' },
  { id: 'FINANCIAL', label: 'Financial' },
  { id: 'COORDINATION', label: 'Coordination' },
  { id: 'ESCALATED', label: 'Escalated' },
  { id: 'OUTCOME_REVIEW', label: 'Outcome Review' },
] as const;

export const INITIAL_DECISIONS: DecisionQueueItem[] = [
  {
    id: 'DEC-01',
    matterId: 'MTR-2026-W-001',
    queue: 'FINANCIAL',
    title: 'Fast-track Rs. 10,000 balance subsistence tranche',
    authority: 'District Collector, Patna',
    risk: 'Delayed shelter exit',
    benefit: 'Immediate livelihood kit',
    status: 'PENDING',
  },
  {
    id: 'DEC-02',
    matterId: 'MTR-2026-W-002',
    queue: 'COORDINATION',
    title: 'Mandate 3-day/week DLSA Panel Roster at Sakhi OSC',
    authority: 'District Collector & DLSA Sec',
    risk: '64% legal drop-off continues',
    benefit: 'Raise linkage 36% → 85%',
    status: 'PENDING',
  },
  {
    id: 'DEC-03',
    matterId: 'MTR-2026-W-003',
    queue: 'ESCALATED',
    title: 'Escalate Rs. 18.5L Shelter Release for High Court Deadline',
    authority: 'Principal Secretary, WCD',
    risk: 'Court non-compliance 2026-12-08',
    benefit: '50 compliant shelter beds',
    status: 'PENDING',
  },
];

export interface NotifItem {
  id: string;
  dedup_key: string;
  target_role: string;
  event_type: string;
  message: string;
  matter_id?: string;
  created_at: string;
}

export const SEED_NOTIFICATIONS: NotifItem[] = [
  {
    id: 'NTF-101',
    dedup_key: 'ASSIGN:ACT-101:TREASURY_OFFICER',
    target_role: 'TREASURY_OFFICER',
    event_type: 'ACTION_ASSIGNED',
    message: 'Action ACT-101 assigned: Approve Treasury PFMS Batch (Balance Rs. 10,000)',
    matter_id: 'MTR-2026-W-001',
    created_at: '2026-11-20T09:00:00Z',
  },
];

export interface GroundTruthCallback {
  id: string;
  caseToken: string;
  channel: 'IVR_VOICE' | 'SMS_CODE';
  code: '1_RECEIVED' | '2_DELAYED' | '3_NOT_RECEIVED';
  reportedAt: string;
  discrepancyFlag: boolean;
  note: string;
}

export const INITIAL_GROUND_TRUTH: GroundTruthCallback[] = [
  {
    id: 'GT-PAT-001',
    caseToken: 'CASE-DV-2026-PAT-0842',
    channel: 'IVR_VOICE',
    code: '1_RECEIVED',
    reportedAt: '2026-11-24 14:20',
    discrepancyFlag: false,
    note: 'Beneficiary pressed 1 (Support & DLSA counsel contact confirmed). Zero PII stored.',
  },
  {
    id: 'GT-PAT-002',
    caseToken: 'CASE-POSH-2026-PAT-0319',
    channel: 'SMS_CODE',
    code: '2_DELAYED',
    reportedAt: '2026-11-24 16:05',
    discrepancyFlag: true,
    note: 'Paper status marked Completed, but callback code 2 indicates interim relief disbursement pending.',
  },
];

export interface ProblemComponent {
  id: string;
  gapType: string;
  observedCondition: string;
  expectedResponse: string;
  evidenceRef: string;
  possibleExplanation: string;
  competentAuthority: string;
  correctiveAction: string;
  dependencies: string;
  resourceReq: string;
  expectedOutcome: string;
}

export const COMPONENT_TYPES = [
  'Service Gap',
  'Implementation Gap',
  'Policy Gap',
  'Access Gap',
  'Coordination Gap',
  'Capacity Gap',
  'Financial Gap',
  'Legal / Procedural Requirement',
  'Resource Requirement',
  'Data Gap',
  'Rehabilitation Requirement',
];

export const INITIAL_PROBLEM_COMPONENTS: ProblemComponent[] = [
  {
    id: 'CMP-01',
    gapType: 'Capacity Gap',
    observedCondition: '64% OSC survivors drop out before DLSA court filing due to 12km travel distance',
    expectedResponse: 'NALSA Sec. 12 Free Legal Aid accessible at Sakhi OSC',
    evidenceRef: 'MoWCD/SAMBAL/OSC/2025/REP-84',
    possibleExplanation: 'No co-located panel advocate desk at OSC',
    competentAuthority: 'Secretary, DLSA Patna',
    correctiveAction: 'Deploy 2 panel advocates 3 days/week at Sakhi OSC',
    dependencies: 'DLSA Panel Renewal (DEP-002)',
    resourceReq: 'Rs. 1.2L annual honorarium',
    expectedOutcome: 'Raise legal aid linkage from 36% to 85%',
  },
  {
    id: 'CMP-02',
    gapType: 'Process Gap',
    observedCondition: 'Informal mediation preceding DIR Form 1 filing',
    expectedResponse: 'Mandatory DIR Form 1 under PWDVA Sec. 9(1)(b)',
    evidenceRef: 'DWPU/PAT/SRV-2026-04 (HYPOTHESIS)',
    possibleExplanation: 'Counselling misunderstood as pre-FIR prerequisite',
    competentAuthority: 'SP (Crime Against Women)',
    correctiveAction: 'Issue station circular + audit DIR register',
    dependencies: 'None (can proceed independently of litigation)',
    resourceReq: 'Training circular only',
    expectedOutcome: '100% DIR compliance at Mahila Cell',
  },
  {
    id: 'CMP-03',
    gapType: 'Financial Gap',
    observedCondition: 'Balance Rs. 10,000 subsistence tranche delayed 11 days',
    expectedResponse: '7-day PFMS batch disbursement post-sanction',
    evidenceRef: 'WCD/PAT/FIN/2026-44',
    possibleExplanation: 'Treasury DDO batch signature pending',
    competentAuthority: 'District Treasury Officer',
    correctiveAction: 'Clear PFMS batch UTR',
    dependencies: 'DEP-001',
    resourceReq: 'Rs. 10,000 approved balance',
    expectedOutcome: 'Immediate shelter & livelihood stability',
  },
];

export interface ContinuityCase {
  token: string;
  consentStatus: string;
  repeatStatements: number;
  paperBaseline: number;
  currentStageIndex: number;
  steps: string[];
}

export const INITIAL_CONTINUITY_CASES: ContinuityCase[] = [
  {
    token: 'CASE-DV-2026-PAT-0842',
    consentStatus: 'GRANTED (Zero-PII Token)',
    repeatStatements: 1,
    paperBaseline: 4,
    currentStageIndex: 2,
    steps: ['OSC Intake', 'Medical 24h', 'PO DIR Filed', 'DLSA Legal Aid', 'Shakti Sadan'],
  },
  {
    token: 'CASE-POSH-2026-PAT-0319',
    consentStatus: 'GRANTED (Zero-PII Token)',
    repeatStatements: 1,
    paperBaseline: 3,
    currentStageIndex: 3,
    steps: ['IC Complaint', 'Interim Relief', 'District LC Review', '90-Day Inquiry', 'Closure'],
  },
];

export interface ActionRecord {
  id: string;
  matter_id: string;
  title: string;
  description: string;
  responsible_department: string;
  responsible_role: string;
  accountable_authority: string;
  coordinating_authority: string;
  acknowledged: number;
  required_deliverable: string;
  timeline_date: string;
  required_evidence: string;
  completion_evidence_ref?: string | null;
  dependency_ids: string[];
  status: string;
}

export const SEED_ACTIONS: ActionRecord[] = [
  {
    id: 'ACT-101',
    matter_id: 'MTR-2026-W-001',
    title: 'Approve Treasury PFMS Batch for Balance Rs. 10,000 Rehab Grant',
    description: 'Clear pending PFMS batch for survivor subsistence grant.',
    responsible_department: 'Finance & Treasury',
    responsible_role: 'TREASURY_OFFICER',
    accountable_authority: 'DISTRICT_COLLECTOR',
    coordinating_authority: 'DISTRICT_COLLECTOR',
    acknowledged: 0,
    required_deliverable: 'Signed PFMS UTR batch',
    timeline_date: '2026-11-30',
    required_evidence: 'PFMS UTR Receipt',
    dependency_ids: [],
    status: 'ASSIGNED',
  },
  {
    id: 'ACT-102',
    matter_id: 'MTR-2026-W-001',
    title: 'Disburse Balance Shelter Rehabilitation Kit & Log Receipt',
    description: 'Complete balance tranche disbursement once DEP-001 resolves.',
    responsible_department: 'Women & Child Development',
    responsible_role: 'DWCD_OFFICER',
    accountable_authority: 'DISTRICT_COLLECTOR',
    coordinating_authority: 'DISTRICT_COLLECTOR',
    acknowledged: 1,
    required_deliverable: 'Disbursement acknowledgement',
    timeline_date: '2026-12-03',
    required_evidence: 'Bank Disbursement Voucher',
    dependency_ids: ['DEP-001'],
    status: 'WAITING_FOR_DEPENDENCY',
  },
  {
    id: 'ACT-103',
    matter_id: 'MTR-2026-W-002',
    title: 'Publish Co-located DLSA Advocate Roster at Sakhi OSC Patna',
    description: 'Deploy 2 panel advocates 3 days/week at Sakhi OSC.',
    responsible_department: 'Legal Services Authority',
    responsible_role: 'DLSA_LAWYER',
    accountable_authority: 'DISTRICT_COLLECTOR',
    coordinating_authority: 'DISTRICT_COLLECTOR',
    acknowledged: 1,
    required_deliverable: 'Signed December Advocate Roster',
    timeline_date: '2026-12-01',
    required_evidence: 'Signed DLSA Roster PDF',
    dependency_ids: [],
    status: 'IN_PROGRESS',
  },
];
