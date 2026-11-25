import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { mockInvestigation, mockGaps } from '@/data/mockData';
import { Card } from '@/components/common/Card';
import { EpistemicBadge } from '@/components/badges/EpistemicBadge';
import { StatusBadge } from '@/components/badges/StatusBadge';
import { GapContract, InvestigationWorkspaceData } from '@/types';
import {
  approveIntervention,
  createIntervention,
  fetchGaps,
  fetchInvestigation,
  updateInvestigation,
} from '@/services/api';
import { useAppStore } from '@/store/appStore';
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
  const { currentRole } = useAppStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedGapId = searchParams.get('gapId') || 'GAP-W-PATNA-001';

  const [gaps, setGaps] = useState<GapContract[]>(mockGaps);
  const [inv, setInv] = useState<InvestigationWorkspaceData>(mockInvestigation);
  const gap = gaps.find((g) => g.id === selectedGapId) || gaps[0];

  const [decisionNotes, setDecisionNotes] = useState('');
  const [selectedIntervention, setSelectedIntervention] = useState(0);
  const [isApproved, setIsApproved] = useState(false);
  const [decisionMessage, setDecisionMessage] = useState<string | null>(null);
  const [newDataGap, setNewDataGap] = useState('');
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [showAddHyp, setShowAddHyp] = useState(false);
  const [newHypText, setNewHypText] = useState('');
  const [newHypProtocol, setNewHypProtocol] = useState('');
  const [newHypScore, setNewHypScore] = useState(55);
  const [hypMessage, setHypMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchGaps().then(setGaps);
  }, []);

  useEffect(() => {
    setIsApproved(false);
    setDecisionMessage(null);
    fetchInvestigation(selectedGapId).then(setInv);
  }, [selectedGapId]);

  const handleSanction = async () => {
    setDecisionMessage(null);
    const chosen = inv.possibleInterventions[selectedIntervention] || gap.mandatedIntervention;
    try {
      const created = await createIntervention(
        {
          gap_id: gap.id,
          type: 'COORDINATION_MECHANISM',
          description: decisionNotes ? `${chosen} — Directive: ${decisionNotes}` : chosen,
          owner_role: gap.namedOwnerRole,
          target_date: gap.deadlineDate,
          kpi_metric: gap.kpiMetric,
          kpi_baseline: gap.kpiBaseline,
          kpi_target: gap.kpiTarget,
        },
        currentRole
      );
      await approveIntervention(created.id, currentRole);
      setIsApproved(true);
      setDecisionMessage(`Sanctioned ${created.id} and assigned to ${gap.namedOwnerRole}.`);
    } catch (err: any) {
      setDecisionMessage(err.message || 'Sanction rejected by RBAC.');
    }
  };

  const handleAddDataGap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDataGap.trim()) return;
    setSaveMessage(null);
    const updatedGaps = [...inv.dataGaps, newDataGap.trim()];
    try {
      const saved = await updateInvestigation(inv.gapId, { data_gaps: updatedGaps }, currentRole);
      setInv(saved);
      setNewDataGap('');
      setSaveMessage('Data gap saved to backend.');
    } catch (err: any) {
      setSaveMessage(err.message || 'Backend required to persist investigation changes.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Investigation Workspace Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold bg-gov-navy text-white px-2 py-0.5 rounded shadow-xs">
              {inv.id}
            </span>
            <span className="text-xs font-semibold text-slate-600">Linked to:</span>
            <span className="font-mono text-xs font-bold text-primary">{inv.gapId}</span>
            <StatusBadge status={inv.status} />
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <select
              value={selectedGapId}
              onChange={(e) => setSearchParams({ gapId: e.target.value })}
              className="text-xs border border-slate-200 rounded px-2 py-1 bg-slate-50 font-mono text-slate-800"
              aria-label="Switch Gap Contract"
            >
              {gaps.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.id} — {g.location.district}
                </option>
              ))}
            </select>
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
                  <span className="font-bold text-slate-600 mt-0.5">G{idx + 1}.</span>
                  <div className="flex-1">
                    <p>{gapItem}</p>
                    <button className="mt-1 text-[11px] font-medium text-gov-blue hover:underline">
                      Issue Inspection Order to Field →
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <form onSubmit={handleAddDataGap} className="mt-3 flex gap-2">
              <input
                type="text"
                placeholder="Log new missing evidence / field verification gap..."
                value={newDataGap}
                onChange={(e) => setNewDataGap(e.target.value)}
                className="flex-1 text-xs border border-slate-200 rounded px-2.5 py-1.5"
              />
              <button type="submit" className="text-xs px-3 py-1.5 bg-slate-800 text-white rounded font-semibold">
                Save Gap
              </button>
            </form>
            {saveMessage && <p className="text-[11px] text-slate-600 mt-1.5">{saveMessage}</p>}

            {(inv.conflictingEvidence?.length ?? 0) > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-200">
                <div className="text-[10px] font-bold uppercase text-amber-800 mb-1">Conflicting Evidence</div>
                <ul className="space-y-1 text-xs text-amber-950">
                  {inv.conflictingEvidence!.map((c, i) => (
                    <li key={i} className="p-2 bg-amber-50 border border-amber-200 rounded">{c}</li>
                  ))}
                </ul>
              </div>
            )}
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
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-amber-900">
                      Hypothesis {idx + 1} ({hyp.id})
                    </span>
                    <label className="flex items-center gap-2 text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                      <span>Plausibility: {Math.round(hyp.plausibilityScore * 100)}%</span>
                      <input
                        type="range"
                        min={5}
                        max={95}
                        step={5}
                        aria-label={`Adjust plausibility for Hypothesis ${idx + 1}`}
                        value={Math.round(hyp.plausibilityScore * 100)}
                        onChange={async (e) => {
                          const score = Number(e.target.value) / 100;
                          const nextHyps = inv.hypotheses.map((h) =>
                            h.id === hyp.id ? { ...h, plausibilityScore: score } : h
                          );
                          const saved = await updateInvestigation(inv.gapId, { hypotheses: nextHyps }, currentRole);
                          setInv(saved);
                          setHypMessage(`Updated plausibility for ${hyp.id} to ${Math.round(score * 100)}%.`);
                        }}
                        className="w-20 accent-amber-700 cursor-pointer"
                      />
                    </label>
                  </div>

                  <p className="text-xs text-slate-800 font-medium leading-relaxed">
                    {hyp.explanation}
                  </p>

                  <div className="text-[11px] text-slate-600 bg-white p-2 rounded border border-amber-100">
                    <strong className="text-slate-800">Field Verification Protocol:</strong> {hyp.fieldVerificationRequired}
                  </div>
                </div>
              ))}

              {hypMessage && <p className="text-[11px] text-slate-600">{hypMessage}</p>}

              {!showAddHyp ? (
                <button
                  type="button"
                  onClick={() => setShowAddHyp(true)}
                  className="text-xs px-3 py-1.5 rounded border border-slate-300 bg-white text-slate-800 font-semibold hover:bg-slate-50"
                >
                  + Add Competing Hypothesis
                </button>
              ) : (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!newHypText.trim()) return;
                    const nextHyps = [
                      ...inv.hypotheses,
                      {
                        id: `HYP-${inv.hypotheses.length + 1}`,
                        explanation: newHypText.trim(),
                        plausibilityScore: newHypScore / 100,
                        supportingEvidenceIds: [],
                        contradictingEvidenceIds: [],
                        fieldVerificationRequired: newHypProtocol.trim() || 'District field verification pending.',
                      },
                    ];
                    const saved = await updateInvestigation(inv.gapId, { hypotheses: nextHyps }, currentRole);
                    setInv(saved);
                    setNewHypText('');
                    setNewHypProtocol('');
                    setNewHypScore(55);
                    setShowAddHyp(false);
                    setHypMessage('Added competing hypothesis to investigation record.');
                  }}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2"
                >
                  <input
                    required
                    placeholder="Competing hypothesis explanation (no raw PII)..."
                    value={newHypText}
                    onChange={(e) => setNewHypText(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded p-2 bg-white"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      placeholder="Field verification protocol..."
                      value={newHypProtocol}
                      onChange={(e) => setNewHypProtocol(e.target.value)}
                      className="sm:col-span-2 text-xs border border-slate-200 rounded p-2 bg-white"
                    />
                    <div className="flex items-center gap-2 text-xs bg-white border border-slate-200 rounded px-2">
                      <span className="text-slate-600">Score: {newHypScore}%</span>
                      <input
                        type="range"
                        min={5}
                        max={95}
                        step={5}
                        value={newHypScore}
                        onChange={(e) => setNewHypScore(Number(e.target.value))}
                        className="flex-1 accent-amber-700"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setShowAddHyp(false)} className="text-xs px-2.5 py-1 border rounded bg-white">
                      Cancel
                    </button>
                    <button type="submit" className="text-xs px-3 py-1 bg-primary hover:bg-primary-hover text-white rounded font-semibold">
                      Save Hypothesis
                    </button>
                  </div>
                </form>
              )}
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
          <div className="bg-white text-slate-900 p-5 rounded-lg border border-slate-200 border-l-4 border-l-gov-navy space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-bold tracking-tight text-gov-navy">Executive Decision Sign-off</span>
              </div>
              <span className="text-[11px] bg-orange-50 px-2 py-0.5 rounded text-orange-800 border border-orange-200 font-mono font-semibold">
                Mandatory Human Gate
              </span>
            </div>

            <p className="text-xs text-slate-600">
              Only a designated administrative authority (DM/Collector or WCD Secretary) can sanction an intervention and bind the responsible department head.
            </p>

            <textarea
              placeholder="Enter official executive minute notes or special directives..."
              value={decisionNotes}
              onChange={(e) => setDecisionNotes(e.target.value)}
              className="w-full h-20 p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-md text-slate-900 placeholder-slate-500 focus:outline-hidden focus:border-primary"
            />

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <button
                type="button"
                onClick={async () => {
                  const updated = await updateInvestigation(
                    inv.gapId,
                    { data_gaps: [...inv.dataGaps, `Field Audit Requisitioned by ${currentRole} (${new Date().toISOString().slice(0, 10)})`] },
                    currentRole
                  );
                  setInv(updated);
                  setDecisionMessage('Field audit requisition logged to Investigation Data Gaps.');
                }}
                className="text-xs text-slate-600 hover:text-gov-navy font-medium flex items-center gap-1"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Requisition Field Audit</span>
              </button>

              <button
                type="button"
                onClick={handleSanction}
                className={`px-4 py-2 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isApproved
                    ? 'bg-green-700 text-white'
                    : 'bg-primary text-white hover:bg-primary-hover'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isApproved ? 'Intervention Sanctioned ✓' : 'Sanction Intervention'}</span>
              </button>
            </div>
            {decisionMessage && (
              <div className="text-xs bg-slate-800 border border-slate-700 rounded p-2.5 flex flex-wrap items-center justify-between gap-2">
                <span className="text-emerald-300">{decisionMessage}</span>
                <Link to="/interventions" className="text-amber-300 font-semibold hover:underline">
                  View in Interventions →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

