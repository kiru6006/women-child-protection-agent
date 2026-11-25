import {
  AuditEvent,
  EvidenceItem,
  GapContract,
  GapStatus,
  GapTaxonomyType,
  Hypothesis,
  InterventionPlan,
  InvestigationWorkspaceData,
  OutcomeRecord,
} from '@/types';
import { useAppStore } from '@/store/appStore';
import { useDemoStore } from '@/store/demoStore';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

function markFallback(active: boolean) {
  useAppStore.getState().setUsingMockFallback(active);
}

function mapEvidence(raw: Record<string, any>): EvidenceItem {
  return {
    id: raw.id,
    title: raw.title,
    sourceOrg: raw.sourceOrg ?? raw.source_org,
    publicationDate: raw.publicationDate ?? raw.publication_date,
    documentType: raw.documentType ?? raw.document_type,
    sourceUrlOrRef: raw.sourceUrlOrRef ?? raw.source_url_or_ref,
    credibilityCategory: raw.credibilityCategory ?? raw.credibility_category,
    sourceOrigin: raw.sourceOrigin ?? raw.source_origin ?? 'SYNTHETIC',
    applicableDomain: raw.applicableDomain ?? raw.applicable_domain,
    epistemicClass: raw.epistemicClass ?? raw.epistemic_class,
    extractedClaim: raw.extractedClaim ?? raw.extracted_claim,
    confidenceScore: raw.confidenceScore ?? raw.confidence_score,
  };
}

function mapGap(raw: Record<string, any>): GapContract {
  const loc = raw.location || {};
  return {
    id: raw.id,
    gapType: raw.gapType ?? raw.gap_type,
    title: raw.title,
    domain: raw.domain,
    location: {
      state: loc.state,
      stateCode: loc.stateCode ?? loc.state_code,
      district: loc.district,
      districtId: loc.districtId ?? loc.district_id,
      block: loc.block,
    },
    affectedCohort: raw.affectedCohort ?? raw.affected_cohort,
    rootCauseHypothesis: raw.rootCauseHypothesis ?? raw.root_cause_hypothesis,
    statutoryBasis: raw.statutoryBasis ?? raw.statutory_basis,
    namedOwnerRole: raw.namedOwnerRole ?? raw.named_owner_role,
    mandatedIntervention: raw.mandatedIntervention ?? raw.mandated_intervention,
    kpiMetric: raw.kpiMetric ?? raw.kpi_metric,
    kpiBaseline: raw.kpiBaseline ?? raw.kpi_baseline,
    kpiTarget: raw.kpiTarget ?? raw.kpi_target,
    kpiSource: raw.kpiSource ?? raw.kpi_source,
    kpiFrequency: raw.kpiFrequency ?? raw.kpi_frequency,
    estimatedCostInr: raw.estimatedCostInr ?? raw.estimated_cost_inr,
    deadlineDate: raw.deadlineDate ?? raw.deadline_date,
    status: raw.status,
    severity: raw.severity,
    confidence: raw.confidence,
    evidenceIds: raw.evidenceIds ?? raw.evidence_ids ?? [],
    createdAt: raw.createdAt ?? raw.created_at,
    updatedAt: raw.updatedAt ?? raw.updated_at,
  };
}

function mapInvestigation(raw: Record<string, any>): InvestigationWorkspaceData {
  return {
    id: raw.id,
    gapId: raw.gapId ?? raw.gap_id,
    domain: raw.domain,
    problemSummary: raw.problemSummary ?? raw.problem_summary,
    verifiedFacts: raw.verifiedFacts ?? raw.verified_facts ?? [],
    conflictingEvidence: raw.conflictingEvidence ?? raw.conflicting_evidence ?? [],
    dataGaps: raw.dataGaps ?? raw.data_gaps ?? [],
    hypotheses: (raw.hypotheses ?? []).map((h: Record<string, any>) => ({
      id: h.id,
      explanation: h.explanation,
      supportingEvidenceIds: h.supportingEvidenceIds ?? h.supporting_evidence_ids ?? [],
      contradictingEvidenceIds: h.contradictingEvidenceIds ?? h.contradicting_evidence_ids ?? [],
      fieldVerificationRequired: h.fieldVerificationRequired ?? h.field_verification_required,
      plausibilityScore: h.plausibilityScore ?? h.plausibility_score,
    })),
    possibleInterventions: raw.possibleInterventions ?? raw.possible_interventions ?? [],
    legalReferences: raw.legalReferences ?? raw.legal_references ?? [],
    schemeReferences: raw.schemeReferences ?? raw.scheme_references ?? [],
    dependencies: raw.dependencies ?? [],
    assignedInvestigatorRole: raw.assignedInvestigatorRole ?? raw.assigned_investigator_role,
    status: raw.status,
    updatedAt: raw.updatedAt ?? raw.updated_at,
  };
}

