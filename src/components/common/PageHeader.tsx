import { Link } from 'react-router-dom';
import { ChevronRight, Info } from 'lucide-react';

interface PageHeaderProps {
  breadcrumb: string[];
  title: string;
  purpose: string;
  badge?: string;
  source?: string;
  reportingPeriod?: string;
  classification?: 'OFFICIAL_PUBLIC' | 'PROVISIONAL' | 'SYNTHETIC' | 'MIXED_OFFICIAL_AND_SYNTHETIC';
  limitations?: string;
  actions?: React.ReactNode;
}

export function PageHeader({
  breadcrumb,
  title,
  purpose,
  badge,
  source = 'MoWCD / Synthetic Pilot Dataset',
  reportingPeriod = '2024–2026',
  classification = 'MIXED_OFFICIAL_AND_SYNTHETIC',
  limitations = 'Demo operational records are synthetic; official portal datasets are cataloged as DISCOVERED pending live ingestion.',
  actions,
}: PageHeaderProps) {
  return (
    <div className="bg-white border border-slate-200 border-l-4 border-l-[#EF5A90] rounded-lg px-4 py-2.5 shadow-xs space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-[11px] text-slate-600 mb-0.5 flex-wrap">
            <Link to="/" className="hover:text-[#7D2A42] font-medium">Home</Link>
            {breadcrumb.map((b, i) => (
              <span key={i} className="flex items-center gap-1">
                <ChevronRight className="w-3 h-3 text-slate-500" />
                <span className={i === breadcrumb.length - 1 ? 'text-[#7D2A42] font-semibold' : ''}>{b}</span>
              </span>
            ))}
          </nav>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold text-[#1F3864] tracking-tight">{title}</h1>
            {badge && (
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#FFE5DE] text-[#7D2A42] border border-[#C98A87] font-semibold">
                {badge}
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-1" title={purpose}>{purpose}</p>
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2 shrink-0">{actions}</div>}
      </div>

      <div className="pt-1.5 border-t border-slate-100 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-slate-600">
        <span><strong>Source:</strong> {source}</span>
        <span><strong>Period:</strong> {reportingPeriod}</span>
        <span className="px-1.5 py-0.5 rounded bg-[#FFFACD] text-[#7D2A42] border border-[#C98A87] font-mono">
          {classification.replace(/_/g, ' ')}
        </span>
        <span className="flex items-center gap-1 text-slate-600 truncate max-w-md" title={limitations}>
          <Info className="w-3 h-3 shrink-0 text-slate-500" />
          <span className="truncate">{limitations}</span>
        </span>
      </div>
    </div>
  );
}
