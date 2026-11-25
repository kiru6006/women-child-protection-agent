import { useEffect, useState } from 'react';
import { Card } from '@/components/common/Card';
import { StatusBadge } from '@/components/badges/StatusBadge';
import { SeverityBadge } from '@/components/badges/SeverityBadge';
import { GapContract, GapStatus, GapTaxonomyType, SeverityLevel } from '@/types';
import { createGap, fetchGaps, updateGapStatus } from '@/services/api';
import { useAppStore } from '@/store/appStore';
import { Filter, Search, ArrowUpRight, Scale, Clock, UserCheck, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const NEXT_STAGE: Partial<Record<GapStatus, GapStatus>> = {
  CANDIDATE: 'UNDER_INVESTIGATION',
  UNDER_INVESTIGATION: 'VALIDATED',
  VALIDATED: 'INTERVENTION_PLANNED',
  INTERVENTION_PLANNED: 'INTERVENTION_ACTIVE',
  INTERVENTION_ACTIVE: 'VERIFIED',
  VERIFIED: 'CLOSED',
};

export function GapExplorerPage() {
  const { currentRole, selectedDistrict, selectedState } = useAppStore();
  const [gaps, setGaps] = useState<GapContract[]>([]);
  const [transitionError, setTransitionError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newOwner, setNewOwner] = useState('PROTECTION_OFFICER_PATNA');
  const [newHypothesis, setNewHypothesis] = useState('');
  const [newType, setNewType] = useState<GapTaxonomyType>('COORDINATION');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');

  useEffect(() => {
    fetchGaps().then(setGaps);
  }, []);

  const handleAdvanceStatus = async (gap: GapContract) => {
    const next = NEXT_STAGE[gap.status];
    if (!next) return;
    setTransitionError(null);
    try {
      const updated = await updateGapStatus(gap.id, next, currentRole);
      setGaps((prev) => prev.map((g) => (g.id === gap.id ? updated : g)));
    } catch (err: any) {
      setTransitionError(err.message || 'Status transition rejected.');
    }
  };

  const handleCreateGap = async (e: React.FormEvent) => {
    e.preventDefault();
    setTransitionError(null);
    try {
      const created = await createGap(
        {
          gap_type: newType,
          title: newTitle,
          district: selectedDistrict,
          state: selectedState,
          affected_cohort: 'Women Protection Beneficiaries',
          root_cause_hypothesis: newHypothesis,
          statutory_basis: 'PWDVA 2005 & Mission Shakti SOP',
          named_owner_role: newOwner,
          mandated_intervention: 'Assigned corrective SOP',
          kpi_metric: 'SLA Compliance',
          kpi_baseline: 40,
          kpi_target: 85,
          deadline_date: '2026-12-31',
        },
        currentRole
      );
      setGaps((prev) => [created, ...prev]);
      setNewTitle('');
      setNewHypothesis('');
      setShowCreate(false);
    } catch (err: any) {
      setTransitionError(err.message || 'Failed to create gap contract.');
    }
  };

  const filteredGaps = gaps.filter((gap) => {
    const matchesSearch =
      gap.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gap.affectedCohort.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gap.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || gap.status === statusFilter;
    const matchesType = typeFilter === 'ALL' || gap.gapType === typeFilter;
    const matchesSeverity = severityFilter === 'ALL' || gap.severity === severityFilter;
    return matchesSearch && matchesStatus && matchesType && matchesSeverity;
  });

  const taxonomyTypes: GapTaxonomyType[] = [
    'POLICY',
    'IMPLEMENTATION',
    'ACCESS',
    'AWARENESS',
    'CAPACITY',
    'GEOGRAPHIC',
    'COORDINATION',
    'PROCESS',
    'OUTCOME',
    'DATA',
    'EMERGING_THREAT',
  ];

  const statuses: GapStatus[] = [
    'CANDIDATE',
    'UNDER_INVESTIGATION',
    'VALIDATED',
    'INTERVENTION_PLANNED',
    'INTERVENTION_ACTIVE',
    'VERIFIED',
    'CLOSED',
    'REJECTED',
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Gap Intelligence Explorer</h1>
          <p className="text-xs text-slate-500 mt-1">
            Stateful Gap Contracts classified under the 11-Taxonomy Government Framework with assigned role owners and measurable KPIs.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowCreate(!showCreate)}
          className="text-xs px-3 py-1.5 rounded bg-primary text-white font-semibold hover:bg-primary-hover flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Propose Gap</span>
        </button>
      </div>

      {showCreate && (
        <Card className="p-4 bg-white border-slate-200">
          <form onSubmit={handleCreateGap} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                required
                placeholder="Gap Contract title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="text-xs border border-slate-200 rounded p-2"
              />
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as GapTaxonomyType)}
                className="text-xs border border-slate-200 rounded p-2"
              >
                {taxonomyTypes.map((t) => (
                  <option key={t} value={t}>{t} GAP</option>
                ))}
              </select>
              <input
                required
                placeholder="Named owner role (e.g. CMO_PATNA)"
                value={newOwner}
                onChange={(e) => setNewOwner(e.target.value)}
                className="text-xs border border-slate-200 rounded p-2"
              />
            </div>
            <textarea
              required
              rows={2}
              placeholder="Root cause hypothesis (no raw PII)..."
              value={newHypothesis}
              onChange={(e) => setNewHypothesis(e.target.value)}
              className="w-full text-xs border border-slate-200 rounded p-2"
            />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowCreate(false)} className="text-xs px-3 py-1.5 border rounded">Cancel</button>
              <button type="submit" className="text-xs px-3 py-1.5 bg-primary hover:bg-primary-hover text-white rounded font-semibold">Create Candidate Gap</button>
            </div>
          </form>
        </Card>
      )}

      {/* Filter and Search Bar */}
      <Card className="p-4 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search gaps, cohorts, statutory bases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-md focus:outline-hidden focus:border-gov-blue"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full text-xs border border-slate-200 rounded-md p-1.5 focus:outline-hidden focus:border-gov-blue"
            >
              <option value="ALL">All Statuses ({gaps.length})</option>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>

          {/* Taxonomy Filter */}
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full text-xs border border-slate-200 rounded-md p-1.5 focus:outline-hidden focus:border-gov-blue"
            >
              <option value="ALL">All 11 Taxonomy Types</option>
              {taxonomyTypes.map((t) => (
                <option key={t} value={t}>
                  {t} GAP
                </option>
              ))}
            </select>
          </div>

          {/* Severity Filter */}
          <div>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="w-full text-xs border border-slate-200 rounded-md p-1.5 focus:outline-hidden focus:border-gov-blue"
            >
              <option value="ALL">All Severities</option>
              {(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as SeverityLevel[]).map((sev) => (
                <option key={sev} value={sev}>
                  {sev} Severity
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Gap Contract Cards Grid */}
      {transitionError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-800 font-medium">
          {transitionError}
        </div>
      )}
      <div className="grid grid-cols-1 gap-4">
        {filteredGaps.map((gap) => (
          <Card key={gap.id} className="hover:border-slate-300 transition-shadow">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-gov-blue">{gap.id}</span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 uppercase">
                    {gap.gapType} GAP
                  </span>
                  <StatusBadge status={gap.status} />
                  <SeverityBadge severity={gap.severity} />
                  <span className="text-xs text-slate-400">
                    {gap.location.district}, {gap.location.state}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {gap.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2">
                  {gap.rootCauseHypothesis}
                </p>

                <div className="pt-2 flex flex-wrap gap-y-1 gap-x-4 text-[11px] text-slate-500 border-t border-slate-100">
                  <span className="flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                    <strong>Owner:</strong> {gap.namedOwnerRole}
                  </span>
                  <span className="flex items-center gap-1">
                    <Scale className="w-3.5 h-3.5 text-slate-400" />
                    <strong>Statutory Basis:</strong> {gap.statutoryBasis}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <strong>Deadline:</strong> {gap.deadlineDate}
                  </span>
                </div>
              </div>

              {/* Action Column */}
              <div className="flex md:flex-col items-center justify-between md:justify-center gap-2 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-4 min-w-[160px]">
                <div className="text-right md:text-center">
                  <div className="text-[10px] text-slate-600 uppercase font-semibold">Target KPI</div>
                  <div className="text-sm font-bold text-slate-900">
                    {gap.kpiTarget}% <span className="text-[10px] text-slate-600">from {gap.kpiBaseline}%</span>
                  </div>
                </div>

                <Link
                  to={`/investigation?gapId=${gap.id}`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-gov-blue text-white text-xs font-semibold hover:bg-gov-navy transition-colors"
                >
                  <span>Investigate</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
                {NEXT_STAGE[gap.status] && (
                  <button
                    type="button"
                    onClick={() => handleAdvanceStatus(gap)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-blue-300 bg-blue-50 text-blue-900 text-[11px] font-semibold hover:bg-blue-100"
                  >
                    Move → {NEXT_STAGE[gap.status]!.replace(/_/g, ' ')}
                  </button>
                )}
              </div>
            </div>
          </Card>
        ))}

        {filteredGaps.length === 0 && (
          <div className="p-12 text-center bg-white border border-slate-200 rounded-lg">
            <p className="text-sm text-slate-500">No gap contracts match your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}

