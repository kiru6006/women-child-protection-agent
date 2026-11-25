import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/common/Card';
import { PageHeader } from '@/components/common/PageHeader';
import { useGovernanceStore } from '@/store/governanceStore';
import { IndependentStatusChip } from '@/components/badges/IndependentStatusChip';

export function OwnershipPage() {
  const { raciAssignments, reassignRaciRole } = useGovernanceStore();
  const [reassignId, setReassignId] = useState<string | null>(null);
  const [newRole, setNewRole] = useState('');
  const [reason, setReason] = useState('');

  return (
    <div className="space-y-4">
      <PageHeader
        breadcrumb={['Government Convergence', 'Responsibility & Ownership Centre']}
        title="RACI Responsibility Matrix & Ownership Centre"
        purpose="Attaches ownership to authorised government roles (not individuals), maintains transfer history, and separates statutory authority from coordination responsibility."
        badge={`${raciAssignments.length} Role Contracts`}
        source="Role-Based RACI Ledger (Synthetic)"
        classification="SYNTHETIC"
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <Card><div className="text-xl font-bold text-[#1F3864]">{raciAssignments.length}</div><div className="text-[11px] text-slate-600">Assigned Actions</div></Card>
        <Card><div className="text-xl font-bold text-orange-700">{raciAssignments.filter((r) => r.status === 'WAITING_FOR_DEPENDENCY').length}</div><div className="text-[11px] text-slate-600">Cross-Dept Waiting</div></Card>
        <Card><div className="text-xl font-bold text-[#7D2A42]">{raciAssignments.filter((r) => r.transferHistory.length > 0).length}</div><div className="text-[11px] text-slate-600">Role Transfers Logged</div></Card>
        <Card><div className="text-xl font-bold text-[#166534]">0</div><div className="text-[11px] text-slate-600">Unassigned Actions</div></Card>
      </div>

      <div className="space-y-3">
        {raciAssignments.map((r) => (
          <Card key={r.id}>
            <div className="space-y-2.5 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[#7D2A42]">{r.id}</span>
                  <Link to={`/matter-360?id=${r.matterId}`} className="font-mono text-[#1F3864] hover:underline font-semibold">
                    {r.matterId}
                  </Link>
                  <span className="font-bold text-slate-900">{r.actionTitle}</span>
                </div>
                <div className="flex items-center gap-2">
                  <IndependentStatusChip dimension="Action" value={r.status} />
                  <button
                    type="button"
                    onClick={() => setReassignId(reassignId === r.id ? null : r.id)}
                    className="px-2.5 py-1 rounded border border-[#C98A87] bg-[#FFE5DE]/60 text-[#7D2A42] font-semibold text-[11px]"
                  >
                    Transfer Role
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 bg-slate-50 p-2.5 rounded border border-slate-200">
                <div><span className="text-[10px] font-bold text-[#7D2A42] uppercase block">R — Responsible</span><strong>{r.responsibleRole}</strong></div>
                <div><span className="text-[10px] font-bold text-[#1F3864] uppercase block">A — Accountable</span><strong>{r.accountableAuthority}</strong></div>
                <div><span className="text-[10px] font-bold text-slate-600 uppercase block">C — Consulted</span>{r.consultedRoles.join(', ')}</div>
                <div><span className="text-[10px] font-bold text-slate-600 uppercase block">I — Informed</span>{r.informedRoles.join(', ')}</div>
              </div>

              <div className="flex flex-wrap gap-4 text-[11px] text-slate-600">
                <span><strong>Completion Criteria:</strong> {r.completionCriteria}</span>
                <span><strong>Review Date:</strong> {r.reviewDate}</span>
                <span><strong>Escalation:</strong> {r.escalationPath}</span>
              </div>

              {r.transferHistory.length > 0 && (
                <div className="p-2 rounded bg-[#FFFACD]/60 border border-[#C98A87] text-[11px]">
                  <strong>Role Transfer History:</strong>{' '}
                  {r.transferHistory.map((t, i) => (
                    <span key={i}>{t.date}: {t.fromRole} → {t.toRole} ({t.reason})</span>
                  ))}
                </div>
              )}

              {reassignId === r.id && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newRole.trim()) return;
                    reassignRaciRole(r.id, newRole.trim(), reason.trim() || 'Administrative posting transfer');
                    setNewRole('');
                    setReason('');
                    setReassignId(null);
                  }}
                  className="p-2.5 rounded bg-[#FFE5DE]/40 border border-[#C98A87] flex flex-wrap gap-2"
                >
                  <input
                    required
                    placeholder="New authorised government role..."
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="flex-1 min-w-[180px] text-xs border border-[#C98A87] rounded px-2 py-1 bg-white"
                  />
                  <input
                    placeholder="Transfer reason..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="flex-1 min-w-[160px] text-xs border border-[#C98A87] rounded px-2 py-1 bg-white"
                  />
                  <button type="submit" className="px-3 py-1 rounded bg-[#7D2A42] text-white font-semibold text-xs">
                    Save Transfer
                  </button>
                </form>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
