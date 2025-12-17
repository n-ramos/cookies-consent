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

ensureStyles()
const client = initCookieWall({
  storageKey: "dev-cookie-wall",
  categories: [
    { key: "essential", title: "Essentiels", required: true },
    { key: "analytics", title: "Analytics" }
  ]
});

// Ouvre seulement s'il n'y a pas de consentement valide
if (!client.hasStoredConsentForCurrentVersion()) {
  client.open()
}
