import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/common/Card';
import { PageHeader } from '@/components/common/PageHeader';
import { IndependentStatusChip } from '@/components/badges/IndependentStatusChip';
import { useAppStore } from '@/store/appStore';
import { CheckCircle2, AlertTriangle, Clock, Send, RotateCcw } from 'lucide-react';

interface ActionRecord {
  id: string;
  matter_id: string;
  title: string;
  description: string;
  responsible_department: string;
  responsible_role: string;
  accountable_authority: string;
  coordinating_authority: string;
  acknowledged: number;
  required_deliverable: string;
  timeline_date: string;
  required_evidence: string;
  completion_evidence_ref?: string | null;
  dependency_ids: string[];
  status: string;
}

const SEED_ACTIONS: ActionRecord[] = [
  {
    id: 'ACT-101',
    matter_id: 'MTR-2026-W-001',
    title: 'Approve Treasury PFMS Batch for Balance Rs. 10,000 Rehab Grant',
    description: 'Clear pending PFMS batch for survivor subsistence grant.',
    responsible_department: 'Finance & Treasury',
    responsible_role: 'TREASURY_OFFICER',
    accountable_authority: 'DISTRICT_COLLECTOR',
    coordinating_authority: 'DISTRICT_COLLECTOR',
    acknowledged: 0,
    required_deliverable: 'Signed PFMS UTR batch',
    timeline_date: '2026-11-30',
    required_evidence: 'PFMS UTR Receipt',
    dependency_ids: [],
    status: 'ASSIGNED',
  },
  {
    id: 'ACT-102',
    matter_id: 'MTR-2026-W-001',
    title: 'Disburse Balance Shelter Rehabilitation Kit & Log Receipt',
    description: 'Complete balance tranche disbursement once DEP-001 resolves.',
    responsible_department: 'Women & Child Development',
    responsible_role: 'DWCD_OFFICER',
    accountable_authority: 'DISTRICT_COLLECTOR',
    coordinating_authority: 'DISTRICT_COLLECTOR',
    acknowledged: 1,
    required_deliverable: 'Disbursement acknowledgement',
    timeline_date: '2026-12-03',
    required_evidence: 'Bank Disbursement Voucher',
    dependency_ids: ['DEP-001'],
    status: 'WAITING_FOR_DEPENDENCY',
  },
  {
    id: 'ACT-103',
    matter_id: 'MTR-2026-W-002',
    title: 'Publish Co-located DLSA Advocate Roster at Sakhi OSC Patna',
    description: 'Deploy 2 panel advocates 3 days/week at Sakhi OSC.',
    responsible_department: 'Legal Services Authority',
    responsible_role: 'DLSA_LAWYER',
    accountable_authority: 'DISTRICT_COLLECTOR',
    coordinating_authority: 'DISTRICT_COLLECTOR',
    acknowledged: 1,
    required_deliverable: 'Signed December Advocate Roster',
    timeline_date: '2026-12-01',
    required_evidence: 'Signed DLSA Roster PDF',
    dependency_ids: [],
    status: 'IN_PROGRESS',
  },
];

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

