import { useAppStore, UserRole } from '@/store/appStore';
import { Shield, MapPin, User } from 'lucide-react';

export function Header() {
  const {
    currentRole,
    setCurrentRole,
    selectedState,
    selectedDistrict,
    setSelectedDistrict,
    activeDomain,
    setActiveDomain,
  } = useAppStore();

  const roleLabels: Record<UserRole, string> = {
    DISTRICT_COLLECTOR: 'District Magistrate / Collector',
    WCD_SECRETARY: 'Joint Secretary (WCD)',
    OSC_ADMIN: 'One Stop Centre Lead (Sakhi)',
    PROTECTION_OFFICER: 'Protection Officer (PWDVA)',
    DLSA_LAWYER: 'DLSA Legal Aid Panel',
    AUDITOR: 'CAG / Social Impact Auditor',
  };

  const districtOptions = [
    { state: 'Bihar', district: 'Patna' },
    { state: 'Bihar', district: 'Gaya' },
    { state: 'Uttar Pradesh', district: 'Varanasi' },
    { state: 'Maharashtra', district: 'Pune' },
  ];

  return (
    <header className="bg-gov-navy text-white border-b border-gov-blue sticky top-0 z-40 shadow-xs">
      <div className="px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Brand & Emblem */}
        <div className="flex items-center space-x-3 min-w-max">
          <div className="w-9 h-9 rounded bg-amber-500 text-slate-950 font-black flex items-center justify-center text-lg shadow-sm border border-amber-300">
            श
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-base">Suraksha Sentinel</span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-mono font-medium border border-amber-400/30">
                v2.5 OS
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              Ministry of Women & Child Development | Gap-Closure & Case Continuity
            </p>
          </div>
        </div>

        {/* Domain Switcher */}
        <div className="hidden md:flex items-center bg-slate-900/60 p-1 rounded-md border border-slate-700">
          <button
            onClick={() => setActiveDomain('WOMEN')}
            className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
              activeDomain === 'WOMEN'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Women Protection
          </button>
          <button
            onClick={() => setActiveDomain('CHILD')}
            className={`px-3 py-1 rounded text-xs font-semibold transition-all flex items-center gap-1 ${
              activeDomain === 'CHILD'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Child Protection</span>
            <span className="text-[9px] bg-slate-800 px-1 rounded text-slate-300 uppercase">Phase 2</span>
          </button>
        </div>

        {/* Administrative Selectors */}
        <div className="flex items-center space-x-3 text-xs">
          {/* District Filter */}
          <div className="hidden sm:flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1.5 rounded border border-slate-700 text-slate-200">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <select
              value={`${selectedState}:${selectedDistrict}`}
              onChange={(e) => {
                const [s, d] = e.target.value.split(':');
                setSelectedDistrict(s, d);
              }}
              className="bg-transparent text-slate-200 font-medium focus:outline-hidden cursor-pointer"
            >
              {districtOptions.map((opt) => (
                <option key={`${opt.state}:${opt.district}`} value={`${opt.state}:${opt.district}`} className="bg-slate-900 text-slate-200">
                  {opt.district}, {opt.state}
                </option>
              ))}
            </select>
          </div>

          {/* Role Switcher (Simulated RBAC) */}
          <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1.5 rounded border border-slate-700 text-slate-200">
            <User className="w-3.5 h-3.5 text-emerald-400" />
            <select
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value as UserRole)}
              className="bg-transparent text-slate-200 font-medium focus:outline-hidden cursor-pointer"
            >
              {Object.entries(roleLabels).map(([roleKey, label]) => (
                <option key={roleKey} value={roleKey} className="bg-slate-900 text-slate-200">
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Zero PII Tag */}
          <div className="hidden lg:flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-950/80 border border-emerald-600/40 text-emerald-300 font-mono text-[11px]">
            <Shield className="w-3 h-3 text-emerald-400" />
            <span>Zero PII / HMAC Tokens</span>
          </div>
        </div>
      </div>
    </header>
  );
}
