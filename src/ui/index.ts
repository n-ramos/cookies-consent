import type { ConsentStore } from '../core/consent/store';
import type { NormalizedCookieWallConfig } from '../core/config/normalize';
import { mountCookieWall } from './mount';
import { bindCookieWall } from './bind';

export type UiHandle = { close: () => void; destroy: () => void };

export function openCookieWall(store: ConsentStore, config: NormalizedCookieWallConfig): UiHandle {
  const root = mountCookieWall(store, config);

  const close = () => {
    root.remove();
  };

  const cleanup = bindCookieWall(root, store, config, close);

  return {
    close,
    destroy: () => {
      cleanup();
      close();
    },
  };
}
