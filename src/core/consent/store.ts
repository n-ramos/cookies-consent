import type { CookieWallConfig, ConsentDecision, ConsentState } from './types';
import { Emitter } from '../events/emitter';
import { defaultDecisionForCategory } from '../config/defaults';
function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x !== null;
}

function isConsentDecision(x: unknown): x is 'granted' | 'denied' {
  return x === 'granted' || x === 'denied';
}

function isConsentCategories(x: unknown): x is Record<string, 'granted' | 'denied'> {
  if (!isRecord(x)) return false;
  return Object.values(x).every(isConsentDecision);
}

export type ConsentChange = { prev: ConsentState; next: ConsentState };

export class ConsentStore {
  private readonly emitter = new Emitter<ConsentChange>();
  private state: ConsentState;

  constructor(private readonly config: CookieWallConfig & { storageKey: string }) {
    this.state = this.loadOrCreate();
  }

  onChange(fn: (change: ConsentChange) => void): () => void {
    return this.emitter.on(fn);
  }

  getState(): ConsentState {
    return structuredClone(this.state);
  }

  hasStoredConsent(): boolean {
    try {
      return localStorage.getItem(this.config.storageKey) !== null;
    } catch {
      return false;
    }
  }

  hasStoredConsentForCurrentVersion(): boolean {
    try {
      const raw = localStorage.getItem(this.config.storageKey);
      if (!raw) return false;
      const parsed = JSON.parse(raw) as Partial<ConsentState> | null;
      return parsed?.version === this.config.version;
    } catch {
      return false;
    }
  }

  acceptAll(): void {
    const next = this.withAllNonRequired('granted');
    this.setState(next);
  }

  rejectAll(): void {
    const next = this.withAllNonRequired('denied');
    this.setState(next);
  }

  setCategory(key: string, decision: ConsentDecision): void {
    const cat = this.config.categories.find((c) => c.key === key);
    if (!cat) return;
    if (cat.required) return;

    const next: ConsentState = {
      ...this.state,
      categories: {
        ...this.state.categories,
        [key]: decision,
      },
      timestamp: new Date().toISOString(),
      version: this.config.version,
    };

    this.setState(next);
  }

  reset(): void {
    try {
      localStorage.removeItem(this.config.storageKey);
    } catch {
      //noop
    }
    this.state = this.createDefaultState();
  }

  private withAllNonRequired(decision: ConsentDecision): ConsentState {
    const categories: Record<string, ConsentDecision> = { ...this.state.categories };
    for (const c of this.config.categories) {
      categories[c.key] = c.required ? 'granted' : decision;
    }
    return {
      version: this.config.version,
      timestamp: new Date().toISOString(),
      categories,
    };
  }

  private setState(next: ConsentState): void {
    const prev = this.state;
    this.state = next;
    this.persist(next);
    this.emitter.emit({ prev, next });
  }

  private persist(state: ConsentState): void {
    try {
      localStorage.setItem(this.config.storageKey, JSON.stringify(state));
    } catch {
      // noop
    }
  }

  private loadOrCreate(): ConsentState {
    const defaults = this.createDefaultState();
    try {
      const raw = localStorage.getItem(this.config.storageKey);
      if (!raw) return defaults;

      const parsed: unknown = JSON.parse(raw);

      if (!isRecord(parsed)) return defaults;
      if (parsed['version'] !== this.config.version) return defaults;

      const parsedCategories = parsed['categories'];
      if (!isConsentCategories(parsedCategories)) return defaults;

      const ts =
        typeof parsed['timestamp'] === 'string' ? parsed['timestamp'] : new Date().toISOString();

      const merged: ConsentState = {
        version: this.config.version,
        timestamp: ts,
        categories: { ...defaults.categories, ...parsedCategories },
      };

      // enforce required categories
      for (const c of this.config.categories) {
        if (c.required) merged.categories[c.key] = 'granted';
      }

      return merged;
    } catch {
      return defaults;
    }
  }

  private createDefaultState(): ConsentState {
    const categories: Record<string, ConsentDecision> = {};
    for (const c of this.config.categories) {
      categories[c.key] = defaultDecisionForCategory(c.required, c.default);
    }
    return {
      version: this.config.version,
      timestamp: new Date().toISOString(),
      categories,
    };
  }
}
