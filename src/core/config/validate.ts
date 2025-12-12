import type { CookieWallConfig } from '../consent/types';

export function validateConfig(config: CookieWallConfig): void {
  if (!config || typeof config !== 'object') throw new Error('Config is required');
  if (!config.version || typeof config.version !== 'string')
    throw new Error('config.version is required');

  if (!Array.isArray(config.categories) || config.categories.length === 0) {
    throw new Error('config.categories must be a non-empty array');
  }

  const keys = new Set<string>();
  for (const c of config.categories) {
    if (!c.key || typeof c.key !== 'string') throw new Error('category.key is required');
    if (keys.has(c.key)) throw new Error(`duplicate category key: ${c.key}`);
    keys.add(c.key);
    if (!c.title || typeof c.title !== 'string')
      throw new Error(`category.title is required for ${c.key}`);
    if (c.googleConsentMode) {
      const v = c.googleConsentMode;
      const ok =
        typeof v === 'string' || (Array.isArray(v) && v.every((x) => typeof x === 'string'));
      if (!ok)
        throw new Error(`category.googleConsentMode must be string or string[] for ${c.key}`);
    }
  }
}
