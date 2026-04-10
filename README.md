# 🍪 @n-ramos/cookie-consent

[![npm version](https://img.shields.io/npm/v/@n-ramos/cookie-consent.svg)](https://www.npmjs.com/package/@n-ramos/cookie-consent)
[![npm downloads](https://img.shields.io/npm/dm/@n-ramos/cookie-consent.svg)](https://www.npmjs.com/package/@n-ramos/cookie-consent)
[![release](https://github.com/n-ramos/cookies-consent/actions/workflows/release.yml/badge.svg)](https://github.com/n-ramos/cookies-consent/actions/workflows/release.yml)
[![codecov](https://codecov.io/gh/n-ramos/cookies-consent/graph/badge.svg?token=KF7QQYOYQL)](https://codecov.io/gh/n-ramos/cookies-consent)
Gestionnaire de consentement cookies **RGPD / CNIL compliant**, moderne, léger et totalement configurable.  
Alternative open-source à Axeptio / Didomi, sans SaaS ni dépendance externe.

---

## ✨ Fonctionnalités

- RGPD / CNIL compliant
- Google Consent Mode v2
- Activation différée des scripts (`type="text/plain"`)
- Nettoyage automatique des cookies
- UI entièrement personnalisable (textes + classes)
- Compatible Laravel 10–12 / Vite / Tailwind
- WebComponent autonome (CDN)
- Aucun cookie déposé par défaut

---

## 📦 Installation

### npm

```bash
pnpm add @n-ramos/cookie-consent
```

```js
import { initCookieWall } from '@n-ramos/cookie-consent';
```

### CDN (WebComponent)

```html
<script
  defer
  src="https://unpkg.com/@n-ramos/cookie-consent@1.0.2/dist/cookie-consent-standalone.js"
></script>
<cookie-consent config='{"categories":[...]}'></cookie-consent>
```

---

## 🚀 Utilisation rapide

```js
const client = initCookieWall({
  storageKey: 'my-consent',
  categories: [
    { key: 'essential', title: 'Essentiels', required: true },
    { key: 'analytics', title: 'Analytics', googleConsentMode: 'analytics_storage' },
  ],
  vendors: { googleConsentMode: { enabled: true } },
});

if (!client.hasStoredConsentForCurrentVersion()) {
  client.open();
}
```

---

## ⚙️ Configuration complète

### CookieWallConfig

```ts
{
  storageKey?: string;
  categories: ConsentCategoryConfig[];
  vendors?: VendorConfig;
  cookieCleanup?: CookieCleanupConfig;
  ui?: CookieWallUIConfig;
}
```

---

### Catégories

```ts
{
  key: string;
  title: string;
  description?: string;
  required?: boolean;
  googleConsentMode?: string | string[];
}
```

---

### Vendors

```ts
vendors: {
  googleConsentMode?: {
    enabled: boolean;
  }
}
```

---

### Nettoyage des cookies

```ts
cookieCleanup: {
  analytics: ["_ga", "_gid", "_clck"],
  ads: ["IDE", "_fbp"]
}
```

---

### UI – Textes

```ts
ui: {
  texts: {
    title?: string;
    description?: string;
    acceptAllLabel?: string;   // "Tout accepter"
    rejectAllLabel?: string;   // "Tout refuser"
    saveLabel?: string;        // "Valider" — si défini, affiche un bouton qui persiste l'état courant des toggles
    customizeLabel?: string;   // "Personnaliser"
  }
}
```

---

### UI – Classes

```ts
ui: {
  classes: {
    backdrop?: string;
    container?: string;
    title?: string;
    description?: string;
    buttonPrimary?: string;
    buttonSecondary?: string;
    buttonSave?: string;       // classe du bouton "Valider" — fallback sur buttonPrimary si absent
    buttonGhost?: string;
    categoryCard?: string;
    toggleTrackOn?: string;
    toggleTrackOff?: string;
    toggleKnob?: string;
    advancedContainer?: string;
  }
}
```

---

## 🧩 Activation différée des scripts

```html
<script type="text/plain" data-cookie-category="analytics">
  console.log("Activé après consentement");
</script>
```

---

## 🧠 API Client

```ts
client.open();
client.close();
client.getState();
client.hasStoredConsent();
client.hasStoredConsentForCurrentVersion();
client.reset();
```

---

## 📚 Documentation détaillée

- docs/CONFIG_REFERENCE.md
- docs/INTEGRATIONS.md

---

## 📄 Licence

MIT © Nicolas Ramos
