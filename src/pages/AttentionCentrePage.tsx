import { Card } from '@/components/common/Card';
import { StatCard } from '@/components/common/StatCard';
import { AlertTriangle, Clock, CheckCircle, Scale, ShieldAlert, FileText } from 'lucide-react';
import { useAppStore } from '@/store/appStore';

export function AttentionCentrePage() {
  const { selectedDistrict, selectedState } = useAppStore();

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border-l-4 border-amber-500 p-4 rounded-r-lg shadow-xs border border-slate-200">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">District Protection Attention Centre</h1>
            <p className="text-xs text-slate-500 mt-1">
              Active Focus: <span className="font-semibold text-slate-700">{selectedDistrict}, {selectedState}</span>. 
              Real-time aggregation of statutory deadline stalls, unacknowledged referrals, and verified systemic gaps.
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded bg-amber-50 text-amber-800 border border-amber-200 font-mono font-medium">
            Next Convergence: Monday 10:00 AM
          </span>
        </div>
      </div>

      {/* 5 Core Action Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          label="Statutory Breaches"
          value="3"
          subtext="Overdue medical / DIR filing"
          variant="alert"
          icon={Clock}
        />
        <StatCard
          label="Unack. Referrals"
          value="8"
          subtext="Pending police/DLSA ack > 24h"
          variant="warning"
          icon={AlertTriangle}
        />
        <StatCard
          label="Active Gaps"
          value="5"
          subtext="2 validated, 3 candidate"
          variant="default"
          icon={Scale}
        />
        <StatCard
          label="Interventions Active"
          value="2"
          subtext="Target date within 30 days"
          variant="default"
          icon={ShieldAlert}
        />
        <StatCard
          label="Verified Outcomes"
          value="4"
          subtext="Measured KPI improvement"
          variant="success"
          icon={CheckCircle}
        />
      </div>

      {/* Primary Queues */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card header={<div className="font-semibold text-sm text-slate-800 flex items-center gap-2">
          <Clock className="w-4 h-4 text-red-600" />
          <span>Critical Statutory Breaches Requiring Collector Action</span>
        </div>}>
          <div className="space-y-3">
            <div className="p-3 border border-red-200 bg-red-50/40 rounded-md">
              <div className="flex justify-between items-start text-xs font-semibold text-red-900 mb-1">
                <span>CASE-DV-2026-PAT-0842</span>
                <span className="text-red-700 bg-red-100 px-1.5 py-0.5 rounded font-mono">18.5h Overdue</span>
              </div>
              <p className="text-xs text-slate-700">
                Medical examination pending at District Hospital beyond 24h statutory window (PWDVA Sec. 7).
              </p>
              <div className="mt-2 text-[11px] text-slate-500 flex justify-between items-center">
                <span>Officer: Dr. R. K. Sinha (Duty MO)</span>
                <button className="text-xs font-semibold text-red-700 hover:underline">Draft Show Cause →</button>
              </div>
            </div>

            <div className="p-3 border border-amber-200 bg-amber-50/40 rounded-md">
              <div className="flex justify-between items-start text-xs font-semibold text-amber-900 mb-1">
                <span>CASE-DV-2026-PAT-0839</span>
                <span className="text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded font-mono">11h Overdue</span>
              </div>
              <p className="text-xs text-slate-700">
                Domestic Incident Report (DIR Form 1) pending submission by Protection Officer to Judicial Magistrate (PWDVA Sec. 9(1)(b)).
              </p>
              <div className="mt-2 text-[11px] text-slate-500 flex justify-between items-center">
                <span>Officer: PO S. Kumari</span>
                <button className="text-xs font-semibold text-amber-800 hover:underline">Draft Memo →</button>
              </div>
            </div>
          </div>
        </Card>

        <Card header={<div className="font-semibold text-sm text-slate-800 flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-600" />
          <span>Priority Gap Contracts Under Active Investigation</span>
        </div>}>
          <div className="space-y-3">
            <div className="p-3 border border-slate-200 rounded-md hover:bg-slate-50/60 transition-colors">
              <div className="flex justify-between items-start text-xs font-semibold text-slate-900 mb-1">
                <span>GAP-W-PATNA-001 (Capacity Gap)</span>
                <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-[11px]">Validated Gap</span>
              </div>
              <p className="text-xs text-slate-600">
                OSC Legal Aid Drop-off: 64% of domestic violence victims at Sakhi Centre Patna not linked to DLSA panel lawyer due to lack of co-located roster.
              </p>
              <div className="mt-2 text-[11px] text-slate-500 flex justify-between items-center">
                <span>Owner: Secretary, DLSA Patna</span>
                <span className="font-medium text-gov-blue">Target: 85% Linkage</span>
              </div>
            </div>

            <div className="p-3 border border-slate-200 rounded-md hover:bg-slate-50/60 transition-colors">
              <div className="flex justify-between items-start text-xs font-semibold text-slate-900 mb-1">
                <span>GAP-W-PATNA-003 (Process Gap)</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-[11px]">Under Investigation</span>
              </div>
              <p className="text-xs text-slate-600">
                Police Station Informal Mediation: Women Police Cell advising reconciliation without recording DIR, creating 3x repeat violence risk.
              </p>
              <div className="mt-2 text-[11px] text-slate-500 flex justify-between items-center">
                <span>Owner: SP (Crime Against Women)</span>
                <span className="font-medium text-gov-blue">Mandatory DIR Audit</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
