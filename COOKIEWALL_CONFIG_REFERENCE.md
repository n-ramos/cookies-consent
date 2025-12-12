# Cookie Wall – Référence complète de configuration

Ce document liste **toutes les options de configuration** de Cookie Wall, ainsi que les **options de personnalisation UI** (textes + classes).

> Remarque : les types ci‑dessous sont exprimés en **TypeScript** (référence).  
> En HTML (Web Component), la config est passée en **JSON** dans l’attribut `config`.

---

## Sommaire

- [1. Configuration principale](#1-configuration-principale)
- [2. Catégories](#2-catégories)
- [3. Vendors](#3-vendors)
- [4. Nettoyage des cookies](#4-nettoyage-des-cookies)
- [5. UI](#5-ui)
- [6. UI – Textes](#6-ui--textes)
- [7. UI – Classes](#7-ui--classes)
- [8. Exemples complets](#8-exemples-complets)

---

## 1. Configuration principale

### Type

```ts
export type ConsentDecision = 'granted' | 'denied';

export interface CookieWallConfig {
  /** Version de politique/texte : changer la version force une nouvelle demande */
  version: string;

  /** Clé de stockage du consentement (localStorage) */
  storageKey?: string; // default: "cookie-wall-consent" (ou équivalent)

  /** Liste des catégories gérées */
  categories: ConsentCategoryConfig[];

  /** Intégrations vendors */
  vendors?: VendorsConfig;

  /** Nettoyage des cookies au retrait du consentement */
  cookieCleanup?: CookieCleanupConfig;

  /** Personnalisation UI (textes, classes, position…) */
  ui?: CookieWallUIConfig;
}
```

### Notes

- `version` doit être modifiée à chaque changement substantiel (texte, catégories, finalités).
- `storageKey` permet d’isoler plusieurs instances/sous-domaines.

---

## 2. Catégories

### Type

```ts
export interface ConsentCategoryConfig {
  /** Identifiant unique (slug) */
  key: string; // ex: "essential" | "analytics" | "ads" | "personalization" | etc.

  /** Libellé affiché */
  title: string;

  /** Description affichée */
  description?: string;

  /** Catégorie obligatoire (toujours "granted") */
  required?: boolean; // default false

  /** Valeur par défaut si non required */
  default?: ConsentDecision; // default "denied" (recommandé)

  /**
   * Mapping Google Consent Mode (v2)
   * - string : une seule clé
   * - string[] : plusieurs clés
   */
  googleConsentMode?: string | string[];
}
```

### Valeurs Google Consent Mode courantes

- `analytics_storage`
- `ad_storage`
- `ad_user_data`
- `ad_personalization`
- `functionality_storage`
- `security_storage`
- `personalization_storage`

> Conseil : `security_storage` et `functionality_storage` sont souvent considérés "essential".

---

## 3. Vendors

### Type

```ts
export interface VendorsConfig {
  googleConsentMode?: {
    /** Active la traduction consentement -> gtag('consent', ...) */
    enabled: boolean;
  };
}
```

### Notes

- Si `vendors.googleConsentMode.enabled === true`, la lib émet des `gtag('consent','update', ...)` selon `googleConsentMode` des catégories.
- Le `gtag('consent','default', ...)` recommandé par Google doit être mis dans le `<head>` de la page (voir README principal).

---

## 4. Nettoyage des cookies

Permet de supprimer **physiquement** les cookies déjà posés lorsqu’un utilisateur retire son consentement (`granted -> denied`).

### Type

```ts
export interface CookieCleanupConfig {
  /**
   * Clé = categoryKey
   * Valeur = liste de préfixes de cookies à supprimer
   */
  [categoryKey: string]: string[];
}
```

### Exemple

```json
{
  "cookieCleanup": {
    "analytics": ["_ga", "_ga_", "_gid", "_gat", "_gac_", "__utm"],
    "ads": ["_fbp", "_fbc", "IDE", "test_cookie"]
  }
}
```

### Notes / limites

- La suppression des cookies dépend des `domain/path`. La lib tente plusieurs variantes.
- Certains cookies tiers ne sont pas supprimables depuis le site (cookies `HttpOnly` par ex.).
- Le nettoyage n’efface pas les données déjà envoyées aux vendors.

---

## 5. UI

### Type

```ts
export interface CookieWallUIConfig {
  /**
   * Position du wall
   * - bottom-left : bas gauche
   * - bottom-right : bas droit
   * - center : centré (modal)
   */
  position?: 'bottom-left' | 'bottom-right' | 'center';

  /** Textes */
  texts?: CookieWallUIText;

  /** Classes CSS (souvent Tailwind) */
  classes?: CookieWallUIClasses;
}
```

---

## 6. UI – Textes

### Type

```ts
export interface CookieWallUIText {
  /** Titre du bandeau */
  title?: string; // default: "🍪 Les cookies"

  /** Texte descriptif */
  description?: string; // default: "On utilise des cookies pour améliorer votre expérience."

  /** Libellé bouton accepter */
  acceptAllLabel?: string; // default: "OK pour moi" / "Tout accepter"

  /** Libellé bouton refuser */
  rejectAllLabel?: string; // default: "Non merci" / "Tout refuser"

  /** Libellé toggle/liaison vers personnalisation */
  customizeLabel?: string; // default: "Je choisis" / "Personnaliser"
}
```

### Exemple

```json
{
  "ui": {
    "texts": {
      "title": "🍪 Gestion des cookies",
      "description": "Choisissez les cookies que vous souhaitez autoriser.",
      "acceptAllLabel": "Tout accepter",
      "rejectAllLabel": "Tout refuser",
      "customizeLabel": "Personnaliser"
    }
  }
}
```

---

## 7. UI – Classes

Les classes permettent de personnaliser totalement le rendu **sans modifier le code**.

### Type

```ts
export interface CookieWallUIClasses {
  /** Wrapper / positionnement global */
  backdrop?: string;

  /** Conteneur principal */
  container?: string;

  /** Titre */
  title?: string;

  /** Description */
  description?: string;

  /** Bouton principal (accepter) */
  buttonPrimary?: string;

  /** Bouton secondaire (refuser) */
  buttonSecondary?: string;

  /** Bouton/texte de personnalisation ("Je choisis") */
  buttonGhost?: string;

  /** Carte de catégorie */
  categoryCard?: string;

  /** Track toggle ON */
  toggleTrackOn?: string;

  /** Track toggle OFF */
  toggleTrackOff?: string;

  /** Knob toggle */
  toggleKnob?: string;
}
```

### Liste des éléments (où ça s’applique)

- `backdrop` : wrapper positionné (fixed bottom-left/right/center)
- `container` : box / panel du cookie wall
- `title` : `<h2>`
- `description` : `<p>`
- `buttonPrimary` : bouton “Tout accepter / OK”
- `buttonSecondary` : bouton “Tout refuser / Non merci”
- `buttonGhost` : lien/bouton “Je choisis / Personnaliser”
- `categoryCard` : ligne/box par catégorie
- `toggleTrackOn` / `toggleTrackOff` : track du toggle
- `toggleKnob` : rond interne du toggle

### Exemple “rouge flat”

```json
{
  "ui": {
    "classes": {
      "container": "bg-red-50 text-red-950 rounded-2xl shadow-xl border border-red-200 p-4",
      "title": "font-semibold text-lg mb-1 text-red-900",
      "description": "text-sm mb-3 text-red-800",
      "buttonPrimary": "bg-red-600 hover:bg-red-500 text-white text-sm font-semibold px-4 py-1.5 rounded-full",
      "buttonSecondary": "text-sm text-red-700 hover:text-red-900 underline",
      "buttonGhost": "text-sm text-red-700 hover:text-red-900 underline mb-3",
      "categoryCard": "flex justify-between items-center border border-red-200 bg-white rounded-xl px-3 py-2",
      "toggleTrackOn": "relative inline-flex h-6 w-11 items-center rounded-full bg-red-600 transition-colors duration-200",
      "toggleTrackOff": "relative inline-flex h-6 w-11 items-center rounded-full bg-red-300 transition-colors duration-200",
      "toggleKnob": "inline-block h-5 w-5 bg-white rounded-full shadow transform transition-transform duration-200"
    }
  }
}
```

### Bonnes pratiques

- Évite d’utiliser des classes dépendantes d’un contexte extérieur (ex: `prose` si le site hôte n’a pas Tailwind).
- Privilégie des classes simples et des couleurs contrastées.
- En mode `center`, `backdrop` peut inclure un fond semi-opaque (ex: `fixed inset-0 bg-black/50 flex items-center justify-center`).

---

## 8. Exemples complets

### 8.1 Web Component – HTML (CDN)

```html
<cookie-consent
  config='{
    "version":"1.2.0",
    "storageKey":"demo-cookiewall",
    "categories":[
      { "key":"essential", "title":"Essentiels", "required":true, "description":"Nécessaire au fonctionnement du site." },
      { "key":"analytics", "title":"Analytics", "description":"Mesure d’audience", "googleConsentMode":"analytics_storage" },
      { "key":"ads", "title":"Publicité", "description":"Personnalisation des annonces",
        "googleConsentMode":["ad_storage","ad_user_data","ad_personalization"]
      }
    ],
    "vendors":{"googleConsentMode":{"enabled":true}},
    "cookieCleanup":{
      "analytics":["_ga","_ga_","_gid","_gat","_gac_","__utm"],
      "ads":["IDE","test_cookie","_fbp","_fbc"]
    },
    "ui":{
      "position":"bottom-left",
      "texts":{
        "title":"🍪 Gestion des cookies",
        "description":"Choisissez vos préférences.",
        "acceptAllLabel":"Tout accepter",
        "rejectAllLabel":"Tout refuser",
        "customizeLabel":"Personnaliser"
      }
    }
  }'
></cookie-consent>

<script src="./dist-cdn/cookie-consent.js" defer></script>
```

### 8.2 Scripts bloqués par catégorie

```html
<!-- Analytics (ex: GTM / GA) -->
<script type="text/plain" data-cookie-category="analytics">
  console.log("Analytics script activated!");
</script>

<!-- Ads -->
<script type="text/plain" data-cookie-category="ads">
  console.log("Ads script activated!");
</script>
```

---

## Changelog / compat

- Ce document décrit les options disponibles dans la version actuelle du projet.
- Si vous ajoutez des options, mettez à jour ce fichier (c’est la “source de vérité” de la config).
