import { GapContract, EvidenceItem, InvestigationWorkspaceData } from '@/types';
import { mockGaps, mockEvidence, mockInvestigation } from '@/data/mockData';

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

export async function fetchGaps(district?: string): Promise<GapContract[]> {
  try {
    const url = district ? `${API_BASE_URL}/gaps?district=${district}` : `${API_BASE_URL}/gaps`;
    const res = await fetch(url, { signal: AbortSignal.timeout(2000) });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Fallback to client mock data
  }
  return district
    ? mockGaps.filter((g) => g.location.district.toLowerCase() === district.toLowerCase())
    : mockGaps;
}

export async function fetchEvidence(): Promise<EvidenceItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/evidence`, { signal: AbortSignal.timeout(2000) });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Fallback to client mock data
  }
  return mockEvidence;
}

export async function fetchInvestigation(gapId: string): Promise<InvestigationWorkspaceData> {
  try {
    const res = await fetch(`${API_BASE_URL}/investigations/${gapId}`, { signal: AbortSignal.timeout(2000) });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Fallback to client mock data
  }
  return mockInvestigation;
}

export async function queryRAG(query: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/rag/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
      signal: AbortSignal.timeout(2500),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Client fallback
  }
  return null;
}
