import cssText from './style.css?inline';
import { initCookieWall } from './lib';
import type { CookieWallConfig } from './core/consent/types';

const STYLE_ID = 'cookie-wall-style';

function ensureStyles(): void {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = cssText;
  document.head.appendChild(style);
}

function safeParse(raw: string | null): CookieWallConfig | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CookieWallConfig;
  } catch (e: unknown) {
    console.error('[cookie-consent] Invalid JSON config', e);
    return null;
  }
}

class CookieConsentElement extends HTMLElement {
  private initialized = false;

  connectedCallback(): void {
    if (this.initialized) return;
    this.initialized = true;

    ensureStyles();

    const config = safeParse(this.getAttribute('config'));
    if (!config) {
      console.warn('[cookie-consent] Missing config attribute');
      return;
    }

    const client = initCookieWall(config);
    if (!client.hasStoredConsentForCurrentVersion()) {
      client.open();
    }
  }
}

if (!customElements.get('cookie-consent')) {
  customElements.define('cookie-consent', CookieConsentElement);
}