export function MyWorkPage() {
  const { currentRole } = useAppStore();
  const [actions, setActions] = useState<ActionRecord[]>(SEED_ACTIONS);
  const [tab, setTab] = useState<'ALL' | 'UNACK' | 'BLOCKED' | 'EVIDENCE'>('ALL');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [evidenceInput, setEvidenceInput] = useState<Record<string, string>>({});
  const [disputeInput, setDisputeInput] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/actions`, { headers: { 'X-User-Role': currentRole }, signal: AbortSignal.timeout(1200) })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setActions(data);
      })
      .catch(() => {});
  }, [currentRole]);

  const filtered = actions.filter((a) => {
    if (roleFilter !== 'ALL' && a.responsible_role !== roleFilter) return false;
    if (tab === 'UNACK') return a.acknowledged === 0;
    if (tab === 'BLOCKED') return a.status === 'WAITING_FOR_DEPENDENCY' || a.dependency_ids.length > 0;
    if (tab === 'EVIDENCE') return a.status === 'IN_PROGRESS' || a.status === 'COMPLETION_REPORTED';
    return true;
  });

  const handleAcknowledge = async (id: string) => {
    setFeedback(null);
    try {
      const res = await fetch(`${API_BASE}/actions/${id}/acknowledge`, {
        method: 'POST',
        headers: { 'X-User-Role': currentRole },
        signal: AbortSignal.timeout(1200),
      });
      if (res.ok) {
        const updated = await res.json();
        setActions((prev) => prev.map((a) => (a.id === id ? updated : a)));
        setFeedback(`Action ${id} acknowledged.`);
        return;
      }
    } catch {}
    setActions((prev) => prev.map((a) => (a.id === id ? { ...a, acknowledged: 1, status: 'ACKNOWLEDGED' } : a)));
    setFeedback(`Action ${id} acknowledged (local demo).`);
  };

  const handleTransition = async (id: string, target_status: string) => {
    setFeedback(null);
    const ev = evidenceInput[id]?.trim();
    if (target_status === 'VERIFICATION_REQUIRED' && !ev) {
      setFeedback('Completion evidence reference is required before submitting for verification.');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/actions/${id}/transition`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-User-Role': currentRole },
        body: JSON.stringify({ target_status, completion_evidence_ref: ev || undefined }),
        signal: AbortSignal.timeout(1200),
      });
      if (res.ok) {
        const updated = await res.json();
        setActions((prev) => prev.map((a) => (a.id === id ? updated : a)));
        setFeedback(`Action ${id} moved to ${target_status}.`);
        return;
      }
      const err = await res.json().catch(() => ({}));
      if (err.detail) {
        setFeedback(err.detail);
        return;
      }
    } catch {}
    setActions((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: target_status, completion_evidence_ref: ev || a.completion_evidence_ref } : a))
    );
    setFeedback(`Action ${id} moved to ${target_status} (local demo).`);
  };

  const handleDispute = async (id: string) => {
    const reason = disputeInput[id]?.trim() || 'Wrong department jurisdiction';
    setFeedback(null);
    try {
      const res = await fetch(`${API_BASE}/actions/${id}/dispute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-User-Role': currentRole },
        body: JSON.stringify({ reason }),
        signal: AbortSignal.timeout(1200),
      });
      if (res.ok) {
        const updated = await res.json();
        setActions((prev) => prev.map((a) => (a.id === id ? updated : a)));
        setFeedback(`Action ${id} returned to coordinating authority.`);
        return;
      }
    } catch {}
    setActions((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'DRAFT' } : a)));
    setFeedback(`Action ${id} returned to coordinating authority (local demo).`);
  };

  return (
    <div className="space-y-4">
      <PageHeader
        breadcrumb={['Government Work Centre', 'My Work']}
        title="My Work — Daily Execution Inbox"
        purpose="Role-based action workspace showing assigned actions, unacknowledged tasks, blocked dependencies, deadlines, and completion evidence submission."
        badge={`${filtered.length} Actions`}
        source="Execution Ownership Engine (12-State Machine)"
        classification="SYNTHETIC"
      />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'ALL', label: `All Actions (${actions.length})` },
            { id: 'UNACK', label: `Awaiting Ack (${actions.filter((a) => a.acknowledged === 0).length})` },
            { id: 'BLOCKED', label: `Blocked / Deps (${actions.filter((a) => a.dependency_ids.length > 0).length})` },
            { id: 'EVIDENCE', label: 'Evidence Required' },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id as any)}
              className={`px-2.5 py-1 rounded text-xs font-semibold border ${
                tab === t.id ? 'bg-[#7D2A42] text-white border-[#7D2A42]' : 'bg-white text-slate-700 border-[#E5B8B7] hover:bg-[#FFE5DE]/40'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <select
          aria-label="Filter by role"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="text-xs border border-[#C98A87] rounded px-2.5 py-1 bg-white"
        >
          <option value="ALL">All Roles</option>
          {Array.from(new Set(actions.map((a) => a.responsible_role))).map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      {feedback && (
        <div className="p-2.5 rounded bg-[#FFE5DE] border border-[#C98A87] text-xs font-semibold text-[#7D2A42]">
          {feedback}
        </div>
      )}

      <div className="space-y-3">
        {filtered.map((a) => (
          <Card key={a.id}>
            <div className="space-y-2.5 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono font-bold text-[#7D2A42]">{a.id}</span>
                  <Link to={`/matter-360?id=${a.matter_id}`} className="font-mono text-[#1F3864] hover:underline font-semibold">
                    {a.matter_id}
                  </Link>
                  <strong className="text-sm text-[#1F3864]">{a.title}</strong>
                </div>
                <div className="flex items-center gap-2">
                  {a.acknowledged === 0 ? (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-orange-50 text-orange-800 border border-orange-300 font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Unacknowledged
                    </span>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#DFFFE0] text-[#166534] border border-[#16A028] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Acknowledged
                    </span>
                  )}
                  <IndependentStatusChip dimension="Action" value={a.status} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 bg-slate-50 p-2 rounded border border-slate-200 text-[11px]">
                <div><span className="text-slate-600 block">Owner Role</span><strong>{a.responsible_role}</strong></div>
                <div><span className="text-slate-600 block">Department</span><strong>{a.responsible_department}</strong></div>
                <div><span className="text-slate-600 block">Deliverable</span><strong>{a.required_deliverable}</strong></div>
                <div><span className="text-slate-600 block flex items-center gap-1"><Clock className="w-3 h-3" /> Deadline</span><strong>{a.timeline_date}</strong></div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                {a.acknowledged === 0 && (
                  <button
                    type="button"
                    onClick={() => handleAcknowledge(a.id)}
                    className="px-2.5 py-1 rounded bg-[#7D2A42] text-white font-semibold"
                  >
                    Acknowledge Assignment
                  </button>
                )}
                {a.status === 'ACKNOWLEDGED' && (
                  <button
                    type="button"
                    onClick={() => handleTransition(a.id, 'IN_PROGRESS')}
                    className="px-2.5 py-1 rounded bg-[#1F3864] text-white font-semibold"
                  >
                    Start Work
                  </button>
                )}
                {(a.status === 'IN_PROGRESS' || a.status === 'COMPLETION_REPORTED') && (
                  <>
                    <input
                      placeholder={`Evidence ref (${a.required_evidence})...`}
                      value={evidenceInput[a.id] || ''}
                      onChange={(e) => setEvidenceInput((p) => ({ ...p, [a.id]: e.target.value }))}
                      className="border border-[#C98A87] rounded px-2 py-1 text-xs flex-1 min-w-[180px]"
                    />
                    <button
                      type="button"
                      onClick={() => handleTransition(a.id, 'VERIFICATION_REQUIRED')}
                      className="px-2.5 py-1 rounded bg-[#16A028] text-white font-semibold flex items-center gap-1"
                    >
                      <Send className="w-3 h-3" /> Submit Evidence
                    </button>
                  </>
                )}
                <div className="flex items-center gap-1 ml-auto">
                  <input
                    placeholder="Dispute / wrong dept reason..."
                    value={disputeInput[a.id] || ''}
                    onChange={(e) => setDisputeInput((p) => ({ ...p, [a.id]: e.target.value }))}
                    className="border border-slate-300 rounded px-2 py-1 text-[11px] w-44"
                  />
                  <button
                    type="button"
                    onClick={() => handleDispute(a.id)}
                    className="px-2 py-1 rounded border border-[#C98A87] bg-white text-[#7D2A42] font-semibold flex items-center gap-1 text-[11px]"
                  >
                    <RotateCcw className="w-3 h-3" /> Dispute
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
