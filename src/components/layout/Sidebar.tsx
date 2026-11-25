import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ShieldCheck,
  ShieldAlert,
  Bot,
  SearchCode,
  MapPin,
  Building2,
  Landmark,
  BookOpen,
  Lock,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { cn } from '@/lib/utils';

interface NavGroup {
  id: string;
  label: string;
  icon: any;
  accent?: string;
  statusTag?: string;
  items: { label: string; to: string }[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    id: 'overview',
    label: 'Overview',
    icon: LayoutDashboard,
    statusTag: 'Live',
    items: [
      { label: 'Home Hub', to: '/' },
      { label: 'Government Command Centre', to: '/command-centre' },
      { label: 'Attention Centre (Collector)', to: '/attention' },
      { label: 'Alerts & Notifications', to: '/alerts' },
      { label: 'National Situation Overview', to: '/geography?tab=india' },
    ],
  },
  {
    id: 'women',
    label: 'Women Protection',
    icon: ShieldCheck,
    accent: 'text-[#7D2A42]',
    statusTag: 'MVP',
    items: [
      { label: 'Women Intelligence Overview', to: '/women?tab=overview' },
      { label: 'Crime & Violence', to: '/women?tab=crime' },
      { label: 'Domestic Violence', to: '/women?tab=dv' },
      { label: 'Sexual Harassment & Exploitation', to: '/women?tab=harassment' },
      { label: 'Workplace Protection', to: '/women?tab=workplace' },
      { label: 'Cyber & Digital Safety', to: '/women?tab=cyber' },
      { label: 'Health & Nutrition', to: '/women?tab=health' },
      { label: 'Economic Empowerment', to: '/women?tab=economic' },
      { label: 'Schemes & Support Services', to: '/women?tab=schemes' },
      { label: 'Rehabilitation & Welfare', to: '/women?tab=rehab' },
    ],
  },
  {
    id: 'child',
    label: 'Child Protection',
    icon: ShieldAlert,
    accent: 'text-[#EF5A90]',
    statusTag: 'Read-Only',
    items: [
      { label: 'Child Intelligence Overview', to: '/child?tab=overview' },
      { label: 'Child Abuse & Neglect', to: '/child?tab=abuse' },
      { label: 'POCSO Intelligence', to: '/child?tab=pocso' },
      { label: 'Missing Children', to: '/child?tab=missing' },
      { label: 'Child Marriage', to: '/child?tab=marriage' },
      { label: 'Child Labour & Trafficking', to: '/child?tab=labour' },
      { label: 'Education & School Dropout', to: '/child?tab=education' },
      { label: 'Health & Nutrition', to: '/child?tab=health' },
      { label: 'Digital Child Safety', to: '/child?tab=digital' },
      { label: 'Institutional & Family Care', to: '/child?tab=care' },
      { label: 'Rehabilitation & Aftercare', to: '/child?tab=aftercare' },
    ],
  },
  {
    id: 'ai',
    label: 'AI Intelligence',
    icon: Bot,
    accent: 'text-[#46296E]',
    statusTag: 'Bounded',
    items: [
      { label: 'AI Intelligence Centre', to: '/ai-intelligence?tab=centre' },
      { label: 'Emerging Issue Detection', to: '/ai-intelligence?tab=emerging' },
      { label: 'Gap Detection', to: '/ai-intelligence?tab=gaps' },
      { label: 'Evidence Analysis', to: '/ai-intelligence?tab=evidence' },
      { label: 'Root-Cause Investigation', to: '/ai-intelligence?tab=root-cause' },
      { label: 'Scheme Effectiveness', to: '/ai-intelligence?tab=schemes' },
      { label: 'Capacity & Resources', to: '/ai-intelligence?tab=capacity' },
      { label: 'Government Convergence', to: '/ai-intelligence?tab=convergence' },
      { label: 'Intervention Recommendations', to: '/ai-intelligence?tab=interventions' },
      { label: 'AI Knowledge Assistant', to: '/knowledge-assistant' },
    ],
  },
  {
    id: 'action',
    label: 'Investigation & Action',
    icon: SearchCode,
    accent: 'text-[#7D2A42]',
    statusTag: 'MVP',
    items: [
      { label: 'Gap Explorer & Contracts', to: '/gaps' },
      { label: 'Investigation Workspace', to: '/investigation' },
      { label: 'Intervention Management', to: '/interventions' },
      { label: 'Departmental Dependencies', to: '/interventions?tab=dependencies' },
      { label: 'Pending Government Actions', to: '/interventions?tab=pending' },
      { label: 'Outcome Verification', to: '/outcomes' },
      { label: 'Decision Briefs', to: '/interventions?tab=briefs' },
    ],
  },
  {
    id: 'geography',
    label: 'Geographic Intelligence',
    icon: MapPin,
    items: [
      { label: 'India Overview', to: '/geography?tab=india' },
      { label: 'State Intelligence', to: '/geography?tab=state' },
      { label: 'District Intelligence', to: '/geography?tab=district' },
      { label: 'Service Coverage', to: '/geography?tab=coverage' },
      { label: 'Capacity Gaps', to: '/geography?tab=capacity' },
      { label: 'Regional Comparisons', to: '/geography?tab=comparisons' },
    ],
  },
  {
    id: 'ecosystem',
    label: 'Government Ecosystem',
    icon: Building2,
    items: [
      { label: 'Ministry Overview', to: '/ecosystem?tab=ministry' },
      { label: 'Government Officials', to: '/ecosystem?tab=officials' },
      { label: 'Organisation Hierarchy', to: '/ecosystem?tab=hierarchy' },
      { label: 'Departments & Institutions', to: '/ecosystem?tab=departments' },
      { label: 'State WCD & District Authorities', to: '/ecosystem?tab=authorities' },
      { label: 'Contact Directory', to: '/ecosystem?tab=contacts' },
      { label: 'Helplines & Emergency', to: '/ecosystem?tab=helplines' },
      { label: 'Responsibility Matrix', to: '/ecosystem?tab=matrix' },
    ],
  },
  {
    id: 'schemes',
    label: 'Schemes & Services',
    icon: Landmark,
    items: [
      { label: 'All Government Schemes', to: '/schemes?tab=all' },
      { label: 'Mission Shakti & OSCs', to: '/schemes?tab=shakti' },
      { label: 'Mission Vatsalya & CCIs', to: '/schemes?tab=vatsalya' },
      { label: 'Saksham Anganwadi & POSHAN', to: '/schemes?tab=poshan' },
      { label: 'Legal Aid & Financial Support', to: '/schemes?tab=legal' },
      { label: 'Service Availability', to: '/schemes?tab=availability' },
    ],
  },
  {
    id: 'knowledge',
    label: 'Knowledge & Data',
    icon: BookOpen,
    items: [
      { label: 'Government Data Catalogue', to: '/knowledge?tab=catalogue' },
      { label: 'Evidence Library', to: '/evidence' },
      { label: 'Laws, Rules & Orders', to: '/knowledge?tab=laws' },
      { label: 'Policies & Guidelines', to: '/knowledge?tab=policies' },
      { label: 'Reports & Parliament', to: '/knowledge?tab=reports' },
      { label: 'Budget & Expenditure', to: '/knowledge?tab=budget' },
    ],
  },
  {
    id: 'governance',
    label: 'Governance & Admin',
    icon: Lock,
    items: [
      { label: 'AI Explainability & Quality', to: '/governance?tab=explainability' },
      { label: 'Source Verification & Security', to: '/governance?tab=security' },
      { label: 'Audit History (WORM)', to: '/audit' },
      { label: 'User & System Config', to: '/governance?tab=config' },
    ],
  },
];

