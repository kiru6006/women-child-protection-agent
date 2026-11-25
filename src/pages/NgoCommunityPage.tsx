import { useState } from 'react';
import { Card } from '@/components/common/Card';
import { PageHeader } from '@/components/common/PageHeader';
import { useGovernanceStore } from '@/store/governanceStore';
import { Building2, Users, ShieldCheck } from 'lucide-react';

export function NgoCommunityPage() {
  const { ngos, activities } = useGovernanceStore();
  const [tab, setTab] = useState<'ngos' | 'activities' | 'local'>('ngos');
  const [activityEv, setActivityEv] = useState<Record<string, string>>({});
  const [verifiedMap, setVerifiedMap] = useState<Record<string, string>>({});

  return (
    <div className="space-y-4">
      <PageHeader
        breadcrumb={['NGO & Community Collaboration', 'Partners & Activities']}
        title="NGO, Local Body & Community Collaboration"
        purpose="Purpose-limited registry of empaneled NGOs, Panchayats, Anganwadis, and SHGs. Sensitive victim/child data is never automatically shared; volunteers hold zero statutory decision authority."
        badge={`${ngos.length} Partners • ${activities.length} Approved Activities`}
        source="Empanelment & Local Body Registry (Synthetic)"
        classification="SYNTHETIC"
      />

      <div className="flex flex-wrap gap-1.5">
        {[
          { id: 'ngos', label: 'Empaneled NGO Registry', icon: Building2 },
          { id: 'activities', label: 'Approved Support Activities', icon: ShieldCheck },
          { id: 'local', label: 'Panchayats, AWCs & SHGs', icon: Users },
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id as any)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold border ${
                tab === t.id ? 'bg-[#7D2A42] text-white border-[#7D2A42]' : 'bg-white text-slate-700 border-[#E5B8B7] hover:bg-[#FFE5DE]/40'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {tab === 'ngos' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ngos.map((n) => (
            <Card key={n.id}>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <strong className="text-sm text-[#1F3864]">{n.name}</strong>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${
                    n.empanelmentStatus === 'EMPANELLED' ? 'bg-[#DFFFE0] text-[#166534] border-[#16A028]' : 'bg-[#FFFACD] text-[#7D2A42] border-[#C98A87]'
                  }`}>
                    {n.empanelmentStatus}
                  </span>
                </div>
                <div className="text-[11px] text-slate-600">{n.category} • {n.geography} • Reg: <span className="font-mono">{n.registrationId}</span></div>
                <div className="flex flex-wrap gap-1">
                  {n.capabilities.map((cap) => (
                    <span key={cap} className="text-[10px] px-2 py-0.5 rounded bg-[#FFE5DE] text-[#7D2A42] border border-[#C98A87] font-medium">
                      {cap}
                    </span>
                  ))}
                </div>
                <div className="p-2 rounded bg-slate-50 border border-slate-200 text-[11px] text-slate-700">
                  <strong>Purpose-Limited Access:</strong> {n.purposeLimitNote}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === 'activities' && (
        <div className="space-y-3">
          {activities.map((a) => (
            <Card key={a.id}>
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div>
                  <span className="font-mono font-bold text-[#7D2A42] mr-2">{a.id}</span>
                  <strong className="text-sm text-[#1F3864]">{a.title}</strong>
                  <div className="text-[11px] text-slate-600 mt-0.5">
                    {a.organisation} • Authority: {a.authority} • Geography: {a.geography}
                  </div>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${
                  (verifiedMap[a.id] || a.verificationStatus) === 'VERIFIED' ? 'bg-[#DFFFE0] text-[#166534] border-[#16A028]' : 'bg-[#FFE5DE] text-[#7D2A42] border-[#C98A87]'
                }`}>
                  {verifiedMap[a.id] || a.verificationStatus}
                </span>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-100 flex flex-wrap gap-4 text-[11px] text-slate-700">
                <span><strong>Target:</strong> {a.targetGroup}</span>
                <span><strong>Funding:</strong> ₹{a.approvedFundingInr.toLocaleString()}</span>
                <span><strong>Expected Outcome:</strong> {a.expectedOutcome}</span>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <input
                  placeholder="Submit delivery evidence ref (no PII)..."
                  value={activityEv[a.id] || ''}
                  onChange={(e) => setActivityEv((p) => ({ ...p, [a.id]: e.target.value }))}
                  className="flex-1 min-w-[180px] border border-[#C98A87] rounded px-2 py-1 text-xs"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!activityEv[a.id]?.trim()) return;
                    setVerifiedMap((p) => ({ ...p, [a.id]: 'VERIFIED' }));
                  }}
                  className="px-2.5 py-1 rounded bg-[#16A028] text-white font-semibold text-[11px]"
                >
                  Submit Delivery Evidence
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === 'local' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <Card header={<strong className="text-[#1F3864]">Gram Panchayats & Urban Wards</strong>}>
            <p className="text-slate-700">24 Gram Panchayats hosting legal awareness camps, 181/1098/15100 signage, and scheme accessibility audits (DEMO-07).</p>
          </Card>
          <Card header={<strong className="text-[#1F3864]">Anganwadi Centres & Schools</strong>}>
            <p className="text-slate-700">110 AWCs & block schools tracking aggregate nutrition/dropout access gaps without citizen surveillance.</p>
          </Card>
          <Card header={<strong className="text-[#1F3864]">Authorised SHGs & Volunteers</strong>}>
            <p className="text-slate-700">Jeevika SHG livelihood linkage & awareness outreach only; zero statutory protection decision authority.</p>
          </Card>
        </div>
      )}
    </div>
  );
}
