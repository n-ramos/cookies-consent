import type { CookieWallConfig, ConsentState } from './types';
import type { ConsentStore } from './store';
import type { ConsentEffect } from './effects/types';

export class ConsentEngine {
  private readonly effects: ConsentEffect[] = [];
  private unsubscribe: (() => void) | undefined;

  constructor(
    private readonly config: CookieWallConfig,
    private readonly store: ConsentStore,
  ) {}

  use(effect: ConsentEffect): this {
    this.effects.push(effect);
    return this;
  }

  start(): void {
    this.run(undefined, this.store.getState());
    this.unsubscribe = this.store.onChange(({ prev, next }) => this.run(prev, next));
  }

  stop(): void {
    this.unsubscribe?.();
    this.unsubscribe = undefined;
    for (const e of this.effects) e.destroy?.();
  }

  private run(prev: ConsentState | undefined, next: ConsentState): void {
    for (const e of this.effects) {
      try {
        const ctx = prev ? { config: this.config, prev, next } : { config: this.config, next };

        e.run(ctx);
      } catch (err) {
        console.warn('[CookieWall] effect error:', e.key, err);
      }
    }
  }
}