export function Sidebar() {
  const { sidebarCollapsed, mobileNavOpen, setMobileNavOpen } = useAppStore();
  const location = useLocation();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    overview: true,
    women: true,
    action: true,
  });

  const toggleGroup = (id: string) => {
    setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const currentFull = `${location.pathname}${location.search}`;

  return (
    <>
      {mobileNavOpen && (
        <div
          className="fixed inset-0 bg-slate-950/50 z-40 md:hidden"
          onClick={() => setMobileNavOpen(false)}
          aria-hidden="true"
        />
      )}
      <aside
        aria-label="Primary platform navigation"
        className={cn(
          'bg-white text-slate-800 border-r border-slate-200 transition-all duration-200 flex flex-col justify-between shrink-0 overflow-y-auto',
          'fixed inset-y-0 left-0 z-50 md:static md:translate-x-0',
          mobileNavOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
          sidebarCollapsed ? 'md:w-14 w-64' : 'w-64'
        )}
      >
        <div className="py-3 px-2 space-y-1">
          {NAV_GROUPS.map((group) => {
            const Icon = group.icon;
            const isOpen = !!openGroups[group.id];
            return (
              <div key={group.id} className="border-b border-slate-100 pb-1 last:border-b-0">
                <button
                  type="button"
                  onClick={() => (sidebarCollapsed ? undefined : toggleGroup(group.id))}
                  title={group.label}
                  className="w-full flex items-center justify-between px-2 py-1.5 rounded text-xs font-bold text-[#64748B] hover:bg-[#F1F5F9] transition-colors"
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <Icon className={cn('w-4 h-4 shrink-0', group.accent || 'text-gov-navy')} />
                    {!sidebarCollapsed && <span className="truncate">{group.label}</span>}
                  </span>
                  {!sidebarCollapsed && (
                    <span className="flex items-center gap-1 shrink-0">
                      {group.statusTag && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#FFE5DE]/70 text-[#7D2A42] border border-[#E5B8B7] font-mono">
                          {group.statusTag}
                        </span>
                      )}
                      {isOpen ? (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      )}
                    </span>
                  )}
                </button>

                {!sidebarCollapsed && isOpen && (
                  <div className="mt-0.5 pl-6 pr-1 space-y-0.5">
                    {group.items.map((item) => {
                      const active = currentFull === item.to || (item.to === '/' && location.pathname === '/');
                      return (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          onClick={() => setMobileNavOpen(false)}
                          className={cn(
                            'block px-2 py-1 rounded text-[11px] transition-colors truncate',
                            active
                              ? 'bg-[#FFE5DE]/80 text-[#7D2A42] border-l-2 border-[#EF5A90] font-semibold'
                              : 'text-slate-600 hover:bg-[#FFE5DE]/40 hover:text-[#7D2A42]'
                          )}
                        >
                          {item.label}
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {!sidebarCollapsed && (
          <div className="p-3 border-t border-slate-200 bg-slate-50 text-[10px] text-slate-500">
            <div className="font-semibold text-gov-navy mb-0.5">MoWCD Operations Portal</div>
            <div>DPDP 2023 • PWDVA • JJ Act • POCSO</div>
          </div>
        )}
      </aside>
    </>
  );
}
