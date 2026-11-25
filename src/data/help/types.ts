export type HelpAvailability =
  | 'AVAILABLE'
  | 'DEMONSTRATION ONLY'
  | 'UNDER DEVELOPMENT'
  | 'PLANNED'
  | 'REQUIRES GOVERNMENT INTEGRATION'
  | 'REQUIRES LEGAL OR ADMINISTRATIVE APPROVAL';

export type HelpCategoryId =
  | 'about'
  | 'vision'
  | 'problems'
  | 'gap-intelligence'
  | 'solutions'
  | 'architecture'
  | 'by-role'
  | 'by-department'
  | 'by-work-category'
  | 'by-issue'
  | 'women-protection'
  | 'child-protection'
  | 'matter-investigation'
  | 'ownership'
  | 'convergence'
  | 'police-litigation'
  | 'finance'
  | 'ngo-community'
  | 'ai-intelligence'
  | 'progress-monitoring'
  | 'alerts-escalation'
  | 'outcomes-recognition'
  | 'directory'
  | 'knowledge-data'
  | 'screen-guide'
  | 'walkthroughs'
  | 'governance-safety'
  | 'faq'
  | 'glossary'
  | 'implementation-status';

export interface HelpRelatedScreen {
  name: string;
  route: string;
  explanation: string;
  status: HelpAvailability;
}

export interface HelpCategoryMeta {
  id: HelpCategoryId;
  number: number;
  label: string;
  group: 'Core' | 'Perspectives' | 'Capabilities' | 'Reference';
  summary: string;
  availability: HelpAvailability;
  lastReviewed: string;
  version: string;
  relatedScreens: HelpRelatedScreen[];
}

export interface HelpProblemMapping {
  id: string;
  problem: string;
  whyItMatters: string;
  existingResponse: string;
  systemicGap: string;
  proposedCapability: string;
  stakeholders: string[];
  expectedImprovement: string;
  screens: { name: string; route: string }[];
}

export interface HelpRoleGuide {
  id: string;
  title: string;
  overview: string;
  responsibilities: string[];
  decisionsAuthority: string;
  infoRequired: string[];
  dailyWork: string[];
  dependencies: string[];
  capabilities: string[];
  accessBoundary: string;
  screens: { name: string; route: string }[];
  exampleWorkflow: string;
}

export interface HelpDeptGuide {
  id: string;
  name: string;
  relationship:
    | 'Statutory responsibility'
    | 'Administrative coordination'
    | 'Information exchange'
    | 'Financial dependency'
    | 'Service referral'
    | 'Authorised collaboration'
    | 'Applicable order compliance';
  purpose: string;
  responsibilities: string;
  lawsSchemes: string;
  activities: string;
  dependencies: string;
  docsExchanged: string;
  responsibleRoles: string[];
  screens: { name: string; route: string }[];
}

export interface HelpWorkCategory {
  id: string;
  name: string;
  purpose: string;
  activities: string;
  stakeholders: string;
  deliverables: string;
  completionCriteria: string;
  evidence: string;
  screens: { name: string; route: string }[];
}

export interface HelpIssueGuide {
  id: string;
  domain: 'WOMEN' | 'CHILD';
  title: string;
  definition: string;
  whyIntervention: string;
  mechanisms: string;
  departments: string[];
  authorities: string[];
  schemes: string[];
  gaps: string;
  dependencies: string;
  resources: string;
  expectedOutcome: string;
  screens: { name: string; route: string }[];
}

export interface HelpScreenEntry {
  name: string;
  route: string;
  category: string;
  purpose: string;
  problemAddressed: string;
  intendedUsers: string;
  actions: string;
  status: HelpAvailability;
}

export interface HelpWalkthrough {
  id: string;
  title: string;
  scenario: string;
  problem: string;
  stakeholders: string;
  govtResponse: string;
  gap: string;
  actions: string;
  responsibilities: string;
  dependencies: string;
  finance: string;
  aiAssistance: string;
  humanApproval: string;
  monitoring: string;
  outcome: string;
  steps: { label: string; route: string }[];
}

export interface MindmapNode {
  id: string;
  label: string;
  explanation: string;
  stakeholders?: string;
  route?: string;
  children?: MindmapNode[];
}

export interface HelpFaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export interface HelpGlossaryItem {
  term: string;
  plainDefinition: string;
  statutoryNote?: string;
}

export interface OnboardingPath {
  id: string;
  role: string;
  steps: { id: string; label: string; categoryId: HelpCategoryId; route?: string }[];
}
