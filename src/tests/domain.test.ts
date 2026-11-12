import { describe, it, expect } from 'vitest';
import { mockGaps, mockEvidence, mockInvestigation, mockOutcomes } from '../data/mockData';

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
});
