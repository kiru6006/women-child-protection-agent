import { NavLink } from 'react-router-dom';
import {
  AlertCircle,
  FolderSearch,
  SearchCode,
  FileText,
  Workflow,
  CheckSquare,
  Bot,
  History,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar, activeDomain } = useAppStore();

  const navItems = [
    {
      to: '/',
      label: 'Attention Centre',
      icon: AlertCircle,
      badge: 'Action Due',
      badgeColor: 'bg-rose-950 text-rose-300 border border-rose-800',
    },
    {
      to: '/women-workspace',
      label: 'Women Protection',
      icon: ShieldCheck,
      badge: 'Domain A',
      badgeColor: 'bg-pink-950 text-pink-300 border border-pink-800',
    },
    {
      to: '/gaps',
      label: 'Gap Explorer',
      icon: FolderSearch,
      badge: '11 Taxonomy',
    },
    {
      to: '/investigation',
      label: 'Investigation Workspace',
      icon: SearchCode,
      badge: 'Primary UI',
      badgeColor: 'bg-pink-800/80 text-white border border-pink-600',
    },
    {
      to: '/evidence',
      label: 'Evidence Library',
      icon: FileText,
      badge: 'Epistemic',
    },
    {
      to: '/interventions',
      label: 'Intervention Workspace',
      icon: Workflow,
    },
    {
      to: '/outcomes',
      label: 'Outcome Verification',
      icon: CheckSquare,
    },
    {
      to: '/knowledge-assistant',
      label: 'Statutory Assistant',
      icon: Bot,
      badge: 'RAG',
    },
    {
      to: '/audit',
      label: 'Audit & Explainability',
      icon: History,
      badge: 'WORM',
    },
    {
      to: '/child-protection',
      label: 'Child Protection',
      icon: ShieldAlert,
      badge: 'Phase 2',
      badgeColor: 'bg-slate-800 text-slate-300',
    },
  ];

  return (
    <aside
      className={cn(
        'bg-slate-950 text-slate-300 border-r border-gov-pink-950/70 transition-all duration-200 flex flex-col justify-between shrink-0',
        sidebarCollapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="py-4 flex flex-col gap-1">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-pink-300 flex items-center justify-between">
          {!sidebarCollapsed && <span>GovTech Command Navigation</span>}
          <button
            onClick={toggleSidebar}
            className="p-1 rounded hover:bg-gov-pink-950 text-pink-400 hover:text-pink-200"
            title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        <nav className="space-y-0.5 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-colors group',
                    isActive
                      ? 'bg-gradient-to-r from-pink-700 to-rose-700 text-white shadow-xs font-semibold'
                      : 'text-slate-300 hover:bg-gov-pink-950/60 hover:text-pink-100'
                  )
                }
                title={sidebarCollapsed ? item.label : undefined}
              >
                <Icon className="w-4 h-4 shrink-0 text-pink-400 group-hover:text-pink-200" />
                {!sidebarCollapsed && (
                  <div className="flex-1 flex items-center justify-between overflow-hidden">
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span
                        className={cn(
                          'text-[10px] px-1.5 py-0.2 rounded font-mono',
                          item.badgeColor || 'bg-gov-pink-950/80 text-pink-300 border border-pink-900'
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      {!sidebarCollapsed && (
        <div className="p-3 border-t border-gov-pink-950 text-[11px] text-pink-200 bg-gov-pink-950/40">
          <div className="flex items-center justify-between mb-1">
            <span>Domain Scope:</span>
            <span className="font-semibold text-white">{activeDomain}</span>
          </div>
          <p className="text-[10px] text-pink-300/70 leading-tight">
            Compliance: DPDP Act 2023, PWDVA 2005, JJ Act 2015.
          </p>
        </div>
      )}
    </aside>
  );
}
