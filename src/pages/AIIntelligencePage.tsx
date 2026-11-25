import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Card } from '@/components/common/Card';
import { PageHeader } from '@/components/common/PageHeader';
import { EpistemicBadge } from '@/components/badges/EpistemicBadge';
import { useDemoStore } from '@/store/demoStore';
import { useAppStore } from '@/store/appStore';

const AI_TABS = [
  { id: 'centre', label: 'AI Intelligence Centre' },
  { id: 'emerging', label: 'Emerging Issues' },
  { id: 'gaps', label: 'Gap Detection' },
  { id: 'evidence', label: 'Evidence Analysis' },
  { id: 'root-cause', label: 'Root-Cause Investigation' },
  { id: 'schemes', label: 'Scheme Effectiveness' },
  { id: 'capacity', label: 'Capacity & Resources' },
  { id: 'convergence', label: 'Govt Convergence' },
  { id: 'interventions', label: 'Intervention Recs' },
];

export function AIIntelligencePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'centre';
  const { currentRole } = useAppStore();
  const { addGap } = useDemoStore();
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const findings = [
    {
      id: 'AIF-01',
      tab: 'gaps',
      title: '64% Legal Aid Drop-off Between Sakhi OSC and DLSA Civil Court',
      domain: 'WOMEN' as const,
      issueCategory: 'W08 Legal Protection',
      geography: 'Patna, Bihar',
      epistemicClass: 'INFERENCE' as const,
      sources: ['MoWCD/SAMBAL/OSC/2025/REP-84', 'NCRB-2024-TABLE-3A.4'],
      reportingPeriod: '2024–2025',
      limitations: 'Aggregate OSC counts; individual travel reasons require field verification.',
      explanations: ['No daily co-located DLSA lawyer at OSC', '12km travel cost barrier for survivors'],
      govtResponse: 'Mission Shakti OSC + NALSA Sec. 12 Free Legal Aid',
      potentialGap: 'CAPACITY / COORDINATION GAP',
      authority: 'Secretary, DLSA Patna',
      humanReview: 'VALIDATED BY DISTRICT COLLECTOR',
      gapId: 'GAP-W-PATNA-001',
    },
    {
      id: 'AIF-02',
      tab: 'root-cause',
      title: 'Informal Police Mediation Preceding DIR Filing',
      domain: 'WOMEN' as const,
      issueCategory: 'W01 Domestic Violence',
      geography: 'Patna, Bihar',
      epistemicClass: 'HYPOTHESIS' as const,
      sources: ['DWPU/PAT/SRV-2026-04', 'PWDVA 2005 Sec. 9(1)(b)'],
      reportingPeriod: '2026 Pilot',
      limitations: 'Qualitative interviews only; station-level register audit pending.',
      explanations: ['Counselling misunderstood as mandatory pre-FIR step', 'Shortage of female desk officers'],
      govtResponse: 'BPR&D SOP & Lalita Kumari (2013) binding guidelines',
      potentialGap: 'PROCESS GAP',
      authority: 'Superintendent of Police (Women Cell)',
      humanReview: 'PENDING HUMAN VERIFICATION',
      gapId: 'GAP-W-PATNA-003',
    },
    {
      id: 'AIF-03',
      tab: 'capacity',
      title: 'Contractual Counsellor Vacancies Across Mission Shakti OSCs',
      domain: 'WOMEN' as const,
      issueCategory: 'W09 Service Accessibility',
      geography: 'Bihar (State Aggregate)',
      epistemicClass: 'VERIFIED_FACT' as const,
      sources: ['CAG Report No. 14 of 2024 (Civil)'],
      reportingPeriod: '2022–2024',
      limitations: 'Audit covers sampled districts; current month vacancy live MIS pending.',
      explanations: ['Delayed contractual renewal cycles', 'Below-market honorarium ceilings'],
      govtResponse: 'Mission Shakti HR Norms',
      potentialGap: 'CAPACITY GAP',
      authority: 'State WCD Mission Director',
      humanReview: 'AUDITED FACT (CAG)',
      gapId: 'GAP-W-PATNA-001',
    },
    {
      id: 'AIF-04',
      tab: 'emerging',
      title: 'Deepfake / Image-Based Abuse Jurisdictional Handoff Ambiguity',
      domain: 'WOMEN' as const,
      issueCategory: 'W04 Digital Safety',
      geography: 'National / State Pilot',
      epistemicClass: 'DATA_NOT_AVAILABLE' as const,
      sources: ['No indexed State SOP for AI-generated NCII at OSC level'],
      reportingPeriod: '2025–2026',
      limitations: 'DATA NOT AVAILABLE: Disaggregated OSC-to-Cyber-Cell referral metrics missing.',
      explanations: ['Unclear SOP between OSC, Cyber Crime Portal (1930) & local police'],
      govtResponse: 'IT Act / BNS + Cyber Crime Portal',
      potentialGap: 'EMERGING THREAT GAP',
      authority: 'State WCD + State Cyber Cell',
      humanReview: 'REQUIRES LEGAL REVIEW',
      gapId: 'GAP-W-PATNA-001',
    },
  ];

  const visible =
    activeTab === 'centre' || activeTab === 'evidence' || activeTab === 'schemes' || activeTab === 'convergence' || activeTab === 'interventions'
      ? findings
      : findings.filter((f) => f.tab === activeTab || activeTab === 'centre');

  return (
    <div className="space-y-5">
      <PageHeader
        breadcrumb={['AI Intelligence', AI_TABS.find((t) => t.id === activeTab)?.label || 'Centre']}
        title="AI Intelligence Centre (Bounded Capabilities A1–A4)"
        purpose="Evidence-backed gap detection, hypothesis generation, scheme effectiveness, and convergence intelligence. AI never converts hypotheses into facts or executes decisions autonomously."
        badge="Bounded AI • temp=0.0"
        source="Indexed Statutory Corpus + Synthetic Pilot Findings"
        reportingPeriod="2024–2026"
        classification="MIXED_OFFICIAL_AND_SYNTHETIC"
      />

      <div className="flex flex-wrap gap-1.5">
        {AI_TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setSearchParams({ tab: t.id })}
            className={`px-2.5 py-1.5 rounded text-xs font-semibold border ${
              activeTab === t.id ? 'bg-gov-navy text-white border-gov-navy' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {t.label}
          </button>
        ))}
        <Link to="/knowledge-assistant" className="px-2.5 py-1.5 rounded text-xs font-semibold border border-blue-300 bg-blue-50 text-blue-800 hover:bg-blue-100">
          Open AI Knowledge Assistant →
        </Link>
      </div>

      {statusMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-900 font-medium">
          {statusMsg}
        </div>
      )}

      <div className="space-y-4">
        {visible.map((f) => (
          <Card key={f.id}>
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-gov-navy">{f.id}</span>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-purple-50 text-purple-800 border border-purple-200 font-semibold">{f.domain}</span>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700">{f.issueCategory}</span>
                  <span className="text-[11px] text-slate-500">{f.geography} • {f.reportingPeriod}</span>
                </div>
                <EpistemicBadge classification={f.epistemicClass} />
              </div>

              <h3 className="text-sm font-bold text-slate-900">{f.title}</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded border border-slate-200">
                <div><strong>Possible Explanations (Hypotheses):</strong> {f.explanations.join('; ')}</div>
                <div><strong>Data Limitations:</strong> {f.limitations}</div>
                <div><strong>Existing Govt Response:</strong> {f.govtResponse}</div>
                <div><strong>Responsible Authority:</strong> {f.authority} ({f.humanReview})</div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                <span className="text-[11px] font-mono text-slate-500">Sources: {f.sources.join(', ')}</span>
                <div className="flex flex-wrap gap-2">
                  <Link to="/evidence" className="px-2.5 py-1 rounded border border-slate-300 hover:bg-slate-50 font-medium">View Evidence</Link>
                  <Link to={`/investigation?gapId=${f.gapId}`} className="px-2.5 py-1 rounded bg-gov-navy text-white font-semibold hover:bg-slate-800">Start Investigation</Link>
                  <button
                    type="button"
                    onClick={() => {
                      const created = addGap(
                        {
                          gapType: 'COORDINATION',
                          title: `Candidate: ${f.title}`,
                          domain: 'WOMEN',
                          location: { state: 'Bihar', stateCode: 'BR', district: 'Patna', districtId: 'PATNA' },
                          affectedCohort: f.issueCategory,
                          rootCauseHypothesis: f.explanations[0],
                          statutoryBasis: f.govtResponse,
                          namedOwnerRole: f.authority,
                          mandatedIntervention: 'Review in District Convergence Meeting',
                          kpiMetric: 'Service SLA %',
                          kpiBaseline: 36,
                          kpiTarget: 85,
                          kpiSource: f.sources[0],
                          kpiFrequency: 'MONTHLY',
                          estimatedCostInr: 0,
                          deadlineDate: '2026-12-31',
                          severity: 'HIGH',
                          confidence: 'MEDIUM',
                          evidenceIds: [],
                        },
                        currentRole
                      );
                      setStatusMsg(`Created Candidate Gap ${created.id} for human validation.`);
                    }}
                    className="px-2.5 py-1 rounded border border-purple-300 bg-purple-50 text-purple-900 font-semibold hover:bg-purple-100"
                  >
                    Create Candidate Gap
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
