import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/common/Card';
import { PageHeader } from '@/components/common/PageHeader';
import { useGovernanceStore } from '@/store/governanceStore';
import { ArrowRight, AlertTriangle, Network } from 'lucide-react';

export function ConvergencePage() {
  const { convergenceLinks, dependencies, detectCircularDependencies } = useGovernanceStore();
  const [selectedLink, setSelectedLink] = useState(convergenceLinks[0]);
  const cycles = detectCircularDependencies();

  return (
    <div className="space-y-4">
      <PageHeader
        breadcrumb={['Government Convergence', 'Department Connectivity']}
        title="Interdepartmental Convergence Intelligence"
        purpose="Maps statutory relationships, information exchange, parallel dependencies, timelines, and data restrictions across WCD and 10 partner departments without hard-coding one universal workflow."
        badge="10 Department Links • Cycle Detection Active"
        source="MoWCD Convergence Matrix (Synthetic Demo)"
        classification="SYNTHETIC"
        actions={
          <Link to="/dependencies" className="text-xs px-3 py-1.5 rounded bg-[#7D2A42] hover:bg-[#654161] text-white font-semibold flex items-center gap-1">
            <span>Dependency 360°</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        }
      />

      {cycles.length > 0 && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-300 text-xs text-red-900 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-700 shrink-0" />
            <span>
              <strong>Circular Dependency Detected:</strong>{' '}
              {cycles.map((c) => c.join(' → ')).join(' | ')}
            </span>
          </div>
          <Link to="/dependencies" className="px-2.5 py-1 rounded bg-red-700 text-white font-semibold shrink-0">
            Resolve Deadlock
          </Link>
        </div>
      )}

      {/* Directional Convergence Hub Diagram */}
      <Card header={<span className="text-xs font-bold text-[#1F3864] flex items-center gap-1.5"><Network className="w-4 h-4 text-[#EF5A90]" /> WCD ↔ Interdepartmental Convergence Graph</span>}>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {convergenceLinks.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => setSelectedLink(link)}
              className={`p-2.5 rounded border text-left text-xs transition-colors ${
                selectedLink.id === link.id
                  ? 'bg-[#FFE5DE] border-[#EF5A90] text-[#7D2A42] font-bold'
                  : 'bg-white border-[#E5B8B7] text-slate-800 hover:bg-[#FFE5DE]/40'
              }`}
            >
              <div className="text-[10px] font-mono text-[#7D2A42]">WCD ↔ {link.toDept}</div>
              <div className="font-semibold truncate mt-0.5">{link.timeline}</div>
            </button>
          ))}
        </div>
      </Card>

      {/* Selected Relationship Detail + Parallel Dependencies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card header={<span className="text-xs font-bold text-[#1F3864]">Relationship Contract: {selectedLink.fromDept} ↔ {selectedLink.toDept}</span>}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200"><span className="text-[10px] font-bold text-slate-600 uppercase block">Purpose</span>{selectedLink.purpose}</div>
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200"><span className="text-[10px] font-bold text-slate-600 uppercase block">Statutory Basis</span>{selectedLink.statutoryBasis}</div>
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200"><span className="text-[10px] font-bold text-slate-600 uppercase block">Responsible Role</span><strong>{selectedLink.responsibleRole}</strong></div>
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200"><span className="text-[10px] font-bold text-slate-600 uppercase block">Timeline & Escalation</span>{selectedLink.timeline} • {selectedLink.escalationMechanism}</div>
            <div className="p-2.5 bg-[#FFE5DE]/40 rounded border border-[#C98A87] sm:col-span-2"><span className="text-[10px] font-bold text-[#7D2A42] uppercase block">Pending Action</span>{selectedLink.pendingAction}</div>
            <div className="p-2.5 bg-[#FFFACD]/60 rounded border border-[#C98A87] sm:col-span-2"><span className="text-[10px] font-bold text-[#7D2A42] uppercase block">Data Access Restriction</span>{selectedLink.accessRestriction}</div>
          </div>
        </Card>

        <Card header={<span className="text-xs font-bold text-[#1F3864]">Parallel Dependency Timeline ({dependencies.length})</span>}>
          <div className="space-y-2">
            {dependencies.map((d) => (
              <div key={d.id} className="p-2.5 rounded border border-[#E5B8B7] bg-white text-xs flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-bold text-[#1F3864] truncate">{d.predecessorNode} → {d.dependentNode}</div>
                  <div className="text-[11px] text-slate-600 truncate">{d.predecessorAction} • Due {d.dueDate}</div>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold shrink-0 ${
                  d.status === 'BLOCKED' ? 'bg-red-50 text-red-800 border border-red-300' : 'bg-[#FFE5DE] text-[#7D2A42] border border-[#C98A87]'
                }`}>
                  {d.status}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
