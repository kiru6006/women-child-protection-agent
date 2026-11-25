import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bot, Send, ShieldAlert, Sparkles, X, ArrowRight } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { useDemoStore } from '@/store/demoStore';
import { useGovernanceStore } from '@/store/governanceStore';
import { HELP_SCREEN_DIRECTORY, HELP_FAQS } from '@/data/help/catalogues';
import { PROBLEM_SOLUTIONS } from '@/data/help/categories';
import { HELP_ROLES } from '@/data/help/guides';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  epistemicTag?: 'SYNTHETIC_DEMO' | 'VERIFIED_FACT' | 'DATA_NOT_AVAILABLE';
  links?: { label: string; to: string }[];
}

const QUICK_PROMPTS = [
  'Explain this dashboard',
  'What items are pending or blocked?',
  'Who owns next actions?',
  'Financial & dependency blockers',
  'AI safety & human gates',
];

export function AskAIDrawer() {
  const location = useLocation();
  const { askAiOpen, setAskAiOpen, currentRole, selectedDistrict, selectedState } = useAppStore();
  const { alerts, gaps, evidence } = useDemoStore();
  const { matters, dependencies, raciAssignments, financials } = useGovernanceStore();

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const screenMeta = useMemo(() => {
    const exact = HELP_SCREEN_DIRECTORY.find((s) => s.route.split('?')[0] === location.pathname);
    return (
      exact || {
        name: 'WCD Integrated Protection Platform',
        route: location.pathname,
        category: 'Platform Workspace',
        purpose: 'Cross-departmental Women & Child Protection intelligence, convergence, and execution workspace.',
        problemAddressed: 'Fragmented protection handoffs, unclear ownership, and unverified outcomes.',
        intendedUsers: 'Ministers, Secretaries, District Collectors, WCD, Police, Legal, Finance & NGOs',
        actions: 'Inspect matters, resolve dependencies, approve interventions, and verify outcomes.',
        status: 'AVAILABLE' as const,
      }
    );
  }, [location.pathname]);

  const liveSummary = useMemo(() => {
    const openAlerts = alerts.filter((a) => a.status !== 'RESOLVED' && a.status !== 'REJECTED').length;
    const activeGaps = gaps.filter((g) => g.status !== 'CLOSED' && g.status !== 'REJECTED').length;
    const blockedDeps = dependencies.filter((d) => d.status === 'BLOCKED' || d.status.startsWith('WAITING_')).length;
    const overdueRaci = raciAssignments.filter((r) => r.status === 'NOT_STARTED' || r.status === 'WAITING_FOR_DEPENDENCY').length;
    const delayedMatters = matters.length;
    const pendingFinance = financials.filter((f) => f.sanctionedInr > f.releasedInr).length;
    return { openAlerts, activeGaps, blockedDeps, overdueRaci, delayedMatters, pendingFinance, evidenceCount: evidence.length };
  }, [alerts, gaps, dependencies, raciAssignments, matters, financials, evidence.length]);

  if (!askAiOpen) return null;

  const generateResponse = (promptText: string): ChatMessage => {
    const q = promptText.toLowerCase().trim();

    if (!q || q.includes('explain') || q.includes('this dashboard') || q.includes('what is this')) {
      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        epistemicTag: 'SYNTHETIC_DEMO',
        text: `**${screenMeta.name}** (${screenMeta.status}): ${screenMeta.purpose}\n\n• **Problem Addressed:** ${screenMeta.problemAddressed}\n• **Intended Users:** ${screenMeta.intendedUsers}\n• **Key Actions:** ${screenMeta.actions}\n• **Live Demo Snapshot (${selectedDistrict}, ${selectedState}):** ${liveSummary.delayedMatters} active matters, ${liveSummary.activeGaps} open gaps, ${liveSummary.openAlerts} open alerts, and ${liveSummary.blockedDeps} pending/blocked dependencies.`,
        links: [
          { label: 'Help & Knowledge Centre', to: '/help' },
          { label: '19-Step End-to-End Demo', to: '/demo-flow' },
        ],
      };
    }

    if (q.includes('pending') || q.includes('blocked') || q.includes('bottleneck') || q.includes('alert')) {
      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        epistemicTag: 'SYNTHETIC_DEMO',
        text: `Current synthetic demo bottlenecks for **${selectedDistrict}, ${selectedState}**:\n• **Open Alerts:** ${liveSummary.openAlerts}\n• **Open Gap Contracts:** ${liveSummary.activeGaps}\n• **Pending / Blocked Dependencies:** ${liveSummary.blockedDeps}\n• **Overdue / Unassigned Ownership:** ${liveSummary.overdueRaci}\n• **Financial Sanctions Awaiting Release:** ${liveSummary.pendingFinance}`,
        links: [
          { label: 'Dependency 360°', to: '/dependencies' },
          { label: 'Alerts & Escalations', to: '/alerts' },
          { label: 'My Work Queue', to: '/my-work' },
        ],
      };
    }

    if (q.includes('owner') || q.includes('who owns') || q.includes('raci') || q.includes('responsib')) {
      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        epistemicTag: 'SYNTHETIC_DEMO',
        text: `Every action is attached to a **role-based owner** (never orphaned on transfer). Currently ${liveSummary.overdueRaci} RACI assignments are overdue or unassigned across active matters. Active header role: **${currentRole}**.`,
        links: [
          { label: 'Ownership & RACI Matrix', to: '/ownership' },
          { label: 'Matter 360°', to: '/matter-360' },
        ],
      };
    }

    if (q.includes('financ') || q.includes('fund') || q.includes('money') || q.includes('sanction') || q.includes('depend')) {
      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        epistemicTag: 'SYNTHETIC_DEMO',
        text: `Financial Intelligence tracks **Allocated → Sanctioned → Released → Disbursed → Utilised → Verified**. Currently **${liveSummary.pendingFinance}** scheme records await release/disbursement, and **${liveSummary.blockedDeps}** cross-department dependencies are pending or blocked (distinguishing lawful court/forensic waits from administrative failures).`,
        links: [
          { label: 'Financial Intelligence', to: '/finance' },
          { label: 'Dependency 360°', to: '/dependencies' },
        ],
      };
    }

    if (q.includes('safety') || q.includes('gate') || q.includes('pii') || q.includes('child') || q.includes('human')) {
      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        epistemicTag: 'VERIFIED_FACT',
        text: `**Mandatory Platform Guardrails:**\n1. **Zero-PII:** Raw Aadhaar, phone, and email payloads are blocked (\`422\`); cases use pseudonymous tokens.\n2. **Human-Led Decisions:** AI cannot auto-validate gaps, approve interventions, sanction funds, or certify outcomes.\n3. **Domain B Isolation:** Live child case writes are locked (\`403\`) in MVP.\n4. **WORM Audit:** All state changes and AI outputs are SHA-256 hash-chained.`,
        links: [
          { label: 'Governance & Safety', to: '/governance?tab=explainability' },
          { label: 'WORM Audit Ledger', to: '/audit' },
        ],
      };
    }

    // Structured local search across FAQs, Problem-Solutions, Roles, and Screens
    const faqMatch = HELP_FAQS.find(
      (f) => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)
    );
    if (faqMatch) {
      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        epistemicTag: 'VERIFIED_FACT',
        text: `**${faqMatch.question}**\n\n${faqMatch.answer}`,
        links: [{ label: 'Open Help Knowledge Centre', to: '/help' }],
      };
    }

    const probMatch = PROBLEM_SOLUTIONS.find(
      (p) => p.problem.toLowerCase().includes(q) || p.systemicGap.toLowerCase().includes(q) || p.proposedCapability.toLowerCase().includes(q)
    );
    if (probMatch) {
      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        epistemicTag: 'SYNTHETIC_DEMO',
        text: `**Problem:** ${probMatch.problem}\n• **Gap:** ${probMatch.systemicGap}\n• **Platform Capability:** ${probMatch.proposedCapability}\n• **Expected Outcome:** ${probMatch.expectedImprovement}`,
        links: probMatch.screens.map((s) => ({ label: s.name, to: s.route })),
      };
    }

    const roleMatch = HELP_ROLES.find((r) => r.title.toLowerCase().includes(q) || r.overview.toLowerCase().includes(q));
    if (roleMatch) {
      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        epistemicTag: 'VERIFIED_FACT',
        text: `**Role: ${roleMatch.title}**\n${roleMatch.overview}\n\n• **Authority:** ${roleMatch.decisionsAuthority}\n• **Access Boundary:** ${roleMatch.accessBoundary}`,
        links: roleMatch.screens.map((s) => ({ label: s.name, to: s.route })),
      };
    }

    const screenMatch = HELP_SCREEN_DIRECTORY.find(
      (s) => s.name.toLowerCase().includes(q) || s.purpose.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)
    );
    if (screenMatch) {
      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        epistemicTag: 'SYNTHETIC_DEMO',
        text: `**${screenMatch.name}** (${screenMatch.status}): ${screenMatch.purpose}\n\n• **Intended Users:** ${screenMatch.intendedUsers}\n• **Actions:** ${screenMatch.actions}`,
        links: [{ label: `Open ${screenMatch.name}`, to: screenMatch.route }],
      };
    }

    return {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      epistemicTag: 'DATA_NOT_AVAILABLE',
      text: `DATA NOT AVAILABLE in local grounded knowledge for "${promptText}". Try asking about the current dashboard (**${screenMeta.name}**), pending bottlenecks, ownership/RACI, finance/dependencies, or open the Help Knowledge Centre.`,
      links: [
        { label: 'Help & Knowledge Centre', to: '/help' },
        { label: 'Statutory RAG Assistant', to: '/knowledge-assistant' },
      ],
    };
  };

  const handleSend = (promptText: string) => {
    const trimmed = promptText.trim();
    if (!trimmed) return;
    const userMsg: ChatMessage = { id: `u-${Date.now()}`, sender: 'user', text: trimmed };
    const aiMsg = generateResponse(trimmed);
    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setInput('');
  };

  return (
    <aside
      aria-label="Ask AI Dashboard Assistant"
      className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white border-l border-slate-300 shadow-2xl flex flex-col"
    >
      {/* Header */}
      <div className="bg-gov-navy text-white px-4 py-3 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#FFC0CB]" />
          <div>
            <div className="text-sm font-bold leading-tight">Ask AI — Dashboard Assistant</div>
            <div className="text-[10px] text-slate-300">Bounded Grounded Intelligence • Zero External PII</div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setAskAiOpen(false)}
          className="p-1.5 rounded hover:bg-slate-800 text-slate-200"
          aria-label="Close Ask AI drawer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Active Screen Context Card */}
      <div className="p-3 bg-[#FFE5DE]/40 border-b border-[#C98A87]/40 text-xs space-y-1">
        <div className="flex items-center justify-between gap-2">
          <span className="font-bold text-[#7D2A42] truncate">{screenMeta.name}</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white border border-[#C98A87] text-[#7D2A42] shrink-0">
            {screenMeta.status}
          </span>
        </div>
        <p className="text-[11px] text-slate-700 leading-snug">{screenMeta.purpose}</p>
        <div className="flex flex-wrap gap-1.5 pt-1 text-[10px] font-mono text-slate-700">
          <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200">Matters: {liveSummary.delayedMatters}</span>
          <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200">Gaps: {liveSummary.activeGaps}</span>
          <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200">Alerts: {liveSummary.openAlerts}</span>
          <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200">Blocked Deps: {liveSummary.blockedDeps}</span>
        </div>
      </div>

      {/* Quick Prompts */}
      <div className="px-3 py-2 border-b border-slate-200 bg-slate-50 flex flex-wrap gap-1.5">
        {QUICK_PROMPTS.map((qp) => (
          <button
            key={qp}
            type="button"
            onClick={() => handleSend(qp)}
            className="text-[11px] px-2 py-1 rounded-full bg-white border border-slate-300 text-slate-800 hover:border-[#7D2A42] hover:text-[#7D2A42] font-medium"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Conversation Feed */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-white text-xs">
        {messages.length === 0 && (
          <div className="p-3 rounded-md border border-slate-200 bg-slate-50 text-slate-700 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-gov-navy">
              <Bot className="w-4 h-4 text-[#7D2A42]" />
              <span>Ready to explain {screenMeta.name}</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Click a quick prompt above or ask any question about this dashboard&apos;s metrics, responsible owners, dependencies, financial status, or platform guardrails.
            </p>
          </div>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            className={`p-2.5 rounded-md border ${
              m.sender === 'user'
                ? 'ml-6 bg-slate-100 border-slate-300 text-slate-900'
                : 'mr-2 bg-white border-[#C98A87]/60 text-slate-800 shadow-2xs'
            }`}
          >
            {m.epistemicTag && (
              <div className="mb-1 flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  {m.epistemicTag}
                </span>
              </div>
            )}
            <div className="whitespace-pre-line leading-relaxed text-[12px]">{m.text}</div>
            {m.links && m.links.length > 0 && (
              <div className="mt-2 pt-1.5 border-t border-slate-100 flex flex-wrap gap-1.5">
                {m.links.map((l) => (
                  <Link
                    key={l.to + l.label}
                    to={l.to}
                    onClick={() => setAskAiOpen(false)}
                    className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-[#FFE5DE] text-[#7D2A42] font-semibold hover:bg-[#FFC0CB]"
                  >
                    <span>{l.label}</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Human-Gate Notice + Prompt Input */}
      <div className="p-3 border-t border-slate-200 bg-slate-50 space-y-2">
        <div className="flex items-center gap-1.5 text-[10px] text-slate-600">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-700 shrink-0" />
          <span>AI intelligence only — statutory, financial & outcome approvals remain human-led.</span>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="flex items-center gap-1.5"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask about ${screenMeta.name}...`}
            className="flex-1 px-2.5 py-1.5 rounded border border-slate-300 text-xs text-slate-900 bg-white"
          />
          <button
            type="submit"
            className="px-3 py-1.5 rounded bg-[#7D2A42] hover:bg-[#654161] text-white text-xs font-semibold inline-flex items-center gap-1"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Ask</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
