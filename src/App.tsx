import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

export function App() {
  return (
    <Router basename="/women-child-protection-agent">
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <header className="bg-gov-navy text-white px-6 py-4 shadow-md flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded bg-amber-500 flex items-center justify-center font-bold text-slate-900 text-lg">
              श
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">WCD Protection Intelligence Platform</h1>
              <p className="text-xs text-slate-300">Ministry of Women & Child Development | Project Suraksha Sentinel & Sahyog</p>
            </div>
          </div>
          <div className="text-xs text-right text-slate-300">
            <span className="inline-block px-2 py-0.5 rounded bg-emerald-800 text-emerald-100 font-medium">Zero PII Architecture</span>
          </div>
        </header>

        <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
          <Routes>
            <Route path="/" element={<div className="p-8 bg-white border border-slate-200 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Phase 1: Foundation Ready</h2>
              <p className="text-slate-600">Core project scaffolding, strict typing, Tailwind styles, and domain contracts initialized.</p>
            </div>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