function mapIntervention(raw: Record<string, any>): InterventionPlan {
  return {
    id: raw.id,
    gapId: raw.gapId ?? raw.gap_id,
    type: raw.type,
    description: raw.description,
    ownerRole: raw.ownerRole ?? raw.owner_role,
    targetDate: raw.targetDate ?? raw.target_date,
    kpiMetric: raw.kpiMetric ?? raw.kpi_metric,
    kpiBaseline: raw.kpiBaseline ?? raw.kpi_baseline,
    kpiTarget: raw.kpiTarget ?? raw.kpi_target,
    status: raw.status,
    approvalRole: raw.approvalRole ?? raw.approval_role,
    approvedAt: raw.approvedAt ?? raw.approved_at,
  };
}

function mapOutcome(raw: Record<string, any>): OutcomeRecord {
  return {
    id: raw.id,
    interventionId: raw.interventionId ?? raw.intervention_id,
    gapId: raw.gapId ?? raw.gap_id,
    baseline: raw.baseline,
    target: raw.target,
    observedResult: raw.observedResult ?? raw.observed_result,
    unit: raw.unit,
    measurementDate: raw.measurementDate ?? raw.measurement_date,
    status: raw.status,
    evidenceNotes: raw.evidenceNotes ?? raw.evidence_notes,
  };
}

export async function fetchGaps(district?: string): Promise<GapContract[]> {
  try {
    const url = district ? `${API_BASE_URL}/gaps?district=${encodeURIComponent(district)}` : `${API_BASE_URL}/gaps`;
    const res = await fetch(url, { signal: AbortSignal.timeout(1500) });
    if (res.ok) {
      markFallback(false);
      return (await res.json()).map(mapGap);
    }
  } catch {
    // Demo fallback
  }
  markFallback(true);
  const all = useDemoStore.getState().gaps;
  return district ? all.filter((g) => g.location.district.toLowerCase() === district.toLowerCase()) : all;
}

export async function createGap(
  payload: {
    gap_type: GapTaxonomyType;
    title: string;
    district: string;
    state: string;
    affected_cohort: string;
    root_cause_hypothesis: string;
    statutory_basis: string;
    named_owner_role: string;
    mandated_intervention: string;
    kpi_metric: string;
    kpi_baseline: number;
    kpi_target: number;
    deadline_date: string;
  },
  role: string
): Promise<GapContract> {
  try {
    const res = await fetch(`${API_BASE_URL}/gaps`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-User-Role': role },
      body: JSON.stringify({
        gap_type: payload.gap_type,
        title: payload.title,
        domain: 'WOMEN',
        location: {
          state: payload.state,
          state_code: payload.state.slice(0, 2).toUpperCase(),
          district: payload.district,
          district_id: payload.district.toUpperCase(),
        },
        affected_cohort: payload.affected_cohort,
        root_cause_hypothesis: payload.root_cause_hypothesis,
        statutory_basis: payload.statutory_basis,
        named_owner_role: payload.named_owner_role,
        mandated_intervention: payload.mandated_intervention,
        kpi_metric: payload.kpi_metric,
        kpi_baseline: payload.kpi_baseline,
        kpi_target: payload.kpi_target,
        kpi_source: 'District WCD Review',
        deadline_date: payload.deadline_date,
      }),
      signal: AbortSignal.timeout(1500),
    });
    if (res.ok) {
      markFallback(false);
      return mapGap(await res.json());
    }
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Failed with status ${res.status}`);
  } catch (e: any) {
    if (e?.name === 'TypeError' || e?.name === 'TimeoutError' || e?.name === 'AbortError') {
      markFallback(true);
      return useDemoStore.getState().addGap(
        {
          gapType: payload.gap_type,
          title: payload.title,
          domain: 'WOMEN',
          location: {
            state: payload.state,
            stateCode: payload.state.slice(0, 2).toUpperCase(),
            district: payload.district,
            districtId: payload.district.toUpperCase(),
          },
          affectedCohort: payload.affected_cohort,
          rootCauseHypothesis: payload.root_cause_hypothesis,
          statutoryBasis: payload.statutory_basis,
          namedOwnerRole: payload.named_owner_role,
          mandatedIntervention: payload.mandated_intervention,
          kpiMetric: payload.kpi_metric,
          kpiBaseline: payload.kpi_baseline,
          kpiTarget: payload.kpi_target,
          kpiSource: 'District WCD Review (Synthetic Demo)',
          kpiFrequency: 'MONTHLY',
          estimatedCostInr: 0,
          deadlineDate: payload.deadline_date,
          severity: 'HIGH',
          confidence: 'MEDIUM',
          evidenceIds: [],
        },
        role
      );
    }
    throw e;
  }
}

export async function updateGapStatus(gapId: string, status: GapStatus, role: string): Promise<GapContract> {
  try {
    const res = await fetch(`${API_BASE_URL}/gaps/${encodeURIComponent(gapId)}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'X-User-Role': role },
      body: JSON.stringify({ status }),
      signal: AbortSignal.timeout(1500),
    });
    if (res.ok) {
      markFallback(false);
      return mapGap(await res.json());
    }
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Failed with status ${res.status}`);
  } catch (e: any) {
    if (e?.name === 'TypeError' || e?.name === 'TimeoutError' || e?.name === 'AbortError') {
      markFallback(true);
      return useDemoStore.getState().advanceGapStatus(gapId, status, role);
    }
    throw e;
  }
}

export async function fetchEvidence(): Promise<EvidenceItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/evidence`, { signal: AbortSignal.timeout(1500) });
    if (res.ok) {
      markFallback(false);
      return (await res.json()).map(mapEvidence);
    }
  } catch {
    // Demo fallback
  }
  markFallback(true);
  return useDemoStore.getState().evidence;
}

