import type { ConsentStore } from '../core/consent/store';
import type { NormalizedCookieWallConfig } from '../core/config/normalize';
import { renderCookieWall } from './template';

const ROOT_ID = 'cookie-wall-root';

export function mountCookieWall(
  store: ConsentStore,
  config: NormalizedCookieWallConfig,
): HTMLElement {
  const existing = document.getElementById(ROOT_ID);
  if (existing) return existing;

  const pos = config.ui.position;
  const backdrop = document.createElement('div');
  backdrop.id = ROOT_ID;

  backdrop.className =
    pos === 'center'
      ? 'fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-4 bg-black/40'
      : pos === 'bottom-right'
        ? 'fixed bottom-4 right-4 z-[9999] w-[340px]'
        : 'fixed bottom-4 left-4 z-[9999] w-[340px]';
  backdrop.innerHTML = renderCookieWall(config, store.getState());
  document.body.appendChild(backdrop);

  return backdrop;
}
