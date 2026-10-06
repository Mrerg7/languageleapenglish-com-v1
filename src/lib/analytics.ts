import { SITE } from '../config/site';

export interface AnalyticsEvent {
  name: string;
  payload?: Record<string, unknown>;
}

const STORAGE_KEY = 'lle_events_v1';
const MAX_EVENTS = 50;

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

function persist(event: AnalyticsEvent) {
  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as unknown[];
    existing.push({ ...event, t: Date.now() });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing.slice(-MAX_EVENTS)));
  } catch {
    /* storage unavailable (private mode) */
  }
}

/**
 * First-party conversion tracking.
 *
 * Events are queued on `window.dataLayer` (GA4/Google Tag Manager compatible),
 * mirrored to localStorage for session inspection, and logged to the console
 * so they can be wired to any provider without touching component code.
 */
export function track(name: string, payload: Record<string, unknown> = {}) {
  const event = { name, payload, t: Date.now() };
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(event);
  persist(event);

  if (import.meta.env.DEV) {
    console.debug('[analytics]', name, payload);
  }
}

export { SITE };
