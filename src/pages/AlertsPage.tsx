import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/common/Card';
import { PageHeader } from '@/components/common/PageHeader';
import { SeverityBadge } from '@/components/badges/SeverityBadge';
import { useAppStore } from '@/store/appStore';
import { useDemoStore } from '@/store/demoStore';
import { AlertItem } from '@/data/platformData';
import { Bell } from 'lucide-react';
import { NotifItem, SEED_NOTIFICATIONS } from '@/data/workflowSeedData';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

const LIFECYCLE: AlertItem['status'][] = [
  'NEW',
  'ACKNOWLEDGED',
  'ASSIGNED',
  'UNDER_REVIEW',
  'ACTION_REQUIRED',
  'RESOLVED',
  'REJECTED',
];

export function AlertsPage() {
  const { currentRole } = useAppStore();
  const { alerts, updateAlertStatus } = useDemoStore();
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [notifs, setNotifs] = useState<NotifItem[]>(SEED_NOTIFICATIONS);

  useEffect(() => {
    fetch(`${API_BASE}/notifications`, { signal: AbortSignal.timeout(1200) })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setNotifs(data);
      })
      .catch(() => {});
  }, []);

  const categories = Array.from(new Set(alerts.map((a) => a.category)));

  const filtered = alerts.filter((a) => {
    const mSev = severityFilter === 'ALL' || a.severity === severityFilter;
    const mCat = categoryFilter === 'ALL' || a.category === categoryFilter;
    const mStat = statusFilter === 'ALL' || a.status === statusFilter;
    return mSev && mCat && mStat;
  });

  return (
    <div className="space-y-5">
      <PageHeader
        breadcrumb={['Overview', 'Alerts & Notifications']}
        title="Alerts & Notification Centre"
        purpose="Actionable, deduplicated operational, service, capacity, data-quality, and AI candidate alerts. Identifiable survivor or child details are never exposed in alerts."
        badge={`${alerts.length} Total Alerts`}
        source="Sentinel SLA Monitor + Data Quality + AI Candidate Queue"
        reportingPeriod="Real-Time Demo Queue"
        classification="SYNTHETIC"
      />

      <Card className="p-3 bg-white">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <select value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)} className="border border-slate-200 rounded p-2">
            <option value="ALL">All Severities</option>
            {['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFORMATIONAL'].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="border border-slate-200 rounded p-2">
            <option value="ALL">All Alert Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border border-slate-200 rounded p-2">
            <option value="ALL">All Lifecycle States</option>
            {LIFECYCLE.map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>
      </Card>

      <Card
        header={
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-bold text-[#1F3864] flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-[#EF5A90]" /> Deduplicated Notifications ({notifs.length})
            </span>
            <span className="text-[10px] font-mono text-[#7D2A42]">Anti-Flooding Active</span>
          </div>
        }
      >
        <div className="space-y-1.5 text-xs">
          {notifs.slice(0, 4).map((n) => (
            <div key={n.id} className="p-2 rounded border border-[#E5B8B7] bg-white flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="font-mono font-bold text-[#7D2A42] mr-2">{n.event_type}</span>
                <span className="text-slate-800">{n.message}</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FFE5DE] text-[#7D2A42] border border-[#C98A87]">
                {n.target_role}
              </span>
            </div>
          ))}
        </div>
      </Card>

      <div className="space-y-3">
        {filtered.map((alert) => (
          <Card key={alert.id} className="hover:border-slate-300">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-gov-navy">{alert.id}</span>
                  <SeverityBadge severity={alert.severity === 'INFORMATIONAL' ? 'LOW' : alert.severity} />
                  <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">{alert.category}</span>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-blue-50 text-blue-800 font-mono">{alert.status}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">{alert.title}</h3>
                <p className="text-xs text-slate-600">{alert.reason}</p>
                <div className="text-[11px] text-slate-500">
                  <strong>Owner:</strong> {alert.responsibleRole} • <strong>Geography:</strong> {alert.geography} • <strong>Source:</strong> {alert.source}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <select
                  aria-label={`Change status for ${alert.id}`}
                  value={alert.status}
                  onChange={(e) => updateAlertStatus(alert.id, e.target.value as AlertItem['status'], currentRole)}
                  className="text-xs border border-slate-300 rounded px-2 py-1.5 bg-white"
                >
                  {LIFECYCLE.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
                <Link
                  to={alert.linkedPath}
                  className="text-xs px-3 py-1.5 rounded bg-gov-navy text-white font-semibold hover:bg-slate-800"
                >
                  Inspect Record →
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
