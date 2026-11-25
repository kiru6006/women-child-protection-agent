import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/common/Card';
import { PageHeader } from '@/components/common/PageHeader';
import { CheckCircle2, ArrowRight, PlayCircle, RotateCcw } from 'lucide-react';

const DEMO_STEPS = [
  { step: 1, title: 'Issue Discovery', detail: '64% OSC-to-DLSA legal drop-off & 11-day balance subsistence delay flagged.', route: '/alerts', screen: 'Alerts & Notifications' },
  { step: 2, title: 'Evidence Review', detail: 'Inspect MoWCD OSC audit + NCRB Table 3A.4 provenance.', route: '/evidence', screen: 'Evidence Library' },
  { step: 3, title: 'Gap Validation', detail: 'Validate GAP-W-PATNA-001 (Capacity Gap, Target 36% → 85%).', route: '/gaps', screen: 'Gap Explorer' },
  { step: 4, title: 'Problem Decomposition', detail: 'Split into Capacity (DLSA), Process (Police DIR), Financial (PFMS) components.', route: '/decompose', screen: 'Problem Decomposition' },
  { step: 5, title: 'Intervention Proposal', detail: 'Propose daily co-located DLSA panel roster at Sakhi OSC Patna.', route: '/interventions', screen: 'Intervention Workspace' },
  { step: 6, title: 'Human Approval Gate', detail: 'District Collector signs executive gate (AI cannot approve).', route: '/investigation?gapId=GAP-W-PATNA-001', screen: 'Investigation Workspace' },
  { step: 7, title: 'Action Assignment', detail: 'Convert into ACT-101 (Treasury), ACT-102 (DWCD), ACT-103 (DLSA).', route: '/my-work', screen: 'My Work Inbox' },
  { step: 8, title: 'Departmental Dependencies', detail: 'Track DEP-001 (Fund Release) & DEP-002 (DLSA Panel Renewal).', route: '/dependencies', screen: 'Dependency 360°' },
  { step: 9, title: 'Police & Legal Coordination', detail: 'Track minimal Police DIR & JMFC hearing independently.', route: '/matter-360?id=MTR-2026-W-001&tab=police', screen: 'Matter 360° Police/Legal' },
  { step: 10, title: 'Financial Dependency', detail: 'Track Rs. 25,000 relief grant (Rs. 15k disbursed, Rs. 10k pending PFMS).', route: '/finance', screen: 'Financial Intelligence' },
  { step: 11, title: 'Authorised NGO Support', detail: 'SEWA Bharat assigned post-shelter livelihood batch (zero PII shared).', route: '/ngo-community', screen: 'NGO & Community' },
  { step: 12, title: 'Progress Monitoring', detail: 'Compare task completion ratio vs intended public outcome.', route: '/command-centre', screen: 'Decision & Command Centre' },
  { step: 13, title: 'Notification Generation', detail: 'Deduplicated assignment & SLA notifications delivered in-app.', route: '/alerts', screen: 'Notifications Inbox' },
  { step: 14, title: 'Escalation Handling', detail: 'Escalate overdue Treasury/Court items to Collector / Secretary.', route: '/command-centre', screen: 'Executive Decision Queue' },
  { step: 15, title: 'Dependency Resolution', detail: 'Resolve DEP-001 PFMS batch; auto-unlock dependent ACT-102.', route: '/dependencies', screen: 'Dependency 360°' },
  { step: 16, title: 'Service Delivery', detail: 'Co-located DLSA advocate & shelter subsistence delivered.', route: '/women?tab=overview', screen: 'Women Protection (M18)' },
  { step: 17, title: 'Completion Verification', detail: 'Submit signed PFMS UTR & DLSA roster evidence in My Work.', route: '/my-work', screen: 'My Work Evidence Gate' },
  { step: 18, title: 'Outcome Verification', detail: 'Day-90 audit verifies linkage rose 36% → 85% before Matter closure.', route: '/outcomes', screen: 'Outcome Verification' },
  { step: 19, title: 'Lessons Learned & Recognition', detail: 'Replicate Bhagalpur/Patna OSC model via quality-gated Recognition.', route: '/excellence', screen: 'Governance Excellence' },
];

