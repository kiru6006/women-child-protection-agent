import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { HomePage } from '@/pages/HomePage';
import { CommandCentrePage } from '@/pages/CommandCentrePage';
import { AlertsPage } from '@/pages/AlertsPage';
import { WomenWorkspacePage } from '@/pages/WomenWorkspacePage';
import { ChildProtectionPage } from '@/pages/ChildProtectionPage';
import { AIIntelligencePage } from '@/pages/AIIntelligencePage';
import { GapExplorerPage } from '@/pages/GapExplorerPage';
import { InvestigationPage } from '@/pages/InvestigationPage';
import { InterventionsPage } from '@/pages/InterventionsPage';
import { OutcomesPage } from '@/pages/OutcomesPage';
import { GeographyPage } from '@/pages/GeographyPage';
import { EcosystemPage } from '@/pages/EcosystemPage';
import { SchemesPage } from '@/pages/SchemesPage';
import { KnowledgeDataPage } from '@/pages/KnowledgeDataPage';
import { EvidenceLibraryPage } from '@/pages/EvidenceLibraryPage';
import { KnowledgeAssistantPage } from '@/pages/KnowledgeAssistantPage';
import { GovernancePage } from '@/pages/GovernancePage';
import { AuditPage } from '@/pages/AuditPage';

export function App() {
  return (
    <Router basename="/women-child-protection-agent">
      <AppLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/command-centre" element={<CommandCentrePage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/women" element={<WomenWorkspacePage />} />
          <Route path="/women-workspace" element={<WomenWorkspacePage />} />
          <Route path="/child" element={<ChildProtectionPage />} />
          <Route path="/child-protection" element={<ChildProtectionPage />} />
          <Route path="/ai-intelligence" element={<AIIntelligencePage />} />
          <Route path="/knowledge-assistant" element={<KnowledgeAssistantPage />} />
          <Route path="/gaps" element={<GapExplorerPage />} />
          <Route path="/investigation" element={<InvestigationPage />} />
          <Route path="/interventions" element={<InterventionsPage />} />
          <Route path="/outcomes" element={<OutcomesPage />} />
          <Route path="/geography" element={<GeographyPage />} />
          <Route path="/ecosystem" element={<EcosystemPage />} />
          <Route path="/schemes" element={<SchemesPage />} />
          <Route path="/knowledge" element={<KnowledgeDataPage />} />
          <Route path="/evidence" element={<EvidenceLibraryPage />} />
          <Route path="/governance" element={<GovernancePage />} />
          <Route path="/audit" element={<AuditPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;
