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
        'bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden',
        className
      )}
      {...props}
    >
      {header && (
        <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          {header}
        </div>
      )}
      <div className="p-5">{children}</div>
      {footer && (
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 text-xs text-slate-500">
          {footer}
        </div>
      )}
    </div>
  );
}
