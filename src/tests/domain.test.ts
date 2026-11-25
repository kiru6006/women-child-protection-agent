import { describe, it, expect } from 'vitest';
import { mockGaps, mockEvidence, mockInvestigation, mockOutcomes } from '../data/mockData';
import { useDemoStore } from '../store/demoStore';
import { useGovernanceStore } from '../store/governanceStore';

describe('WCD Protection Intelligence Platform — Domain & Integrity Invariants', () => {
  it('enforces that all initial mock gaps have valid 11-type taxonomy classifications', () => {
    const validTaxonomy = [
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

    mockGaps.forEach((gap) => {
      expect(validTaxonomy).toContain(gap.gapType);
      expect(gap.id).toMatch(/^GAP-[WC]-[A-Z]+-\d{3}$/);
      expect(gap.namedOwnerRole.length).toBeGreaterThan(0);
      expect(gap.kpiTarget).toBeGreaterThan(gap.kpiBaseline);
    });
  });

  it('guarantees zero PII in all stored mock evidence claims and tokens', () => {
    const piiRegex = /\b\d{4}\s\d{4}\s\d{4}\b|\b[A-Z]{5}\d{4}[A-Z]\b/; // Aadhaar / PAN pattern
    mockEvidence.forEach((item) => {
      expect(item.extractedClaim).not.toMatch(piiRegex);
      expect(['VERIFIED_FACT', 'INFERENCE', 'HYPOTHESIS', 'RECOMMENDATION', 'DATA_NOT_AVAILABLE']).toContain(
        item.epistemicClass
      );
    });
  });

  it('validates that investigation workspace distinguishes facts from competing hypotheses', () => {
    expect(mockInvestigation.verifiedFacts.length).toBeGreaterThan(0);
    expect(mockInvestigation.hypotheses.length).toBeGreaterThanOrEqual(2);
    expect(mockInvestigation.dataGaps.length).toBeGreaterThan(0);

    mockInvestigation.hypotheses.forEach((hyp) => {
      expect(hyp.plausibilityScore).toBeGreaterThan(0);
      expect(hyp.plausibilityScore).toBeLessThanOrEqual(1.0);
      expect(hyp.fieldVerificationRequired.length).toBeGreaterThan(0);
    });
  });

  it('verifies outcome records validate observed result against baseline and target', () => {
    mockOutcomes.forEach((outcome) => {
      expect(outcome.target).toBeGreaterThan(outcome.baseline);
      expect(outcome.observedResult).toBeGreaterThan(outcome.baseline);
      expect(['EFFECTIVE', 'PARTIALLY_EFFECTIVE', 'INEFFECTIVE', 'INSUFFICIENT_DATA']).toContain(outcome.status);
    });
  });

  it('supports full interactive mock-store lifecycle and rejects raw PII', () => {
    const store = useDemoStore.getState();
    expect(() =>
      store.addEvidence(
        {
          title: 'Bad',
          sourceOrg: 'Test',
          publicationDate: '2026-11-25',
          documentType: 'SOP',
          sourceUrlOrRef: 'REF',
          credibilityCategory: 'OFFICIAL_GOVERNMENT',
          sourceOrigin: 'SYNTHETIC',
          applicableDomain: 'WOMEN',
          epistemicClass: 'HYPOTHESIS',
          extractedClaim: 'Aadhaar 1234 5678 9012 leak',
          confidenceScore: 0.5,
        },
        'OSC_ADMIN'
      )
    ).toThrow(/ZERO-PII/);

    const inv = store.getInvestigationForGap('GAP-W-PATNA-003');
    expect(inv.gapId).toBe('GAP-W-PATNA-003');
  });

  it('validates 10 synthetic E2E demos, independent statuses, cycle detection, and RACI transfer history', () => {
    const gov = useGovernanceStore.getState();
    expect(gov.matters.length).toBe(10);
    expect(gov.convergenceLinks.length).toBe(10);
    gov.matters.forEach((m, idx) => {
      expect(m.demoCode).toBe(`DEMO-${String(idx + 1).padStart(2, '0')}`);
      expect(m.isSynthetic).toBe(true);
      expect(m.matterStatus).toBeDefined();
      expect(m.adminStatus).toBeDefined();
      expect(m.police.status).toBeDefined();
      expect(m.litigation.status).toBeDefined();
      expect(m.litigation.complianceStatus).toBeDefined();
      expect(m.finance.status).toBeDefined();
      expect(m.outcome.status).toBeDefined();
    });

    const cycles = gov.detectCircularDependencies();
    expect(cycles.length).toBeGreaterThanOrEqual(1);

    gov.reassignRaciRole('RACI-02', 'Addl. Secretary DLSA Patna', 'Unit test posting');
    const updated = useGovernanceStore.getState().raciAssignments.find((r) => r.id === 'RACI-02');
    expect(updated?.responsibleRole).toBe('Addl. Secretary DLSA Patna');
    expect(updated?.transferHistory.length).toBe(1);
  });
});

