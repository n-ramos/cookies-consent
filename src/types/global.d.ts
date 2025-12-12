export {};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    CookieWall?: typeof import('../lib').CookieWall;
  }
}
