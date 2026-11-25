import { EpistemicClass, ProtectionDomain, SeverityLevel } from './index';

// Section 14: 7 Independent Status Dimensions
export type MatterStatus =
  | 'OPEN'
  | 'UNDER_REVIEW'
  | 'ACTIVE'
  | 'BLOCKED'
  | 'RESOLVED'
  | 'CLOSED'
  | 'REOPENED';

export type AdminActionStatus =
  | 'NOT_STARTED'
  | 'ASSIGNED'
  | 'ACKNOWLEDGED'
  | 'IN_PROGRESS'
  | 'WAITING_FOR_DEPENDENCY'
  | 'COMPLETED'
  | 'VERIFIED'
  | 'CANCELLED';

export type PoliceCoordinationStatus =
  | 'NOT_APPLICABLE'
  | 'PRELIMINARY_INQUIRY'
  | 'FIR_REGISTERED'
  | 'INVESTIGATION_ONGOING'
  | 'CHARGESHEET_FILED';

export type LitigationStatus =
  | 'NOT_APPLICABLE'
  | 'PENDING_HEARING'
  | 'INTERIM_ORDER_PASSED'
  | 'DISPOSED'
  | 'APPEAL_PENDING';

export type CourtComplianceStatus =
  | 'NOT_APPLICABLE'
  | 'REVIEW_REQUIRED'
  | 'AWAITING_ACTION'
  | 'PARTIALLY_COMPLIED'
  | 'COMPLIANCE_REPORTED'
  | 'COMPLIANCE_VERIFIED'
  | 'STAYED_NOT_EXECUTABLE';

export type FinancialStatus =
  | 'NOT_APPLICABLE'
  | 'REQUESTED'
  | 'UNDER_REVIEW'
  | 'SANCTIONED'
  | 'RELEASED'
  | 'DISBURSED'
  | 'UTILISATION_REPORTED'
  | 'UTILISATION_VERIFIED'
  | 'REJECTED';

export type GovernanceOutcomeStatus =
  | 'NOT_MEASURED'
  | 'IN_PROGRESS'
  | 'PARTIALLY_ACHIEVED'
  | 'ACHIEVED'
  | 'NOT_ACHIEVED'
  | 'INSUFFICIENT_EVIDENCE';

export type DependencyType =
  | 'POLICE_INVESTIGATION'
  | 'POLICE_DOCUMENTATION'
  | 'JUDICIAL_PROCEEDINGS'
  | 'COURT_ORDER'
  | 'LEGAL_REVIEW'
  | 'MEDICAL_EXAMINATION'
  | 'DEPARTMENTAL_APPROVAL'
  | 'ADMINISTRATIVE_SANCTION'
  | 'FINANCIAL_SANCTION'
  | 'FUND_RELEASE'
  | 'RESOURCE_AVAILABILITY'
  | 'SERVICE_PROVIDER_AVAILABILITY'
  | 'NGO_COORDINATION'
  | 'LOCAL_BODY_COORDINATION'
  | 'BENEFICIARY_SAFE_VERIFICATION'
  | 'DOCUMENT_AVAILABILITY'
  | 'DATA_AVAILABILITY';

export type DependencyStatus =
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'WAITING_FOR_INFORMATION'
  | 'WAITING_FOR_APPROVAL'
  | 'WAITING_FOR_LEGAL_PROCESS'
  | 'WAITING_FOR_FUNDS'
  | 'BLOCKED'
  | 'RESOLVED'
  | 'NOT_APPLICABLE'
  | 'CANCELLED';

export type MatterCategory =
  | 'SYSTEMIC_GAP'
  | 'WELFARE_ASSISTANCE'
  | 'AUTHORISED_CASE_COORDINATION'
  | 'REHABILITATION'
  | 'SCHEME_IMPLEMENTATION'
  | 'COURT_ORDER_COMPLIANCE'
  | 'FINANCIAL_ASSISTANCE'
  | 'DEPARTMENTAL_COORDINATION';

export interface Matter360 {
  id: string;
  demoCode: string; // DEMO-01..DEMO-10
  title: string;
  domain: ProtectionDomain;
  category: MatterCategory;
  jurisdiction: string;
  severity: SeverityLevel;
  epistemicClass: EpistemicClass;
  matterStatus: MatterStatus;
  adminStatus: AdminActionStatus;
  coordinatingAuthority: string;
  responsibleAuthority: string;
  responsibleDepartment: string;
  createdDate: string;
  updatedDate: string;
  isSynthetic: true;

  // B. Police Coordination
  police: {
    reference: string;
    firRef: string;
    station: string;
    responsibleRole: string;
    status: PoliceCoordinationStatus;
    requiredDocs: string;
    pendingLawfulAction: string;
    courtDependency: string;
    updatedDate: string;
  };

