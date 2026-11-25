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
          ? 'bg-[#FFE5DE] text-[#7D2A42] border-[#C98A87]'
          : 'bg-[#FFC0CB]/45 text-[#7D2A42] border-[#EF5A90]',
        className
      )}
    >
      {isWomen ? <ShieldCheck className="w-3 h-3 text-[#7D2A42]" /> : <UserCheck className="w-3 h-3 text-[#EF5A90]" />}
      <span>{isWomen ? 'Women Protection' : 'Child Protection'}</span>
    </span>
  );
}

