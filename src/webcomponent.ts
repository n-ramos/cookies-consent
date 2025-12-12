// src/cookie-consent.ts
import { initCookieWall } from "./lib";
import type { CookieWallConfig } from "./lib/types";

import cssText from "./style.css?inline";

const STYLE_ID = "cookie-wall-style";

function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = cssText;
    document.head.appendChild(style);
}

function safeParseConfig(raw: string | null): CookieWallConfig | null {
    if (!raw) return null;
    try {
        return JSON.parse(raw) as CookieWallConfig;
    } catch (e) {
        console.error("[cookie-consent] Invalid JSON in config attribute", e);
        return null;
    }
}

class CookieConsentElement extends HTMLElement {
    private _initialized = false;

    connectedCallback() {
        if (this._initialized) return;
        this._initialized = true;

        ensureStyles();

        // config en attribut JSON
        const config = safeParseConfig(this.getAttribute("config"));
        if (!config) {
            console.warn("[cookie-consent] Missing config attribute");
            return;
        }

        const client = initCookieWall(config);
        if (!client.hasStoredConsentForCurrentVersion()) {
            client.open();
        }
        (this as any)._client = client;
    }
}

if (!customElements.get("cookie-consent")) {
    customElements.define("cookie-consent", CookieConsentElement);
}

// Optionnel : exposer une API globale simple (debug)
declare global {
    interface Window {
        CookieWall?: any;
    }
}
window.CookieWall = window.CookieWall || {};
