import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ShieldCheck,
  Bot,
  SearchCode,
  Building2,
  BookOpen,
  Lock,
  ChevronDown,
  ChevronRight,
  Network,
  Wallet,
  Award,
  Users,
  Scale,
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
      { label: '19-Step E2E Demo', to: '/demo-flow' },
      { label: 'My Work (Daily Inbox)', to: '/my-work' },
      { label: 'Government Command Centre', to: '/command-centre' },
      { label: 'Alerts & Notifications', to: '/alerts' },
      { label: 'Minister Overview', to: '/dashboards?role=MINISTER' },
      { label: 'Secretary Overview', to: '/dashboards?role=SECRETARY' },
      { label: 'Collector & Role Views', to: '/dashboards?role=COLLECTOR' },
    ],
  },
  {
    id: 'protection',
    label: 'Protection Intelligence',
    icon: ShieldCheck,
    accent: 'text-[#7D2A42]',
    statusTag: 'MVP',
    items: [
      { label: 'Women Protection (Domain A)', to: '/women?tab=overview' },
      { label: 'Child Protection (Read-Only)', to: '/child?tab=overview' },
      { label: 'Attention Centre (Collector)', to: '/attention' },
      { label: 'Schemes & Services', to: '/schemes?tab=all' },
      { label: 'Geographic Intelligence', to: '/geography?tab=india' },
    ],
  },
  {
    id: 'matter',
    label: 'Matter & Action Management',
    icon: SearchCode,
    accent: 'text-[#7D2A42]',
    statusTag: '360°',
    items: [
      { label: 'Matter 360°', to: '/matter-360' },
      { label: 'Problem Decomposition', to: '/decompose' },
      { label: 'Investigation Workspace', to: '/investigation' },
      { label: 'Gap Contracts', to: '/gaps' },
      { label: 'Intervention Management', to: '/interventions' },
      { label: 'Outcome Verification', to: '/outcomes' },
    ],
  },
  {
    id: 'police_legal',
    label: 'Police & Legal Coordination',
    icon: Scale,
    accent: 'text-[#1F3864]',
    statusTag: 'Demo',
    items: [
      { label: 'Police Coordination', to: '/matter-360?tab=police' },
      { label: 'Litigation & Court Orders', to: '/matter-360?tab=litigation' },
      { label: 'Legal Aid (DLSA)', to: '/dashboards?role=LEGAL' },
    ],
  },
  {
    id: 'convergence',
    label: 'Government Convergence',
    icon: Network,
    accent: 'text-[#EF5A90]',
    statusTag: 'Demo',
    items: [
      { label: 'Department Connectivity', to: '/convergence' },
      { label: 'Dependency 360°', to: '/dependencies' },
      { label: 'Responsibility Matrix (RACI)', to: '/ownership' },
    ],
  },
  {
    id: 'finance',
    label: 'Finance & Resources',
    icon: Wallet,
    accent: 'text-[#16A028]',
    statusTag: 'Demo',
    items: [
      { label: 'Financial Command Centre', to: '/finance' },
      { label: 'Finance Dashboard', to: '/dashboards?role=FINANCE' },
    ],
  },
  {
    id: 'ngo',
    label: 'NGO & Community',
    icon: Users,
    accent: 'text-[#167F80]',
    statusTag: 'Demo',
    items: [
      { label: 'NGO & Local Body Registry', to: '/ngo-community' },
      { label: 'NGO Partner Dashboard', to: '/dashboards?role=NGO' },
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
      { label: 'Knowledge Assistant (RAG)', to: '/knowledge-assistant' },
    ],
  },
  {
    id: 'ecosystem',
    label: 'Government Ecosystem',
    icon: Building2,
    items: [
      { label: 'Officials & Hierarchy', to: '/ecosystem?tab=officials' },
      { label: 'Contact & Helplines', to: '/ecosystem?tab=helplines' },
    ],
  },
  {
    id: 'excellence',
    label: 'Governance Excellence',
    icon: Award,
    accent: 'text-[#EF5A90]',
    items: [
      { label: 'Best Practices & Recognition', to: '/excellence' },
    ],
  },
  {
    id: 'knowledge',
    label: 'Knowledge & Data',
    icon: BookOpen,
    items: [
      { label: 'Evidence Library', to: '/evidence' },
      { label: 'Government Data Catalogue', to: '/knowledge?tab=catalogue' },
      { label: 'Laws, Policies & Budgets', to: '/knowledge?tab=laws' },
    ],
  },
  {
    id: 'admin',
    label: 'Administration',
    icon: Lock,
    items: [
      { label: 'Audit History (WORM)', to: '/audit' },
      { label: 'Governance & Security', to: '/governance?tab=explainability' },
    ],
  },
];

export function Sidebar() {
  const { sidebarCollapsed, mobileNavOpen, setMobileNavOpen } = useAppStore();
  const location = useLocation();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    overview: true,
    protection: true,
    matter: true,
    convergence: true,
  });

  const toggleGroup = (id: string) => {
    setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const currentFull = `${location.pathname}${location.search}`;

  return (
    <>
      {mobileNavOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-30 md:hidden"
          onClick={() => setMobileNavOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        aria-label="Primary Navigation"
        className={cn(
          'bg-white border-r border-[#E5B8B7] flex flex-col shrink-0 transition-all duration-200 z-40',
          'fixed md:static inset-y-0 left-0 top-14 md:top-0 h-[calc(100vh-3.5rem)] md:h-auto',
          mobileNavOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
          sidebarCollapsed ? 'w-16' : 'w-64'
        )}
      >
        <div className="flex-1 overflow-y-auto py-2 px-2 space-y-1">
          {NAV_GROUPS.map((group) => {
            const Icon = group.icon;
            const isOpen = !!openGroups[group.id];
            return (
              <div key={group.id} className="border-b border-slate-100 pb-1 last:border-b-0">
                <button
                  type="button"
                  onClick={() => (sidebarCollapsed ? undefined : toggleGroup(group.id))}
                  title={group.label}
                  className="w-full flex items-center justify-between px-2 py-1.5 rounded text-xs font-bold text-[#64748B] hover:bg-[#FFE5DE]/40 transition-colors"
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
          <div className="p-2.5 border-t border-[#E5B8B7] bg-[#FFE5DE]/20 text-[10px] text-slate-600">
            <div className="font-semibold text-[#7D2A42]">Zero-PII • Human-in-Loop</div>
            <div>12-Group Governance Nav</div>
          </div>
        )}
      </aside>
    </>
  );
}
