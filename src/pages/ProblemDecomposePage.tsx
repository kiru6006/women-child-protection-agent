import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/common/Card';
import { PageHeader } from '@/components/common/PageHeader';
import { Plus, Layers } from 'lucide-react';
import {
  COMPONENT_TYPES,
  INITIAL_PROBLEM_COMPONENTS,
  ProblemComponent,
} from '@/data/workflowSeedData';

export function ProblemDecomposePage() {
  const [components, setComponents] = useState<ProblemComponent[]>(INITIAL_PROBLEM_COMPONENTS);
  const [showAdd, setShowAdd] = useState(false);
  const [gapType, setGapType] = useState(COMPONENT_TYPES[0]);
  const [observedCondition, setObservedCondition] = useState('');
  const [competentAuthority, setCompetentAuthority] = useState('');
  const [correctiveAction, setCorrectiveAction] = useState('');

  return (
    <div className="space-y-4">
      <PageHeader
        breadcrumb={['Matter & Investigation', 'Problem Decomposition']}
        title="Problem-to-Solution Decomposition Workspace"
        purpose="Splits complex protection problems into typed sub-gaps with evidence, expected response, competent authority, dependencies, and resource requirements without treating incomplete data as failure."
        badge={`${components.length} Components`}
        source="MTR-2026-W-001 / GAP-W-PATNA-001"
        classification="SYNTHETIC"
        actions={
          <button
            type="button"
            onClick={() => setShowAdd(!showAdd)}
            className="text-xs px-3 py-1.5 rounded bg-[#7D2A42] text-white font-semibold flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Add Component
          </button>
        }
      />

      {showAdd && (
        <Card>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setComponents((prev) => [
                ...prev,
                {
                  id: `CMP-0${prev.length + 1}`,
                  gapType,
                  observedCondition,
                  expectedResponse: 'Statutory SLA compliance',
                  evidenceRef: 'FIELD-OBS-PENDING (HYPOTHESIS)',
                  possibleExplanation: 'Requires field verification',
                  competentAuthority,
                  correctiveAction,
                  dependencies: 'None',
                  resourceReq: 'To be estimated',
                  expectedOutcome: 'Measurable service improvement',
                },
              ]);
              setObservedCondition('');
              setCompetentAuthority('');
              setCorrectiveAction('');
              setShowAdd(false);
            }}
            className="space-y-2 text-xs"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <select value={gapType} onChange={(e) => setGapType(e.target.value)} className="border border-[#C98A87] rounded p-2">
                {COMPONENT_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <input required placeholder="Competent Authority..." value={competentAuthority} onChange={(e) => setCompetentAuthority(e.target.value)} className="border border-[#C98A87] rounded p-2" />
            </div>
            <input required placeholder="Observed condition..." value={observedCondition} onChange={(e) => setObservedCondition(e.target.value)} className="w-full border border-[#C98A87] rounded p-2" />
            <input required placeholder="Required corrective action..." value={correctiveAction} onChange={(e) => setCorrectiveAction(e.target.value)} className="w-full border border-[#C98A87] rounded p-2" />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowAdd(false)} className="px-3 py-1 border rounded">Cancel</button>
              <button type="submit" className="px-3 py-1 bg-[#7D2A42] text-white rounded font-semibold">Save Component</button>
            </div>
          </form>
        </Card>
      )}

      <div className="space-y-3">
        {components.map((c) => (
          <Card key={c.id}>
            <div className="space-y-2 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#EF5A90]" />
                  <span className="font-mono font-bold text-[#7D2A42]">{c.id}</span>
                  <span className="px-2 py-0.5 rounded bg-[#FFE5DE] text-[#7D2A42] border border-[#C98A87] font-semibold text-[11px]">{c.gapType}</span>
                </div>
                <Link to="/my-work" className="px-2.5 py-1 rounded bg-[#1F3864] text-white font-semibold text-[11px]">
                  Assign in My Work →
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded border border-slate-200 text-[11px]">
                <div><span className="text-slate-600 block font-bold uppercase">Observed</span>{c.observedCondition}</div>
                <div><span className="text-slate-600 block font-bold uppercase">Expected Govt Response</span>{c.expectedResponse}</div>
                <div><span className="text-slate-600 block font-bold uppercase">Evidence</span><span className="font-mono">{c.evidenceRef}</span></div>
                <div><span className="text-slate-600 block font-bold uppercase">Competent Authority</span><strong>{c.competentAuthority}</strong></div>
                <div><span className="text-slate-600 block font-bold uppercase">Corrective Action</span>{c.correctiveAction}</div>
                <div><span className="text-slate-600 block font-bold uppercase">Dependencies & Resources</span>{c.dependencies} • {c.resourceReq}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
