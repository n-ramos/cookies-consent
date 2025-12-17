import type { ConsentEffect } from './types';
import type { ConsentDecision } from '../types';

type GtagConsent = Record<string, 'granted' | 'denied'>;

function toGtag(decision: ConsentDecision): 'granted' | 'denied' {
  return decision === 'granted' ? 'granted' : 'denied';
}

export const googleConsentModeEffect: ConsentEffect = {
  key: 'google-consent-mode',
  run({ config, next }) {
    if (!config.vendors?.googleConsentMode?.enabled) return;
    const gtag = window.gtag;
    if (typeof gtag !== 'function') return;

    const payload: GtagConsent = {};
    for (const c of config.categories) {
      if (!c.googleConsentMode) continue;
      const keys = Array.isArray(c.googleConsentMode) ? c.googleConsentMode : [c.googleConsentMode];
      const status = next.categories[c.key]?.status ?? 'denied';
      for (const k of keys) payload[k] = toGtag(status);
    }

    if (Object.keys(payload).length > 0) {
      gtag('consent', 'update', payload);
    }
  },
};
