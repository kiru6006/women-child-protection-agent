import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Menu, Search, Shield, User, MapPin, PanelLeft } from 'lucide-react';
import { useAppStore, UserRole } from '@/store/appStore';
import { useDemoStore } from '@/store/demoStore';
import { governmentSchemes } from '@/data/platformData';

export function Header() {
  const navigate = useNavigate();
  const {
    currentRole,
    setCurrentRole,
    selectedState,
    selectedDistrict,
    setSelectedDistrict,
    toggleSidebar,
    mobileNavOpen,
    setMobileNavOpen,
  } = useAppStore();

  const { alerts, gaps, officials, evidence, datasets } = useDemoStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  const openAlertsCount = alerts.filter((a) => a.status !== 'RESOLVED' && a.status !== 'REJECTED').length;

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

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (q.length < 2) return [];
    const results: { label: string; type: string; to: string }[] = [];

    gaps.forEach((g) => {
      if (g.title.toLowerCase().includes(q) || g.id.toLowerCase().includes(q)) {
        results.push({ label: `${g.id}: ${g.title}`, type: 'Gap Contract', to: `/investigation?gapId=${g.id}` });
      }
    });
    governmentSchemes.forEach((s) => {
      if (s.name.toLowerCase().includes(q) || s.purpose.toLowerCase().includes(q)) {
        results.push({ label: s.name, type: 'Scheme', to: `/schemes?tab=all` });
      }
    });
    officials.forEach((o) => {
      if (o.designation.toLowerCase().includes(q) || o.jurisdiction.toLowerCase().includes(q)) {
        results.push({ label: `${o.designation} (${o.jurisdiction})`, type: 'Official', to: `/ecosystem?tab=officials` });
      }
    });
    evidence.forEach((e) => {
      if (e.title.toLowerCase().includes(q) || e.extractedClaim.toLowerCase().includes(q)) {
        results.push({ label: e.title, type: 'Evidence', to: `/knowledge?tab=evidence` });
      }
    });
    datasets.forEach((d) => {
      if (d.name.toLowerCase().includes(q) || d.category.toLowerCase().includes(q)) {
        results.push({ label: d.name, type: 'Dataset', to: `/knowledge?tab=catalogue` });
      }
    });
    return results.slice(0, 8);
  }, [searchQuery, gaps, officials, evidence, datasets]);

  return (
    <header className="bg-gov-navy text-white border-b border-slate-800 sticky top-0 z-40 shadow-xs">
      <div className="px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-2">
        {/* Left: Sidebar Toggle + Platform Identity */}
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="md:hidden p-1.5 rounded bg-slate-800 border border-slate-700 text-slate-100 hover:bg-slate-700"
            aria-label="Toggle mobile navigation"
          >
            <Menu className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={toggleSidebar}
            className="hidden md:inline-flex p-1.5 rounded bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700"
            aria-label="Toggle sidebar"
          >
            <PanelLeft className="w-4 h-4" />
          </button>
          <Link to="/" className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded bg-blue-700 text-white font-black flex items-center justify-center text-sm border border-blue-500 shrink-0">
              WCD
            </div>
            <div className="min-w-0">
              <div className="font-bold text-sm text-white truncate">WCD Protection Intelligence Platform</div>
              <p className="hidden lg:block text-[10px] text-slate-300 truncate">
                Ministry of Women & Child Development | Governance, Continuity & Gap-Closure Portal
              </p>
            </div>
          </Link>
        </div>

        {/* Center: Global Search */}
        <div className="relative flex-1 max-w-md min-w-[180px] order-3 md:order-2 w-full md:w-auto">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
          <input
            type="search"
            value={searchQuery}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 180)}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search gaps, schemes, officials, datasets, laws..."
            aria-label="Global platform search"
            className="w-full pl-8 pr-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-hidden focus:border-blue-400"
          />
          {searchFocused && searchResults.length > 0 && (
            <div className="absolute left-0 right-0 mt-1 bg-white text-slate-900 rounded-md shadow-lg border border-slate-200 z-50 max-h-72 overflow-y-auto">
              {searchResults.map((res, idx) => (
                <button
                  key={idx}
                  type="button"
                  onMouseDown={() => {
                    setSearchQuery('');
                    navigate(res.to);
                  }}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 border-b border-slate-100 flex items-center justify-between gap-2"
                >
                  <span className="truncate font-medium">{res.label}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono shrink-0">
                    {res.type}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Scope, Alerts Bell, Role, Zero-PII */}
        <div className="flex items-center gap-2 text-xs order-2 md:order-3">
          <div className="hidden sm:flex items-center gap-1 bg-slate-800 px-2 py-1 rounded border border-slate-700">
            <MapPin className="w-3 h-3 text-blue-300" />
            <select
              aria-label="Administrative scope"
              value={`${selectedState}:${selectedDistrict}`}
              onChange={(e) => {
                const [s, d] = e.target.value.split(':');
                setSelectedDistrict(s, d);
              }}
              className="bg-transparent text-slate-100 text-xs focus:outline-hidden cursor-pointer"
            >
              {districtOptions.map((opt) => (
                <option key={`${opt.state}:${opt.district}`} value={`${opt.state}:${opt.district}`} className="bg-slate-900 text-white">
                  {opt.district}, {opt.state}
                </option>
              ))}
            </select>
          </div>

          <Link
            to="/alerts"
            className="relative p-1.5 rounded bg-slate-800 border border-slate-700 text-slate-100 hover:bg-slate-700"
            aria-label={`Alerts centre (${openAlertsCount} open)`}
          >
            <Bell className="w-4 h-4" />
            {openAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 px-1 min-w-[16px] h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">
                {openAlertsCount}
              </span>
            )}
          </Link>

          <div className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded border border-slate-700 max-w-[160px] sm:max-w-none">
            <User className="w-3 h-3 text-blue-300 shrink-0" />
            <select
              aria-label="Active official role"
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value as UserRole)}
              className="bg-transparent text-slate-100 text-xs focus:outline-hidden cursor-pointer truncate"
            >
              {Object.entries(roleLabels).map(([roleKey, label]) => (
                <option key={roleKey} value={roleKey} className="bg-slate-900 text-white">
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="hidden xl:flex items-center gap-1 px-2 py-1 rounded bg-emerald-950 border border-emerald-700 text-emerald-200 font-mono text-[10px]">
            <Shield className="w-3 h-3" />
            <span>Zero PII</span>
          </div>
        </div>
      </div>
    </header>
  );
}
