import { Link, useSearchParams } from 'react-router-dom';
import { Card } from '@/components/common/Card';
import { PageHeader } from '@/components/common/PageHeader';
import { useGovernanceStore } from '@/store/governanceStore';
import { DashboardRoleKey } from '@/types/governance';
import { IndependentStatusChip } from '@/components/badges/IndependentStatusChip';

const ROLES: { key: DashboardRoleKey; label: string; scope: string; guard: string }[] = [
  { key: 'MINISTER', label: 'Minister', scope: 'Aggregate strategic intelligence, systemic bottlenecks & excellence', guard: 'Identifiable case details hidden by default' },
  { key: 'SECRETARY', label: 'Principal Secretary', scope: 'Departmental accountability, court compliance & escalations', guard: 'Inter-departmental execution focus' },
  { key: 'COMMISSIONER', label: 'Commissioner / Director', scope: 'Programme coverage, service capacity & district delivery', guard: 'Operational & scheme oversight' },
  { key: 'COLLECTOR', label: 'District Collector', scope: 'District matters, convergence, NGOs, local bodies & outcomes', guard: 'District executive sanction authority' },
  { key: 'DWCD_OFFICER', label: 'District WCD Officer', scope: 'Assigned matters, referrals, welfare & Day-90 follow-ups', guard: 'Authorised operational scope' },
  { key: 'POLICE', label: 'Police Coordination', scope: 'Minimum authorised FIR/DIR & safety handover milestones', guard: 'Does not replace CCTNS or direct investigation' },
  { key: 'LEGAL', label: 'Legal Coordination', scope: 'DLSA legal aid roster & executive court-order compliance', guard: 'Does not direct judicial decisions' },
  { key: 'FINANCE', label: 'Finance & Treasury', scope: 'Sanctions, releases, disbursements & utilisation gaps', guard: 'AI cannot approve payments' },
  { key: 'NGO', label: 'NGO Partner', scope: 'Assigned approved activities & delivery evidence only', guard: 'Zero access to unrelated matters or PII' },
  { key: 'AUDITOR', label: 'Auditor', scope: 'WORM audit trail, financial traceability & compliance exceptions', guard: 'Read-only independent audit view' },
];

export function RoleDashboardsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeRole = (searchParams.get('role') as DashboardRoleKey) || 'MINISTER';
  const roleMeta = ROLES.find((r) => r.key === activeRole) || ROLES[0];
  const { matters, dependencies, financials, activities, nominations } = useGovernanceStore();

  return (
    <div className="space-y-4">
      <PageHeader
        breadcrumb={['Overview', 'Role-Based Dashboards']}
        title={`${roleMeta.label} Dashboard`}
        purpose={`${roleMeta.scope}. Safeguard: ${roleMeta.guard}.`}
        badge="10 Role Views (Demo)"
        source="Role-Scoped Governance Projection (Synthetic)"
        classification="SYNTHETIC"
      />

      <div className="flex flex-wrap gap-1.5">
        {ROLES.map((r) => (
          <button
            key={r.key}
            type="button"
            onClick={() => setSearchParams({ role: r.key })}
            className={`px-2.5 py-1 rounded text-xs font-semibold border ${
              activeRole === r.key
                ? 'bg-[#7D2A42] text-white border-[#7D2A42]'
                : 'bg-white text-slate-700 border-[#E5B8B7] hover:bg-[#FFE5DE]/40'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      <div className="p-2.5 rounded border border-[#C98A87] bg-[#FFE5DE]/40 text-xs text-[#7D2A42] flex flex-wrap items-center justify-between gap-2">
        <span><strong>Role Focus:</strong> {roleMeta.scope}</span>
        <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-[#C98A87]">{roleMeta.guard}</span>
      </div>

      {activeRole === 'NGO' ? (
        <Card header={<span className="text-xs font-bold text-[#1F3864]">Assigned Approved NGO Activities Only ({activities.length})</span>}>
          <div className="space-y-2 text-xs">
            {activities.map((a) => (
              <div key={a.id} className="p-2.5 rounded border border-[#E5B8B7] bg-white flex items-center justify-between gap-2">
                <div>
                  <div className="font-bold text-[#1F3864]">{a.title}</div>
                  <div className="text-[11px] text-slate-600">{a.organisation} • {a.geography} • {a.expectedOutcome}</div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#DFFFE0] text-[#166534] border border-[#16A028] font-bold">
                  {a.verificationStatus}
                </span>
              </div>
            ))}
          </div>
        </Card>
      ) : activeRole === 'FINANCE' ? (
        <Card header={<span className="text-xs font-bold text-[#1F3864]">Finance & Utilisation Queue ({financials.length} Schemes)</span>}>
          <div className="space-y-2 text-xs">
            {financials.map((f) => (
              <div key={f.id} className="p-2.5 rounded border border-[#E5B8B7] bg-white flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="font-bold text-[#1F3864]">{f.schemeName}</div>
                  <div className="text-[11px] text-slate-600">{f.candidateGap}</div>
                </div>
                <IndependentStatusChip dimension="Financial" value={f.financialStatus} />
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card header={<span className="text-xs font-bold text-[#1F3864]">Role Action Queue ({matters.length} Matters)</span>}>
            <div className="space-y-2 text-xs">
              {matters.slice(0, 5).map((m) => (
                <Link
                  key={m.id}
                  to={`/matter-360?id=${m.id}`}
                  className="block p-2.5 rounded border border-[#E5B8B7] hover:border-[#EF5A90] bg-white"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-[#1F3864] truncate">{m.demoCode}: {m.title}</span>
                    <IndependentStatusChip dimension="Matter" value={m.matterStatus} />
                  </div>
                  <div className="text-[11px] text-slate-600 mt-1">
                    {activeRole === 'POLICE'
                      ? `Police: ${m.police.reference} (${m.police.status})`
                      : activeRole === 'LEGAL'
                        ? `Court: ${m.litigation.caseRef} (${m.litigation.complianceStatus})`
                        : `Owner: ${m.ownership.responsibleRole} • Pending: ${m.ownership.pendingAction}`}
                  </div>
                </Link>
              ))}
            </div>
          </Card>

          <Card header={<span className="text-xs font-bold text-[#1F3864]">Escalations, Dependencies & Recognition</span>}>
            <div className="space-y-2 text-xs">
              {dependencies.slice(0, 4).map((d) => (
                <div key={d.id} className="p-2.5 rounded border border-[#E5B8B7] bg-slate-50 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-bold text-[#7D2A42] truncate">{d.predecessorAction}</div>
                    <div className="text-[11px] text-slate-600 truncate">Escalation: {d.escalationAuthority}</div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-[#C98A87] font-bold shrink-0">{d.status}</span>
                </div>
              ))}
              {activeRole === 'MINISTER' && (
                <div className="p-2.5 rounded bg-[#DFFFE0] border border-[#16A028] text-[11px] text-[#166534]">
                  <strong>Governance Excellence:</strong> {nominations.filter((n) => n.status === 'APPROVED').length} verified good practices approved for replication.
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
