import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { AskAIDrawer } from './AskAIDrawer';
import { useAppStore } from '@/store/appStore';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { usingMockFallback } = useAppStore();

  return (
    <div className="min-h-screen bg-app flex flex-col font-sans">
      <Header />
      {usingMockFallback && (
        <div
          role="status"
          className="bg-amber-50 border-b border-amber-300 px-4 py-1.5 text-xs text-amber-900 flex items-center justify-center gap-2 font-medium"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
          <span>
            <strong>DEMO MODE (SYNTHETIC DATA):</strong> Interactive demonstration running with mock government datasets. Zero real PII.
          </span>
        </div>
      )}
      <div className="flex-1 flex overflow-hidden relative">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-3 md:p-4 lg:p-5 bg-app">
          <div className="max-w-7xl mx-auto space-y-4">
            {children}
          </div>
        </main>
        <AskAIDrawer />
      </div>
    </div>
  );
}
