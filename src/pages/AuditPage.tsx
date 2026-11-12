import { mockAuditLogs } from '@/data/mockData';
import { Card } from '@/components/common/Card';
import { Lock } from 'lucide-react';

export function AuditPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Cryptographic Audit & Explainability Ledger</h1>
          <p className="text-xs text-slate-500 mt-1">
            WORM (Write Once, Read Many) tamper-evident SHA-256 hash log of all AI suggestions, administrative decisions, and data access.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-300 font-mono flex items-center gap-1 font-semibold">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Hash Chain Intact</span>
          </span>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Event ID</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Actor Role</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Entity</th>
                <th className="py-3 px-4">Audit Details</th>
                <th className="py-3 px-4">SHA-256 Block Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {mockAuditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-gov-blue">{log.id}</td>
                  <td className="py-3 px-4 text-slate-500 whitespace-nowrap">{log.timestamp.replace('T', ' ').replace('Z', '')}</td>
                  <td className="py-3 px-4 font-semibold text-slate-800">{log.actorRole}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[11px]">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-xs">{log.entityId}</td>
                  <td className="py-3 px-4 text-xs max-w-xs">{log.details}</td>
                  <td className="py-3 px-4 font-mono text-[10px] text-slate-400 truncate max-w-[140px]" title={log.sha256Hash}>
                    {log.sha256Hash.substring(0, 16)}...
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
