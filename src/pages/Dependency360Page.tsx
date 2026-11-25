import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/common/Card';
import { PageHeader } from '@/components/common/PageHeader';
import { useGovernanceStore } from '@/store/governanceStore';
import { DependencyStatus } from '@/types/governance';

const DEP_STATUSES: DependencyStatus[] = [
  'OPEN',
  'IN_PROGRESS',
  'WAITING_FOR_INFORMATION',
  'WAITING_FOR_APPROVAL',
  'WAITING_FOR_LEGAL_PROCESS',
  'WAITING_FOR_FUNDS',
  'BLOCKED',
  'RESOLVED',
  'NOT_APPLICABLE',
  'CANCELLED',
];

export function Dependency360Page() {
  const { dependencies, updateDependencyStatus, detectCircularDependencies } = useGovernanceStore();
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const cycles = detectCircularDependencies();

  const filtered = dependencies.filter((d) => statusFilter === 'ALL' || d.status === statusFilter);

  return (
    <div className="space-y-4">
      <PageHeader
        breadcrumb={['Government Convergence', 'Dependency 360°']}
        title="Dependency 360° Management"
        purpose="Tracks 17 dependency types and 10 statuses across departments while distinguishing lawful procedural waiting periods from avoidable delays."
        badge={`${dependencies.length} Active Dependencies`}
        source="Convergence Dependency Engine (Synthetic)"
        classification="SYNTHETIC"
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <Card><div className="text-xl font-bold text-[#1F3864]">{dependencies.length}</div><div className="text-[11px] text-slate-600">Total Tracked</div></Card>
        <Card><div className="text-xl font-bold text-red-700">{dependencies.filter((d) => d.status === 'BLOCKED').length}</div><div className="text-[11px] text-slate-600">Blocked</div></Card>
        <Card><div className="text-xl font-bold text-[#7D2A42]">{dependencies.filter((d) => d.isLawfulWait).length}</div><div className="text-[11px] text-slate-600">Lawful Wait (Non-Fault)</div></Card>
        <Card><div className="text-xl font-bold text-orange-700">{cycles.length}</div><div className="text-[11px] text-slate-600">Circular Deadlocks</div></Card>
      </div>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <span className="text-xs font-bold text-[#1F3864]">Dependency Register</span>
          <select
            aria-label="Filter dependencies by status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs border border-[#C98A87] rounded px-2.5 py-1 bg-white"
          >
            <option value="ALL">All 10 Statuses</option>
            {DEP_STATUSES.map((s) => (
              <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2.5">
          {filtered.map((d) => (
            <div key={d.id} className="p-3 rounded border border-[#E5B8B7] bg-white text-xs space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono font-bold text-[#7D2A42]">{d.id}</span>
                  <Link to={`/matter-360?id=${d.matterId}`} className="font-mono text-[#1F3864] hover:underline font-semibold">
                    {d.matterId}
                  </Link>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#FFE5DE] text-[#7D2A42] border border-[#C98A87] font-mono">
                    {d.type.replace(/_/g, ' ')}
                  </span>
                  {d.isLawfulWait && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#DFFFE0] text-[#166534] border border-[#16A028] font-semibold">
                      Lawful Waiting Period
                    </span>
                  )}
                </div>
                <select
                  aria-label={`Change status for ${d.id}`}
                  value={d.status}
                  onChange={(e) => updateDependencyStatus(d.id, e.target.value as DependencyStatus)}
                  className="text-[11px] border border-[#C98A87] rounded px-2 py-1 font-semibold bg-[#FFE5DE]/30"
                >
                  {DEP_STATUSES.map((s) => (
                    <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                  ))}
                </select>
              </div>
              <div className="font-semibold text-slate-900">
                {d.predecessorAction} → {d.dependentAction}
              </div>
              <div className="flex flex-wrap gap-4 text-[11px] text-slate-600">
                <span><strong>Owner:</strong> {d.ownerRole}</span>
                <span><strong>Due:</strong> {d.dueDate}</span>
                <span><strong>Escalation:</strong> {d.escalationAuthority}</span>
                <span><strong>Reason:</strong> {d.reason}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
