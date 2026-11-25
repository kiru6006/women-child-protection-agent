import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Card } from '@/components/common/Card';
import { PageHeader } from '@/components/common/PageHeader';
import { DomainBadge } from '@/components/badges/DomainBadge';
import { SeverityBadge } from '@/components/badges/SeverityBadge';
import { IndependentStatusChip } from '@/components/badges/IndependentStatusChip';
import { useGovernanceStore } from '@/store/governanceStore';
import { MatterStatus } from '@/types/governance';
import { Shield, Scale, HeartHandshake, Wallet, Users, CheckCircle2, Bot, ArrowRight } from 'lucide-react';

const MATTER_SECTIONS = [
  { id: 'overview', label: 'A. Overview & 7 Statuses', icon: Shield },
  { id: 'police', label: 'B. Police Coordination', icon: Shield },
  { id: 'litigation', label: 'C. Litigation & Court Orders', icon: Scale },
  { id: 'welfare', label: 'D. Welfare & Services', icon: HeartHandshake },
  { id: 'finance', label: 'E. Financial Coordination', icon: Wallet },
  { id: 'ownership', label: 'F–G. Ownership & NGO', icon: Users },
  { id: 'outcome', label: 'H. Outcome & AI', icon: CheckCircle2 },
];

export function Matter360Page() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { matters, dependencies, updateMatterStatus } = useGovernanceStore();

  const selectedId = searchParams.get('id') || matters[0].id;
  const activeTab = searchParams.get('tab') || 'overview';
  const matter = matters.find((m) => m.id === selectedId) || matters[0];
  const linkedDeps = dependencies.filter((d) => d.matterId === matter.id);
  const [domainFilter, setDomainFilter] = useState<'ALL' | 'WOMEN' | 'CHILD'>('ALL');

  const visibleMatters = matters.filter((m) => domainFilter === 'ALL' || m.domain === domainFilter);

  return (
    <div className="space-y-4">
      <PageHeader
        breadcrumb={['Matter & Action Management', 'Matter 360°']}
        title={`Matter 360° — ${matter.demoCode} (${matter.id})`}
        purpose="Unified permission-controlled coordination workspace spanning Overview, Police, Litigation, Court Compliance, Welfare, Finance, Ownership, NGO, and Outcome."
        badge="SYNTHETIC DEMONSTRATION"
        source="DEMO-01..DEMO-10 Governance Scenarios"
        classification="SYNTHETIC"
        actions={
          <div className="flex items-center gap-2">
            <DomainBadge domain={matter.domain} />
            <SeverityBadge severity={matter.severity} />
          </div>
        }
      />

      {/* Matter Register Strip */}
      <Card className="p-0">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-[#1F3864]">Select Matter / Demo:</span>
            <select
              aria-label="Filter matters by domain"
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value as any)}
              className="border border-[#C98A87] rounded px-2 py-1 text-xs bg-white"
            >
              <option value="ALL">All ({matters.length})</option>
              <option value="WOMEN">Women (Domain A)</option>
              <option value="CHILD">Child Aggregate (Domain B)</option>
            </select>
          </div>
          <select
            aria-label="Update Matter Status"
            value={matter.matterStatus}
            onChange={(e) => updateMatterStatus(matter.id, e.target.value as MatterStatus)}
            className="border border-[#C98A87] rounded px-2 py-1 text-xs font-semibold text-[#7D2A42] bg-[#FFE5DE]/40"
          >
            {(['OPEN', 'UNDER_REVIEW', 'ACTIVE', 'BLOCKED', 'RESOLVED', 'CLOSED', 'REOPENED'] as MatterStatus[]).map((st) => (
              <option key={st} value={st}>Matter Status: {st}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
          {visibleMatters.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setSearchParams({ id: m.id, tab: activeTab })}
              className={`p-2 rounded border text-left text-[11px] transition-colors ${
                m.id === matter.id
                  ? 'bg-[#FFE5DE] border-[#EF5A90] text-[#7D2A42] font-bold'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-[#FFE5DE]/40'
              }`}
            >
              <div className="font-mono text-[10px]">{m.demoCode} • {m.domain}</div>
              <div className="truncate font-semibold">{m.title}</div>
            </button>
          ))}
        </div>
      </Card>

      {/* 7 Independent Status Dimensions */}
      <Card header={<span className="text-xs font-bold text-[#1F3864]">Independent Status Dimensions (Never Merged Into One Generic Status)</span>}>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          <IndependentStatusChip dimension="1. Matter" value={matter.matterStatus} />
          <IndependentStatusChip dimension="2. Admin Action" value={matter.adminStatus} />
          <IndependentStatusChip dimension="3. Police" value={matter.police.status} />
          <IndependentStatusChip dimension="4. Litigation" value={matter.litigation.status} />
          <IndependentStatusChip dimension="5. Court Order" value={matter.litigation.complianceStatus} />
          <IndependentStatusChip dimension="6. Financial" value={matter.finance.status} />
          <IndependentStatusChip dimension="7. Outcome" value={matter.outcome.status} />
        </div>
      </Card>

      {/* Section Tabs */}
      <div className="flex flex-wrap gap-1.5">
        {MATTER_SECTIONS.map((s) => {
          const Icon = s.icon;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setSearchParams({ id: matter.id, tab: s.id })}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-semibold border ${
                activeTab === s.id
                  ? 'bg-[#7D2A42] text-white border-[#7D2A42]'
                  : 'bg-white text-slate-700 border-[#E5B8B7] hover:bg-[#FFE5DE]/50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* Section Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card header={<span className="text-xs font-bold text-[#1F3864]">A. Matter Overview</span>}>
            <dl className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="p-2 bg-slate-50 rounded border border-slate-200"><dt className="text-[10px] font-bold text-slate-600 uppercase">Reference</dt><dd className="font-mono font-bold text-[#7D2A42]">{matter.id}</dd></div>
              <div className="p-2 bg-slate-50 rounded border border-slate-200"><dt className="text-[10px] font-bold text-slate-600 uppercase">Category</dt><dd className="font-semibold">{matter.category.replace(/_/g, ' ')}</dd></div>
              <div className="p-2 bg-slate-50 rounded border border-slate-200"><dt className="text-[10px] font-bold text-slate-600 uppercase">Jurisdiction</dt><dd className="font-semibold">{matter.jurisdiction}</dd></div>
              <div className="p-2 bg-slate-50 rounded border border-slate-200"><dt className="text-[10px] font-bold text-slate-600 uppercase">Epistemic Class</dt><dd className="font-mono font-semibold">{matter.epistemicClass}</dd></div>
              <div className="p-2 bg-slate-50 rounded border border-slate-200"><dt className="text-[10px] font-bold text-slate-600 uppercase">Coordinating Authority</dt><dd className="font-semibold">{matter.coordinatingAuthority}</dd></div>
              <div className="p-2 bg-slate-50 rounded border border-slate-200"><dt className="text-[10px] font-bold text-slate-600 uppercase">Responsible Authority</dt><dd className="font-semibold">{matter.responsibleAuthority}</dd></div>
            </dl>
            <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between">
                <strong className="text-[#1F3864]">Meaningful Progress Timeline:</strong>
                {(matter.matterStatus === 'CLOSED' || matter.matterStatus === 'RESOLVED') && (
                  <button
                    type="button"
                    onClick={() => updateMatterStatus(matter.id, 'REOPENED')}
                    className="px-2 py-0.5 rounded border border-orange-400 bg-orange-50 text-orange-900 font-semibold"
                  >
                    Reopen Matter
                  </button>
                )}
              </div>
              <div className="p-2 rounded bg-[#FFE5DE]/30 border border-[#E5B8B7]">
                <strong>Created:</strong> {matter.createdDate} → <strong>Last Progress:</strong> {matter.updatedDate} → <strong>Next Review:</strong> {matter.outcome.nextReviewDate}
              </div>
            </div>
          </Card>

          <Card header={<span className="text-xs font-bold text-[#1F3864]">Linked Dependencies ({linkedDeps.length})</span>}>
            {linkedDeps.length === 0 ? (
              <div className="text-xs text-slate-600 p-3 bg-slate-50 rounded border border-slate-200">No active blocking dependencies on this matter.</div>
            ) : (
              <div className="space-y-2">
                {linkedDeps.map((d) => (
                  <div key={d.id} className="p-2.5 rounded border border-[#E5B8B7] bg-[#FFE5DE]/20 text-xs flex items-center justify-between gap-2">
                    <div>
                      <div className="font-bold text-[#1F3864]">{d.predecessorAction} → {d.dependentAction}</div>
                      <div className="text-[11px] text-slate-600">Owner: {d.ownerRole} • Due: {d.dueDate}</div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-[#C98A87] font-bold">{d.status}</span>
                  </div>
                ))}
              </div>
            )}
            <Link to="/dependencies" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#7D2A42] hover:underline">
              <span>Open Dependency 360°</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Card>
        </div>
      )}

      {activeTab === 'police' && (
        <Card header={<span className="text-xs font-bold text-[#1F3864]">B. Police Coordination (Minimum Necessary Authorised Fields)</span>}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200"><span className="text-[10px] font-bold text-slate-600 uppercase block">Police Reference</span><strong>{matter.police.reference}</strong></div>
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200"><span className="text-[10px] font-bold text-slate-600 uppercase block">FIR / DIR Reference</span><strong>{matter.police.firRef}</strong></div>
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200"><span className="text-[10px] font-bold text-slate-600 uppercase block">Police Station</span><strong>{matter.police.station}</strong></div>
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200"><span className="text-[10px] font-bold text-slate-600 uppercase block">Responsible Role</span><strong>{matter.police.responsibleRole}</strong></div>
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200"><span className="text-[10px] font-bold text-slate-600 uppercase block">Required Docs</span><strong>{matter.police.requiredDocs}</strong></div>
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200"><span className="text-[10px] font-bold text-slate-600 uppercase block">Pending Lawful Action</span><strong>{matter.police.pendingLawfulAction}</strong></div>
          </div>
          <div className="mt-3 p-2.5 rounded bg-[#FFFACD]/70 border border-[#C98A87] text-[11px] text-slate-800">
            <strong>Statutory Safeguard:</strong> Confidential investigation diaries are excluded; neither WCD nor AI may direct independent criminal investigation decisions.
          </div>
        </Card>
      )}

      {activeTab === 'litigation' && (
        <Card header={<span className="text-xs font-bold text-[#1F3864]">C. Litigation & Judicial Order Compliance</span>}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200"><span className="text-[10px] font-bold text-slate-600 uppercase block">Court / Tribunal</span><strong>{matter.litigation.court}</strong></div>
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200"><span className="text-[10px] font-bold text-slate-600 uppercase block">Case Reference</span><strong className="font-mono">{matter.litigation.caseRef}</strong></div>
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200"><span className="text-[10px] font-bold text-slate-600 uppercase block">Hearing Date</span><strong>{matter.litigation.hearingDate}</strong></div>
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200"><span className="text-[10px] font-bold text-slate-600 uppercase block">Applicable Order</span><strong>{matter.litigation.applicableOrder}</strong></div>
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200"><span className="text-[10px] font-bold text-slate-600 uppercase block">Compliance Authority</span><strong>{matter.litigation.complianceAuthority}</strong></div>
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200"><span className="text-[10px] font-bold text-slate-600 uppercase block">Appeal / Stay Status</span><strong>{matter.litigation.appealOrStayStatus}</strong></div>
          </div>
          <div className="mt-3 p-2.5 rounded bg-[#E6D0E3]/50 border border-[#654161] text-[11px] text-[#46296E]">
            <strong>Judicial Independence:</strong> Disposed litigation is tracked separately from protection outcomes; executive compliance is tracked without treating judicial proceedings as subordinate.
          </div>
        </Card>
      )}

      {activeTab === 'welfare' && (
        <Card header={<span className="text-xs font-bold text-[#1F3864]">D. Welfare & Protection Services (Applicable Services Only)</span>}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {matter.welfareServices.map((w) => (
              <div key={w.service} className="p-3 rounded border border-[#E5B8B7] bg-[#FFE5DE]/25 text-xs space-y-1">
                <div className="font-bold text-[#7D2A42]">{w.service}</div>
                <div className="text-[11px] text-slate-600">Provider: {w.provider}</div>
                <span className="inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-[#C98A87] font-bold">
                  {w.status}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === 'finance' && (
        <Card header={<span className="text-xs font-bold text-[#1F3864]">E. Financial Coordination ({matter.finance.scheme})</span>}>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-center text-xs mb-3">
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200"><div className="text-[10px] text-slate-600 uppercase font-bold">Estimated</div><div className="font-bold text-[#1F3864]">₹{matter.finance.estimatedInr.toLocaleString()}</div></div>
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200"><div className="text-[10px] text-slate-600 uppercase font-bold">Approved</div><div className="font-bold text-[#1F3864]">₹{matter.finance.approvedInr.toLocaleString()}</div></div>
            <div className="p-2.5 rounded bg-[#FFE5DE]/50 border border-[#C98A87]"><div className="text-[10px] text-[#7D2A42] uppercase font-bold">Released</div><div className="font-bold text-[#7D2A42]">₹{matter.finance.releasedInr.toLocaleString()}</div></div>
            <div className="p-2.5 rounded bg-[#DFFFE0] border border-[#16A028]"><div className="text-[10px] text-[#166534] uppercase font-bold">Disbursed</div><div className="font-bold text-[#166534]">₹{matter.finance.disbursedInr.toLocaleString()}</div></div>
            <div className="p-2.5 rounded bg-[#DFFFE0] border border-[#16A028]"><div className="text-[10px] text-[#166534] uppercase font-bold">Utilised</div><div className="font-bold text-[#166534]">₹{matter.finance.utilisedInr.toLocaleString()}</div></div>
          </div>
          <div className="text-xs text-slate-700 flex flex-wrap gap-4">
            <span><strong>Sanction Ref:</strong> {matter.finance.sanctionRef}</span>
            <span><strong>Sanctioning Authority:</strong> {matter.finance.sanctioningAuthority}</span>
            <span><strong>Category:</strong> {matter.finance.category}</span>
          </div>
        </Card>
      )}

      {activeTab === 'ownership' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card header={<span className="text-xs font-bold text-[#1F3864]">F. Ownership & Delay Analysis</span>}>
            <div className="space-y-2 text-xs">
              <div><strong>Accountable Authority:</strong> {matter.ownership.accountableAuthority}</div>
              <div><strong>Responsible Role:</strong> {matter.ownership.responsibleRole}</div>
              <div><strong>Supporting Depts:</strong> {matter.ownership.supportingDepartments.join(', ')}</div>
              <div><strong>Pending Action:</strong> {matter.ownership.pendingAction}</div>
              <div><strong>Delay Reason:</strong> {matter.ownership.delayReason} ({matter.ownership.isLawfulWait ? 'Lawful Procedural Wait' : 'Administrative Action Required'})</div>
              <div><strong>Escalation Authority:</strong> {matter.ownership.escalationAuthority}</div>
            </div>
          </Card>

          <Card header={<span className="text-xs font-bold text-[#1F3864]">G. NGO & Community Participation</span>}>
            <div className="space-y-2 text-xs">
              <div><strong>Authorised Partner:</strong> {matter.ngoSupport.organisation}</div>
              <div><strong>Approved Activity:</strong> {matter.ngoSupport.activity}</div>
              <div><strong>Status:</strong> <span className="font-mono font-bold">{matter.ngoSupport.status}</span></div>
              <div><strong>Evidence Ref:</strong> {matter.ngoSupport.evidenceRef}</div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'outcome' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card header={<span className="text-xs font-bold text-[#1F3864]">H. Outcome & Follow-Up</span>}>
            <div className="space-y-2 text-xs">
              <div><strong>Expected Outcome:</strong> {matter.outcome.expectedOutcome}</div>
              <div><strong>Actual Delivered:</strong> {matter.outcome.actualDelivered}</div>
              <div><strong>Follow-Up Status:</strong> {matter.outcome.followUpStatus}</div>
              <div><strong>Unmet Needs:</strong> {matter.outcome.unmetNeeds}</div>
              <div><strong>Next Review Date:</strong> {matter.outcome.nextReviewDate}</div>
            </div>
          </Card>

          <Card header={<span className="text-xs font-bold text-[#46296E] flex items-center gap-1.5"><Bot className="w-4 h-4" /> Bounded AI Summary & Human Gate</span>}>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded bg-[#E6D0E3]/40 border border-[#654161]"><strong>Finding:</strong> {matter.aiSummary.finding}</div>
              <div className="p-2.5 rounded bg-slate-50 border border-slate-200"><strong>Limitations:</strong> {matter.aiSummary.limitations}</div>
              <div className="p-2.5 rounded bg-[#DFFFE0] border border-[#16A028]"><strong>Human Decision:</strong> {matter.aiSummary.humanDecision}</div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
