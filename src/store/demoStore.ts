import { create } from 'zustand';
import {
  AuditEvent,
  EvidenceItem,
  GapContract,
  GapStatus,
  Hypothesis,
  InterventionPlan,
  InvestigationWorkspaceData,
  OutcomeRecord,
} from '@/types';
import {
  mockAuditLogs,
  mockEvidence,
  mockGaps,
  mockInterventions,
  mockInvestigation,
  mockOutcomes,
} from '@/data/mockData';
import {
  AlertItem,
  DatasetEntry,
  OfficialRecord,
  initialAlerts,
  officialDatasetCatalog,
  officialDirectory,
} from '@/data/platformData';

const PII_REGEX = /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}\b|\b(?:\+91[\s-]?)?[6-9]\d{9}\b|\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/;
const HUMAN_VALIDATORS = new Set(['DISTRICT_COLLECTOR', 'WCD_SECRETARY', 'PROTECTION_OFFICER']);

const ALLOWED_TRANSITIONS: Record<GapStatus, GapStatus[]> = {
  CANDIDATE: ['UNDER_INVESTIGATION', 'REJECTED'],
  UNDER_INVESTIGATION: ['VALIDATED', 'REJECTED'],
  VALIDATED: ['INTERVENTION_PLANNED', 'REJECTED'],
  INTERVENTION_PLANNED: ['INTERVENTION_ACTIVE', 'REJECTED'],
  INTERVENTION_ACTIVE: ['VERIFIED'],
  VERIFIED: ['CLOSED'],
  CLOSED: [],
  REJECTED: [],
};

function pseudoHash(input: string): string {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).padStart(8, '0').repeat(8);
}

function buildFallbackInvestigation(gap: GapContract): InvestigationWorkspaceData {
  return {
    id: `INV-${gap.id.replace('GAP-', '')}`,
    gapId: gap.id,
    domain: gap.domain,
    problemSummary: `${gap.title} — ${gap.rootCauseHypothesis}`,
    verifiedFacts: [
      `Cohort affected: ${gap.affectedCohort} (${gap.location.district}, ${gap.location.state}).`,
      `Statutory mandate: ${gap.statutoryBasis}.`,
    ],
    conflictingEvidence: [],
    dataGaps: [`Baseline audit required from ${gap.namedOwnerRole} (${gap.kpiSource}).`],
    hypotheses: [
      {
        id: `HYP-${gap.id}-1`,
        explanation: gap.rootCauseHypothesis,
        supportingEvidenceIds: gap.evidenceIds,
        contradictingEvidenceIds: [],
        fieldVerificationRequired: `Joint review with ${gap.namedOwnerRole} in ${gap.location.district}.`,
        plausibilityScore: 0.78,
      },
    ],
    possibleInterventions: [
      `Process Fix: ${gap.mandatedIntervention}`,
      `Convergence Directive: Bind ${gap.namedOwnerRole} to ${gap.kpiTarget}% ${gap.kpiMetric} by ${gap.deadlineDate}.`,
    ],
    legalReferences: [gap.statutoryBasis],
    schemeReferences: ['Mission Shakti (Sambal / Samarthya)'],
    dependencies: [gap.namedOwnerRole],
    assignedInvestigatorRole: gap.namedOwnerRole,
    status: 'UNDER_INVESTIGATION',
    updatedAt: gap.updatedAt,
  };
}

interface DemoState {
  evidence: EvidenceItem[];
  gaps: GapContract[];
  investigations: Record<string, InvestigationWorkspaceData>;
  interventions: InterventionPlan[];
  outcomes: OutcomeRecord[];
  auditLogs: AuditEvent[];
  alerts: AlertItem[];
  officials: OfficialRecord[];
  datasets: DatasetEntry[];