export function DemoWalkthroughPage() {
  const [completed, setCompleted] = useState<number[]>([1, 2, 3]);
  const [activeStep, setActiveStep] = useState<number>(4);

  const toggleStep = (step: number) => {
    setCompleted((prev) => (prev.includes(step) ? prev.filter((s) => s !== step) : [...prev, step]));
  };

  const current = DEMO_STEPS.find((s) => s.step === activeStep) || DEMO_STEPS[0];
  const pct = Math.round((completed.length / DEMO_STEPS.length) * 100);

  return (
    <div className="space-y-4">
      <PageHeader
        breadcrumb={['Overview', '19-Step E2E Demo']}
        title="19-Step End-to-End Women Protection Walkthrough"
        purpose="Interactive synthetic demonstration linking every stage from issue discovery to outcome verification and governance recognition (Patna Sakhi OSC Pilot)."
        badge={`SYNTHETIC DEMO • ${completed.length}/19 Verified`}
        source="DEMO-01 & GAP-W-PATNA-001"
        classification="SYNTHETIC"
        actions={
          <button
            type="button"
            onClick={() => {
              setCompleted([1]);
              setActiveStep(1);
            }}
            className="text-xs px-2.5 py-1 rounded border border-[#C98A87] bg-white text-[#7D2A42] font-semibold flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Demo
          </button>
        }
      />

      {/* Progress Banner */}
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs mb-2">
          <div className="flex items-center gap-2">
            <PlayCircle className="w-4 h-4 text-[#EF5A90]" />
            <strong className="text-[#1F3864]">
              Active Step {current.step}: {current.title}
            </strong>
            <span className="text-slate-600">— {current.detail}</span>
          </div>
          <div className="flex items-center gap-2">
            <Link to={current.route} className="px-3 py-1 rounded bg-[#7D2A42] text-white font-semibold flex items-center gap-1">
              <span>Open {current.screen}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <button
              type="button"
              onClick={() => {
                if (!completed.includes(activeStep)) setCompleted((p) => [...p, activeStep]);
                setActiveStep((prev) => Math.min(19, prev + 1));
              }}
              className="px-3 py-1 rounded bg-[#16A028] text-white font-semibold"
            >
              Complete & Next →
            </button>
          </div>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className="bg-[#EF5A90] h-full transition-all" style={{ width: `${pct}%` }} />
        </div>
      </Card>

      {/* 19-Step Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {DEMO_STEPS.map((s) => {
          const isDone = completed.includes(s.step);
          const isCurrent = activeStep === s.step;
          return (
            <div
              key={s.step}
              onClick={() => setActiveStep(s.step)}
              className={`p-3 rounded-lg border text-xs cursor-pointer transition-colors ${
                isCurrent
                  ? 'bg-[#FFE5DE]/70 border-[#EF5A90] shadow-xs'
                  : isDone
                    ? 'bg-[#DFFFE0]/50 border-[#16A028]'
                    : 'bg-white border-[#E5B8B7] hover:border-[#EF5A90]'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="font-mono font-bold text-[#7D2A42]">STEP {String(s.step).padStart(2, '0')}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleStep(s.step);
                  }}
                  aria-label={`Toggle step ${s.step}`}
                  className={`text-[10px] px-1.5 py-0.5 rounded border font-semibold flex items-center gap-1 ${
                    isDone ? 'bg-[#16A028] text-white border-[#16A028]' : 'bg-white text-slate-600 border-slate-300'
                  }`}
                >
                  {isDone && <CheckCircle2 className="w-3 h-3" />}
                  <span>{isDone ? 'Done' : 'Mark'}</span>
                </button>
              </div>
              <div className="font-bold text-[#1F3864]">{s.title}</div>
              <div className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">{s.detail}</div>
              <Link
                to={s.route}
                onClick={(e) => e.stopPropagation()}
                className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-[#7D2A42] hover:underline"
              >
                <span>{s.screen}</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
