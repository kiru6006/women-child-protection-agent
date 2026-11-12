import { useState } from 'react';
import { mockInvestigation, mockGaps } from '@/data/mockData';
import { Card } from '@/components/common/Card';
import { EpistemicBadge } from '@/components/badges/EpistemicBadge';
import { StatusBadge } from '@/components/badges/StatusBadge';
import {
  CheckCircle2,
  FileQuestion,
  HelpCircle,
  Scale,
  Workflow,
  UserCheck,
  Send,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';

export function InvestigationPage() {
  const inv = mockInvestigation;
  const gap = mockGaps.find((g) => g.id === inv.gapId) || mockGaps[0];

  const [decisionNotes, setDecisionNotes] = useState('');
  const [selectedIntervention, setSelectedIntervention] = useState(0);
  const [isApproved, setIsApproved] = useState(false);

  return (
    <div className="space-y-6">
      {/* Investigation Workspace Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold bg-gov-pink-900 text-white px-2 py-0.5 rounded shadow-xs">
              {inv.id}
            </span>
            <span className="text-xs font-semibold text-slate-500">Linked to:</span>
            <span className="font-mono text-xs font-bold text-gov-pink-700">{inv.gapId}</span>
            <StatusBadge status={inv.status} />
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Assigned Investigator: <strong className="text-slate-800">{inv.assignedInvestigatorRole}</strong></span>
          </div>
        </div>

        <div className="pt-3">
          <h1 className="text-xl font-bold text-slate-900">{gap.title}</h1>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">{inv.problemSummary}</p>
        </div>
      </div>

      {/* Grid: 2 Columns (Facts & Gaps vs Hypotheses) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Facts & Data Gaps */}
        <div className="space-y-6">
          {/* Section 1: Verified Facts */}
          <Card
            header={
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2 font-bold text-sm text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>1. Verified Facts (Authoritative Sources)</span>
                </div>
                <EpistemicBadge classification="VERIFIED_FACT" />
              </div>
            }
          >
            <ul className="space-y-3">
              {inv.verifiedFacts.map((fact, idx) => (
                <li key={idx} className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-md text-xs text-emerald-950 flex items-start gap-2.5">
                  <span className="font-bold text-emerald-700 mt-0.5">F{idx + 1}.</span>
                  <div className="flex-1">
                    <p className="leading-relaxed">{fact}</p>
                    <span className="inline-block mt-1 text-[10px] font-mono text-emerald-800 bg-emerald-100/60 px-1.5 py-0.2 rounded">
                      Audited Official Evidence
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          {/* Section 2: Data Gaps / Unverified */}
          <Card
            header={
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2 font-bold text-sm text-slate-800">
                  <FileQuestion className="w-4 h-4 text-slate-600" />
                  <span>2. Data Gaps (Information Required From Field)</span>
                </div>
                <EpistemicBadge classification="DATA_NOT_AVAILABLE" />
              </div>
            }
          >
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-md mb-3 text-xs text-slate-600">
              <p>
                <strong>Epistemic Rule:</strong> The AI model is strictly prohibited from inventing statistics or converting missing data into assumptions.
              </p>
            </div>

            <ul className="space-y-2">
              {inv.dataGaps.map((gapItem, idx) => (
                <li key={idx} className="p-2.5 border border-slate-200 rounded text-xs text-slate-700 flex items-start gap-2">
                  <span className="font-bold text-slate-400 mt-0.5">G{idx + 1}.</span>
                  <div className="flex-1">
                    <p>{gapItem}</p>
                    <button className="mt-1 text-[11px] font-medium text-gov-blue hover:underline">
                      Issue Inspection Order to Field →
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          {/* Section 3: Statutory & Legal Framework */}
          <Card
            header={
              <div className="flex items-center gap-2 font-bold text-sm text-slate-800">
                <Scale className="w-4 h-4 text-indigo-600" />
                <span>3. Statutory Citations & Legal Basis</span>
              </div>
            }
          >
            <ul className="space-y-2 text-xs">
              {inv.legalReferences.map((ref, idx) => (
                <li key={idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded flex items-center justify-between">
                  <span className="font-medium text-slate-800">{ref}</span>
                  <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono">
                    Mandatory Rule
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Right Column: Hypotheses & Interventions */}
        <div className="space-y-6">
          {/* Section 4: Competing Hypotheses */}
          <Card
            header={
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2 font-bold text-sm text-slate-800">
                  <HelpCircle className="w-4 h-4 text-amber-600" />
                  <span>4. Competing Hypotheses (AI Reasoning Layer)</span>
                </div>
                <EpistemicBadge classification="HYPOTHESIS" />
              </div>
            }
          >
            <div className="space-y-3">
              {inv.hypotheses.map((hyp, idx) => (
                <div key={hyp.id} className="p-3.5 border border-amber-200 bg-amber-50/30 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-amber-900">
                      Hypothesis {idx + 1} ({hyp.id})
                    </span>
                    <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                      Plausibility: {Math.round(hyp.plausibilityScore * 100)}%
                    </span>
                  </div>

                  <p className="text-xs text-slate-800 font-medium leading-relaxed">
                    {hyp.explanation}
                  </p>

                  <div className="text-[11px] text-slate-600 bg-white p-2 rounded border border-amber-100">
                    <strong className="text-slate-800">Field Verification Protocol:</strong> {hyp.fieldVerificationRequired}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Section 5: Government Intervention Options */}
          <Card
            header={
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2 font-bold text-sm text-slate-800">
                  <Workflow className="w-4 h-4 text-gov-blue" />
                  <span>5. Mandated Intervention Options</span>
                </div>
                <EpistemicBadge classification="RECOMMENDATION" />
              </div>
            }
          >
            <p className="text-xs text-slate-500 mb-3">
              Hierarchy of Government Action: Process Fix → Capacity Enhancement → Inter-Dept Convergence → Policy Amendment.
            </p>

            <div className="space-y-2">
              {inv.possibleInterventions.map((opt, idx) => (
                <label
                  key={idx}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedIntervention === idx
                      ? 'border-gov-blue bg-blue-50/50 shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="intervention_option"
                    checked={selectedIntervention === idx}
                    onChange={() => setSelectedIntervention(idx)}
                    className="mt-0.5 text-gov-blue focus:ring-gov-blue"
                  />
                  <div className="text-xs flex-1">
                    <span className="font-semibold text-slate-900 block mb-0.5">
                      {opt.split(':')[0]}
                    </span>
                    <span className="text-slate-600 leading-relaxed">
                      {opt.split(':')[1] || opt}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </Card>

          {/* Human Gate: Collector / Magistrate Decision Console */}
          <div className="bg-slate-900 text-white p-5 rounded-lg border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-bold tracking-tight">Executive Decision Sign-off</span>
              </div>
              <span className="text-[11px] bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-mono">
                Mandatory Human Gate
              </span>
            </div>

            <p className="text-xs text-slate-300">
              Only a designated administrative authority (DM/Collector or WCD Secretary) can sanction an intervention and bind the responsible department head.
            </p>

            <textarea
              placeholder="Enter official executive minute notes or special directives..."
              value={decisionNotes}
              onChange={(e) => setDecisionNotes(e.target.value)}
              className="w-full h-20 p-2.5 text-xs bg-slate-950 border border-slate-700 rounded-md text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-amber-400"
            />

            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => {
                  alert('Inspection requisition issued to SDM Sadar for field verification of travel allowances.');
                }}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Requisition Field Audit</span>
              </button>

              <button
                onClick={() => {
                  setIsApproved(true);
                  alert('Intervention Approved: Executive Order drafted and transmitted to Secretary DLSA Patna.');
                }}
                className={`px-4 py-2 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isApproved
                    ? 'bg-emerald-600 text-white'
                    : 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isApproved ? 'Intervention Sanctioned ✓' : 'Sanction Intervention'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

