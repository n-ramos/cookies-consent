export type ConsentDecision = "granted" | "denied";

export interface ConsentCategoryConfig {
    key: string;
    title: string;
    description?: string;
    required?: boolean;
    default?: ConsentDecision;
    googleConsentMode?: string | string[];
}

export interface ConsentState {
    categories: Record<string, ConsentDecision>;
    timestamp: string;
    version: string;
}

/**
 * Classes Tailwind (ou CSS classiques) pour personnaliser la modale.
 * Le dev peut override uniquement ce qu'il veut.
 */
export interface CookieWallUIClasses {
    backdrop?: string;
    container?: string;
    title?: string;
    description?: string;
    buttonPrimary?: string;
    buttonSecondary?: string;
    buttonGhost?: string;
    categoryCard?: string;
    toggleTrackOn?: string;
    toggleTrackOff?: string;
    toggleKnob?: string;
}

/**
 * Petits textes personnalisables (labels, etc.)
 */
export interface CookieWallUIText {
    title?: string;
    description?: string;
    acceptAllLabel?: string;
    rejectAllLabel?: string;
    customizeLabel?: string;
}

/**
 * Config UI globale
 */
export interface CookieWallUIConfig {
    /**
     * position approximative sur l’écran
     */
    position?: "bottom-left" | "bottom-right" | "center";
    classes?: CookieWallUIClasses;
    texts?: CookieWallUIText;
}

export interface CookieCleanupConfig {
    [categoryKey: string]: string[];
}

export interface CookieWallConfig {
    version: string;
    storageKey?: string;
    categories: ConsentCategoryConfig[];
    vendors?: {
        googleConsentMode?: { enabled: boolean };
    };
    cookieCleanup?: CookieCleanupConfig;

    /**
     * 🎨 Personnalisation visuelle de la modale
     */
    ui?: CookieWallUIConfig;
}
