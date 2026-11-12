import { ProtectionDomain } from '@/types';
import { cn } from '@/lib/utils';
import { ShieldCheck, UserCheck } from 'lucide-react';

interface DomainBadgeProps {
  domain: ProtectionDomain;
  className?: string;
}

export function DomainBadge({ domain, className }: DomainBadgeProps) {
  const isWomen = domain === 'WOMEN';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border',
        isWomen
          ? 'bg-rose-50 text-rose-800 border-rose-200'
          : 'bg-purple-50 text-purple-800 border-purple-200',
        className
      )}
    >
      {isWomen ? <ShieldCheck className="w-3 h-3 text-rose-600" /> : <UserCheck className="w-3 h-3 text-purple-600" />}
      <span>{isWomen ? 'Women Protection' : 'Child Protection'}</span>
    </span>
  );
}

