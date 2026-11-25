import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/common/Card';
import { PageHeader } from '@/components/common/PageHeader';
import { StatusBadge } from '@/components/badges/StatusBadge';
import { SeverityBadge } from '@/components/badges/SeverityBadge';
import { useAppStore } from '@/store/appStore';
import { useDemoStore } from '@/store/demoStore';
import { ArrowRight } from 'lucide-react';

export function CommandCentrePage() {
  const { selectedState, selectedDistrict } = useAppStore();
  const { gaps, alerts, interventions, outcomes } = useDemoStore();

  const [domainFilter, setDomainFilter] = useState<'ALL' | 'WOMEN' | 'CHILD'>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [periodFilter, setPeriodFilter] = useState<string>('2024–2026');

  const filteredGaps = gaps.filter((g) => {
    const matchDomain = domainFilter === 'ALL' || g.domain === domainFilter;
    const matchSev = priorityFilter === 'ALL' || g.severity === priorityFilter;
    return matchDomain && matchSev;
  });

  const filteredAlerts = alerts.filter((a) => {
    const matchDomain = domainFilter === 'ALL' || a.domain === domainFilter || a.domain === 'SHARED';
    const matchSev = priorityFilter === 'ALL' || a.severity === priorityFilter;
    return matchDomain && matchSev;
  });

  return (
    <div className="space-y-5">
      <PageHeader
        breadcrumb={['Overview', 'Government Command Centre']}
        title="Government Command Centre — What Requires Attention Now?"
        purpose="Operational queue for District Collectors, State WCD Directors, and Ministry officers. Every record links directly to its underlying investigation, evidence, intervention, or show-cause action."
        badge={`${selectedDistrict}, ${selectedState}`}
        source="Suraksha Sentinel & Gap-Closure OS (Synthetic Operational Queue)"
        reportingPeriod={periodFilter}
        classification="SYNTHETIC"
      />

      {/* Scope & Filters */}
      <Card className="p-3 bg-white">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <select
            aria-label="Filter by domain"
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value as any)}
            className="border border-slate-200 rounded p-2"
          >
            <option value="ALL">All Domains (Women & Child)</option>
            <option value="WOMEN">Women Protection (Domain A)</option>
            <option value="CHILD">Child Protection (Domain B)</option>
          </select>

          <select
            aria-label="Filter by priority"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="border border-slate-200 rounded p-2"
          >
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL">CRITICAL</option>
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LOW">LOW</option>
          </select>

          <select
            aria-label="Reporting period"
            value={periodFilter}
            onChange={(e) => setPeriodFilter(e.target.value)}
            className="border border-slate-200 rounded p-2"
          >
            <option value="2024–2026">Period: 2024–2026 (Latest)</option>
            <option value="2025–2026">Period: 2025–2026</option>
          </select>

          <Link
            to="/ecosystem?tab=officials"
            className="flex items-center justify-center gap-1 border border-slate-300 rounded p-2 font-semibold text-gov-navy hover:bg-slate-50"
          >
            <span>Verify Authority Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </Card>

      {/* Priority Attention Queue & Overdue Actions */}
      <Card header={<span className="text-sm font-bold text-gov-navy">Critical Protection Issues & Overdue Operational Actions</span>}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[11px]">
              <tr>
                <th className="py-2.5 px-3">Title & Source</th>
                <th className="py-2.5 px-3">Domain</th>
                <th className="py-2.5 px-3">Priority</th>
                <th className="py-2.5 px-3">Geography</th>
                <th className="py-2.5 px-3">Responsible Authority</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAlerts.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3">
                    <div className="font-semibold text-slate-900">{a.title}</div>
                    <div className="text-[11px] text-slate-500">{a.source} • {a.createdAt.slice(0, 10)}</div>
                  </td>
                  <td className="py-2.5 px-3 font-mono">{a.domain}</td>
                  <td className="py-2.5 px-3"><SeverityBadge severity={a.severity === 'INFORMATIONAL' ? 'LOW' : a.severity} /></td>
                  <td className="py-2.5 px-3">{a.geography}</td>
                  <td className="py-2.5 px-3 font-medium">{a.responsibleRole}</td>
                  <td className="py-2.5 px-3 font-mono text-[11px]">{a.status}</td>
                  <td className="py-2.5 px-3">
                    <Link to={a.linkedPath} className="text-blue-700 font-semibold hover:underline whitespace-nowrap">
                      Open Record →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Validated Gaps & Active Investigations */}
      <Card header={<span className="text-sm font-bold text-gov-navy">Validated Gaps, Active Investigations & Departmental Dependencies</span>}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[11px]">
              <tr>
                <th className="py-2.5 px-3">Gap Contract</th>
                <th className="py-2.5 px-3">Domain</th>
                <th className="py-2.5 px-3">Severity</th>
                <th className="py-2.5 px-3">Owner Role</th>
                <th className="py-2.5 px-3">Deadline</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Workspace</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredGaps.map((g) => (
                <tr key={g.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3">
                    <div className="font-semibold text-slate-900">{g.title}</div>
                    <div className="text-[11px] text-slate-500">{g.id} • {g.statutoryBasis}</div>
                  </td>
                  <td className="py-2.5 px-3 font-mono">{g.domain}</td>
                  <td className="py-2.5 px-3"><SeverityBadge severity={g.severity} /></td>
                  <td className="py-2.5 px-3">{g.namedOwnerRole}</td>
                  <td className="py-2.5 px-3 font-mono">{g.deadlineDate}</td>
                  <td className="py-2.5 px-3"><StatusBadge status={g.status} /></td>
                  <td className="py-2.5 px-3">
                    <Link to={`/investigation?gapId=${g.id}`} className="text-blue-700 font-semibold hover:underline">
                      Investigate →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pending Decisions, Interventions & Outcomes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card
          header={
            <div className="flex items-center justify-between w-full">
              <span className="text-sm font-bold text-gov-navy">Pending Official Decisions & Interventions</span>
              <Link to="/interventions" className="text-xs font-semibold text-blue-700 hover:underline">Manage All →</Link>
            </div>
          }
        >
          <div className="space-y-2 text-xs">
            {interventions.map((i) => (
              <div key={i.id} className="p-2.5 rounded border border-slate-200 flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-900">{i.description}</div>
                  <div className="text-[11px] text-slate-500">Owner: {i.ownerRole} • Deadline: {i.targetDate}</div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 font-mono shrink-0">{i.status}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card
          header={
            <div className="flex items-center justify-between w-full">
              <span className="text-sm font-bold text-gov-navy">Outcome Verification & Executive Briefs</span>
              <Link to="/outcomes" className="text-xs font-semibold text-blue-700 hover:underline">Verify Outcomes →</Link>
            </div>
          }
        >
          <div className="space-y-2 text-xs">
            {outcomes.map((o) => (
              <div key={o.id} className="p-2.5 rounded border border-slate-200 flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-900">{o.id} ({o.gapId}) — Observed {o.observedResult}% vs Target {o.target}%</div>
                  <div className="text-[11px] text-slate-500">{o.evidenceNotes}</div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold shrink-0">{o.status}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
