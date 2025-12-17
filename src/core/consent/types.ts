export type ConsentDecision = 'granted' | 'denied';

export interface ConsentCategoryConfig {
  key: string;
  title: string;
  description?: string;
  required?: boolean;
  default?: ConsentDecision;
  googleConsentMode?: string | string[];
}

export interface CookieWallUIText {
  title?: string;
  description?: string;
  acceptAllLabel?: string;
  rejectAllLabel?: string;
  customizeLabel?: string;
}

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

export interface CookieWallUIConfig {
  position?: 'bottom-left' | 'bottom-right' | 'center';
  texts?: CookieWallUIText;
  classes?: CookieWallUIClasses;
}

export interface VendorsConfig {
  googleConsentMode?: { enabled: boolean };
}

export interface CookieCleanupConfig {
  [categoryKey: string]: string[];
}

export interface CookieWallConfig {
  storageKey?: string;
  categories: ConsentCategoryConfig[];
  vendors?: VendorsConfig;
  cookieCleanup?: CookieCleanupConfig;
  ui?: CookieWallUIConfig;
}

export interface ConsentCategoryState {
  status: ConsentDecision;
  services: string[];
  checksum: string;
}

export interface ConsentState {
  timestamp: string;
  categories: Record<string, ConsentCategoryState>;
}
