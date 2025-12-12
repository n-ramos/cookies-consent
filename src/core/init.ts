import type { CookieWallConfig } from './consent/types';
import { normalizeConfig } from './config/normalize';
import { ConsentStore } from './consent/store';
import { ConsentEngine } from './consent/engine';
import { googleConsentModeEffect } from './consent/effects/googleConsentModeEffect';
import { scriptActivationEffect } from './consent/effects/scriptActivationEffect';
import { cookieCleanupEffect } from './consent/effects/cookieCleanupEffect';
import { openCookieWall } from '../ui';

export type CookieWallClient = {
  open: () => void;
  destroy: () => void;
  getState: () => ReturnType<ConsentStore['getState']>;
  acceptAll: () => void;
  rejectAll: () => void;
  setCategory: (key: string, decision: 'granted' | 'denied') => void;
  hasStoredConsent: () => boolean;
  hasStoredConsentForCurrentVersion: () => boolean;
};

export function initCookieWall(rawConfig: CookieWallConfig): CookieWallClient {
  const config = normalizeConfig(rawConfig);
  const store = new ConsentStore({ ...config, storageKey: config.storageKey });

  const engine = new ConsentEngine(config, store)
    .use(cookieCleanupEffect)
    .use(scriptActivationEffect)
    .use(googleConsentModeEffect);

  engine.start();

  let uiHandle: { destroy: () => void } | null = null;

  const open = () => {
    // avoid multiple UI instances
    uiHandle?.destroy();
    uiHandle = openCookieWall(store, config);
  };

  const destroy = () => {
    uiHandle?.destroy();
    uiHandle = null;
    engine.stop();
  };

  return {
    open,
    destroy,
    getState: () => store.getState(),
    acceptAll: () => store.acceptAll(),
    rejectAll: () => store.rejectAll(),
    setCategory: (key, decision) => store.setCategory(key, decision),
    hasStoredConsent: () => store.hasStoredConsent(),
    hasStoredConsentForCurrentVersion: () => store.hasStoredConsentForCurrentVersion(),
  };
}
