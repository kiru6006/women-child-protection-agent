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
    <header className="bg-gov-pink-950 text-white border-b border-gov-pink-800 sticky top-0 z-40 shadow-sm">
      <div className="px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Brand & National Portal Style Emblem */}
        <div className="flex items-center space-x-3 min-w-max">
          <div className="w-9 h-9 rounded-md bg-gradient-to-br from-pink-500 to-rose-700 text-white font-black flex items-center justify-center text-lg shadow-sm border border-pink-400">
            श
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-base text-pink-50">Suraksha Sentinel & Sahyog</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-pink-900 text-pink-200 font-mono font-semibold border border-pink-700">
                MoWCD Enterprise OS
              </span>
            </div>
            <p className="text-[11px] text-pink-200/80">
              Ministry of Women & Child Development | Case Continuity & Gap-Closure Operating System
            </p>
          </div>
        </div>

        {/* Domain Switcher */}
        <div className="hidden md:flex items-center bg-gov-pink-900/90 p-1 rounded-lg border border-pink-800/80">
          <button
            onClick={() => setActiveDomain('WOMEN')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              activeDomain === 'WOMEN'
                ? 'bg-pink-600 text-white shadow-xs'
                : 'text-pink-200 hover:text-white'
            }`}
          >
            Women Protection
          </button>
          <button
            onClick={() => setActiveDomain('CHILD')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all flex items-center gap-1 ${
              activeDomain === 'CHILD'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'text-pink-300 hover:text-white'
            }`}
          >
            <span>Child Protection</span>
            <span className="text-[9px] bg-gov-pink-950 px-1 rounded text-pink-300 uppercase">Phase 2</span>
          </button>
        </div>

        {/* Administrative Selectors */}
        <div className="flex items-center space-x-3 text-xs">
          {/* District Filter */}
          <div className="hidden sm:flex items-center gap-1.5 bg-gov-pink-900/80 px-2.5 py-1.5 rounded-md border border-pink-800 text-pink-100">
            <MapPin className="w-3.5 h-3.5 text-pink-400" />
            <select
              value={`${selectedState}:${selectedDistrict}`}
              onChange={(e) => {
                const [s, d] = e.target.value.split(':');
                setSelectedDistrict(s, d);
              }}
              className="bg-transparent text-pink-100 font-medium focus:outline-hidden cursor-pointer"
            >
              {districtOptions.map((opt) => (
                <option key={`${opt.state}:${opt.district}`} value={`${opt.state}:${opt.district}`} className="bg-slate-900 text-white">
                  {opt.district}, {opt.state}
                </option>
              ))}
            </select>
          </div>

          {/* Role Switcher */}
          <div className="flex items-center gap-1.5 bg-gov-pink-900/80 px-2.5 py-1.5 rounded-md border border-pink-800 text-pink-100">
            <User className="w-3.5 h-3.5 text-pink-300" />
            <select
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value as UserRole)}
              className="bg-transparent text-pink-100 font-medium focus:outline-hidden cursor-pointer"
            >
              {Object.entries(roleLabels).map(([roleKey, label]) => (
                <option key={roleKey} value={roleKey} className="bg-slate-900 text-white">
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Zero PII Tag */}
          <div className="hidden lg:flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 font-mono text-[11px]">
            <Shield className="w-3 h-3 text-emerald-400" />
            <span>Zero PII / HMAC Encrypted</span>
          </div>
        </div>
      </div>
    </header>
  );
}
