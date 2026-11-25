import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/common/Card';
import { PageHeader } from '@/components/common/PageHeader';
import { SeverityBadge } from '@/components/badges/SeverityBadge';
import { IndependentStatusChip } from '@/components/badges/IndependentStatusChip';
import { useAppStore } from '@/store/appStore';
import { useGovernanceStore } from '@/store/governanceStore';
import { useDemoStore } from '@/store/demoStore';
import { CheckCircle2, RotateCcw, AlertTriangle } from 'lucide-react';
import { DECISION_QUEUES, INITIAL_DECISIONS } from '@/data/workflowSeedData';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

export function CommandCentrePage() {
  const { selectedState, selectedDistrict, currentRole } = useAppStore();
  const { matters, dependencies, financials, activities } = useGovernanceStore();
  const { alerts } = useDemoStore();

  const [domainFilter, setDomainFilter] = useState<'ALL' | 'WOMEN' | 'CHILD'>('ALL');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [queueFilter, setQueueFilter] = useState<string>('ALL');
  const [decisions, setDecisions] = useState(INITIAL_DECISIONS);
  const [rationale, setRationale] = useState<Record<string, string>>({});
  const [decMsg, setDecMsg] = useState<string | null>(null);

  const filteredMatters = matters.filter((m) => {
    const dOk = domainFilter === 'ALL' || m.domain === domainFilter;
    const sOk = severityFilter === 'ALL' || m.severity === severityFilter;
    return dOk && sOk;
  });

  const handleDecision = async (dec: typeof INITIAL_DECISIONS[0], action: 'APPROVED' | 'RETURNED' | 'ESCALATED') => {
    setDecMsg(null);
    const note = rationale[dec.id]?.trim() || `${action} during Command Centre review`;
    try {
      const res = await fetch(`${API_BASE}/decisions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-User-Role': currentRole },
        body: JSON.stringify({
          matter_id: dec.matterId,
          queue_type: dec.queue,
          title: dec.title,
          decision_action: action,
          rationale: note,
        }),
        signal: AbortSignal.timeout(1200),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        if (res.status === 403) {
          setDecMsg(err.detail || 'Forbidden: role cannot approve this decision.');
          return;
        }
      }
    } catch {}
    setDecisions((prev) => prev.map((d) => (d.id === dec.id ? { ...d, status: action } : d)));
    setDecMsg(`Decision ${dec.id} recorded as ${action}.`);
  };

  // Separate Task Completion vs Intended Public Outcome (§14)
  const resolvedMatters = matters.filter((m) => m.matterStatus === 'RESOLVED' || m.matterStatus === 'CLOSED').length;
  const achievedOutcomes = matters.filter((m) => m.outcome.status === 'ACHIEVED').length;

  const metrics = [
    { label: 'Total Matters', val: matters.length, to: '/matter-360' },
    { label: 'Active', val: matters.filter((m) => m.matterStatus === 'ACTIVE').length, to: '/matter-360' },
    { label: 'Blocked', val: matters.filter((m) => m.matterStatus === 'BLOCKED').length, to: '/dependencies' },
    { label: 'Pending Deps', val: dependencies.filter((d) => d.status !== 'RESOLVED').length, to: '/dependencies' },
    { label: 'Pending Finance', val: financials.filter((f) => f.financialStatus === 'SANCTIONED' || f.financialStatus === 'UNDER_REVIEW').length, to: '/finance' },
    { label: 'NGO Support', val: activities.length, to: '/ngo-community' },
    { label: 'Active Alerts', val: alerts.length, to: '/alerts' },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        breadcrumb={['Government Work Centre', 'Decision & Command Centre']}
        title="Decision & Command Centre"
        purpose="Actionable Decision Queues (Policy, Admin, Financial, Coordination, Escalations) plus Progress Monitoring separating task completion from public outcome achievement."
        badge={`${selectedDistrict}, ${selectedState}`}
        source="Decision & Progress Monitoring Engine (Synthetic)"
        classification="SYNTHETIC"
        actions={
          <div className="flex items-center gap-2">
            <Link to="/my-work" className="text-xs px-3 py-1.5 rounded border border-[#C98A87] bg-white text-[#7D2A42] font-semibold">
              My Work Inbox
            </Link>
            <Link to="/dashboards?role=MINISTER" className="text-xs px-3 py-1.5 rounded bg-[#7D2A42] hover:bg-[#654161] text-white font-semibold">
              Role Views →
            </Link>
          </div>
        }
      />

      {/* Separate Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center">
        {metrics.map((m) => (
          <Link key={m.label} to={m.to} className="p-2.5 rounded-lg border border-[#E5B8B7] border-t-2 border-t-[#EF5A90] bg-white hover:bg-[#FFE5DE]/40">
            <div className="text-lg font-extrabold text-[#1F3864]">{m.val}</div>
            <div className="text-[10px] text-slate-600 font-semibold truncate">{m.label}</div>
          </Link>
        ))}
      </div>

      {/* Progress Monitoring vs Public Outcome (§14) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <Card>
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-[#1F3864]">Administrative Task Completion Ratio</span>
            <span className="font-mono font-bold text-[#7D2A42]">{Math.round((resolvedMatters / Math.max(1, matters.length)) * 100)}% ({resolvedMatters}/{matters.length})</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="bg-[#EF5A90] h-full" style={{ width: `${Math.round((resolvedMatters / Math.max(1, matters.length)) * 100)}%` }} />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-[#1F3864]">Verified Intended Public Outcome</span>
            <span className="font-mono font-bold text-[#166534]">{Math.round((achievedOutcomes / Math.max(1, matters.length)) * 100)}% ({achievedOutcomes}/{matters.length})</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="bg-[#16A028] h-full" style={{ width: `${Math.round((achievedOutcomes / Math.max(1, matters.length)) * 100)}%` }} />
          </div>
        </Card>
      </div>

      {/* Actionable Decision Queue (§7) */}
      <Card
        header={
          <div className="flex flex-wrap items-center justify-between gap-2 w-full">
            <span className="text-xs font-bold text-[#1F3864]">Executive Decision Queue (Human Gate Required)</span>
            <div className="flex flex-wrap gap-1">
              {DECISION_QUEUES.map((q) => (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setQueueFilter(q.id)}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                    queueFilter === q.id ? 'bg-[#7D2A42] text-white border-[#7D2A42]' : 'bg-white text-slate-700 border-[#E5B8B7]'
                  }`}
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>
        }
      >
        {decMsg && <div className="mb-2 p-2 rounded bg-[#FFE5DE] border border-[#C98A87] text-xs font-semibold text-[#7D2A42]">{decMsg}</div>}
        <div className="space-y-2.5 text-xs">
          {decisions
            .filter((d) => queueFilter === 'ALL' || d.queue === queueFilter)
            .map((d) => (
              <div key={d.id} className="p-3 rounded border border-[#E5B8B7] bg-white space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#7D2A42]">{d.id}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#FFE5DE] text-[#7D2A42] border border-[#C98A87] font-semibold">{d.queue}</span>
                    <strong className="text-[#1F3864]">{d.title}</strong>
                  </div>
                  <IndependentStatusChip dimension="Decision" value={d.status} />
                </div>
                <div className="flex flex-wrap gap-4 text-[11px] text-slate-600">
                  <span><strong>Authority:</strong> {d.authority}</span>
                  <span><strong>Risk:</strong> {d.risk}</span>
                  <span><strong>Benefit:</strong> {d.benefit}</span>
                </div>
                {d.status === 'PENDING' && (
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <input
                      placeholder="Decision rationale..."
                      value={rationale[d.id] || ''}
                      onChange={(e) => setRationale((p) => ({ ...p, [d.id]: e.target.value }))}
                      className="flex-1 min-w-[180px] border border-[#C98A87] rounded px-2 py-1 text-xs"
                    />
                    <button type="button" onClick={() => handleDecision(d, 'APPROVED')} className="px-2.5 py-1 rounded bg-[#16A028] text-white font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Approve
                    </button>
                    <button type="button" onClick={() => handleDecision(d, 'RETURNED')} className="px-2.5 py-1 rounded border border-[#C98A87] bg-white text-[#7D2A42] font-semibold flex items-center gap-1">
                      <RotateCcw className="w-3 h-3" /> Return
                    </button>
                    <button type="button" onClick={() => handleDecision(d, 'ESCALATED')} className="px-2.5 py-1 rounded bg-orange-600 text-white font-semibold flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Escalate
                    </button>
                  </div>
                )}
              </div>
            ))}
        </div>
      </Card>

      {/* Filterable Matter Register */}
      <Card
        header={
          <div className="flex flex-wrap items-center justify-between gap-2 w-full">
            <span className="text-xs font-bold text-[#1F3864]">Matter Register ({filteredMatters.length})</span>
            <div className="flex gap-2 text-xs">
              <select aria-label="Filter domain" value={domainFilter} onChange={(e) => setDomainFilter(e.target.value as any)} className="border border-[#C98A87] rounded px-2 py-1 bg-white">
                <option value="ALL">All Domains</option>
                <option value="WOMEN">Women</option>
                <option value="CHILD">Child</option>
              </select>
              <select aria-label="Filter severity" value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)} className="border border-[#C98A87] rounded px-2 py-1 bg-white">
                <option value="ALL">All Severities</option>
                <option value="CRITICAL">CRITICAL</option>
                <option value="HIGH">HIGH</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="LOW">LOW</option>
              </select>
            </div>
          </div>
        }
      >
        <div className="space-y-2">
          {filteredMatters.map((m) => (
            <Link key={m.id} to={`/matter-360?id=${m.id}`} className="block p-2.5 rounded border border-[#E5B8B7] hover:border-[#EF5A90] bg-white text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[#7D2A42]">{m.demoCode}</span>
                  <span className="font-bold text-[#1F3864]">{m.title}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <SeverityBadge severity={m.severity} />
                  <IndependentStatusChip dimension="Matter" value={m.matterStatus} />
                </div>
              </div>
              <div className="text-[11px] text-slate-600">
                <strong>Owner:</strong> {m.ownership.responsibleRole} • <strong>Pending:</strong> {m.ownership.pendingAction}
              </div>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
