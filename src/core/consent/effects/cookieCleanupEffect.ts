import type { ConsentEffect } from './types';

export function deleteCookie(name: string): void {
  const hostname = window.location.hostname;
  const parts = hostname.split('.');
  const domains: string[] = [];

  // Try current host and parent domains
  for (let i = 0; i < parts.length; i++) {
    domains.push('.' + parts.slice(i).join('.'));
  }
  domains.push(hostname);

  const paths = ['/', window.location.pathname || '/'];

  for (const domain of domains) {
    for (const path of paths) {
      document.cookie = `${name}=; Max-Age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}; domain=${domain}`;
      document.cookie = `${name}=; Max-Age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`;
    }
  }
}

export function cleanupByPrefixes(prefixes: string[]): void {
  const all = document.cookie ? document.cookie.split('; ') : [];
  const cookieNames: string[] = [];

  for (const c of all) {
    const idx = c.indexOf('=');
    const name = idx >= 0 ? c.slice(0, idx) : c;
    if (name) cookieNames.push(name);
  }
  for (const name of cookieNames) {
    for (const prefix of prefixes) {
      if (name === prefix || name.startsWith(prefix)) {
        deleteCookie(name);
      }
    }
  }
}

export const cookieCleanupEffect: ConsentEffect = {
  key: 'cookie-cleanup',
  run({ config, prev, next }) {
    if (!config.cookieCleanup) return;
    if (!prev) return;

    for (const [cat, prefixes] of Object.entries(config.cookieCleanup)) {
      const was = prev.categories[cat]?.status;
      const now = next.categories[cat]?.status;

      if (was === 'granted' && now === 'denied') {
        cleanupByPrefixes(prefixes);
      }
      if (was === undefined && now === 'denied') {
        cleanupByPrefixes(prefixes);
      }
    }
  },
};
