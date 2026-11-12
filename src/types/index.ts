export type ProtectionDomain = 'WOMEN' | 'CHILD';

export type EpistemicClass = 
  | 'VERIFIED_FACT' 
  | 'INFERENCE' 
  | 'HYPOTHESIS' 
  | 'RECOMMENDATION' 
  | 'DATA_NOT_AVAILABLE';

export type GapTaxonomyType = 
  | 'POLICY' 
  | 'IMPLEMENTATION' 
  | 'ACCESS' 
  | 'AWARENESS'
  | 'CAPACITY' 
  | 'GEOGRAPHIC' 
  | 'COORDINATION' 
  | 'PROCESS'
  | 'OUTCOME' 
  | 'DATA' 
  | 'EMERGING_THREAT';

export type GapStatus = 
  | 'CANDIDATE' 
  | 'UNDER_INVESTIGATION' 
  | 'VALIDATED' 
  | 'INTERVENTION_PLANNED' 
  | 'INTERVENTION_ACTIVE'
  | 'VERIFIED' 
  | 'CLOSED' 
  | 'REJECTED';

export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type ConfidenceLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface LocationScope {
  state: string;
  stateCode: string;
  district: string;
  districtId: string;
  block?: string;
}

export interface EvidenceItem {
  id: string;
  title: string;
  sourceOrg: string;
  publicationDate: string;
  documentType: 'ACT' | 'SOP' | 'ANNUAL_REPORT' | 'CAG_AUDIT' | 'DATASET' | 'FIELD_STUDY';
  sourceUrlOrRef: string;
  credibilityCategory: 'OFFICIAL_GOVERNMENT' | 'STATUTORY_BODY' | 'INDEPENDENT_AUDIT';
  applicableDomain: 'WOMEN' | 'CHILD' | 'SHARED';
  epistemicClass: EpistemicClass;
  extractedClaim: string;
  confidenceScore: number;
}

export interface GapContract {
  id: string;
  gapType: GapTaxonomyType;
  title: string;
  domain: ProtectionDomain;
  location: LocationScope;
  affectedCohort: string;
  rootCauseHypothesis: string;
  statutoryBasis: string;
  namedOwnerRole: string;
  mandatedIntervention: string;
  kpiMetric: string;
  kpiBaseline: number;
  kpiTarget: number;
  kpiSource: string;
  kpiFrequency: 'MONTHLY' | 'QUARTERLY';
  estimatedCostInr: number;
  deadlineDate: string;
  status: GapStatus;
  severity: SeverityLevel;
  confidence: ConfidenceLevel;
  evidenceIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Hypothesis {
  id: string;
  explanation: string;
  supportingEvidenceIds: string[];
  contradictingEvidenceIds: string[];
  fieldVerificationRequired: string;
  plausibilityScore: number;
}

export interface InvestigationWorkspaceData {
  id: string;
  gapId: string;
  domain: ProtectionDomain;
  problemSummary: string;
  verifiedFacts: string[];
  dataGaps: string[];
  hypotheses: Hypothesis[];
  possibleInterventions: string[];
  legalReferences: string[];
  assignedInvestigatorRole: string;
  status: 'CANDIDATE' | 'UNDER_INVESTIGATION' | 'VALIDATED' | 'INTERVENTION_PLANNED' | 'VERIFIED';
  updatedAt: string;
}

export interface InterventionPlan {
  id: string;
  gapId: string;
  type: 'PROCESS_IMPROVEMENT' | 'CAPACITY_ENHANCEMENT' | 'COORDINATION_MECHANISM' | 'TRAINING' | 'SCHEME_MODIFICATION' | 'TECHNOLOGY_SUPPORT' | 'PILOT_PROGRAMME' | 'LEGAL_REVIEW';
  description: string;
  ownerRole: string;
  targetDate: string;
  kpiMetric: string;
  kpiBaseline: number;
  kpiTarget: number;
  status: 'PROPOSED' | 'APPROVED' | 'IN_PROGRESS' | 'VERIFIED' | 'FAILED';
  approvalRole?: string;
  approvedAt?: string;
}

export interface OutcomeRecord {
  id: string;
  interventionId: string;
  gapId: string;
  baseline: number;
  target: number;
  observedResult: number;
  unit: string;
  measurementDate: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'PARTIALLY_EFFECTIVE' | 'EFFECTIVE' | 'INEFFECTIVE' | 'INSUFFICIENT_DATA';
  evidenceNotes: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  actorRole: string;
  action: string;
  entityType: 'GAP' | 'EVIDENCE' | 'INVESTIGATION' | 'INTERVENTION' | 'OUTCOME' | 'AUTH';
  entityId: string;
  details: string;
  sha256Hash: string;
}
