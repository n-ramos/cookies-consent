import type {
  CookieWallConfig,
  CookieWallUIClasses,
  CookieWallUIConfig,
  CookieWallUIText,
} from '../consent/types';
import { DEFAULT_CLASSES, DEFAULT_STORAGE_KEY, DEFAULT_TEXTS } from './defaults';
import { validateConfig } from './validate';

export type NormalizedCookieWallConfig = CookieWallConfig & {
  storageKey: string;
  ui: Required<Omit<CookieWallUIConfig, 'texts' | 'classes'>> & {
    texts: Required<CookieWallUIText>;
    classes: Required<CookieWallUIClasses>;
  };
};

export function normalizeConfig(input: CookieWallConfig): NormalizedCookieWallConfig {
  validateConfig(input);

  const ui = input.ui ?? {};
  const texts = { ...DEFAULT_TEXTS, ...(ui.texts ?? {}) };
  const classes = { ...DEFAULT_CLASSES, ...(ui.classes ?? {}) };
  const position = ui.position ?? 'bottom-left';

  return {
    ...input,
    storageKey: input.storageKey ?? DEFAULT_STORAGE_KEY,
    ui: {
      position,
      texts,
      classes,
    },
  };
}
