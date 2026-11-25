import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/common/Card';
import { PageHeader } from '@/components/common/PageHeader';
import { SeverityBadge } from '@/components/badges/SeverityBadge';
import { IndependentStatusChip } from '@/components/badges/IndependentStatusChip';
import { useAppStore } from '@/store/appStore';
import { useGovernanceStore } from '@/store/governanceStore';
import { useDemoStore } from '@/store/demoStore';

export function CommandCentrePage() {
  const { selectedState, selectedDistrict } = useAppStore();
  const { matters, dependencies, financials, activities } = useGovernanceStore();
  const { alerts } = useDemoStore();

  const [domainFilter, setDomainFilter] = useState<'ALL' | 'WOMEN' | 'CHILD'>('ALL');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [deptFilter, setDeptFilter] = useState<string>('ALL');

  const departments = Array.from(new Set(matters.map((m) => m.responsibleDepartment)));

  const filteredMatters = matters.filter((m) => {
    const dOk = domainFilter === 'ALL' || m.domain === domainFilter;
    const sOk = severityFilter === 'ALL' || m.severity === severityFilter;
    const depOk = deptFilter === 'ALL' || m.responsibleDepartment === deptFilter;
    return dOk && sOk && depOk;
  });

  const metrics = [
    { label: 'Total Matters', val: matters.length, to: '/matter-360' },
    { label: 'Open / Review', val: matters.filter((m) => m.matterStatus === 'OPEN' || m.matterStatus === 'UNDER_REVIEW').length, to: '/matter-360' },
    { label: 'Active', val: matters.filter((m) => m.matterStatus === 'ACTIVE').length, to: '/matter-360' },
    { label: 'Blocked', val: matters.filter((m) => m.matterStatus === 'BLOCKED').length, to: '/dependencies' },
    { label: 'Pending Approvals', val: dependencies.filter((d) => d.status === 'WAITING_FOR_APPROVAL').length, to: '/dependencies' },
    { label: 'Police Actions', val: matters.filter((m) => m.police.status !== 'NOT_APPLICABLE').length, to: '/matter-360?tab=police' },
    { label: 'Legal Dependencies', val: matters.filter((m) => m.litigation.status !== 'NOT_APPLICABLE').length, to: '/matter-360?tab=litigation' },
    { label: 'Admin Waiting', val: matters.filter((m) => m.adminStatus === 'WAITING_FOR_DEPENDENCY').length, to: '/ownership' },
    { label: 'Pending Sanctions', val: financials.filter((f) => f.financialStatus === 'SANCTIONED' || f.financialStatus === 'UNDER_REVIEW').length, to: '/finance' },
    { label: 'Pending Releases', val: dependencies.filter((d) => d.type === 'FUND_RELEASE').length, to: '/finance' },
    { label: 'NGO Support', val: activities.length, to: '/ngo-community' },
    { label: 'Verified Outcomes', val: matters.filter((m) => m.outcome.status === 'ACHIEVED').length, to: '/outcomes' },
    { label: 'Resolved / Closed', val: matters.filter((m) => m.matterStatus === 'RESOLVED' || m.matterStatus === 'CLOSED').length, to: '/matter-360' },
    { label: 'Active Alerts', val: alerts.length, to: '/alerts' },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        breadcrumb={['Overview', 'Government Command Centre']}
        title="Government Command Centre"
        purpose="Operational overview across domains, departments, police/legal dependencies, financial bottlenecks, NGO support, and verified outcomes. Every metric links to underlying records."
        badge={`${selectedDistrict}, ${selectedState}`}
        source="Integrated Governance Queue (Synthetic)"
        classification="SYNTHETIC"
        actions={
          <Link to="/dashboards?role=MINISTER" className="text-xs px-3 py-1.5 rounded bg-[#7D2A42] hover:bg-[#654161] text-white font-semibold">
            Role Dashboards →
          </Link>
        }
      />

      {/* Multi-Dimension Filter Bar */}
      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          <select aria-label="Filter domain" value={domainFilter} onChange={(e) => setDomainFilter(e.target.value as any)} className="border border-[#C98A87] rounded p-1.5 bg-white">
            <option value="ALL">All Domains (Women & Child)</option>
            <option value="WOMEN">Women Protection (Domain A)</option>
            <option value="CHILD">Child Aggregate (Domain B)</option>
          </select>
          <select aria-label="Filter severity" value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)} className="border border-[#C98A87] rounded p-1.5 bg-white">
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">CRITICAL</option>
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LOW">LOW</option>
          </select>
          <select aria-label="Filter department" value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="border border-[#C98A87] rounded p-1.5 bg-white">
            <option value="ALL">All Departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </Card>

      {/* 14 Operational Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center">
        {metrics.map((m) => (
          <Link key={m.label} to={m.to} className="p-2.5 rounded-lg border border-[#E5B8B7] border-t-2 border-t-[#EF5A90] bg-white hover:bg-[#FFE5DE]/40 transition-colors">
            <div className="text-lg font-extrabold text-[#1F3864]">{m.val}</div>
            <div className="text-[10px] text-slate-600 font-semibold truncate">{m.label}</div>
          </Link>
        ))}
      </div>

      {/* Matter Register */}
      <Card header={<span className="text-xs font-bold text-[#1F3864]">Matter Register ({filteredMatters.length} Matching)</span>}>
        <div className="space-y-2">
          {filteredMatters.map((m) => (
            <Link
              key={m.id}
              to={`/matter-360?id=${m.id}`}
              className="block p-2.5 rounded border border-[#E5B8B7] hover:border-[#EF5A90] bg-white text-xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[#7D2A42]">{m.demoCode}</span>
                  <span className="font-bold text-[#1F3864]">{m.title}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <SeverityBadge severity={m.severity} />
                  <IndependentStatusChip dimension="Matter" value={m.matterStatus} />
                  <IndependentStatusChip dimension="Admin" value={m.adminStatus} />
                </div>
              </div>
              <div className="flex flex-wrap gap-3 text-[11px] text-slate-600">
                <span><strong>Dept:</strong> {m.responsibleDepartment}</span>
                <span><strong>Owner:</strong> {m.ownership.responsibleRole}</span>
                <span><strong>Pending:</strong> {m.ownership.pendingAction}</span>
              </div>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
