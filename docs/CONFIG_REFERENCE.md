# Configuration Reference — @n-ramos/cookie-consent

Documentation complète de la configuration de la librairie.

Inclut :
- toutes les options disponibles
- valeurs par défaut
- comportements internes
- API exposée

---

## CookieWallConfig

```ts
export type CookieWallConfig = {
  version?: string;
  storageKey?: string;
  categories: ConsentCategoryConfig[];
  vendors?: VendorConfig;
  cookieCleanup?: CookieCleanupConfig;
  ui?: CookieWallUIConfig;
};
```

---

## ConsentCategoryConfig

```ts
export type ConsentCategoryConfig = {
  key: string;
  title: string;
  description?: string;
  required?: boolean;
  googleConsentMode?: string | string[];
};
```

---

## VendorConfig

```ts
export type VendorConfig = {
  googleConsentMode?: {
    enabled: boolean;
  };
};
```

---

## CookieCleanupConfig

```ts
export type CookieCleanupConfig = Record<string, string[]>;
```

---

## UI Configuration

```ts
export type CookieWallUIConfig = {
  position?: "bottom-left" | "bottom-right" | "center";
  texts?: CookieWallUIText;
  classes?: CookieWallUIClasses;
};
```
```ts
export interface CookieWallUIText {
  title?: string;
  description?: string;
  acceptAllLabel?: string;
  rejectAllLabel?: string;
  customizeLabel?: string;
}


```
```ts
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
  advancedContainer?: string;
}
```
---

## API Client

```ts
client.open()
client.close()
client.getState()
client.hasStoredConsent()
client.hasStoredConsentForCurrentVersion()
client.reset()
```
