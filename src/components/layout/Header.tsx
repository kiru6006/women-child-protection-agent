import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, CircleHelp, Contrast, MapPin, Menu, PanelLeft, PlayCircle, Search, Shield, Sparkles, User } from 'lucide-react';
import { ROLE_LABELS, useAppStore, type UserRole } from '@/store/appStore';
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
    themeMode,
    toggleThemeMode,
    toggleAskAi,
  } = useAppStore();

  const { alerts, gaps, officials, evidence, datasets } = useDemoStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [openMenu, setOpenMenu] = useState<'search' | 'location' | 'role' | 'pii' | null>(null);

  const openAlertsCount = alerts.filter((a) => a.status !== 'RESOLVED' && a.status !== 'REJECTED').length;

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
        results.push({ label: `${g.id}: ${g.title}`, type: 'Gap', to: `/investigation?gapId=${g.id}` });
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
        results.push({ label: e.title, type: 'Evidence', to: `/evidence` });
      }
    });
    datasets.forEach((d) => {
      if (d.name.toLowerCase().includes(q) || d.category.toLowerCase().includes(q)) {
        results.push({ label: d.name, type: 'Dataset', to: `/knowledge?tab=catalogue` });
      }
    });
    return results.slice(0, 8);
  }, [searchQuery, gaps, officials, evidence, datasets]);

  const iconBtn =
    'group relative p-1.5 sm:p-2 rounded bg-slate-800/90 border border-slate-700 text-slate-100 hover:bg-[#7D2A42] hover:border-[#EF5A90] flex items-center justify-center shrink-0';

  const tooltipCls =
    'hidden sm:block pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity absolute top-full right-0 mt-1.5 whitespace-nowrap px-2 py-1 rounded bg-slate-900 text-white text-[11px] font-medium border border-slate-700 shadow-md z-50';

  return (
    <header className="bg-gov-navy text-white border-b border-slate-800 sticky top-0 z-40 shadow-xs">
      <div className="px-3 sm:px-4 py-1.5 flex items-center justify-between gap-2">
        {/* Left: Compact Toggle + Identity */}
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className={`md:hidden ${iconBtn}`}
            aria-label="Toggle mobile navigation"
          >
            <Menu className="w-4 h-4" />
            <span className="hidden sm:block pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity absolute top-full left-0 mt-1.5 whitespace-nowrap px-2 py-1 rounded bg-slate-900 text-white text-[11px] border border-slate-700 z-50">
              Menu
            </span>
          </button>
          <button
            type="button"
            onClick={toggleSidebar}
            className={`hidden md:inline-flex ${iconBtn}`}
            aria-label="Toggle sidebar"
          >
            <PanelLeft className="w-4 h-4" />
            <span className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity absolute top-full left-0 mt-1.5 whitespace-nowrap px-2 py-1 rounded bg-slate-900 text-white text-[11px] border border-slate-700 z-50">
              Toggle Sidebar
            </span>
          </button>
          <Link to="/" className="group relative flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded bg-[#7D2A42] text-white font-black flex items-center justify-center text-xs border border-[#EF5A90] shrink-0">
              WCD
            </div>
            <span className="hidden sm:inline font-bold text-sm text-white truncate">WCD Protection Portal</span>
            <span className="hidden sm:block pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity absolute top-full left-0 mt-1.5 whitespace-nowrap px-2 py-1 rounded bg-slate-900 text-white text-[11px] border border-slate-700 z-50">
              Ministry of Women & Child Development — Integrated Protection Platform
            </span>
          </Link>
        </div>

        {/* Right: Icon-Only Compact Controls (Hover & Click reveal full label) */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Search Icon */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenMenu(openMenu === 'search' ? null : 'search')}
              className={iconBtn}
              aria-label="Global platform search"
            >
              <Search className="w-4 h-4" />
              <span className={tooltipCls}>Global Search</span>
            </button>
            {openMenu === 'search' && (
              <div className="absolute right-0 mt-1.5 w-72 sm:w-80 bg-white text-slate-900 rounded-md shadow-lg border border-[#C98A87] p-2 z-50">
                <input
                  autoFocus
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search gaps, schemes, officials, laws..."
                  className="w-full px-2.5 py-1.5 rounded border border-[#C98A87] text-xs text-slate-900"
                />
                {searchResults.length > 0 && (
                  <div className="mt-1.5 max-h-60 overflow-y-auto divide-y divide-slate-100">
                    {searchResults.map((res, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setSearchQuery('');
                          setOpenMenu(null);
                          navigate(res.to);
                        }}
                        className="w-full text-left px-2 py-1.5 text-xs hover:bg-[#FFE5DE]/50 flex items-center justify-between gap-2"
                      >
                        <span className="truncate font-medium">{res.label}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono shrink-0">{res.type}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* District Scope Icon */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenMenu(openMenu === 'location' ? null : 'location')}
              className={iconBtn}
              aria-label={`Jurisdiction: ${selectedDistrict}, ${selectedState}`}
            >
              <MapPin className="w-4 h-4 text-[#FFC0CB]" />
              <span className={tooltipCls}>Jurisdiction: {selectedDistrict}, {selectedState}</span>
            </button>
            {openMenu === 'location' && (
              <div className="absolute right-0 mt-1.5 w-52 bg-white text-slate-900 rounded-md shadow-lg border border-[#C98A87] p-1.5 z-50 space-y-1 text-xs">
                <div className="px-2 py-1 text-[10px] font-bold uppercase text-[#7D2A42]">Select District</div>
                {districtOptions.map((opt) => (
                  <button
                    key={`${opt.state}:${opt.district}`}
                    type="button"
                    onClick={() => {
                      setSelectedDistrict(opt.state, opt.district);
                      setOpenMenu(null);
                    }}
                    className={`w-full text-left px-2 py-1.5 rounded ${
                      selectedDistrict === opt.district ? 'bg-[#FFE5DE] text-[#7D2A42] font-bold' : 'hover:bg-slate-100'
                    }`}
                  >
                    {opt.district}, {opt.state}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Alerts Bell Icon */}
          <Link
            to="/alerts"
            className={iconBtn}
            aria-label={`Alerts centre (${openAlertsCount} open)`}
          >
            <Bell className="w-4 h-4" />
            {openAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 px-1 min-w-[15px] h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">
                {openAlertsCount}
              </span>
            )}
            <span className={tooltipCls}>Alerts & Notifications ({openAlertsCount} open)</span>
          </Link>

          {/* Black & White Theme Toggle Icon */}
          <button
            type="button"
            onClick={toggleThemeMode}
            className={iconBtn}
            aria-label="Toggle Black and White theme"
          >
            <Contrast className="w-4 h-4" />
            <span className={tooltipCls}>
              {themeMode === 'bw' ? 'Switch to Pink Civic Theme' : 'Switch to Black & White Theme'}
            </span>
          </button>

          {/* Zero PII Icon */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenMenu(openMenu === 'pii' ? null : 'pii')}
              className={iconBtn}
              aria-label="Zero PII Safeguarding Active"
            >
              <Shield className="w-4 h-4 text-[#8AEA92]" />
              <span className={tooltipCls}>Zero-PII Safeguarding Active</span>
            </button>
            {openMenu === 'pii' && (
              <div className="absolute right-0 mt-1.5 w-60 bg-white text-slate-900 rounded-md shadow-lg border border-[#C98A87] p-2.5 z-50 text-xs">
                <div className="font-bold text-[#7D2A42] mb-1">Zero-PII Safeguarding</div>
                <p className="text-[11px] text-slate-600">All references use pseudonymous tokens; raw Aadhaar, phone, and email payloads are blocked (`422`).</p>
              </div>
            )}
          </div>

          {/* Ask AI Dashboard Assistant Icon */}
          <button
            type="button"
            onClick={toggleAskAi}
            className="group relative p-1.5 sm:p-2 rounded bg-[#1F3864] border border-[#EF5A90] text-white hover:bg-[#7D2A42] flex items-center justify-center shrink-0"
            aria-label="Ask AI about this dashboard"
          >
            <Sparkles className="w-4 h-4 text-[#FFC0CB]" />
            <span className={tooltipCls}>Ask AI — Dashboard Assistant</span>
          </button>

          {/* Help & Platform Knowledge Centre Icon */}
          <Link
            to="/help"
            className={iconBtn}
            aria-label="Help & Platform Knowledge Centre"
          >
            <CircleHelp className="w-4 h-4 text-[#FFC0CB]" />
            <span className={tooltipCls}>Help & Knowledge Centre</span>
          </Link>

          {/* 19-Step End-to-End Demo Button (Just before User Profile Icon) */}
          <Link
            to="/demo-flow"
            className="group relative p-1.5 sm:p-2 rounded bg-[#7D2A42] border border-[#EF5A90] text-white hover:bg-[#654161] flex items-center justify-center shrink-0"
            aria-label="19-Step End-to-End Demo Walkthrough"
          >
            <PlayCircle className="w-4 h-4" />
            <span className={tooltipCls}>19-Step End-to-End Demo</span>
          </Link>

          {/* User Profile / Role Icon */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenMenu(openMenu === 'role' ? null : 'role')}
              className={iconBtn}
              aria-label={`User Role: ${ROLE_LABELS[currentRole]}`}
            >
              <User className="w-4 h-4 text-[#FFC0CB]" />
              <span className={tooltipCls}>Profile: {ROLE_LABELS[currentRole]}</span>
            </button>
            {openMenu === 'role' && (
              <div className="absolute right-0 mt-1.5 w-64 bg-white text-slate-900 rounded-md shadow-lg border border-[#C98A87] p-1.5 z-50 space-y-1 text-xs">
                <div className="px-2 py-1 text-[10px] font-bold uppercase text-[#7D2A42]">Active Official Role</div>
                {Object.entries(ROLE_LABELS).map(([roleKey, label]) => (
                  <button
                    key={roleKey}
                    type="button"
                    onClick={() => {
                      setCurrentRole(roleKey as UserRole);
                      setOpenMenu(null);
                    }}
                    className={`w-full text-left px-2 py-1.5 rounded ${
                      currentRole === roleKey ? 'bg-[#FFE5DE] text-[#7D2A42] font-bold' : 'hover:bg-slate-100'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