  updateAlertStatus: (id: string, status: AlertItem['status'], role: string) => void;
  addEvidence: (item: Omit<EvidenceItem, 'id'>, role: string) => EvidenceItem;
  addGap: (gap: Omit<GapContract, 'id' | 'createdAt' | 'updatedAt' | 'status'>, role: string) => GapContract;
  advanceGapStatus: (gapId: string, targetStatus: GapStatus, role: string) => GapContract;
  getInvestigationForGap: (gapId: string) => InvestigationWorkspaceData;
  updateInvestigationLocal: (
    gapId: string,
    patch: { data_gaps?: string[]; conflicting_evidence?: string[]; hypotheses?: Hypothesis[] },
    role: string
  ) => InvestigationWorkspaceData;
  addIntervention: (plan: Omit<InterventionPlan, 'id' | 'status'>, role: string) => InterventionPlan;
  approveInterventionLocal: (id: string, role: string) => InterventionPlan;
  addOutcome: (record: Omit<OutcomeRecord, 'id' | 'status'>, role: string) => OutcomeRecord;
  verifyOutcomeLocal: (id: string, status: OutcomeRecord['status'], role: string) => OutcomeRecord;
  logAudit: (actorRole: string, action: string, entityType: AuditEvent['entityType'], entityId: string, details: string) => void;
}