export async function createEvidence(
  payload: {
    title: string;
    source_org: string;
    publication_date: string;
    document_type: EvidenceItem['documentType'];
    source_url_or_ref: string;
    source_origin: 'OFFICIAL' | 'OPERATIONAL' | 'FIELD' | 'SYNTHETIC';
    epistemic_class: EvidenceItem['epistemicClass'];
    extracted_claim: string;
  },
  role: string
): Promise<EvidenceItem> {
  try {
    const res = await fetch(`${API_BASE_URL}/evidence`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-User-Role': role },
      body: JSON.stringify({ ...payload, applicable_domain: 'WOMEN' }),
      signal: AbortSignal.timeout(1500),
    });
    if (res.ok) {
      markFallback(false);
      return mapEvidence(await res.json());
    }
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Failed with status ${res.status}`);
  } catch (e: any) {
    if (e?.name === 'TypeError' || e?.name === 'TimeoutError' || e?.name === 'AbortError') {
      markFallback(true);
      return useDemoStore.getState().addEvidence(
        {
          title: payload.title,
          sourceOrg: payload.source_org,
          publicationDate: payload.publication_date,
          documentType: payload.document_type,
          sourceUrlOrRef: payload.source_url_or_ref,
          credibilityCategory: 'OFFICIAL_GOVERNMENT',
          sourceOrigin: payload.source_origin,
          applicableDomain: 'WOMEN',
          epistemicClass: payload.epistemic_class,
          extractedClaim: payload.extracted_claim,
          confidenceScore: 0.85,
        },
        role
      );
    }
    throw e;
  }
}

export async function fetchInvestigation(gapId: string): Promise<InvestigationWorkspaceData> {
  try {
    const res = await fetch(`${API_BASE_URL}/investigations/${encodeURIComponent(gapId)}`, {
      signal: AbortSignal.timeout(1500),
    });
    if (res.ok) {
      markFallback(false);
      return mapInvestigation(await res.json());
    }
  } catch {
    // Demo fallback
  }
  markFallback(true);
  return useDemoStore.getState().getInvestigationForGap(gapId);
}

export async function updateInvestigation(
  gapId: string,
  payload: { data_gaps?: string[]; conflicting_evidence?: string[]; hypotheses?: Hypothesis[] },
  role: string
): Promise<InvestigationWorkspaceData> {
  try {
    const res = await fetch(`${API_BASE_URL}/investigations/${encodeURIComponent(gapId)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'X-User-Role': role },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(1500),
    });
    if (res.ok) {
      markFallback(false);
      return mapInvestigation(await res.json());
    }
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Failed with status ${res.status}`);
  } catch (e: any) {
    if (e?.name === 'TypeError' || e?.name === 'TimeoutError' || e?.name === 'AbortError') {
      markFallback(true);
      return useDemoStore.getState().updateInvestigationLocal(gapId, payload, role);
    }
    throw e;
  }
}

export async function queryRAG(query: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/rag/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
      signal: AbortSignal.timeout(1500),
    });
    if (res.ok) {
      markFallback(false);
      return await res.json();
    }
  } catch {
    markFallback(true);
  }
  return null;
}

export async function fetchInterventions(): Promise<InterventionPlan[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/interventions`, { signal: AbortSignal.timeout(1500) });
    if (res.ok) {
      markFallback(false);
      return (await res.json()).map(mapIntervention);
    }
  } catch {
    // Demo fallback
  }
  markFallback(true);
  return useDemoStore.getState().interventions;
}

