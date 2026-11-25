import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export function Card({ children, className, header, footer, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white border border-[#E5B8B7] border-t-2 border-t-[#EF5A90]/75 hover:border-[#EF5A90] transition-colors rounded-lg shadow-xs overflow-hidden',
        className
      )}
      {...props}
    >
      {header && (
        <div className="px-4 py-2.5 border-b border-[#F3D5D4] bg-[#FFE5DE]/30 flex items-center justify-between">
          {header}
        </div>
      )}
      <div className="p-3.5">{children}</div>
      {footer && (
        <div className="px-4 py-2 border-t border-[#F3D5D4] bg-[#FFE5DE]/20 text-xs text-slate-600">
          {footer}
        </div>
      )}
    </div>
  );
}

