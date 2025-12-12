import type { CookieWallConfig, ConsentState } from '../types';

export type EffectCtx =
  | { config: CookieWallConfig; next: ConsentState; prev?: never }
  | { config: CookieWallConfig; next: ConsentState; prev: ConsentState };

export interface ConsentEffect {
  key: string;
  run(ctx: EffectCtx): void;
  destroy?(): void;
}
