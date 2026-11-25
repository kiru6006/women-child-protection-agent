/**
 * Offline-tolerant field queue stored in localStorage for low-connectivity OSC/field centres.
 * Stores non-PII action payloads only (Zero-PII invariant preserved).
 */

export interface OfflineQueuedItem {
  id: string;
  endpoint: string;
  method: 'POST' | 'PATCH';
  payload: Record<string, unknown>;
  queuedAt: string;
}

const STORAGE_KEY = 'wcd_offline_sync_queue_v1';

export function getOfflineQueue(): OfflineQueuedItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as OfflineQueuedItem[]) : [];
  } catch {
    return [];
  }
}

export function enqueueOfflineAction(
  endpoint: string,
  method: 'POST' | 'PATCH',
  payload: Record<string, unknown>
): OfflineQueuedItem[] {
  const next: OfflineQueuedItem[] = [
    ...getOfflineQueue(),
    {
      id: `OFF-${Date.now()}`,
      endpoint,
      method,
      payload,
      queuedAt: new Date().toISOString(),
    },
  ];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Ignore storage quota errors in private browsing
  }
  return next;
}

export function clearOfflineQueue(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore
  }
}
