import type {
    CookieWallConfig,
    ConsentDecision,
    ConsentState
} from "./types";
import { applyGoogleConsentMode } from "./googleConsent";
import { activateScriptsForCategory } from "./scriptActivation";
import { clearCookiesForCategory } from "./cookieCleanup";

export class ConsentStore {
    private state: ConsentState;
    private storageKey: string;

    constructor(private conf: CookieWallConfig) {
        this.storageKey = conf.storageKey ?? "cookie-wall-consent";
        this.state = this.load() ?? this.initial();
        this.applyEffects();
    }

    private initial(): ConsentState {
        const categories: Record<string, ConsentDecision> = {};

        for (const c of this.conf.categories) {
            categories[c.key] = c.required ? "granted" : c.default ?? "denied";
        }

        return {
            categories,
            timestamp: new Date().toISOString(),
            version: this.conf.version
        };
    }

    private load(): ConsentState | null {
        try {
            const raw = localStorage.getItem(this.storageKey);
            if (!raw) return null;
            const parsed = JSON.parse(raw) as ConsentState;
            if (parsed.version !== this.conf.version) return null;
            return parsed;
        } catch {
            return null;
        }
    }

    private save() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.state));
        } catch {
            // ignore
        }
    }

    private applyEffects() {
        // Google Consent Mode
        applyGoogleConsentMode(this.conf, this.state);

        // Activation des scripts différés
        Object.entries(this.state.categories).forEach(([cat, val]) => {
            if (val === "granted") {
                activateScriptsForCategory(cat);
            }
        });
    }

    private update() {
        this.save();
        this.applyEffects();
    }

    // === API publique ===

    acceptAll() {
        Object.keys(this.state.categories).forEach((k) => {
            this.state.categories[k] = "granted";
        });
        this.update();
        // Pas de cleanup ici, on ne retire rien, on donne plus
    }

    rejectAll() {
        const prev = { ...this.state.categories };

        for (const c of this.conf.categories) {
            this.state.categories[c.key] = c.required ? "granted" : "denied";
        }

        this.update();

        // Cleanup pour toutes les catégories qui étaient granted et passent à denied
        for (const [cat, oldVal] of Object.entries(prev)) {
            const newVal = this.state.categories[cat];
            if (oldVal === "granted" && newVal === "denied") {
                clearCookiesForCategory(cat, this.conf);
            }
        }
    }

    setCategory(cat: string, val: ConsentDecision) {
        const prev = this.state.categories[cat];
        this.state.categories[cat] = val;
        this.update();

        if (prev === "granted" && val === "denied") {
            clearCookiesForCategory(cat, this.conf);
        }
    }

    getState() {
        return this.state;
    }
    hasStoredConsent(): boolean {
        try {
            return localStorage.getItem(this.storageKey) !== null;
        } catch {
            return false;
        }
    }

    getStorageKey(): string {
        return this.storageKey;
    }

    hasStoredConsentForCurrentVersion(): boolean {
        try {
            const raw = localStorage.getItem(this.storageKey);
            if (!raw) return false;
            const parsed = JSON.parse(raw);
            return parsed?.version === this.conf.version;
        } catch {
            return false;
        }
    }


}


