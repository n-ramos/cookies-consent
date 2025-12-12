import type { CookieWallUIClasses, CookieWallUIText, ConsentDecision } from '../consent/types';

export const DEFAULT_STORAGE_KEY = 'cookie-wall-consent';

export const DEFAULT_TEXTS: Required<CookieWallUIText> = {
  title: '🍪 Gestion des cookies',
  description: 'Nous utilisons des cookies pour améliorer l’expérience et mesurer l’audience.',
  acceptAllLabel: 'Tout accepter',
  rejectAllLabel: 'Tout refuser',
  customizeLabel: 'Personnaliser',
};

export const DEFAULT_CLASSES: Required<CookieWallUIClasses> = {
  backdrop: 'fixed bottom-4 left-4 z-[9999] w-[340px]',
  container: 'rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-xl',
  title: 'text-base font-semibold mb-1',
  description: 'text-sm text-slate-600 mb-3',
  buttonPrimary:
    'bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-4 py-2 rounded-full',
  buttonSecondary: 'text-sm text-slate-600 hover:text-slate-900 underline',
  buttonGhost: 'text-sm text-slate-700 hover:text-slate-900 underline mb-3',
  categoryCard:
    'flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2',
  toggleTrackOn:
    'relative inline-flex h-6 w-11 items-center rounded-full bg-emerald-500 transition-colors duration-200',
  toggleTrackOff:
    'relative inline-flex h-6 w-11 items-center rounded-full bg-slate-300 transition-colors duration-200',
  toggleKnob:
    'inline-block h-5 w-5 bg-white rounded-full shadow transform transition-transform duration-200',
  advancedContainer: 'flex flex-col gap-2 mb-3 max-h-44 overflow-auto',
};

export function defaultDecisionForCategory(
  required: boolean | undefined,
  d?: ConsentDecision,
): ConsentDecision {
  if (required) return 'granted';
  return d ?? 'denied';
}
