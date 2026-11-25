import { Link, useSearchParams } from 'react-router-dom';
import { Card } from '@/components/common/Card';
import { PageHeader } from '@/components/common/PageHeader';
import { useAppStore } from '@/store/appStore';

const GOV_TABS = [
  { id: 'explainability', label: 'AI Explainability & Quality' },
  { id: 'security', label: 'Security & Privacy' },
  { id: 'config', label: 'User & System Config' },
];

export function GovernancePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'explainability';
  const { currentRole, usingMockFallback } = useAppStore();

  return (
    <div className="space-y-5">
      <PageHeader
        breadcrumb={['Governance & Admin', GOV_TABS.find((t) => t.id === activeTab)?.label || 'Governance']}
        title="Governance, AI Explainability & Security Administration"
        purpose="Auditability, source verification, DPDP Act 2023 safeguards, role-based access controls, and system configuration."
        source="Platform Governance Engine"
        reportingPeriod="Live Session"
        classification="OFFICIAL_PUBLIC"
      />

      <div className="flex flex-wrap gap-2">
        {GOV_TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setSearchParams({ tab: t.id })}
            className={`px-3 py-1.5 rounded text-xs font-semibold border ${
              activeTab === t.id ? 'bg-gov-navy text-white border-gov-navy' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {t.label}
          </button>
        ))}
        <Link to="/audit" className="px-3 py-1.5 rounded text-xs font-semibold border border-emerald-300 bg-emerald-50 text-emerald-900">
          Open WORM Audit Ledger →
        </Link>
      </div>

      <Card header={<span className="text-sm font-bold text-gov-navy">Active Controls & Compliance Status</span>}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded border border-slate-200 bg-slate-50">
            <strong>AI Temperature & Fallback:</strong> Locked to <code>0.0</code>; unsupported queries return <code>DATA NOT AVAILABLE</code>.
          </div>
          <div className="p-3 rounded border border-slate-200 bg-slate-50">
            <strong>Zero-PII Enforcement:</strong> Client & server regex guards block Aadhaar, phone numbers, and emails (`422`).
          </div>
          <div className="p-3 rounded border border-slate-200 bg-slate-50">
            <strong>Active Role Context:</strong> <code>{currentRole}</code> (Domain B writes locked `403` in MVP).
          </div>
          <div className="p-3 rounded border border-slate-200 bg-slate-50">
            <strong>Data Mode:</strong> {usingMockFallback ? 'Synthetic Demo Store (Client)' : 'Connected FastAPI + SQLite/PostgreSQL'}.
          </div>
        </div>
      </Card>
    </div>
  );
}
