'use client';

/**
 * Lightweight analytics — tracks product usage events without capturing user text.
 * Sends to window.gtag when Google Analytics is configured (GA_MEASUREMENT_ID env var).
 * All events are safe: they record modes and outcomes, never the content submitted.
 */

type EventName =
  | 'mode_selected'
  | 'generation_requested'
  | 'generation_completed'
  | 'generation_failed'
  | 'quota_exhausted'
  | 'copy_clicked'
  | 'regenerate_clicked'
  | 'quick_action_used'
  | 'tool_page_viewed';

interface EventParams {
  mode?: string;
  tone?: string;
  error_type?: string;
  tool?: string;
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(event: EventName, params?: EventParams): void {
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', event, { ...params, non_interaction: false });
    }
  } catch {
    // Never let analytics errors surface to users
  }
}
