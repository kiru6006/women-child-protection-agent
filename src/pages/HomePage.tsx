import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  Bot,
  Building2,
  CheckCircle2,
  Clock,
  Database,
  Landmark,
  Network,
  PhoneCall,
  Scale,
  SearchCode,
  ShieldCheck,
  Wallet,
} from 'lucide-react';
import { Card } from '@/components/common/Card';
import { MoreInfoButton } from '@/components/common/PageHeader';
import { SeverityBadge } from '@/components/badges/SeverityBadge';
import { DomainBadge } from '@/components/badges/DomainBadge';
import { IndependentStatusChip } from '@/components/badges/IndependentStatusChip';
import { useDemoStore } from '@/store/demoStore';
import { useGovernanceStore } from '@/store/governanceStore';
import { useAppStore } from '@/store/appStore';

export function HomePage() {
  const { selectedDistrict, selectedState } = useAppStore();
  const { alerts, gaps, outcomes, datasets, evidence } = useDemoStore();
  const { matters, dependencies, financials, nominations, activities } = useGovernanceStore();

  const totalReleased = financials.reduce((a, f) => a + f.releasedInr, 0);
  const totalUtilised = financials.reduce((a, f) => a + f.utilisedInr, 0);
  const totalPending = financials.reduce((a, f) => a + f.pendingInr, 0);

  // Section A: Overall Status
  const statusStrip = [
    { label: 'Open / Review', val: matters.filter((m) => m.matterStatus === 'OPEN' || m.matterStatus === 'UNDER_REVIEW').length, border: 'border-l-[#1F3864]', text: 'text-[#1F3864]', to: '/matter-360' },
    { label: 'In Progress', val: matters.filter((m) => m.matterStatus === 'ACTIVE').length, border: 'border-l-[#EF5A90]', text: 'text-[#7D2A42]', to: '/command-centre' },
    { label: 'Blocked', val: matters.filter((m) => m.matterStatus === 'BLOCKED').length, border: 'border-l-red-600', text: 'text-red-700', to: '/dependencies' },
    { label: 'Pending Deps', val: dependencies.filter((d) => d.status !== 'RESOLVED').length, border: 'border-l-orange-500', text: 'text-orange-700', to: '/dependencies' },
    { label: 'Verified Outcomes', val: outcomes.length, border: 'border-l-[#16A028]', text: 'text-[#166534]', to: '/outcomes' },
    { label: 'Closed / Resolved', val: matters.filter((m) => m.matterStatus === 'RESOLVED' || m.matterStatus === 'CLOSED').length, border: 'border-l-[#167F80]', text: 'text-[#167F80]', to: '/excellence' },
  ];

  // Section B: Pending with whom?
  const deptPending = [
    { dept: 'WCD', count: 3, to: '/ownership' },
    { dept: 'Police', count: 2, to: '/matter-360?tab=police' },
    { dept: 'DLSA / Legal', count: 2, to: '/matter-360?tab=litigation' },
    { dept: 'Health', count: 2, to: '/convergence' },
    { dept: 'Education', count: 1, to: '/child' },
    { dept: 'Finance', count: 3, to: '/finance' },
    { dept: 'District Admin', count: 2, to: '/command-centre' },
    { dept: 'NGOs / Local', count: activities.length, to: '/ngo-community' },
  ];

  return (
    <div className="space-y-4">
      {/* Compact Command Header */}
      <div className="bg-white border border-[#E5B8B7] border-l-4 border-l-[#EF5A90] rounded-lg px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-base sm:text-lg font-bold text-[#1F3864] tracking-tight">WCD Integrated Governance & Protection Hub</h1>
          <span className="text-[11px] px-2 py-0.5 rounded bg-[#FFE5DE] text-[#7D2A42] border border-[#C98A87] font-semibold">
            {selectedDistrict}, {selectedState}
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-[#FFFACD] text-[#7D2A42] border border-[#C98A87] font-mono font-semibold">
            10 SYNTHETIC DEMOS
          </span>
        </div>
        <div className="flex items-center gap-2">
          <MoreInfoButton
            title="WCD Integrated Governance Hub"
            purpose="Answers what happened, who needs support, which authority is responsible, what is pending with whom, what dependencies/funds are needed, and whether outcomes were achieved."
          />
          <Link to="/my-work" className="text-xs px-2.5 py-1.5 rounded border border-[#C98A87] bg-white text-[#7D2A42] font-semibold hover:bg-[#FFE5DE]/50">
            My Work
          </Link>
          <Link to="/dashboards?role=MINISTER" className="text-xs px-2.5 py-1.5 rounded border border-[#C98A87] bg-white text-[#7D2A42] font-semibold hover:bg-[#FFE5DE]/50">
            Role Views
          </Link>
          <Link to="/matter-360" className="text-xs px-3 py-1.5 rounded bg-[#7D2A42] hover:bg-[#654161] text-white font-semibold flex items-center gap-1">
            <span>Matter 360°</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Section A: Overall Status */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {statusStrip.map((s) => (
          <Link key={s.label} to={s.to} className={`bg-white border border-[#E5B8B7] border-l-4 ${s.border} hover:border-[#EF5A90] rounded-lg p-2.5 shadow-xs`}>
            <div className="text-[10px] font-bold uppercase text-slate-600 truncate">{s.label}</div>
            <div className={`text-xl font-extrabold mt-0.5 ${s.text}`}>{s.val}</div>
          </Link>
        ))}
      </div>

      {/* Section B (Pending With Whom) + Section E (Financial Status) + Section H (Excellence) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card header={<span className="text-xs font-bold text-[#1F3864]">B. Pending With Whom? (Dept Queue)</span>}>
          <div className="grid grid-cols-4 gap-1.5 text-center">
            {deptPending.map((d) => (
              <Link key={d.dept} to={d.to} className="p-2 rounded border border-[#E5B8B7] bg-[#FFE5DE]/25 hover:bg-[#FFE5DE]/70">
                <div className="text-sm font-extrabold text-[#7D2A42]">{d.count}</div>
                <div className="text-[10px] font-semibold text-slate-700 truncate">{d.dept}</div>
              </Link>
            ))}
          </div>
        </Card>

        <Card
          header={
            <div className="flex items-center justify-between w-full">
              <span className="text-xs font-bold text-[#1F3864] flex items-center gap-1"><Wallet className="w-3.5 h-3.5 text-[#16A028]" /> E. Financial Status</span>
              <Link to="/finance" className="text-[11px] font-semibold text-[#7D2A42] hover:underline">Details →</Link>
            </div>
          }
        >
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 rounded bg-[#FFE5DE]/40 border border-[#C98A87]"><div className="font-extrabold text-[#7D2A42]">₹{(totalReleased / 100000).toFixed(1)}L</div><div className="text-[10px] text-slate-600">Released</div></div>
            <div className="p-2 rounded bg-[#DFFFE0] border border-[#16A028]"><div className="font-extrabold text-[#166534]">₹{(totalUtilised / 100000).toFixed(1)}L</div><div className="text-[10px] text-slate-600">Utilised</div></div>
            <div className="p-2 rounded bg-orange-50 border border-orange-300"><div className="font-extrabold text-orange-800">₹{(totalPending / 100000).toFixed(1)}L</div><div className="text-[10px] text-slate-600">Pending</div></div>
          </div>
        </Card>

        <Card
          header={
            <div className="flex items-center justify-between w-full">
              <span className="text-xs font-bold text-[#1F3864] flex items-center gap-1"><Award className="w-3.5 h-3.5 text-[#EF5A90]" /> H. Governance Excellence</span>
              <Link to="/excellence" className="text-[11px] font-semibold text-[#7D2A42] hover:underline">Recognition →</Link>
            </div>
          }
        >
          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="p-2 rounded bg-[#DFFFE0] border border-[#16A028]">
              <div className="font-extrabold text-[#166534]">{nominations.filter((n) => n.status === 'APPROVED').length}</div>
              <div className="text-[10px] text-slate-700">Verified Best Practices</div>
            </div>
            <div className="p-2 rounded bg-[#FFC0CB]/40 border border-[#EF5A90]">
              <div className="font-extrabold text-[#7D2A42]">{activities.length}</div>
              <div className="text-[10px] text-slate-700">NGO / Local Activities</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Section C (Domains & Work Categories) + Section D (Major Dependencies) + Section G (AI & Alerts) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card header={<span className="text-xs font-bold text-[#1F3864]">C. Protection Domains & Categories</span>}>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 rounded bg-[#FFE5DE]/40 border border-[#C98A87]">
              <DomainBadge domain="WOMEN" />
              <Link to="/women?tab=overview" className="text-[11px] font-bold text-[#7D2A42] hover:underline">
                {gaps.filter((g) => g.domain === 'WOMEN').length} Gaps • M18 Demo →
              </Link>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-[#FFC0CB]/35 border border-[#EF5A90]">
              <DomainBadge domain="CHILD" />
              <Link to="/child?tab=overview" className="text-[11px] font-bold text-[#7D2A42] hover:underline">
                C01–C16 Research →
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-[10px] text-center">
              <Link to="/matter-360?tab=police" className="p-1.5 rounded border border-[#E5B8B7] bg-white font-semibold hover:bg-[#FFE5DE]/40">Police</Link>
              <Link to="/matter-360?tab=litigation" className="p-1.5 rounded border border-[#E5B8B7] bg-white font-semibold hover:bg-[#FFE5DE]/40">Court Orders</Link>
              <Link to="/schemes?tab=all" className="p-1.5 rounded border border-[#E5B8B7] bg-white font-semibold hover:bg-[#FFE5DE]/40">Schemes</Link>
            </div>
          </div>
        </Card>

        <Card
          header={
            <div className="flex items-center justify-between w-full">
              <span className="text-xs font-bold text-[#1F3864] flex items-center gap-1"><Network className="w-3.5 h-3.5 text-[#EF5A90]" /> D. Major Dependencies</span>
              <Link to="/dependencies" className="text-[11px] font-semibold text-[#7D2A42] hover:underline">All →</Link>
            </div>
          }
        >
          <div className="space-y-1.5">
            {dependencies.slice(0, 3).map((d) => (
              <Link key={d.id} to={`/matter-360?id=${d.matterId}`} className="flex items-center justify-between gap-2 p-2 rounded border border-[#E5B8B7] bg-white hover:border-[#EF5A90] text-xs">
                <div className="min-w-0">
                  <div className="font-semibold text-[#1F3864] truncate">{d.predecessorNode} → {d.dependentNode}</div>
                  <div className="text-[10px] text-slate-600 truncate">{d.ownerRole}</div>
                </div>
                <IndependentStatusChip dimension="Dep" value={d.status} />
              </Link>
            ))}
          </div>
        </Card>

        <Card
          header={
            <div className="flex items-center justify-between w-full">
              <span className="text-xs font-bold text-[#1F3864]">F–G. Priority Alerts & AI</span>
              <Link to="/alerts" className="text-[11px] font-semibold text-[#7D2A42] hover:underline">Alerts →</Link>
            </div>
          }
        >
          <div className="space-y-1.5">
            {alerts.slice(0, 3).map((a) => (
              <Link key={a.id} to={a.linkedPath} className="flex items-center justify-between gap-2 p-2 rounded border border-[#E5B8B7] bg-white hover:border-[#EF5A90] text-xs">
                <span className="font-semibold text-slate-900 truncate">{a.title}</span>
                <SeverityBadge severity={a.severity} />
              </Link>
            ))}
          </div>
        </Card>
      </div>

      {/* Section I: Quick Access Launchpad + Helplines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2" header={<span className="text-xs font-bold text-[#1F3864]">I. Quick Access Workspaces</span>}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {[
              { label: 'Matter 360°', to: '/matter-360', icon: ShieldCheck },
              { label: 'Convergence', to: '/convergence', icon: Network },
              { label: 'Dependency 360°', to: '/dependencies', icon: Clock },
              { label: 'RACI Ownership', to: '/ownership', icon: Building2 },
              { label: 'Finance Intel', to: '/finance', icon: Wallet },
              { label: 'NGO & Local', to: '/ngo-community', icon: Landmark },
              { label: 'AI Intelligence', to: '/ai-intelligence?tab=centre', icon: Bot },
              { label: 'Investigation', to: '/investigation', icon: SearchCode },
              { label: 'Role Dashboards', to: '/dashboards?role=MINISTER', icon: Scale },
              { label: 'Excellence', to: '/excellence', icon: Award },
              { label: `Data (${datasets.length})`, to: '/knowledge?tab=catalogue', icon: Database },
              { label: `Evidence (${evidence.length})`, to: '/evidence', icon: CheckCircle2 },
            ].map((q) => {
              const Icon = q.icon;
              return (
                <Link key={q.label} to={q.to} className="p-2 rounded border border-[#E5B8B7] bg-white hover:bg-[#FFE5DE]/50 flex items-center gap-1.5 font-semibold text-[#1F3864]">
                  <Icon className="w-3.5 h-3.5 text-[#7D2A42] shrink-0" />
                  <span className="truncate">{q.label}</span>
                </Link>
              );
            })}
          </div>
        </Card>

        <Card header={<span className="text-xs font-bold text-[#1F3864]">Emergency Helplines</span>}>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              { num: '181', label: 'Women Helpline' },
              { num: '1098', label: 'Child Helpline' },
              { num: '112', label: 'ERSS' },
              { num: '15100', label: 'Legal Aid' },
            ].map((h) => (
              <div key={h.num} className="p-2 rounded bg-[#FFE5DE]/40 border border-[#C98A87] flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-[#7D2A42] shrink-0" />
                <div>
                  <div className="font-black text-[#1F3864] leading-none">{h.num}</div>
                  <div className="text-[10px] text-slate-600">{h.label}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
