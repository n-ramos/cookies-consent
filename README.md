# 🍪 Cookie Wall – Documentation complète
# Cookie Consent

[![npm version](https://img.shields.io/npm/v/@n-ramos/cookie-consent.svg)](https://www.npmjs.com/package/@n-ramos/cookie-consent)
[![npm downloads](https://img.shields.io/npm/dm/@n-ramos/cookie-consent.svg)](https://www.npmjs.com/package/@n-ramos/cookie-consent)
[![release](https://github.com/n-ramos/cookies-consent/actions/workflows/release.yml/badge.svg)](https://github.com/n-ramos/cookies-consent/actions/workflows/release.yml)

Cookie Wall est une **librairie de gestion du consentement RGPD** inspirée de solutions comme Axeptio.
Elle est conçue pour être **simple à intégrer**, **hautement configurable** et **conforme aux exigences RGPD / CNIL**.

---

## Table des matières

1. Philosophie & conformité RGPD
2. Installation
3. Démarrage rapide
4. Configuration complète
5. Gestion des scripts et cookies
6. Google Consent Mode v2
7. Web Component `<cookie-consent>`
8. API JavaScript publique
9. Personnalisation UI / Design
10. Versionnement du consentement
11. Bonnes pratiques RGPD
12. Développement & build
13. FAQ
14. Licence & roadmap

---

## 1. Philosophie & conformité RGPD

Cookie Wall applique strictement les principes suivants :

- ❌ Aucun cookie non essentiel avant consentement
- ✅ Consentement explicite (acceptation **et** refus)
- ✅ Possibilité de modifier son choix à tout moment
- ✅ Re-demande du consentement lors d’un changement légal
- ✅ Compatible CNIL / RGPD / ePrivacy

La librairie **ne dépose aucun cookie elle-même** :  
elle se contente de **bloquer, activer ou nettoyer** les scripts fournis par le développeur.

---

## 2. Installation

### Option recommandée — CDN / script global

```html
<script src="cookie-consent.js" defer></script>
```

Aucune dépendance requise côté client.

---

### Option module (Vite / ESM)

```ts
import { initCookieWall } from "cookie-wall";
```

---

## 3. Démarrage rapide

```html
<cookie-consent
  config='{
    "version": "1.0.0",
    "categories": [
      { "key": "essential", "title": "Essentiels", "required": true },
      { "key": "analytics", "title": "Analytics" }
    ]
  }'
></cookie-consent>
```

➡️ Le cookie wall s’affiche automatiquement à la première visite.

---

## 4. Configuration complète

### Structure générale

```ts
type CookieWallConfig = {
  version: string;
  storageKey?: string;
  categories: CookieCategory[];
  vendors?: VendorsConfig;
  cookieCleanup?: Record<string, string[]>;
  ui?: UIConfig;
};
```

---

### Catégories de cookies

```json
{
  "key": "analytics",
  "title": "Analytics",
  "description": "Mesure d’audience",
  "required": false,
  "googleConsentMode": "analytics_storage"
}
```

- `key` : identifiant unique
- `required` : true = toujours actif
- `googleConsentMode` : clé associée à Google Consent Mode

---

## 5. Gestion des scripts et cookies

### Bloquer un script tiers

```html
<script type="text/plain" data-cookie-category="analytics">
  // Code Google Analytics, Meta, etc.
</script>
```

➡️ Le script sera exécuté uniquement si la catégorie est acceptée.

---

### Nettoyage des cookies

```json
"cookieCleanup": {
  "analytics": ["_ga", "_gid", "_gat", "_ga_"]
}
```

Les cookies sont supprimés automatiquement lors d’un refus ou retrait.

---

## 6. Google Consent Mode v2

### Code obligatoire dans `<head>`

```html
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }

  gtag('consent', 'default', {
    'ad_storage': 'denied',
    'analytics_storage': 'denied',
    'ad_user_data': 'denied',
    'ad_personalization': 'denied',
    'functionality_storage': 'granted',
    'security_storage': 'granted'
  });
</script>
```

Cookie Wall mettra automatiquement à jour ces valeurs.

---

## 7. Web Component `<cookie-consent>`

### Pourquoi un Web Component ?

- intégration en 1 ligne
- compatible CMS / frameworks
- pas de dépendance externe

```html
<cookie-consent config='{...}'></cookie-consent>
```

---

## 8. API JavaScript publique

Disponible via `window.CookieWall`.

```js
CookieWall.init(config);
CookieWall.open();
CookieWall.getState();
CookieWall.hasStoredConsentForCurrentVersion();
CookieWall.reset();
```

---

## 9. Personnalisation UI

### Textes

```json
"ui": {
  "texts": {
    "title": "🍪 Cookies",
    "description": "Gérez vos préférences",
    "acceptAllLabel": "Tout accepter",
    "rejectAllLabel": "Tout refuser",
    "customizeLabel": "Personnaliser"
  }
}
```

---

### Classes CSS

```json
"ui": {
  "classes": {
    "container": "bg-red-50 text-red-900",
    "buttonPrimary": "bg-red-600 text-white",
    "buttonSecondary": "underline"
  }
}
```

---

## 10. Versionnement du consentement

```json
"version": "1.2.0"
```

➡️ Toute modification légale doit entraîner une nouvelle version.

---

## 11. Bonnes pratiques RGPD

- Toujours afficher Refuser au même niveau que Accepter
- Bloquer tous les scripts non essentiels
- Versionner chaque changement
- Documenter les finalités

---

## 12. Développement & build

```bash
pnpm install
pnpm dev
pnpm build
```

### Build CDN

```bash
pnpm vite build --config vite.config.standalone.ts
```

---

## 13. FAQ

**Est-ce conforme CNIL ?**  
Oui, si configuré correctement.

**Support multi-langue ?**  
Prévu via la configuration UI.

---

## 14. Licence & roadmap

Licence : MIT

### Roadmap
- Badge discret cookies
- Multi-langue
- IAB TCF v2
- Dashboard SaaS
