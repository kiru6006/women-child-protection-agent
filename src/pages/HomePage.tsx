import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  Building2,
  CheckCircle2,
  Clock,
  Database,
  FileCheck2,
  Landmark,
  MapPin,
  PhoneCall,
  Scale,
  SearchCode,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import { Card } from '@/components/common/Card';
import { MoreInfoButton } from '@/components/common/PageHeader';
import { SeverityBadge } from '@/components/badges/SeverityBadge';
import { StatusBadge } from '@/components/badges/StatusBadge';
import { DomainBadge } from '@/components/badges/DomainBadge';
import { useDemoStore } from '@/store/demoStore';
import { useAppStore } from '@/store/appStore';
import { governmentSchemes } from '@/data/platformData';

export function HomePage() {
  const { selectedDistrict, selectedState } = useAppStore();
  const { alerts, gaps, interventions, outcomes, datasets, evidence } = useDemoStore();

  const criticalAlerts = alerts.filter((a) => a.severity === 'CRITICAL' || a.severity === 'HIGH');
  const validatedGaps = gaps.filter((g) => g.status === 'VALIDATED').length;
  const underInvestigation = gaps.filter((g) => g.status === 'UNDER_INVESTIGATION').length;
  const pendingDecisions = interventions.filter((i) => i.status === 'PROPOSED').length;
  const activeInterventions = interventions.filter((i) => i.status === 'APPROVED' || i.status === 'IN_PROGRESS').length;
  const verifiedFacts = evidence.filter((e) => e.epistemicClass === 'VERIFIED_FACT').length;

  const kpiBoxes = [
    { label: 'Critical Alerts', val: alerts.filter((a) => a.severity === 'CRITICAL').length, sub: `${criticalAlerts.length} High/Crit`, to: '/alerts', border: 'border-l-red-600', text: 'text-red-700', icon: AlertTriangle },
    { label: 'Validated Gaps', val: validatedGaps, sub: `${gaps.length} Total Contracts`, to: '/gaps', border: 'border-l-gov-navy', text: 'text-gov-navy', icon: Scale },
    { label: 'Investigations', val: underInvestigation, sub: 'Active Root-Cause', to: '/investigation', border: 'border-l-primary', text: 'text-primary', icon: SearchCode },
    { label: 'Pending Decisions', val: pendingDecisions, sub: 'Human Gate Queue', to: '/interventions?tab=pending', border: 'border-l-orange-500', text: 'text-orange-700', icon: Clock },
    { label: 'Active Actions', val: activeInterventions, sub: `${interventions.length} Plans`, to: '/interventions', border: 'border-l-green-600', text: 'text-green-700', icon: ShieldCheck },
    { label: 'Verified Outcomes', val: outcomes.length, sub: '90-Day Field Audit', to: '/outcomes', border: 'border-l-green-700', text: 'text-green-700', icon: CheckCircle2 },
  ];

  const lifecycleStages = [
    { stage: '1. Discover', count: alerts.length, pct: 100, color: 'bg-red-600', to: '/alerts' },
    { stage: '2. Investigate', count: underInvestigation + validatedGaps, pct: 75, color: 'bg-primary', to: '/investigation' },
    { stage: '3. Intervene', count: interventions.length, pct: 60, color: 'bg-orange-500', to: '/interventions' },
    { stage: '4. Verify', count: outcomes.length, pct: 80, color: 'bg-green-600', to: '/outcomes' },
  ];

  const quickModules = [
    { label: 'Command Centre', to: '/command-centre', icon: AlertTriangle },
    { label: 'AI Intelligence', to: '/ai-intelligence?tab=centre', icon: Bot },
    { label: 'Officials & Directory', to: '/ecosystem?tab=officials', icon: Building2 },
    { label: 'Geography Coverage', to: '/geography?tab=india', icon: MapPin },
    { label: 'Schemes & Services', to: '/schemes?tab=all', icon: Landmark },
    { label: 'Data & Knowledge', to: '/knowledge?tab=catalogue', icon: Database },
    { label: 'Evidence Library', to: '/evidence', icon: FileCheck2 },
    { label: 'Governance & Audit', to: '/audit', icon: ShieldAlert },
  ];

  return (
    <div className="space-y-4">
      {/* Compact Command Header Strip */}
      <div className="bg-white border border-slate-200 border-l-4 border-l-[#EF5A90] rounded-lg px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-base sm:text-lg font-bold text-[#1F3864] tracking-tight">WCD Protection Intelligence Hub</h1>
          <span className="text-[11px] px-2 py-0.5 rounded bg-[#FFE5DE] text-[#7D2A42] border border-[#C98A87] font-semibold">
            {selectedDistrict}, {selectedState}
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-[#FFFACD] text-[#7D2A42] border border-[#C98A87] font-mono font-semibold">
            SYNTHETIC PILOT
          </span>
        </div>
        <div className="flex items-center gap-2">
          <MoreInfoButton
            title="WCD Protection Intelligence Hub"
            purpose="Unified platform for discovering systemic protection failures, inspecting authoritative evidence, coordinating responsible authorities, managing interventions, and verifying outcomes."
          />
          <Link
            to="/command-centre"
            className="text-xs px-3 py-1.5 rounded border border-[#C98A87] bg-white text-[#7D2A42] font-semibold hover:bg-[#FFE5DE]/50"
          >
            Command Centre
          </Link>
          <Link
            to="/investigation?gapId=GAP-W-PATNA-001"
            className="text-xs px-3 py-1.5 rounded bg-[#7D2A42] hover:bg-[#654161] text-white font-semibold flex items-center gap-1"
          >
            <span>Open Investigation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Row 1: 6 Visual KPI Boxes */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpiBoxes.map((k) => {
          const Icon = k.icon;
          return (
            <Link
              key={k.label}
              to={k.to}
              className={`bg-white border border-slate-200 border-l-4 ${k.border} rounded-lg p-3 hover:border-slate-300 transition-all shadow-xs`}
            >
              <div className="flex items-center justify-between text-slate-600 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider truncate">{k.label}</span>
                <Icon className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              </div>
              <div className={`text-2xl font-extrabold leading-none ${k.text}`}>{k.val}</div>
              <div className="text-[11px] text-slate-600 mt-1.5 truncate">{k.sub}</div>
            </Link>
          );
        })}
      </div>

      {/* Row 2: Domain Snapshot Cards + Protection Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Domain A: Women Protection */}
        <Card
          className="border-[#C98A87]"
          header={
            <div className="flex items-center justify-between w-full">
              <DomainBadge domain="WOMEN" />
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#DFFFE0] text-[#1F3864] border border-[#16A028] font-bold">
                MVP ACTIVE
              </span>
            </div>
          }
        >
          <div className="grid grid-cols-3 gap-2 text-center mb-2.5">
            <div className="p-2 rounded bg-[#FFE5DE] border border-[#C98A87]">
              <div className="text-base font-bold text-[#7D2A42]">{gaps.filter((g) => g.domain === 'WOMEN').length}</div>
              <div className="text-[10px] text-[#7D2A42] font-medium">Gap Contracts</div>
            </div>
            <div className="p-2 rounded bg-[#FFE5DE] border border-[#C98A87]">
              <div className="text-base font-bold text-[#7D2A42]">6</div>
              <div className="text-[10px] text-[#7D2A42] font-medium">Journey Stages</div>
            </div>
            <div className="p-2 rounded bg-[#FFE5DE] border border-[#C98A87]">
              <div className="text-base font-bold text-[#7D2A42]">2</div>
              <div className="text-[10px] text-[#7D2A42] font-medium">M18 Tokens</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-1.5 text-[11px]">
            <Link to="/women?tab=dv" className="px-2 py-1 rounded bg-white border border-[#C98A87] text-[#7D2A42] font-semibold text-center hover:bg-[#FFE5DE]">
              PWDVA / DV
            </Link>
            <Link to="/women?tab=workplace" className="px-2 py-1 rounded bg-white border border-[#C98A87] text-[#7D2A42] font-semibold text-center hover:bg-[#FFE5DE]">
              POSH
            </Link>
            <Link to="/women?tab=schemes" className="px-2 py-1 rounded bg-white border border-[#C98A87] text-[#7D2A42] font-semibold text-center hover:bg-[#FFE5DE]">
              OSC / Shakti
            </Link>
          </div>
        </Card>

        {/* Domain B: Child Protection */}
        <Card
          className="border-[#EF5A90]"
          header={
            <div className="flex items-center justify-between w-full">
              <DomainBadge domain="CHILD" />
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#E6D0E3] text-[#46296E] border border-[#654161] font-bold">
                AGGREGATE ONLY
              </span>
            </div>
          }
        >
          <div className="grid grid-cols-3 gap-2 text-center mb-2.5">
            <div className="p-2 rounded bg-[#FFC0CB]/45 border border-[#EF5A90]">
              <div className="text-base font-bold text-[#7D2A42]">16</div>
              <div className="text-[10px] text-[#7D2A42] font-medium">C01–C16 Taxon</div>
            </div>
            <div className="p-2 rounded bg-[#FFC0CB]/45 border border-[#EF5A90]">
              <div className="text-base font-bold text-[#7D2A42]">403</div>
              <div className="text-[10px] text-[#7D2A42] font-medium">Write Locked</div>
            </div>
            <div className="p-2 rounded bg-[#FFC0CB]/45 border border-[#EF5A90]">
              <div className="text-base font-bold text-[#7D2A42]">0</div>
              <div className="text-[10px] text-[#7D2A42] font-medium">Live Child PII</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-1.5 text-[11px]">
            <Link to="/child?tab=pocso" className="px-2 py-1 rounded bg-white border border-[#EF5A90] text-[#7D2A42] font-semibold text-center hover:bg-[#FFC0CB]/40">
              POCSO
            </Link>
            <Link to="/child?tab=marriage" className="px-2 py-1 rounded bg-white border border-[#EF5A90] text-[#7D2A42] font-semibold text-center hover:bg-[#FFC0CB]/40">
              Marriage
            </Link>
            <Link to="/child?tab=care" className="px-2 py-1 rounded bg-white border border-[#EF5A90] text-[#7D2A42] font-semibold text-center hover:bg-[#FFC0CB]/40">
              Vatsalya / CCI
            </Link>
          </div>
        </Card>

        {/* Protection Intelligence Pipeline */}
        <Card
          header={
            <div className="flex items-center justify-between w-full">
              <span className="text-sm font-bold text-gov-navy">Intelligence Pipeline</span>
              <span className="text-[10px] font-mono text-slate-600">E2E LOOP</span>
            </div>
          }
        >
          <div className="space-y-2.5">
            {lifecycleStages.map((s) => (
              <Link key={s.stage} to={s.to} className="block group">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-800 group-hover:text-primary">{s.stage}</span>
                  <span className="font-mono font-bold text-slate-700">{s.count} items</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`${s.color} h-full rounded-full`} style={{ width: `${s.pct}%` }} />
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </div>

      {/* Row 3: Live Data Cards (Alerts, Gap KPI Progress, Outcome Verification) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Priority Alerts */}
        <Card
          header={
            <div className="flex items-center justify-between w-full">
              <span className="text-sm font-bold text-gov-navy">Priority Alerts</span>
              <Link to="/alerts" className="text-xs font-semibold text-primary hover:underline">View All →</Link>
            </div>
          }
        >
          <div className="space-y-2">
            {criticalAlerts.slice(0, 3).map((a) => (
              <Link key={a.id} to={a.linkedPath} className="block p-2.5 rounded border border-slate-200 hover:border-primary text-xs">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-bold text-slate-900 truncate">{a.title}</span>
                  <SeverityBadge severity={a.severity} />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-600">
                  <span className="truncate">{a.responsibleRole}</span>
                  <span className="font-mono shrink-0">{a.geography}</span>
                </div>
              </Link>
            ))}
          </div>
        </Card>

        {/* Active Gap Contracts with KPI Target Bar */}
        <Card
          header={
            <div className="flex items-center justify-between w-full">
              <span className="text-sm font-bold text-gov-navy">Active Gap Contracts</span>
              <Link to="/gaps" className="text-xs font-semibold text-primary hover:underline">Explorer →</Link>
            </div>
          }
        >
          <div className="space-y-2">
            {gaps.slice(0, 3).map((g) => (
              <Link
                key={g.id}
                to={`/investigation?gapId=${g.id}`}
                className="block p-2.5 rounded border border-slate-200 hover:border-primary text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono font-bold text-primary">{g.id}</span>
                  <StatusBadge status={g.status} />
                </div>
                <div className="font-semibold text-slate-900 truncate">{g.title}</div>
                <div className="flex items-center justify-between text-[11px] text-slate-600">
                  <span>{g.namedOwnerRole}</span>
                  <span className="font-mono font-semibold">{g.kpiBaseline}% → {g.kpiTarget}%</span>
                </div>
              </Link>
            ))}
          </div>
        </Card>

        {/* Outcomes & 90-Day Verification */}
        <Card
          header={
            <div className="flex items-center justify-between w-full">
              <span className="text-sm font-bold text-gov-navy">Outcome Verification</span>
              <Link to="/outcomes" className="text-xs font-semibold text-primary hover:underline">All Outcomes →</Link>
            </div>
          }
        >
          <div className="space-y-2.5">
            {outcomes.slice(0, 3).map((o) => {
              const pct = Math.min(100, Math.round((o.observedResult / Math.max(1, o.target)) * 100));
              return (
                <Link key={o.id} to="/outcomes" className="block p-2.5 rounded border border-slate-200 hover:border-primary text-xs space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono font-bold text-gov-navy">{o.id}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-green-50 text-green-800 border border-green-200 font-bold">
                      {o.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-600">
                    <span>Baseline {o.baseline}% → Observed <strong className="text-primary">{o.observedResult}%</strong></span>
                    <span className="font-semibold">Target {o.target}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="bg-green-600 h-full rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </Link>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Row 4: Helplines & Schemes | Data & Evidence Inventory | Quick Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Helplines & Schemes */}
        <Card
          header={
            <div className="flex items-center justify-between w-full">
              <span className="text-sm font-bold text-gov-navy">Helplines & Schemes</span>
              <Link to="/schemes?tab=all" className="text-xs font-semibold text-primary hover:underline">All Schemes →</Link>
            </div>
          }
        >
          <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
            {[
              { num: '181', label: 'Women Helpline' },
              { num: '1098', label: 'Child Helpline' },
              { num: '112', label: 'ERSS Emergency' },
              { num: '15100', label: 'NALSA Legal Aid' },
            ].map((h) => (
              <div key={h.num} className="p-2 rounded bg-slate-50 border border-slate-200 flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-primary shrink-0" />
                <div>
                  <div className="font-black text-gov-navy leading-none">{h.num}</div>
                  <div className="text-[10px] text-slate-600 mt-0.5">{h.label}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {governmentSchemes.map((s) => (
              <Link
                key={s.id}
                to="/schemes?tab=all"
                className="text-[11px] px-2 py-1 rounded bg-green-50 text-green-900 border border-green-200 font-semibold hover:bg-green-100"
              >
                {s.name}
              </Link>
            ))}
          </div>
        </Card>

        {/* Data & Evidence Inventory */}
        <Card
          header={
            <div className="flex items-center justify-between w-full">
              <span className="text-sm font-bold text-gov-navy">Data & Evidence Inventory</span>
              <Link to="/knowledge?tab=catalogue" className="text-xs font-semibold text-primary hover:underline">Catalogue →</Link>
            </div>
          }
        >
          <div className="grid grid-cols-2 gap-2.5 text-center">
            <Link to="/knowledge?tab=catalogue" className="p-3 rounded bg-slate-50 border border-slate-200 hover:border-primary">
              <div className="text-xl font-extrabold text-gov-navy">{datasets.length}</div>
              <div className="text-[11px] text-slate-600 font-medium">Official GoI Datasets</div>
            </Link>
            <Link to="/evidence" className="p-3 rounded bg-slate-50 border border-slate-200 hover:border-primary">
              <div className="text-xl font-extrabold text-primary">{evidence.length}</div>
              <div className="text-[11px] text-slate-600 font-medium">Indexed Evidence</div>
            </Link>
            <Link to="/evidence" className="p-3 rounded bg-green-50 border border-green-200 hover:border-green-400">
              <div className="text-xl font-extrabold text-green-800">{verifiedFacts}</div>
              <div className="text-[11px] text-green-900 font-medium">Verified Facts</div>
            </Link>
            <Link to="/knowledge-assistant" className="p-3 rounded bg-indigo-50 border border-indigo-200 hover:border-indigo-400">
              <div className="text-xl font-extrabold text-indigo-800">0.0</div>
              <div className="text-[11px] text-indigo-900 font-medium">AI Temp (Bounded)</div>
            </Link>
          </div>
        </Card>

        {/* Quick Module Launchpad */}
        <Card header={<span className="text-sm font-bold text-gov-navy">Platform Modules</span>}>
          <div className="grid grid-cols-2 gap-2">
            {quickModules.map((m) => {
              const Icon = m.icon;
              return (
                <Link
                  key={m.label}
                  to={m.to}
                  className="p-2 rounded border border-slate-200 bg-white hover:border-primary hover:bg-blue-50/40 flex items-center gap-2 text-xs font-semibold text-slate-800 transition-colors"
                >
                  <Icon className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span className="truncate">{m.label}</span>
                </Link>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
