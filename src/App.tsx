import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { AttentionCentrePage } from '@/pages/AttentionCentrePage';
import { WomenWorkspacePage } from '@/pages/WomenWorkspacePage';
import { GapExplorerPage } from '@/pages/GapExplorerPage';
import { InvestigationPage } from '@/pages/InvestigationPage';
import { EvidenceLibraryPage } from '@/pages/EvidenceLibraryPage';
import { InterventionsPage } from '@/pages/InterventionsPage';
import { OutcomesPage } from '@/pages/OutcomesPage';
import { KnowledgeAssistantPage } from '@/pages/KnowledgeAssistantPage';
import { AuditPage } from '@/pages/AuditPage';
import { ChildProtectionPage } from '@/pages/ChildProtectionPage';

export function App() {
  return (
    <Router basename="/women-child-protection-agent">
      <AppLayout>
        <Routes>
          <Route path="/" element={<AttentionCentrePage />} />
          <Route path="/women-workspace" element={<WomenWorkspacePage />} />
          <Route path="/gaps" element={<GapExplorerPage />} />
          <Route path="/investigation" element={<InvestigationPage />} />
          <Route path="/evidence" element={<EvidenceLibraryPage />} />
          <Route path="/interventions" element={<InterventionsPage />} />
          <Route path="/outcomes" element={<OutcomesPage />} />
          <Route path="/knowledge-assistant" element={<KnowledgeAssistantPage />} />
          <Route path="/audit" element={<AuditPage />} />
          <Route path="/child-protection" element={<ChildProtectionPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;
