import type {
  CookieWallConfig,
  ConsentDecision,
  ConsentState,
  ConsentCategoryState,
} from './types';
import { Emitter } from '../events/emitter';
import { defaultDecisionForCategory } from '../config/defaults';
import { getServicesFromDOM, calculateChecksum } from './serviceScanner';

function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x !== null;
}

function isConsentDecision(x: unknown): x is 'granted' | 'denied' {
  return x === 'granted' || x === 'denied';
}

function isConsentCategoryState(x: unknown): x is ConsentCategoryState {
  if (!isRecord(x)) return false;
  return (
      isConsentDecision(x['status']) &&
      Array.isArray(x['services']) &&
      typeof x['checksum'] === 'string'
  );
}

export type ConsentChange = { prev: ConsentState; next: ConsentState };

export class ConsentStore {
  private readonly emitter = new Emitter<ConsentChange>();
  private state: ConsentState;
  private servicesFromDOM: Record<string, string[]>;

  constructor(private readonly config: CookieWallConfig & { storageKey: string }) {
    this.servicesFromDOM = getServicesFromDOM();
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

      const parsed: unknown = JSON.parse(raw);
      if (!isRecord(parsed)) return false;
      if (!isRecord(parsed['categories'])) return false;

      const parsedCategories = parsed['categories'];

      // Vérifier les checksums pour chaque catégorie
      for (const c of this.config.categories) {
        const stored = parsedCategories[c.key];
        if (!isConsentCategoryState(stored)) return false;

        const expectedChecksum = calculateChecksum(this.servicesFromDOM[c.key] ?? []);
        if (stored.checksum !== expectedChecksum) return false;
      }

      return true;
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
    if (!cat || cat.required) return;

    const services = this.servicesFromDOM[key] ?? [];
    const next: ConsentState = {
      ...this.state,
      categories: {
        ...this.state.categories,
        [key]: {
          status: decision,
          services,
          checksum: calculateChecksum(services),
        },
      },
      timestamp: new Date().toISOString(),
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
    const categories: Record<string, ConsentCategoryState> = {};

    for (const c of this.config.categories) {
      const services = this.servicesFromDOM[c.key] ?? [];
      categories[c.key] = {
        status: c.required ? 'granted' : decision,
        services,
        checksum: calculateChecksum(services),
      };
    }

    return {
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

      const parsedCategories = parsed['categories'];
      if (!isRecord(parsedCategories)) return defaults;

      // Valider checksums
      for (const c of this.config.categories) {
        const stored = parsedCategories[c.key];
        if (!isConsentCategoryState(stored)) return defaults;

        const expectedChecksum = calculateChecksum(this.servicesFromDOM[c.key] ?? []);
        if (stored.checksum !== expectedChecksum) return defaults;
      }

      const ts =
          typeof parsed['timestamp'] === 'string' ? parsed['timestamp'] : new Date().toISOString();

      const merged: ConsentState = {
        timestamp: ts,
        categories: {},
      };

      // Reconstruire les catégories correctement typées
      for (const c of this.config.categories) {
        const stored = parsedCategories[c.key];
        if (isConsentCategoryState(stored)) {
          merged.categories[c.key] = stored;
        } else {
          // Recréer depuis la catégorie de config
          const services = this.servicesFromDOM[c.key] ?? [];
          merged.categories[c.key] = {
            status: defaultDecisionForCategory(c.required, c.default),
            services,
            checksum: calculateChecksum(services),
          };
        }
      }

      // enforce required categories
      for (const c of this.config.categories) {
        if (c.required) {
          const services = this.servicesFromDOM[c.key] ?? [];
          merged.categories[c.key] = {
            status: 'granted',
            services,
            checksum: calculateChecksum(services),
          };
        }
      }

      return merged;
    } catch {
      return defaults;
    }
  }

  private createDefaultState(): ConsentState {
    const categories: Record<string, ConsentCategoryState> = {};

    for (const c of this.config.categories) {
      const services = this.servicesFromDOM[c.key] ?? [];
      categories[c.key] = {
        status: defaultDecisionForCategory(c.required, c.default),
        services,
        checksum: calculateChecksum(services),
      };
    }

    return {
      timestamp: new Date().toISOString(),
      categories,
    };
  }
}
