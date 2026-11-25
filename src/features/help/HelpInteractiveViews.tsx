import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/common/Card';
import { HELP_DEPARTMENTS, HELP_ISSUES, HELP_ROLES, HELP_WORK_CATEGORIES } from '@/data/help/guides';
import {
  HELP_FAQS,
  HELP_GLOSSARY,
  HELP_SCREEN_DIRECTORY,
  HELP_WALKTHROUGHS,
  LIFECYCLE_STEPS,
  PLATFORM_MINDMAP,
} from '@/data/help/catalogues';
import { PROBLEM_SOLUTIONS } from '@/data/help/categories';
import { MindmapNode } from '@/data/help/types';
import { ArrowRight, ChevronDown, ChevronRight, ExternalLink } from 'lucide-react';

export function AvailabilityBadge({ status }: { status: string }) {
  const cls =
    status === 'AVAILABLE'
      ? 'bg-[#DFFFE0] text-[#166534] border-[#16A028]'
      : status === 'DEMONSTRATION ONLY'
        ? 'bg-[#FFE5DE] text-[#7D2A42] border-[#C98A87]'
        : 'bg-[#FFFACD] text-[#7D2A42] border-[#C98A87]';
  return <span className={`text-[10px] px-2 py-0.5 rounded border font-mono font-bold ${cls}`}>{status}</span>;
}

export function Lifecycle18View() {
  const [selected, setSelected] = useState(LIFECYCLE_STEPS[0]);
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
        {LIFECYCLE_STEPS.map((s) => (
          <button
            key={s.step}
            type="button"
            onClick={() => setSelected(s)}
            className={`p-2 rounded border text-left text-[11px] ${
              selected.step === s.step
                ? 'bg-[#7D2A42] text-white border-[#7D2A42]'
                : 'bg-white text-slate-800 border-[#E5B8B7] hover:bg-[#FFE5DE]/40'
            }`}
          >
            <div className="font-mono text-[10px] opacity-80">{s.step}</div>
            <div className="font-bold truncate">{s.title}</div>
          </button>
        ))}
      </div>
      <Card header={<span className="text-xs font-bold text-[#1F3864]">Step {selected.step}: {selected.title}</span>}>
        <div className="space-y-2 text-xs">
          <p className="text-slate-700">{selected.explanation}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-2 rounded border border-slate-200 text-[11px]">
            <div><span className="text-slate-600 block font-bold uppercase">Input</span>{selected.input}</div>
            <div><span className="text-slate-600 block font-bold uppercase">Responsible</span>{selected.role}</div>
            <div><span className="text-slate-600 block font-bold uppercase">Output</span>{selected.output}</div>
            <div><span className="text-slate-600 block font-bold uppercase">Example</span>{selected.example}</div>
          </div>
          <Link to={selected.route} className="inline-flex items-center gap-1 text-xs font-semibold text-[#7D2A42] hover:underline">
            <span>Open Relevant Screen</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </Card>
    </div>
  );
}

