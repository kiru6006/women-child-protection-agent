import { Card } from '@/components/common/Card';
import { PageHeader } from '@/components/common/PageHeader';
import { useGovernanceStore } from '@/store/governanceStore';
import { FinancialStatus } from '@/types/governance';
import { IndependentStatusChip } from '@/components/badges/IndependentStatusChip';

const FIN_STATUSES: FinancialStatus[] = [
  'REQUESTED',
  'UNDER_REVIEW',
  'SANCTIONED',
  'RELEASED',
  'DISBURSED',
  'UTILISATION_REPORTED',
  'UTILISATION_VERIFIED',
];

export function FinancePage() {
  const { financials, advanceFinancialStatus } = useGovernanceStore();

  const totals = financials.reduce(
    (acc, f) => ({
      allocated: acc.allocated + f.allocatedInr,
      sanctioned: acc.sanctioned + f.sanctionedInr,
      released: acc.released + f.releasedInr,
      disbursed: acc.disbursed + f.disbursedInr,
      utilised: acc.utilised + f.utilisedInr,
      pending: acc.pending + f.pendingInr,
    }),
    { allocated: 0, sanctioned: 0, released: 0, disbursed: 0, utilised: 0, pending: 0 }
  );

  return (
    <div className="space-y-4">
      <PageHeader
        breadcrumb={['Finance & Resources', 'Financial Command Centre']}
        title="Financial & Fund Allocation Intelligence"
        purpose="Tracks scheme budgets from Allocation → Sanction → Release → Disbursement → Utilisation → Outcome Verification. Unspent balances are flagged for review without assuming leakage; AI cannot approve payments."
        badge="SYNTHETIC PFMS / SNA DEMO"
        source="Scheme Financial Ledger (Synthetic)"
        classification="SYNTHETIC"
      />

      {/* Aggregate Financial Flow Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-center">
        {[
          { label: 'Allocated', val: totals.allocated, cls: 'text-[#1F3864]' },
          { label: 'Sanctioned', val: totals.sanctioned, cls: 'text-[#1F3864]' },
          { label: 'Released', val: totals.released, cls: 'text-[#7D2A42]' },
          { label: 'Disbursed', val: totals.disbursed, cls: 'text-[#167F80]' },
          { label: 'Utilised', val: totals.utilised, cls: 'text-[#16A028]' },
          { label: 'Pending / Unspent', val: totals.pending, cls: 'text-orange-700' },
        ].map((m) => (
          <Card key={m.label}>
            <div className={`text-base font-extrabold ${m.cls}`}>₹{(m.val / 100000).toFixed(1)}L</div>
            <div className="text-[11px] text-slate-600 font-medium">{m.label}</div>
          </Card>
        ))}
      </div>

      {/* Scheme Fund Flow & Candidate Financial Gaps */}
      <div className="space-y-3">
        {financials.map((f) => {
          const utilPct = Math.round((f.utilisedInr / Math.max(1, f.releasedInr)) * 100);
          return (
            <Card key={f.id}>
              <div className="space-y-2.5 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="font-mono font-bold text-[#7D2A42] mr-2">{f.id}</span>
                    <strong className="text-sm text-[#1F3864]">{f.schemeName}</strong>
                    <span className="ml-2 text-[11px] text-slate-600">({f.level} • {f.jurisdiction})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IndependentStatusChip dimension="Financial" value={f.financialStatus} />
                    <select
                      aria-label={`Update financial status for ${f.id}`}
                      value={f.financialStatus}
                      onChange={(e) => advanceFinancialStatus(f.id, e.target.value as FinancialStatus)}
                      className="text-[11px] border border-[#C98A87] rounded px-2 py-1 bg-[#FFE5DE]/30 font-semibold"
                    >
                      {FIN_STATUSES.map((st) => (
                        <option key={st} value={st}>{st.replace(/_/g, ' ')}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-[11px] bg-slate-50 p-2 rounded border border-slate-200">
                  <div><span className="text-slate-600 block">Allocated</span><strong>₹{(f.allocatedInr / 100000).toFixed(1)}L</strong></div>
                  <div><span className="text-slate-600 block">Sanctioned</span><strong>₹{(f.sanctionedInr / 100000).toFixed(1)}L</strong></div>
                  <div><span className="text-slate-600 block">Released</span><strong>₹{(f.releasedInr / 100000).toFixed(1)}L</strong></div>
                  <div><span className="text-slate-600 block">Disbursed</span><strong>₹{(f.disbursedInr / 100000).toFixed(1)}L</strong></div>
                  <div><span className="text-slate-600 block">Utilised</span><strong className="text-[#166534]">₹{(f.utilisedInr / 100000).toFixed(1)}L ({utilPct}%)</strong></div>
                  <div><span className="text-slate-600 block">Pending</span><strong className="text-orange-700">₹{(f.pendingInr / 100000).toFixed(1)}L</strong></div>
                </div>

                <div className="p-2 rounded bg-[#FFFACD]/60 border border-[#C98A87] text-[11px] text-slate-800">
                  <strong className="text-[#7D2A42]">Candidate Financial Gap:</strong> {f.candidateGap}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
