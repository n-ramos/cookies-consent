import type { CookieWallConfig } from './core/consent/types';
import { initCookieWall as _initCookieWall } from './core/init';

export type CookieWallClient = ReturnType<typeof _initCookieWall>;

let lastClient: CookieWallClient | null = null;

export function initCookieWall(config: CookieWallConfig): CookieWallClient {
  lastClient = _initCookieWall(config);
  return lastClient;
}

export const CookieWall = {
  init: (config: CookieWallConfig) => initCookieWall(config),
  open: () => lastClient?.open(),
  destroy: () => lastClient?.destroy(),
  getState: () => lastClient?.getState(),
  hasStoredConsent: () => lastClient?.hasStoredConsent() ?? false,
  hasStoredConsentForCurrentVersion: () => lastClient?.hasStoredConsentForCurrentVersion() ?? false,
};

export default CookieWall;

if (typeof window !== 'undefined') {
  window.CookieWall = CookieWall;
}