export function ProblemSolutionView() {
  return (
    <div className="space-y-3">
      {PROBLEM_SOLUTIONS.map((p) => (
        <Card key={p.id}>
          <div className="space-y-2 text-xs">
            <div className="font-bold text-[#1F3864]">{p.id}: {p.problem}</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded border border-slate-200 text-[11px]">
              <div><strong className="text-[#7D2A42] block">Why It Matters:</strong>{p.whyItMatters}</div>
              <div><strong className="text-[#7D2A42] block">Existing Response:</strong>{p.existingResponse}</div>
              <div><strong className="text-[#7D2A42] block">Systemic Gap:</strong>{p.systemicGap}</div>
              <div><strong className="text-[#166534] block">Platform Solution:</strong>{p.proposedCapability}</div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
              <span className="text-slate-600"><strong>Stakeholders:</strong> {p.stakeholders.join(', ')}</span>
              <div className="flex flex-wrap gap-1.5">
                {p.screens.map((sc) => (
                  <Link key={sc.route} to={sc.route} className="px-2 py-0.5 rounded bg-[#FFE5DE] text-[#7D2A42] border border-[#C98A87] font-semibold hover:bg-[#FFC0CB]/60">
                    {sc.name} →
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export function RoleGuideView() {
  const [roleId, setRoleId] = useState(HELP_ROLES[0].id);
  const role = HELP_ROLES.find((r) => r.id === roleId) || HELP_ROLES[0];
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {HELP_ROLES.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setRoleId(r.id)}
            className={`px-2.5 py-1 rounded text-xs font-semibold border ${
              roleId === r.id ? 'bg-[#7D2A42] text-white border-[#7D2A42]' : 'bg-white text-slate-700 border-[#E5B8B7]'
            }`}
          >
            {r.title.split(' (')[0]}
          </button>
        ))}
      </div>
      <Card header={<span className="text-xs font-bold text-[#1F3864]">{role.title}</span>}>
        <div className="space-y-2.5 text-xs">
          <p className="text-slate-700">{role.overview}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200"><strong className="block text-[#7D2A42] mb-1">Primary Responsibilities</strong><ul className="list-disc pl-4 space-y-0.5">{role.responsibilities.map((x) => <li key={x}>{x}</li>)}</ul></div>
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200"><strong className="block text-[#7D2A42] mb-1">Daily Work & Required Info</strong><ul className="list-disc pl-4 space-y-0.5">{role.dailyWork.map((x) => <li key={x}>{x}</li>)}</ul></div>
            <div className="p-2.5 rounded bg-[#FFE5DE]/40 border border-[#C98A87]"><strong className="block text-[#7D2A42] mb-1">Decisions & Authority</strong>{role.decisionsAuthority}</div>
            <div className="p-2.5 rounded bg-[#FFFACD]/60 border border-[#C98A87]"><strong className="block text-[#7D2A42] mb-1">Data Access Boundary</strong>{role.accessBoundary}</div>
          </div>
          <div className="p-2.5 rounded bg-[#DFFFE0]/60 border border-[#16A028] text-[11px]">
            <strong>Example Workflow:</strong> {role.exampleWorkflow}
          </div>
          <div className="flex flex-wrap gap-2">
            {role.screens.map((s) => (
              <Link key={s.route} to={s.route} className="px-2.5 py-1 rounded bg-[#7D2A42] text-white font-semibold text-xs">
                Open {s.name} →
              </Link>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

export function DepartmentGuideView() {
  const [deptId, setDeptId] = useState(HELP_DEPARTMENTS[0].id);
  const dept = HELP_DEPARTMENTS.find((d) => d.id === deptId) || HELP_DEPARTMENTS[0];
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
        {HELP_DEPARTMENTS.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => setDeptId(d.id)}
            className={`p-2 rounded border text-left text-[11px] ${
              deptId === d.id ? 'bg-[#7D2A42] text-white border-[#7D2A42]' : 'bg-white text-slate-800 border-[#E5B8B7]'
            }`}
          >
            <div className="font-bold truncate">{d.name}</div>
            <div className="text-[10px] opacity-80 truncate">{d.relationship}</div>
          </button>
        ))}
      </div>
      <Card header={<span className="text-xs font-bold text-[#1F3864]">{dept.name} ({dept.relationship})</span>}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          <div className="p-2 bg-slate-50 rounded border border-slate-200"><strong className="block text-[#7D2A42]">Purpose</strong>{dept.purpose}</div>
          <div className="p-2 bg-slate-50 rounded border border-slate-200"><strong className="block text-[#7D2A42]">Laws & Schemes</strong>{dept.lawsSchemes}</div>
          <div className="p-2 bg-slate-50 rounded border border-slate-200"><strong className="block text-[#7D2A42]">Responsibilities & Activities</strong>{dept.responsibilities}</div>
          <div className="p-2 bg-slate-50 rounded border border-slate-200"><strong className="block text-[#7D2A42]">Info Exchanged & Dependencies</strong>{dept.docsExchanged} • Deps: {dept.dependencies}</div>
        </div>
        <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span><strong>Roles:</strong> {dept.responsibleRoles.join(', ')}</span>
          <div className="flex gap-1.5">
            {dept.screens.map((s) => (
              <Link key={s.route} to={s.route} className="px-2.5 py-1 rounded bg-[#7D2A42] text-white font-semibold">{s.name} →</Link>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

export function WorkCategoryView() {
  const [catId, setCatId] = useState(HELP_WORK_CATEGORIES[0].id);
  const cat = HELP_WORK_CATEGORIES.find((c) => c.id === catId) || HELP_WORK_CATEGORIES[0];
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {HELP_WORK_CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCatId(c.id)}
            className={`px-2.5 py-1 rounded text-xs font-semibold border ${
              catId === c.id ? 'bg-[#7D2A42] text-white border-[#7D2A42]' : 'bg-white text-slate-700 border-[#E5B8B7]'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>
      <Card header={<span className="text-xs font-bold text-[#1F3864]">{cat.name}</span>}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="p-2 bg-slate-50 rounded border border-slate-200"><strong>Purpose:</strong> {cat.purpose}</div>
          <div className="p-2 bg-slate-50 rounded border border-slate-200"><strong>Stakeholders:</strong> {cat.stakeholders}</div>
          <div className="p-2 bg-slate-50 rounded border border-slate-200"><strong>Deliverables:</strong> {cat.deliverables}</div>
          <div className="p-2 bg-slate-50 rounded border border-slate-200"><strong>Completion Criteria & Evidence:</strong> {cat.completionCriteria} ({cat.evidence})</div>
        </div>
        <div className="mt-2 flex gap-2">
          {cat.screens.map((s) => (
            <Link key={s.route} to={s.route} className="text-xs px-2.5 py-1 rounded bg-[#7D2A42] text-white font-semibold">{s.name} →</Link>
          ))}
        </div>
      </Card>
    </div>
  );
}

export function IssueGuideView() {
  const [issueId, setIssueId] = useState(HELP_ISSUES[0].id);
  const issue = HELP_ISSUES.find((i) => i.id === issueId) || HELP_ISSUES[0];
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {HELP_ISSUES.map((i) => (
          <button
            key={i.id}
            type="button"
            onClick={() => setIssueId(i.id)}
            className={`px-2.5 py-1 rounded text-xs font-semibold border ${
              issueId === i.id ? 'bg-[#7D2A42] text-white border-[#7D2A42]' : 'bg-white text-slate-700 border-[#E5B8B7]'
            }`}
          >
            [{i.domain}] {i.title}
          </button>
        ))}
      </div>
      <Card header={<span className="text-xs font-bold text-[#1F3864]">{issue.title}</span>}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="p-2 bg-slate-50 rounded border border-slate-200"><strong>Definition:</strong> {issue.definition}</div>
          <div className="p-2 bg-slate-50 rounded border border-slate-200"><strong>Existing Mechanisms:</strong> {issue.mechanisms}</div>
          <div className="p-2 bg-slate-50 rounded border border-slate-200"><strong>Departments & Authorities:</strong> {issue.departments.join(', ')} ({issue.authorities.join(', ')})</div>
          <div className="p-2 bg-slate-50 rounded border border-slate-200"><strong>Schemes:</strong> {issue.schemes.join(', ')}</div>
          <div className="p-2 bg-[#FFE5DE]/40 rounded border border-[#C98A87]"><strong>Possible Gaps & Deps:</strong> {issue.gaps} — {issue.dependencies}</div>
          <div className="p-2 bg-[#DFFFE0]/60 rounded border border-[#16A028]"><strong>Expected Outcome:</strong> {issue.expectedOutcome}</div>
        </div>
        <div className="mt-2 flex gap-2">
          {issue.screens.map((s) => (
            <Link key={s.route} to={s.route} className="text-xs px-2.5 py-1 rounded bg-[#7D2A42] text-white font-semibold">{s.name} →</Link>
          ))}
        </div>
      </Card>
    </div>
  );
}

function MindmapBranch({ node, depth = 0 }: { node: MindmapNode; depth?: number }) {
  const [open, setOpen] = useState(depth < 1);
  const hasKids = (node.children?.length ?? 0) > 0;
  return (
    <div className="ml-3 border-l border-[#C98A87] pl-3 py-1 space-y-1">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        {hasKids && (
          <button type="button" onClick={() => setOpen(!open)} className="p-0.5 rounded bg-[#FFE5DE] text-[#7D2A42]">
            {open ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
        )}
        <strong className="text-[#1F3864]">{node.label}</strong>
        <span className="text-[11px] text-slate-600">— {node.explanation}</span>
        {node.route && (
          <Link to={node.route} className="text-[10px] px-2 py-0.5 rounded bg-[#FFE5DE] text-[#7D2A42] border border-[#C98A87] font-semibold">
            Open →
          </Link>
        )}
      </div>
      {open && hasKids && node.children!.map((c) => <MindmapBranch key={c.id} node={c} depth={depth + 1} />)}
    </div>
  );
}

export function PlatformMindmapView() {
  return (
    <Card header={<span className="text-xs font-bold text-[#1F3864]">Interactive Expandable Platform Mindmap</span>}>
      <MindmapBranch node={PLATFORM_MINDMAP} />
    </Card>
  );
}

export function ScreenDirectoryView() {
  const [filter, setFilter] = useState('ALL');
  const rows = HELP_SCREEN_DIRECTORY.filter((s) => filter === 'ALL' || s.status === filter);
  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <span className="text-xs font-bold text-[#1F3864]">Verified Application Screen Directory ({rows.length})</span>
        <select aria-label="Filter screens by availability" value={filter} onChange={(e) => setFilter(e.target.value)} className="text-xs border border-[#C98A87] rounded px-2 py-1 bg-white">
          <option value="ALL">All Statuses</option>
          <option value="AVAILABLE">AVAILABLE</option>
          <option value="DEMONSTRATION ONLY">DEMONSTRATION ONLY</option>
          <option value="REQUIRES GOVERNMENT INTEGRATION">REQUIRES GOVERNMENT INTEGRATION</option>
          <option value="REQUIRES LEGAL OR ADMINISTRATIVE APPROVAL">REQUIRES LEGAL OR ADMINISTRATIVE APPROVAL</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px]">
            <tr>
              <th className="py-2 px-2">Screen</th>
              <th className="py-2 px-2">Category</th>
              <th className="py-2 px-2">Purpose & Actions</th>
              <th className="py-2 px-2">Status</th>
              <th className="py-2 px-2">Open</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((r) => (
              <tr key={r.route} className="hover:bg-[#FFE5DE]/20">
                <td className="py-2 px-2 font-bold text-[#1F3864]">{r.name}<div className="font-mono text-[10px] text-slate-500">{r.route}</div></td>
                <td className="py-2 px-2 text-slate-700">{r.category}</td>
                <td className="py-2 px-2 text-slate-700">{r.purpose} <span className="text-slate-500">({r.actions})</span></td>
                <td className="py-2 px-2"><AvailabilityBadge status={r.status} /></td>
                <td className="py-2 px-2">
                  <Link to={r.route} className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#7D2A42] text-white font-semibold text-[11px]">
                    Open <ExternalLink className="w-3 h-3" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export function DemoWalkthroughsView() {
  const [idx, setIdx] = useState(0);
  const demo = HELP_WALKTHROUGHS[idx];
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {HELP_WALKTHROUGHS.map((w, i) => (
          <button
            key={w.id}
            type="button"
            onClick={() => setIdx(i)}
            className={`px-2.5 py-1 rounded text-xs font-semibold border ${
              idx === i ? 'bg-[#7D2A42] text-white border-[#7D2A42]' : 'bg-white text-slate-700 border-[#E5B8B7]'
            }`}
          >
            Demo {i + 1}
          </button>
        ))}
      </div>
      <Card
        header={
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-bold text-[#1F3864]">{demo.title}</span>
            <AvailabilityBadge status="DEMONSTRATION ONLY" />
          </div>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="p-2 bg-slate-50 rounded border border-slate-200"><strong>Scenario & Problem:</strong> {demo.scenario} — {demo.problem}</div>
          <div className="p-2 bg-slate-50 rounded border border-slate-200"><strong>Stakeholders & Govt Response:</strong> {demo.stakeholders} ({demo.govtResponse})</div>
          <div className="p-2 bg-slate-50 rounded border border-slate-200"><strong>Gap & Responsibilities:</strong> {demo.gap} • {demo.responsibilities}</div>
          <div className="p-2 bg-slate-50 rounded border border-slate-200"><strong>Dependencies & Finance:</strong> {demo.dependencies} • {demo.finance}</div>
          <div className="p-2 bg-[#E6D0E3]/40 rounded border border-[#654161]"><strong>AI Assistance & Human Gate:</strong> {demo.aiAssistance} | {demo.humanApproval}</div>
          <div className="p-2 bg-[#DFFFE0]/60 rounded border border-[#16A028]"><strong>Monitoring & Outcome:</strong> {demo.monitoring} → {demo.outcome}</div>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex gap-1.5">
            <button type="button" disabled={idx === 0} onClick={() => setIdx((p) => Math.max(0, p - 1))} className="px-2.5 py-1 rounded border text-xs disabled:opacity-40">← Previous</button>
            <button type="button" disabled={idx === HELP_WALKTHROUGHS.length - 1} onClick={() => setIdx((p) => Math.min(HELP_WALKTHROUGHS.length - 1, p + 1))} className="px-2.5 py-1 rounded border text-xs disabled:opacity-40">Next →</button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {demo.steps.map((s) => (
              <Link key={s.route} to={s.route} className="px-2.5 py-1 rounded bg-[#7D2A42] text-white text-xs font-semibold">{s.label} →</Link>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

export function FaqSectionView() {
  const [openId, setOpenId] = useState<string | null>(HELP_FAQS[0].id);
  return (
    <div className="space-y-2">
      {HELP_FAQS.map((f) => (
        <Card key={f.id}>
          <button
            type="button"
            onClick={() => setOpenId(openId === f.id ? null : f.id)}
            className="w-full flex items-center justify-between text-left text-xs font-bold text-[#1F3864]"
          >
            <span>[{f.category}] {f.question}</span>
            {openId === f.id ? <ChevronDown className="w-4 h-4 shrink-0" /> : <ChevronRight className="w-4 h-4 shrink-0" />}
          </button>
          {openId === f.id && <p className="mt-2 pt-2 border-t border-slate-100 text-xs text-slate-700">{f.answer}</p>}
        </Card>
      ))}
    </div>
  );
}

export function GlossaryView() {
  const [q, setQ] = useState('');
  const filtered = HELP_GLOSSARY.filter(
    (g) => g.term.toLowerCase().includes(q.toLowerCase()) || g.plainDefinition.toLowerCase().includes(q.toLowerCase())
  );
  return (
    <div className="space-y-3">
      <input
        type="search"
        placeholder="Filter glossary terms..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="w-full text-xs border border-[#C98A87] rounded px-3 py-1.5 bg-white"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {filtered.map((g) => (
          <Card key={g.term}>
            <div className="text-xs font-bold text-[#7D2A42]">{g.term}</div>
            <p className="text-xs text-slate-700 mt-1">{g.plainDefinition}</p>
            {g.statutoryNote && <div className="text-[11px] text-slate-600 mt-1 italic">Note: {g.statutoryNote}</div>}
          </Card>
        ))}
      </div>
    </div>
  );
}
