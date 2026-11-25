import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Bot, Compass, Send, ShieldAlert, Sparkles, X } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { useDemoStore } from '@/store/demoStore';
import { useGovernanceStore } from '@/store/governanceStore';
import { HELP_FAQS, HELP_GLOSSARY, HELP_SCREEN_DIRECTORY } from '@/data/help/catalogues';
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
  'Pending items & bottlenecks',
  'Who owns next actions?',
  'Financial & dependency blockers',
  'AI safety & human gates',
];

const IMPORTANT_PAGES = [
  { label: 'Home Hub', to: '/' },
  { label: 'Matter 360°', to: '/matter-360' },
  { label: 'Dependencies', to: '/dependencies' },
  { label: 'Ownership', to: '/ownership' },
  { label: 'Finance', to: '/finance' },
  { label: 'Outcomes (M17)', to: '/outcomes' },
  { label: 'Women (M18)', to: '/women' },
  { label: '19-Step Demo', to: '/demo-flow' },
  { label: 'Help Centre', to: '/help' },
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
    const overdueRaci = raciAssignments.filter(
      (r) => r.status === 'NOT_STARTED' || r.status === 'WAITING_FOR_DEPENDENCY'
    ).length;
    const activeMatters = matters.length;
    const pendingFinance = financials.filter((f) => f.sanctionedInr > f.releasedInr).length;
    return {
      openAlerts,
      activeGaps,
      blockedDeps,
      overdueRaci,
      activeMatters,
      pendingFinance,
      evidenceCount: evidence.length,
    };
  }, [alerts, gaps, dependencies, raciAssignments, matters, financials, evidence.length]);

  const generateResponse = (promptText: string): ChatMessage => {
    const q = promptText.toLowerCase().trim();
    const tokens = q.split(/[^a-z0-9]+/).filter((t) => t.length >= 3);

    if (!q || q.includes('explain') || q.includes('this dashboard') || q.includes('what is this') || q.includes('overview')) {
      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        epistemicTag: 'SYNTHETIC_DEMO',
        text: `**${screenMeta.name}** (${screenMeta.status}): ${screenMeta.purpose}\n\n• **Problem Addressed:** ${screenMeta.problemAddressed}\n• **Intended Users:** ${screenMeta.intendedUsers}\n• **Key Actions:** ${screenMeta.actions}\n• **Live Demo Snapshot (${selectedDistrict}, ${selectedState}):** ${liveSummary.activeMatters} matters, ${liveSummary.activeGaps} open gaps, ${liveSummary.openAlerts} alerts, ${liveSummary.blockedDeps} waiting/blocked dependencies.`,
        links: [
          { label: 'Help & Knowledge Centre', to: '/help' },
          { label: '19-Step Demo', to: '/demo-flow' },
        ],
      };
    }

    if (q.includes('pending') || q.includes('blocked') || q.includes('bottleneck') || q.includes('alert') || q.includes('status')) {
      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        epistemicTag: 'SYNTHETIC_DEMO',
        text: `Current synthetic bottlenecks in **${selectedDistrict}, ${selectedState}**:\n• **Open Alerts:** ${liveSummary.openAlerts}\n• **Open Gap Contracts:** ${liveSummary.activeGaps}\n• **Blocked / Waiting Dependencies:** ${liveSummary.blockedDeps}\n• **Pending Ownership Actions:** ${liveSummary.overdueRaci}\n• **Sanctioned Funds Awaiting Release:** ${liveSummary.pendingFinance}`,
        links: [
          { label: 'Dependency 360°', to: '/dependencies' },
          { label: 'Alerts & Escalations', to: '/alerts' },
          { label: 'My Work Queue', to: '/my-work' },
        ],
      };
    }

    if (q.includes('owner') || q.includes('who owns') || q.includes('raci') || q.includes('responsib') || q.includes('transfer')) {
      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        epistemicTag: 'SYNTHETIC_DEMO',
        text: `Every action is attached to a **role-based owner** (retained across officer transfers). Currently **${liveSummary.overdueRaci}** RACI assignments are Not Started or Waiting for Dependency. Active role: **${currentRole}**.`,
        links: [
          { label: 'Ownership & RACI Matrix', to: '/ownership' },
          { label: 'Matter 360°', to: '/matter-360' },
        ],
      };
    }

    if (q.includes('financ') || q.includes('fund') || q.includes('money') || q.includes('sanction') || q.includes('budget')) {
      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        epistemicTag: 'SYNTHETIC_DEMO',
        text: `Financial Intelligence tracks **Allocated → Sanctioned → Released → Disbursed → Utilised → Verified**. Currently **${liveSummary.pendingFinance}** scheme records have sanctioned funds awaiting release, and **${liveSummary.blockedDeps}** dependencies are waiting/blocked.`,
        links: [
          { label: 'Financial Intelligence', to: '/finance' },
          { label: 'Dependency 360°', to: '/dependencies' },
        ],
      };
    }

    if (q.includes('safety') || q.includes('gate') || q.includes('pii') || q.includes('child') || q.includes('human') || q.includes('law')) {
      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        epistemicTag: 'VERIFIED_FACT',
        text: `**Non-Negotiable Platform Guardrails:**\n1. **Zero-PII:** Raw Aadhaar, phone, and email payloads are blocked (\`422\`); cases use pseudonymous tokens.\n2. **Human-Led Decisions:** AI never auto-validates gaps, approves interventions, sanctions funds, or certifies outcomes.\n3. **Domain B Isolation:** Live child case writes are locked (\`403\`) in MVP.\n4. **WORM Audit:** All state changes & AI outputs are SHA-256 hash-chained.`,
        links: [
          { label: 'Governance & Safety', to: '/governance?tab=explainability' },
          { label: 'WORM Audit Ledger', to: '/audit' },
        ],
      };
    }

    const scoreText = (haystack: string) =>
      tokens.reduce((acc, t) => (haystack.toLowerCase().includes(t) ? acc + 1 : acc), 0);

    const bestFaq = [...HELP_FAQS]
      .map((item) => ({ item, score: scoreText(`${item.question} ${item.answer} ${item.category}`) }))
      .sort((a, b) => b.score - a.score)[0];

    const bestProb = [...PROBLEM_SOLUTIONS]
      .map((item) => ({ item, score: scoreText(`${item.problem} ${item.systemicGap} ${item.proposedCapability}`) }))
      .sort((a, b) => b.score - a.score)[0];

    const bestRole = [...HELP_ROLES]
      .map((item) => ({ item, score: scoreText(`${item.title} ${item.overview} ${item.decisionsAuthority}`) }))
      .sort((a, b) => b.score - a.score)[0];

    const bestScreen = [...HELP_SCREEN_DIRECTORY]
      .map((item) => ({ item, score: scoreText(`${item.name} ${item.purpose} ${item.category} ${item.actions}`) }))
      .sort((a, b) => b.score - a.score)[0];

    const bestGlossary = [...HELP_GLOSSARY]
      .map((item) => ({ item, score: scoreText(`${item.term} ${item.plainDefinition}`) }))
      .sort((a, b) => b.score - a.score)[0];

    const candidates = [
      { kind: 'faq', score: bestFaq?.score || 0 },
      { kind: 'prob', score: bestProb?.score || 0 },
      { kind: 'role', score: bestRole?.score || 0 },
      { kind: 'screen', score: bestScreen?.score || 0 },
      { kind: 'glossary', score: bestGlossary?.score || 0 },
    ].sort((a, b) => b.score - a.score);

    const top = candidates[0];
    if (top && top.score > 0) {
      if (top.kind === 'faq' && bestFaq) {
        return {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          epistemicTag: 'VERIFIED_FACT',
          text: `**${bestFaq.item.question}**\n\n${bestFaq.item.answer}`,
          links: [{ label: 'Help & Knowledge Centre', to: '/help' }],
        };
      }
      if (top.kind === 'prob' && bestProb) {
        return {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          epistemicTag: 'SYNTHETIC_DEMO',
          text: `**Problem:** ${bestProb.item.problem}\n• **Systemic Gap:** ${bestProb.item.systemicGap}\n• **Platform Solution:** ${bestProb.item.proposedCapability}\n• **Expected Outcome:** ${bestProb.item.expectedImprovement}`,
          links: bestProb.item.screens.map((s) => ({ label: s.name, to: s.route })),
        };
      }
      if (top.kind === 'role' && bestRole) {
        return {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          epistemicTag: 'VERIFIED_FACT',
          text: `**Role: ${bestRole.item.title}**\n${bestRole.item.overview}\n• **Authority:** ${bestRole.item.decisionsAuthority}\n• **Access Boundary:** ${bestRole.item.accessBoundary}`,
          links: bestRole.item.screens.map((s) => ({ label: s.name, to: s.route })),
        };
      }
      if (top.kind === 'screen' && bestScreen) {
        return {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          epistemicTag: 'SYNTHETIC_DEMO',
          text: `**${bestScreen.item.name}** (${bestScreen.item.status}): ${bestScreen.item.purpose}\n• **Problem Addressed:** ${bestScreen.item.problemAddressed}\n• **Actions:** ${bestScreen.item.actions}`,
          links: [{ label: `Open ${bestScreen.item.name}`, to: bestScreen.item.route }],
        };
      }
      if (top.kind === 'glossary' && bestGlossary) {
        return {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          epistemicTag: 'VERIFIED_FACT',
          text: `**${bestGlossary.item.term}:** ${bestGlossary.item.plainDefinition}`,
          links: [{ label: 'Glossary in Help Centre', to: '/help' }],
        };
      }
    }

    return {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      epistemicTag: 'DATA_NOT_AVAILABLE',
      text: `Grounded summary for "${promptText}" on **${screenMeta.name}**: ${screenMeta.purpose}\n\nNo exact match was found in local statutory FAQs; open **Help & Knowledge Centre** or **Statutory RAG Assistant** for full document search.`,
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

  // Persistent Bottom-Right Ask AI Launcher when collapsed
  if (!askAiOpen) {
    return (
      <div className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-40">
        <button
          type="button"
          onClick={() => setAskAiOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#1F3864] hover:bg-[#7D2A42] text-white border border-[#EF5A90] shadow-lg text-xs font-bold transition-colors"
          aria-label="Open Ask AI Dashboard Assistant"
        >
          <Sparkles className="w-4 h-4 text-[#FFC0CB]" />
          <span>Ask AI</span>
          <span className="hidden sm:inline text-[10px] font-normal px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-200 max-w-[140px] truncate">
            {screenMeta.name}
          </span>
        </button>
      </div>
    );
  }

  return (
    <aside
      aria-label="Ask AI Dashboard Assistant"
      className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-50 w-[calc(100vw-1.5rem)] sm:w-[440px] max-h-[82vh] bg-white rounded-lg border border-slate-300 shadow-2xl flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gov-navy text-white px-3.5 py-2.5 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2 min-w-0">
          <Sparkles className="w-4 h-4 text-[#FFC0CB] shrink-0" />
          <div className="min-w-0">
            <div className="text-xs sm:text-sm font-bold leading-tight truncate">Ask AI — Dashboard Assistant</div>
            <div className="text-[10px] text-slate-300 truncate">Active: {screenMeta.name}</div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setAskAiOpen(false)}
          className="p-1 rounded hover:bg-slate-800 text-slate-200 shrink-0"
          aria-label="Minimize Ask AI"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Active Screen Context + Live Metrics */}
      <div className="p-2.5 bg-[#FFE5DE]/40 border-b border-[#C98A87]/40 text-xs space-y-1">
        <div className="flex items-center justify-between gap-2">
          <span className="font-bold text-[#7D2A42] truncate">{screenMeta.name}</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white border border-[#C98A87] text-[#7D2A42] shrink-0">
            {screenMeta.status}
          </span>
        </div>
        <p className="text-[11px] text-slate-700 leading-snug">{screenMeta.purpose}</p>
        <div className="flex flex-wrap gap-1 pt-0.5 text-[10px] font-mono text-slate-700">
          <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200">Matters: {liveSummary.activeMatters}</span>
          <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200">Gaps: {liveSummary.activeGaps}</span>
          <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200">Alerts: {liveSummary.openAlerts}</span>
          <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200">Blocked Deps: {liveSummary.blockedDeps}</span>
        </div>
      </div>

      {/* Important Pages Section */}
      <div className="px-2.5 py-2 border-b border-slate-200 bg-slate-50 space-y-1">
        <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-600">
          <Compass className="w-3 h-3 text-[#7D2A42]" />
          <span>Important Platform Pages</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {IMPORTANT_PAGES.map((p) => (
            <Link
              key={p.to}
              to={p.to}
              onClick={() => setAskAiOpen(false)}
              className={`text-[10px] px-2 py-0.5 rounded border font-semibold transition-colors ${
                location.pathname === p.to
                  ? 'bg-[#7D2A42] text-white border-[#7D2A42]'
                  : 'bg-white text-slate-700 border-slate-300 hover:border-[#7D2A42] hover:text-[#7D2A42]'
              }`}
            >
              {p.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Prompts */}
      <div className="px-2.5 py-1.5 border-b border-slate-200 bg-white flex flex-wrap gap-1">
        {QUICK_PROMPTS.map((qp) => (
          <button
            key={qp}
            type="button"
            onClick={() => handleSend(qp)}
            className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 border border-slate-300 text-slate-800 hover:border-[#7D2A42] hover:text-[#7D2A42] font-medium"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Conversation Feed */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-2.5 bg-white text-xs min-h-[150px]">
        {messages.length === 0 && (
          <div className="p-2.5 rounded-md border border-slate-200 bg-slate-50 text-slate-700 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-gov-navy">
              <Bot className="w-4 h-4 text-[#7D2A42]" />
              <span>Ask anything about {screenMeta.name}</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Click a quick prompt, jump to an important page above, or type your own question below.
            </p>
          </div>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            className={`p-2 rounded-md border ${
              m.sender === 'user'
                ? 'ml-6 bg-slate-100 border-slate-300 text-slate-900'
                : 'mr-2 bg-white border-[#C98A87]/60 text-slate-800 shadow-2xs'
            }`}
          >
            {m.epistemicTag && (
              <div className="mb-1">
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  {m.epistemicTag}
                </span>
              </div>
            )}
            <div className="whitespace-pre-line leading-relaxed text-[11.5px]">{m.text}</div>
            {m.links && m.links.length > 0 && (
              <div className="mt-1.5 pt-1.5 border-t border-slate-100 flex flex-wrap gap-1">
                {m.links.map((l) => (
                  <Link
                    key={l.to + l.label}
                    to={l.to}
                    onClick={() => setAskAiOpen(false)}
                    className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-[#FFE5DE] text-[#7D2A42] font-semibold hover:bg-[#FFC0CB]"
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
      <div className="p-2.5 border-t border-slate-200 bg-slate-50 space-y-1.5">
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
            className="px-3 py-1.5 rounded bg-[#7D2A42] hover:bg-[#654161] text-white text-xs font-semibold inline-flex items-center gap-1 shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Ask</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