  // C. Litigation & Judicial Coordination
  litigation: {
    court: string;
    caseRef: string;
    category: string;
    status: LitigationStatus;
    hearingDate: string;
    applicableOrder: string;
    orderDate: string;
    complianceAuthority: string;
    complianceRequirement: string;
    deadline: string;
    appealOrStayStatus: string;
    complianceStatus: CourtComplianceStatus;
  };

  // D. Welfare & Protection Services
  welfareServices: {
    service: string;
    applicable: boolean;
    status: 'DELIVERED' | 'IN_PROGRESS' | 'PENDING' | 'NOT_REQUIRED';
    provider: string;
  }[];

  // E. Financial Coordination
  finance: {
    scheme: string;
    category: string;
    estimatedInr: number;
    requestedInr: number;
    approvedInr: number;
    releasedInr: number;
    disbursedInr: number;
    utilisedInr: number;
    sanctionRef: string;
    sanctioningAuthority: string;
    status: FinancialStatus;
  };

  // F. Ownership & Dependencies
  ownership: {
    accountableAuthority: string;
    responsibleRole: string;
    supportingDepartments: string[];
    pendingAction: string;
    dependencyOwner: string;
    expectedCompletionDate: string;
    escalationAuthority: string;
    delayReason: string;
    isLawfulWait: boolean;
  };

  // G. NGO & Community Participation
  ngoSupport: {
    organisation: string;
    activity: string;
    status: 'APPROVED' | 'ACTIVE' | 'COMPLETED' | 'NOT_APPLICABLE';
    evidenceRef: string;
  };

  // H. Outcome
  outcome: {
    expectedOutcome: string;
    actualDelivered: string;
    followUpStatus: string;
    status: GovernanceOutcomeStatus;
    unmetNeeds: string;
    nextReviewDate: string;
  };

  // AI Assistance (Bounded)
  aiSummary: {
    finding: string;
    limitations: string;
    humanDecision: string;
  };
}

export interface Dependency360 {
  id: string;
  matterId: string;
  type: DependencyType;
  predecessorAction: string;
  dependentAction: string;
  predecessorNode: string;
  dependentNode: string;
  ownerRole: string;
  supportingAuthority: string;
  reason: string;
  status: DependencyStatus;
  isLawfulWait: boolean;
  dueDate: string;
  escalationAuthority: string;
  evidenceRef: string;
}

export interface DepartmentLink {
  id: string;
  fromDept: string;
  toDept: string;
  purpose: string;
  statutoryBasis: string;
  infoExchanged: string;
  responsibleRole: string;
  expectedAction: string;
  pendingAction: string;
  dependencyType: DependencyType;
  timeline: string;
  escalationMechanism: string;
  accessRestriction: string;
}

export interface ResponsibilityAssignment {
  id: string;
  matterId: string;
  actionTitle: string;
  responsibleDept: string;
  responsibleRole: string; // R
  accountableAuthority: string; // A
  consultedRoles: string[]; // C
  informedRoles: string[]; // I
  reviewDate: string;
  completionCriteria: string;
  escalationPath: string;
  status: AdminActionStatus;
  transferHistory: { date: string; fromRole: string; toRole: string; reason: string }[];
}

export interface SchemeBudgetRecord {
  id: string;
  schemeName: string;
  level: 'CENTRAL' | 'STATE' | 'DISTRICT';
  jurisdiction: string;
  allocatedInr: number;
  sanctionedInr: number;
  releasedInr: number;
  disbursedInr: number;
  utilisedInr: number;
  pendingInr: number;
  financialStatus: FinancialStatus;
  candidateGap: string;
  isSynthetic: boolean;
}

export interface NGOOrganisation {
  id: string;
  name: string;
  registrationId: string;
  empanelmentStatus: 'EMPANELLED' | 'PROVISIONAL' | 'VERIFICATION_PENDING';
  geography: string;
  category: string;
  capabilities: string[];
  officialContact: string;
  grantStatus: string;
  purposeLimitNote: string;
}

export interface SupportActivity {
  id: string;
  title: string;
  category: string;
  authority: string;
  organisation: string;
  geography: string;
  targetGroup: string;
  approvedFundingInr: number;
  expectedOutcome: string;
  verificationStatus: 'VERIFIED' | 'IN_PROGRESS' | 'PROPOSED';
  isLocalBody?: boolean;
}

export interface RecognitionNomination {
  id: string;
  candidateName: string;
  candidateType: 'DEPARTMENT' | 'DISTRICT_TEAM' | 'FRONTLINE_TEAM' | 'NGO' | 'LOCAL_BODY';
  category: string;
  geography: string;
  evidenceSummary: string;
  qualityMetric: string; // Never raw arrest/closure counts
  independentVerifier: string;
  status: 'NOMINATED' | 'UNDER_REVIEW' | 'APPROVED';
}

export type DashboardRoleKey =
  | 'MINISTER'
  | 'SECRETARY'
  | 'COMMISSIONER'
  | 'COLLECTOR'
  | 'DWCD_OFFICER'
  | 'POLICE'
  | 'LEGAL'
  | 'FINANCE'
  | 'NGO'
  | 'AUDITOR';
