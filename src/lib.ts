import type { CookieWallConfig } from "./lib/types";
import { ConsentStore } from "./lib/consentStore";
import { openCookieWall } from "./lib/ui";

/**
 * Client public retourné par initCookieWall
 * (API STABLE – ne dépend pas de l'implémentation interne)
 */
export type CookieWallClient = {
    open: () => void;
    getState: () => ReturnType<ConsentStore["getState"]>;
    hasStoredConsent: () => boolean;
    hasStoredConsentForCurrentVersion: () => boolean;
};

let lastClient: CookieWallClient | null = null;

/**
 * Initialisation principale
 */
export function initCookieWall(config: CookieWallConfig): CookieWallClient {
    const store = new ConsentStore(config);

    const client: CookieWallClient = {
        open: () => {
            openCookieWall(store, config);
        },

        getState: () => store.getState(),
        hasStoredConsent: () => store.hasStoredConsent(),

        hasStoredConsentForCurrentVersion: () =>
            store.hasStoredConsentForCurrentVersion()
    };

    lastClient = client;
    return client;
}

/**
 * API globale (pour UMD / IIFE / CDN)
 * => window.CookieWall
 */
export const CookieWall = {
    init: (config: CookieWallConfig) => initCookieWall(config),

    open: () => {
        lastClient?.open();
    },

    getState: () => {
        return lastClient?.getState();
    },

    hasStoredConsent: () => {
        return lastClient?.hasStoredConsent() ?? false;
    },

    hasStoredConsentForCurrentVersion: () => {
        return lastClient?.hasStoredConsentForCurrentVersion() ?? false;
    },

    reset: () => {
        if (!lastClient) return;
        try {
            localStorage.removeItem(
                (lastClient as any).config?.storageKey ?? "cookie-wall-consent"
            );
        } catch {}
    }
};

// ✅ IMPORTANT : export default pour Vite lib (UMD / IIFE)
export default CookieWall;

// Sécurité supplémentaire (runtime)
if (typeof window !== "undefined") {
    (window as any).CookieWall = CookieWall;
}
