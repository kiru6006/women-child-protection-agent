import { useEffect, useState } from 'react';
import { Card } from '@/components/common/Card';
import { MoreInfoButton } from '@/components/common/PageHeader';
import { InterventionPlan } from '@/types';
import { approveIntervention, createIntervention, fetchInterventions } from '@/services/api';
import { useAppStore } from '@/store/appStore';
import { Calendar, Target, CheckCircle2, AlertCircle, Plus } from 'lucide-react';

export function InterventionsPage() {
  const { currentRole } = useAppStore();
  const [interventions, setInterventions] = useState<InterventionPlan[]>([]);
  const [actionError, setActionError] = useState<string | null>(null);
  const [showPropose, setShowPropose] = useState(false);
  const [desc, setDesc] = useState('');
  const [ownerRole, setOwnerRole] = useState('PROTECTION_OFFICER_PATNA');

  useEffect(() => {
    fetchInterventions().then(setInterventions);
  }, []);

  const handlePropose = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);
    try {
      const created = await createIntervention(
        {
          gap_id: 'GAP-W-PATNA-001',
          type: 'PROCESS_IMPROVEMENT',
          description: desc,
          owner_role: ownerRole,
          target_date: '2026-12-31',
          kpi_metric: 'Legal Aid Access Rate',
          kpi_baseline: 36,
          kpi_target: 85,
        },
        currentRole
      );
      setInterventions((prev) => [created, ...prev]);
      setDesc('');
      setShowPropose(false);
    } catch (err: any) {
      setActionError(err.message || 'Failed to propose intervention.');
    }
  };

  const handleApprove = async (id: string) => {
    setActionError(null);
    try {
      const updated = await approveIntervention(id, currentRole);
      setInterventions((prev) => prev.map((item) => (item.id === id ? updated : item)));
    } catch (err: any) {
      setActionError(err.message || 'Approval rejected.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold text-[#1F3864]">Intervention Workspace & Directives</h1>
          <MoreInfoButton
            title="Intervention Workspace & Directives"
            purpose="Formal administrative interventions sanctioned by District Magistrates and WCD Secretaries with measurable baseline-to-target KPIs."
          />
        </div>
        <button
          type="button"
          onClick={() => setShowPropose(!showPropose)}
          className="text-xs px-3 py-1.5 rounded bg-[#7D2A42] text-white font-semibold hover:bg-[#654161] flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Propose Intervention</span>
        </button>
      </div>

      {showPropose && (
        <Card className="p-4 bg-white border-slate-200">
          <form onSubmit={handlePropose} className="space-y-3">
            <input
              required
              placeholder="Assigned owner role (e.g. SECRETARY_DLSA_PATNA)"
              value={ownerRole}
              onChange={(e) => setOwnerRole(e.target.value)}
              className="w-full text-xs border border-slate-200 rounded p-2"
            />
            <textarea
              required
              rows={2}
              placeholder="Proposed corrective intervention description..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full text-xs border border-slate-200 rounded p-2"
            />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowPropose(false)} className="text-xs px-3 py-1.5 border rounded">Cancel</button>
              <button type="submit" className="text-xs px-3 py-1.5 bg-primary hover:bg-primary-hover text-white rounded font-semibold">Submit Proposal</button>
            </div>
          </form>
        </Card>
      )}

      {actionError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-800 font-medium">
          {actionError}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {interventions.map((intPlan) => {
          const isApproved = intPlan.status === 'APPROVED' || intPlan.status === 'IN_PROGRESS';
          return (
            <Card key={intPlan.id} className="hover:border-slate-300 transition-shadow">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-gov-blue">{intPlan.id}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-blue-50 text-blue-800 font-semibold uppercase">
                      {intPlan.type.replace(/_/g, ' ')}
                    </span>
                    <span className="font-mono text-xs text-slate-400">Linked: {intPlan.gapId}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        intPlan.status === 'PROPOSED'
                          ? 'bg-slate-100 text-slate-700'
                          : intPlan.status === 'IN_PROGRESS'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {intPlan.status === 'IN_PROGRESS' ? (
                        <AlertCircle className="w-3 h-3 text-amber-600" />
                      ) : (
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      )}
                      <span>{intPlan.status.replace(/_/g, ' ')}</span>
                    </span>

                    {intPlan.status === 'PROPOSED' && (
                      <button
                        type="button"
                        onClick={() => handleApprove(intPlan.id)}
                        className="text-xs px-2.5 py-1 rounded bg-primary text-white font-semibold hover:bg-primary-hover"
                      >
                        Approve Intervention
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-sm font-semibold text-slate-900 leading-relaxed">{intPlan.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-md text-xs">
                  <div>
                    <span className="text-slate-600 uppercase text-[10px] font-bold block">Assigned Owner</span>
                    <span className="font-semibold text-slate-800">{intPlan.ownerRole}</span>
                  </div>

                  <div>
                    <span className="text-slate-600 uppercase text-[10px] font-bold block flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      <span>Target KPI</span>
                    </span>
                    <span className="font-semibold text-slate-800">
                      {intPlan.kpiMetric}: <strong className="text-emerald-700">{intPlan.kpiTarget}%</strong> (from {intPlan.kpiBaseline}%)
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-600 uppercase text-[10px] font-bold block flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>Statutory Deadline</span>
                    </span>
                    <span className="font-semibold text-slate-800">{intPlan.targetDate}</span>
                  </div>
                </div>

                {isApproved && intPlan.approvalRole && (
                  <div className="text-[11px] text-slate-500 flex items-center justify-between pt-2 border-t border-slate-100">
                    <span>Sanctioned by: <strong className="text-slate-700">{intPlan.approvalRole}</strong></span>
                    <span>Sanction Date: {intPlan.approvedAt?.split('T')[0]}</span>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