export const useDemoStore = create<DemoState>((set, get) => ({
  evidence: mockEvidence.map((e) => ({ ...e, sourceOrigin: e.sourceOrigin ?? 'SYNTHETIC' })),
  gaps: mockGaps,
  investigations: { [mockInvestigation.gapId]: mockInvestigation },
  interventions: mockInterventions,
  outcomes: mockOutcomes,
  auditLogs: mockAuditLogs,
  alerts: initialAlerts,
  officials: officialDirectory,
  datasets: officialDatasetCatalog,

  updateAlertStatus: (id, status, role) => {
    set((s) => ({
      alerts: s.alerts.map((a) => (a.id === id ? { ...a, status } : a)),
    }));
    get().logAudit(role, 'UPDATE_ALERT_STATUS', 'INVESTIGATION', id, `Alert ${id} -> ${status}`);
  },

  logAudit: (actorRole, action, entityType, entityId, details) => {
    const prev = get().auditLogs;
    const prevHash = prev[0]?.sha256Hash || '0'.repeat(64);
    const ts = new Date().toISOString();
    const id = `AUD-${prev.length + 901}`;
    const entry: AuditEvent = {
      id,
      timestamp: ts,
      actorRole,
      action,
      entityType,
      entityId,
      details,
      sha256Hash: pseudoHash(`${id}|${ts}|${actorRole}|${action}|${entityId}|${details}|${prevHash}`),
    };
    set({ auditLogs: [entry, ...prev] });
  },

  addEvidence: (item, role) => {
    if (PII_REGEX.test(`${item.title} ${item.extractedClaim} ${item.sourceUrlOrRef}`)) {
      throw new Error('ZERO-PII POLICY VIOLATION (DPDP Act 2023): Raw Aadhaar, phone, or email blocked.');
    }
    const created: EvidenceItem = {
      ...item,
      id: `EVD-DEMO-${Math.floor(100 + Math.random() * 900)}`,
    };
    set((s) => ({ evidence: [created, ...s.evidence] }));
    get().logAudit(role, 'CREATE_EVIDENCE', 'EVIDENCE', created.id, `Added ${created.sourceOrigin} evidence`);
    return created;
  },

  addGap: (gap, role) => {
    if (PII_REGEX.test(`${gap.title} ${gap.affectedCohort} ${gap.rootCauseHypothesis}`)) {
      throw new Error('ZERO-PII POLICY VIOLATION (DPDP Act 2023): Raw Aadhaar, phone, or email blocked.');
    }
    const now = new Date().toISOString();
    const created: GapContract = {
      ...gap,
      id: `GAP-W-${gap.location.districtId.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      status: 'CANDIDATE',
      createdAt: now,
      updatedAt: now,
    };
    set((s) => ({ gaps: [created, ...s.gaps] }));
    get().logAudit(role, 'CREATE_GAP_CANDIDATE', 'GAP', created.id, `Created candidate gap: ${created.title}`);
    return created;
  },

  advanceGapStatus: (gapId, targetStatus, role) => {
    const gap = get().gaps.find((g) => g.id === gapId);
    if (!gap) throw new Error('Gap Contract not found.');
    if (!ALLOWED_TRANSITIONS[gap.status].includes(targetStatus)) {
      throw new Error(`Invalid transition: ${gap.status} -> ${targetStatus}`);
    }
    if (['VALIDATED', 'INTERVENTION_PLANNED', 'INTERVENTION_ACTIVE', 'VERIFIED', 'CLOSED'].includes(targetStatus) && !HUMAN_VALIDATORS.has(role)) {
      throw new Error(`Role '${role}' cannot perform human-gated transition to '${targetStatus}'.`);
    }
    const updated: GapContract = { ...gap, status: targetStatus, updatedAt: new Date().toISOString() };
    set((s) => ({ gaps: s.gaps.map((g) => (g.id === gapId ? updated : g)) }));
    get().logAudit(role, 'TRANSITION_GAP_STATUS', 'GAP', gapId, `${gap.status} -> ${targetStatus}`);
    return updated;
  },

  getInvestigationForGap: (gapId) => {
    const existing = get().investigations[gapId];
    if (existing) return existing;
    const gap = get().gaps.find((g) => g.id === gapId) || get().gaps[0];
    const generated = buildFallbackInvestigation(gap);
    set((s) => ({ investigations: { ...s.investigations, [gap.id]: generated } }));
    return generated;
  },

  updateInvestigationLocal: (gapId, patch, role) => {
    const current = get().getInvestigationForGap(gapId);
    const updated: InvestigationWorkspaceData = {
      ...current,
      dataGaps: patch.data_gaps ?? current.dataGaps,
      conflictingEvidence: patch.conflicting_evidence ?? current.conflictingEvidence,
      hypotheses: patch.hypotheses ?? current.hypotheses,
      updatedAt: new Date().toISOString(),
    };
    set((s) => ({ investigations: { ...s.investigations, [gapId]: updated } }));
    get().logAudit(role, 'UPDATE_INVESTIGATION', 'INVESTIGATION', updated.id, `Updated investigation for ${gapId}`);
    return updated;
  },

  addIntervention: (plan, role) => {
    const created: InterventionPlan = {
      ...plan,
      id: `INT-DEMO-${Math.floor(100 + Math.random() * 900)}`,
      status: 'PROPOSED',
    };
    set((s) => ({ interventions: [created, ...s.interventions] }));
    get().logAudit(role, 'PROPOSE_INTERVENTION', 'INTERVENTION', created.id, `Proposed for ${created.gapId}`);
    return created;
  },

  approveInterventionLocal: (id, role) => {
    if (!HUMAN_VALIDATORS.has(role)) {
      throw new Error(`Role '${role}' cannot approve government interventions.`);
    }
    const target = get().interventions.find((i) => i.id === id);
    if (!target) throw new Error('Intervention not found.');
    const updated: InterventionPlan = {
      ...target,
      status: 'APPROVED',
      approvalRole: role,
      approvedAt: new Date().toISOString(),
    };
    set((s) => ({ interventions: s.interventions.map((i) => (i.id === id ? updated : i)) }));
    get().logAudit(role, 'APPROVE_INTERVENTION', 'INTERVENTION', id, `Sanctioned by ${role}`);
    return updated;
  },

  addOutcome: (record, role) => {
    const created: OutcomeRecord = {
      ...record,
      id: `OUT-DEMO-${Math.floor(100 + Math.random() * 900)}`,
      status: 'IN_PROGRESS',
    };
    set((s) => ({ outcomes: [created, ...s.outcomes] }));
    get().logAudit(role, 'RECORD_OUTCOME', 'OUTCOME', created.id, `Recorded ${created.observedResult}${created.unit}`);
    return created;
  },

  verifyOutcomeLocal: (id, status, role) => {
    if (!HUMAN_VALIDATORS.has(role)) {
      throw new Error(`Role '${role}' cannot certify outcome verification.`);
    }
    const target = get().outcomes.find((o) => o.id === id);
    if (!target) throw new Error('Outcome record not found.');
    const updated: OutcomeRecord = { ...target, status };
    set((s) => ({ outcomes: s.outcomes.map((o) => (o.id === id ? updated : o)) }));
    get().logAudit(role, 'VERIFY_OUTCOME', 'OUTCOME', id, `Certified ${status} by ${role}`);
    return updated;
  },
}));
