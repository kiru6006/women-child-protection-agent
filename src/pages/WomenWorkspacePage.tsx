import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Card } from '@/components/common/Card';
import { PageHeader } from '@/components/common/PageHeader';
import { DomainBadge } from '@/components/badges/DomainBadge';
import { ShieldCheck, ArrowRight, HeartPulse, Scale, Home, Briefcase, RefreshCw, CheckCircle2 } from 'lucide-react';

const WOMEN_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'crime', label: 'Crime & Violence' },
  { id: 'dv', label: 'Domestic Violence' },
  { id: 'harassment', label: 'Sexual Harassment' },
  { id: 'workplace', label: 'Workplace (POSH)' },
  { id: 'cyber', label: 'Cyber & Digital Safety' },
  { id: 'health', label: 'Health & Nutrition' },
  { id: 'economic', label: 'Economic Empowerment' },
  { id: 'schemes', label: 'Schemes & Support' },
  { id: 'rehab', label: 'Rehabilitation' },
];

const INITIAL_CONTINUITY_CASES = [
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

export function WomenWorkspacePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';
  const [continuityCases, setContinuityCases] = useState(INITIAL_CONTINUITY_CASES);

  const journeyStages = [
    { title: '1. Safety & Distress Intake', desc: 'OSC Intake / Helpline 181 / Women Police Cell', icon: ShieldCheck, status: 'Active (32 Synthetic)', to: '/gaps' },
    { title: '2. Immediate Health & Forensic', desc: 'Hospital Medical Exam within 24h (PWDVA s.7)', icon: HeartPulse, status: '2 Breaches Flagged', to: '/knowledge-assistant?token=CASE-DV-2026-PAT-0842&breach=MEDICAL_EXAM_24H&officer=Duty%20MO' },
    { title: '3. Legal Protection & DIR', desc: 'Protection Officer DIR filing & DLSA Panel Assignment', icon: Scale, status: '11 Awaiting DIR', to: '/investigation?gapId=GAP-W-PATNA-001' },
    { title: '4. Shelter & Emergency Care', desc: 'Sakhi Swadhar Greh / Shakti Sadan', icon: Home, status: '4 Active Admissions', to: '/schemes?tab=shakti' },
    { title: '5. Economic & Livelihood Support', desc: 'MGNREGS / DAY-NRLM / SANKALP Linkage', icon: Briefcase, status: '8 Pending Linkage', to: '/interventions' },
    { title: '6. Outcome & Rehabilitation', desc: '3-Month Survivor Safety & Non-Repetition Audit', icon: RefreshCw, status: '14 Under Verification', to: '/outcomes' },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        breadcrumb={['Women Protection', WOMEN_TABS.find((t) => t.id === activeTab)?.label || 'Overview']}
        title="Women Protection Intelligence (Domain A)"
        purpose="Domain A operational continuum: Safety → Support → Legal → Shelter → Economic → Rehabilitation. Covers W01–W12 categories."
        badge="MVP Active"
        source="MoWCD Mission Shakti + NCRB + Synthetic Pilot"
        reportingPeriod="2024–2026"
        classification="MIXED_OFFICIAL_AND_SYNTHETIC"
        actions={<DomainBadge domain="WOMEN" />}
      />

      <div className="flex flex-wrap gap-1.5">
        {WOMEN_TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setSearchParams({ tab: t.id })}
            className={`px-2.5 py-1 rounded text-xs font-semibold border ${
              activeTab === t.id ? 'bg-[#7D2A42] text-white border-[#7D2A42]' : 'bg-white text-slate-700 border-slate-200 hover:bg-[#FFE5DE]/60'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {journeyStages.map((stage) => {
          const Icon = stage.icon;
          return (
            <Link key={stage.title} to={stage.to} className="block group">
              <Card className="h-full group-hover:border-[#EF5A90] transition-colors">
                <div className="flex items-start gap-2.5">
                  <div className="p-2 rounded-lg bg-[#FFE5DE] text-[#7D2A42]">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-bold text-slate-900 group-hover:text-[#7D2A42]">{stage.title}</h3>
                    <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-1">{stage.desc}</p>
                    <div className="mt-2 text-[11px] font-semibold text-[#7D2A42] flex items-center justify-between">
                      <span>{stage.status}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* M18 Demo: Zero-PII Micro Case Continuity Tracker */}
      <Card
        header={
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm font-bold text-gov-navy">Micro Case Continuity Tracker (M18 Synthetic Demo)</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-pink-50 text-pink-800 border border-pink-200 font-mono font-semibold">
              Zero-PII Pseudonymous Tokens Only
            </span>
          </div>
        }
      >
        <div className="space-y-3">
          {continuityCases.map((c) => (
            <div key={c.token} className="p-3 bg-slate-50 border border-slate-200 rounded-md space-y-2 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono font-bold text-gov-navy">{c.token}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded border font-semibold ${
                      c.consentStatus.startsWith('WITHDRAWN')
                        ? 'bg-amber-50 text-amber-900 border-amber-300'
                        : 'bg-green-50 text-green-800 border-green-200'
                    }`}
                  >
                    {c.consentStatus}
                  </span>
                  <span className="text-[11px] text-slate-600">
                    Repeat Statements: <strong className="text-green-700">{c.repeatStatements}</strong> (Paper baseline: {c.paperBaseline})
                  </span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() =>
                      setContinuityCases((prev) =>
                        prev.map((item) =>
                          item.token === c.token
                            ? {
                                ...item,
                                consentStatus: item.consentStatus.startsWith('WITHDRAWN')
                                  ? 'GRANTED (Zero-PII Token)'
                                  : 'WITHDRAWN (Non-Statutory Sharing Paused)',
                              }
                            : item
                        )
                      )
                    }
                    className="px-2 py-1 rounded border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 font-semibold text-[11px]"
                  >
                    {c.consentStatus.startsWith('WITHDRAWN') ? 'Restore Consent' : 'Withdraw Consent'}
                  </button>
                  {c.currentStageIndex < c.steps.length - 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setContinuityCases((prev) =>
                          prev.map((item) =>
                            item.token === c.token
                              ? { ...item, currentStageIndex: Math.min(item.steps.length - 1, item.currentStageIndex + 1) }
                              : item
                          )
                        )
                      }
                      className="px-2.5 py-1 rounded bg-primary hover:bg-primary-hover text-white font-semibold text-[11px]"
                    >
                      Log Next Continuity Step
                    </button>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {c.steps.map((st, idx) => {
                  const done = idx <= c.currentStageIndex;
                  return (
                    <span
                      key={st}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[11px] font-medium ${
                        done ? 'bg-blue-50 text-blue-900 border-blue-200' : 'bg-white text-slate-600 border-slate-200'
                      }`}
                    >
                      {done && <CheckCircle2 className="w-3 h-3 text-primary" />}
                      <span>{st}</span>
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
