import { create } from 'zustand';
import {
  DepartmentLink,
  Dependency360,
  DependencyStatus,
  FinancialStatus,
  Matter360,
  MatterStatus,
  NGOOrganisation,
  RecognitionNomination,
  ResponsibilityAssignment,
  SchemeBudgetRecord,
  SupportActivity,
} from '@/types/governance';
import {
  convergenceLinks,
  initialDependencies,
  initialFinancialRecords,
  initialNominations,
  initialRaciAssignments,
  initialSupportActivities,
  ngoOrganisations,
  syntheticMatters,
} from '@/data/governanceData';

interface GovernanceState {
  matters: Matter360[];
  dependencies: Dependency360[];
  convergenceLinks: DepartmentLink[];
  raciAssignments: ResponsibilityAssignment[];
  financials: SchemeBudgetRecord[];
  ngos: NGOOrganisation[];
  activities: SupportActivity[];
  nominations: RecognitionNomination[];

  updateMatterStatus: (matterId: string, status: MatterStatus) => void;
  updateDependencyStatus: (depId: string, status: DependencyStatus) => void;
  reassignRaciRole: (raciId: string, newRole: string, reason: string) => void;
  advanceFinancialStatus: (finId: string, status: FinancialStatus) => void;
  approveNomination: (nomId: string) => void;
  addNomination: (nom: Omit<RecognitionNomination, 'id' | 'status'>) => void;
  detectCircularDependencies: () => string[][];
}

export const useGovernanceStore = create<GovernanceState>((set, get) => ({
  matters: syntheticMatters,
  dependencies: initialDependencies,
  convergenceLinks,
  raciAssignments: initialRaciAssignments,
  financials: initialFinancialRecords,
  ngos: ngoOrganisations,
  activities: initialSupportActivities,
  nominations: initialNominations,

  updateMatterStatus: (matterId, status) =>
    set((s) => ({
      matters: s.matters.map((m) =>
        m.id === matterId
          ? { ...m, matterStatus: status, updatedDate: new Date().toISOString().slice(0, 10) }
          : m
      ),
    })),

  updateDependencyStatus: (depId, status) =>
    set((s) => ({
      dependencies: s.dependencies.map((d) => (d.id === depId ? { ...d, status } : d)),
    })),

  reassignRaciRole: (raciId, newRole, reason) =>
    set((s) => ({
      raciAssignments: s.raciAssignments.map((r) =>
        r.id === raciId
          ? {
              ...r,
              transferHistory: [
                ...r.transferHistory,
                {
                  date: new Date().toISOString().slice(0, 10),
                  fromRole: r.responsibleRole,
                  toRole: newRole,
                  reason,
                },
              ],
              responsibleRole: newRole,
            }
          : r
      ),
    })),

  advanceFinancialStatus: (finId, status) =>
    set((s) => ({
      financials: s.financials.map((f) => (f.id === finId ? { ...f, financialStatus: status } : f)),
    })),

  approveNomination: (nomId) =>
    set((s) => ({
      nominations: s.nominations.map((n) => (n.id === nomId ? { ...n, status: 'APPROVED' } : n)),
    })),

  addNomination: (nom) =>
    set((s) => ({
      nominations: [
        {
          ...nom,
          id: `REC-2026-0${s.nominations.length + 1}`,
          status: 'NOMINATED',
        },
        ...s.nominations,
      ],
    })),

  detectCircularDependencies: () => {
    const active = get().dependencies.filter((d) => d.status !== 'RESOLVED' && d.status !== 'CANCELLED');
    const adj = new Map<string, string[]>();
    for (const d of active) {
      const list = adj.get(d.predecessorNode) || [];
      list.push(d.dependentNode);
      adj.set(d.predecessorNode, list);
    }
    const cycles: string[][] = [];
    const visited = new Set<string>();
    const stack = new Set<string>();

    const dfs = (node: string, path: string[]) => {
      visited.add(node);
      stack.add(node);
      for (const nxt of adj.get(node) || []) {
        if (!visited.has(nxt)) {
          dfs(nxt, [...path, nxt]);
        } else if (stack.has(nxt)) {
          const idx = path.indexOf(nxt);
          cycles.push(path.slice(idx).concat(nxt));
        }
      }
      stack.delete(node);
    };

    for (const node of adj.keys()) {
      if (!visited.has(node)) dfs(node, [node]);
    }
    return cycles;
  },
}));
