import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Info, X } from 'lucide-react';

interface MoreInfoButtonProps {
  title: string;
  purpose: string;
  source?: string;
  reportingPeriod?: string;
  classification?: string;
  limitations?: string;
}

export function MoreInfoButton({
  title,
  purpose,
  source = 'MoWCD / Synthetic Pilot Dataset',
  reportingPeriod = '2024–2026',
  classification = 'MIXED_OFFICIAL_AND_SYNTHETIC',
  limitations = 'Demo operational records are synthetic; official portal datasets are cataloged as DISCOVERED pending live ingestion.',
}: MoreInfoButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-[#C98A87] bg-[#FFE5DE]/70 text-[#7D2A42] hover:bg-[#FFC0CB]/60 text-[11px] font-semibold"
      >
        <Info className="w-3.5 h-3.5" />
        <span>More</span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${title} Details`}
          className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4"
        >
          <div className="bg-white border border-[#C98A87] border-t-4 border-t-[#EF5A90] rounded-lg max-w-lg w-full p-5 shadow-lg space-y-3">
            <div className="flex items-start justify-between gap-2 border-b border-[#F3D5D4] pb-2.5">
              <div>
                <h2 className="text-sm font-bold text-[#1F3864]">{title}</h2>
                <span className="inline-block mt-1 px-1.5 py-0.5 rounded bg-[#FFFACD] text-[#7D2A42] border border-[#C98A87] font-mono text-[10px]">
                  {classification.replace(/_/g, ' ')}
                </span>
              </div>
              <button
                type="button"
                aria-label="Close details"
                onClick={() => setOpen(false)}
                className="p-1 rounded hover:bg-[#FFE5DE] text-[#7D2A42]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded border border-slate-200">
              <strong className="block text-[10px] uppercase text-[#7D2A42] mb-1">Scope & Purpose</strong>
              {purpose}
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="p-2.5 rounded bg-[#FFE5DE]/40 border border-[#E5B8B7]">
                <span className="block text-[10px] uppercase font-bold text-[#7D2A42]">Source</span>
                <span className="font-medium text-slate-900">{source}</span>
              </div>
              <div className="p-2.5 rounded bg-[#FFE5DE]/40 border border-[#E5B8B7]">
                <span className="block text-[10px] uppercase font-bold text-[#7D2A42]">Reporting Period</span>
                <span className="font-medium text-slate-900">{reportingPeriod}</span>
              </div>
            </div>

            <div className="p-2.5 rounded bg-[#FFFACD]/60 border border-[#C98A87] text-[11px] text-slate-800">
              <strong className="text-[#7D2A42]">Known Limitations:</strong> {limitations}
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-3.5 py-1.5 rounded bg-[#7D2A42] hover:bg-[#654161] text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

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
  source,
  reportingPeriod,
  classification,
  limitations,
  actions,
}: PageHeaderProps) {
  return (
    <div className="bg-white border border-[#E5B8B7] border-l-4 border-l-[#EF5A90] rounded-lg px-4 py-2.5 shadow-xs">
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
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {actions}
          <MoreInfoButton
            title={title}
            purpose={purpose}
            source={source}
            reportingPeriod={reportingPeriod}
            classification={classification}
            limitations={limitations}
          />
        </div>
      </div>
    </div>
  );
}