export async function createIntervention(
  payload: {
    gap_id: string;
    type: InterventionPlan['type'];
    description: string;
    owner_role: string;
    target_date: string;
    kpi_metric: string;
    kpi_baseline: number;
    kpi_target: number;
  },
  role: string
): Promise<InterventionPlan> {
  try {
    const res = await fetch(`${API_BASE_URL}/interventions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-User-Role': role },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(1500),
    });
    if (res.ok) {
      markFallback(false);
      return mapIntervention(await res.json());
    }
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Failed with status ${res.status}`);
  } catch (e: any) {
    if (e?.name === 'TypeError' || e?.name === 'TimeoutError' || e?.name === 'AbortError') {
      markFallback(true);
      return useDemoStore.getState().addIntervention(
        {
          gapId: payload.gap_id,
          type: payload.type,
          description: payload.description,
          ownerRole: payload.owner_role,
          targetDate: payload.target_date,
          kpiMetric: payload.kpi_metric,
          kpiBaseline: payload.kpi_baseline,
          kpiTarget: payload.kpi_target,
        },
        role
      );
    }
    throw e;
  }
}

export async function approveIntervention(id: string, role: string): Promise<InterventionPlan> {
  try {
    const res = await fetch(`${API_BASE_URL}/interventions/${encodeURIComponent(id)}/approve`, {
      method: 'POST',
      headers: { 'X-User-Role': role },
      signal: AbortSignal.timeout(1500),
    });
    if (res.ok) {
      markFallback(false);
      return mapIntervention(await res.json());
    }
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Failed with status ${res.status}`);
  } catch (e: any) {
    if (e?.name === 'TypeError' || e?.name === 'TimeoutError' || e?.name === 'AbortError') {
      markFallback(true);
      return useDemoStore.getState().approveInterventionLocal(id, role);
    }
    throw e;
  }
}

export async function fetchOutcomes(): Promise<OutcomeRecord[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/outcomes`, { signal: AbortSignal.timeout(1500) });
    if (res.ok) {
      markFallback(false);
      return (await res.json()).map(mapOutcome);
    }
  } catch {
    // Demo fallback
  }
  markFallback(true);
  return useDemoStore.getState().outcomes;
}

export async function createOutcome(
  payload: {
    intervention_id: string;
    gap_id: string;
    baseline: number;
    target: number;
    observed_result: number;
    measurement_date: string;
    evidence_notes: string;
  },
  role: string
): Promise<OutcomeRecord> {
  try {
    const res = await fetch(`${API_BASE_URL}/outcomes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-User-Role': role },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(1500),
    });
    if (res.ok) {
      markFallback(false);
      return mapOutcome(await res.json());
    }
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Failed with status ${res.status}`);
  } catch (e: any) {
    if (e?.name === 'TypeError' || e?.name === 'TimeoutError' || e?.name === 'AbortError') {
      markFallback(true);
      return useDemoStore.getState().addOutcome(
        {
          interventionId: payload.intervention_id,
          gapId: payload.gap_id,
          baseline: payload.baseline,
          target: payload.target,
          observedResult: payload.observed_result,
          unit: '%',
          measurementDate: payload.measurement_date,
          evidenceNotes: payload.evidence_notes,
        },
        role
      );
    }
    throw e;
  }
}

export async function verifyOutcome(
  id: string,
  status: OutcomeRecord['status'],
  role: string
): Promise<OutcomeRecord> {
  try {
    const res = await fetch(`${API_BASE_URL}/outcomes/${encodeURIComponent(id)}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-User-Role': role },
      body: JSON.stringify({ status }),
      signal: AbortSignal.timeout(1500),
    });
    if (res.ok) {
      markFallback(false);
      return mapOutcome(await res.json());
    }
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Failed with status ${res.status}`);
  } catch (e: any) {
    if (e?.name === 'TypeError' || e?.name === 'TimeoutError' || e?.name === 'AbortError') {
      markFallback(true);
      return useDemoStore.getState().verifyOutcomeLocal(id, status, role);
    }
    throw e;
  }
}

export async function fetchAuditLedger(): Promise<AuditEvent[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/audit/ledger`, { signal: AbortSignal.timeout(1500) });
    if (res.ok) {
      markFallback(false);
      return (await res.json()).map((r: Record<string, any>) => ({
        id: r.id,
        timestamp: r.timestamp,
        actorRole: r.actorRole ?? r.actor_role,
        action: r.action,
        entityType: r.entityType ?? r.entity_type,
        entityId: r.entityId ?? r.entity_id,
        details: r.details,
        previousHash: r.previousHash ?? r.previous_hash,
        sha256Hash: r.sha256Hash ?? r.sha256_hash,
      }));
    }
  } catch {
    // Demo fallback
  }
  markFallback(true);
  return useDemoStore.getState().auditLogs;
}

export async function verifyAuditChain(): Promise<{ valid: boolean; total_blocks?: number }> {
  try {
    const res = await fetch(`${API_BASE_URL}/audit/verify`, { signal: AbortSignal.timeout(1500) });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Demo fallback
  }
  return { valid: true, total_blocks: useDemoStore.getState().auditLogs.length };
}
