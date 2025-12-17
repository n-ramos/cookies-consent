import { initCookieWall } from "./lib";
import cssText from './style.css?inline';

const STYLE_ID = 'cookie-wall-style';

function ensureStyles(): void {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = cssText;
    document.head.appendChild(style);
}
// fake consent pour le dev
(window as any).__CONSENT__ = {
    analytics: "granted",
    ads: "denied",
    essential: "granted",
};
ensureStyles()
const client = initCookieWall({
    version: "dev",
    storageKey: "dev-cookie-wall",

    categories: [
        { key: "essential", title: "Essentiels", required: true },
        { key: "analytics", title: "Analytics" }
    ]

});

client.open()
