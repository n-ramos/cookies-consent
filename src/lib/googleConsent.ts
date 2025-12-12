import type { CookieWallConfig, ConsentState } from "./types";

let defaultSent = false;

export function applyGoogleConsentMode(
    conf: CookieWallConfig,
    state: ConsentState
) {
    if (!conf.vendors?.googleConsentMode?.enabled) return;
    if (typeof window === "undefined" || typeof window.gtag !== "function") {
        return;
    }

    // Récupérer toutes les clés de consentement utilisées dans la conf
    const allModes = new Set<string>();

    for (const cat of conf.categories) {
        if (!cat.googleConsentMode) continue;

        const modes = Array.isArray(cat.googleConsentMode)
            ? cat.googleConsentMode
            : [cat.googleConsentMode];

        modes.forEach((m) => allModes.add(m));
    }

    // 1) Envoyer l'état par défaut UNE FOIS (souvent "denied" partout)
    if (!defaultSent && allModes.size > 0) {
        const defaultPayload: Record<string, "granted" | "denied"> = {};

        for (const mode of allModes) {
            // par défaut on met "denied" (recommandation standard)
            defaultPayload[mode] = "denied";
        }

        window.gtag("consent", "default", defaultPayload);
        defaultSent = true;
    }

    // 2) Envoyer l'état ACTUEL (update) basé sur ton store
    const updatePayload: Record<string, "granted" | "denied"> = {};

    for (const cat of conf.categories) {
        if (!cat.googleConsentMode) continue;

        const decision = state.categories[cat.key]; // "granted" ou "denied"

        const modes = Array.isArray(cat.googleConsentMode)
            ? cat.googleConsentMode
            : [cat.googleConsentMode];

        for (const mode of modes) {
            updatePayload[mode] = decision;
        }
    }

    if (Object.keys(updatePayload).length > 0) {
        window.gtag("consent", "update", updatePayload);
    }
}
