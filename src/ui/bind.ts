import type { ConsentStore } from '../core/consent/store';
import { NormalizedCookieWallConfig } from '../core/config/normalize';

type Cleanup = () => void;

function qs<T extends Element>(root: ParentNode, sel: string): T | null {
  return root.querySelector(sel);
}

export function bindCookieWall(
  root: HTMLElement,
  store: ConsentStore,
  config: NormalizedCookieWallConfig,
  onClose: () => void,
): Cleanup {
  const cleanups: Cleanup[] = [];

  const advanced = qs<HTMLElement>(root, '[data-cw-advanced]');
  const toggleAdvancedBtn = qs<HTMLButtonElement>(root, '[data-cw-action="toggle-advanced"]');

  const setAdvanced = (open: boolean) => {
    if (!advanced) return;
    if (open) {
      advanced.classList.remove('hidden');
      requestAnimationFrame(() => {
        advanced.classList.remove('opacity-0', 'translate-y-1');
      });
    } else {
      advanced.classList.add('opacity-0', 'translate-y-1');
      const t = window.setTimeout(() => advanced.classList.add('hidden'), 200);
      cleanups.push(() => window.clearTimeout(t));
    }
  };

  let advancedOpen = true;
  setAdvanced(true);
  if (toggleAdvancedBtn) {
    const onClick = () => {
      advancedOpen = !advancedOpen;
      setAdvanced(advancedOpen);
    };
    toggleAdvancedBtn.addEventListener('click', onClick);
    cleanups.push(() => toggleAdvancedBtn.removeEventListener('click', onClick));
  }

  const acceptBtn = qs<HTMLButtonElement>(root, '[data-cw-action="accept"]');
  if (acceptBtn) {
    const onClick = () => {
      store.acceptAll();
      onClose();
    };
    acceptBtn.addEventListener('click', onClick);
    cleanups.push(() => acceptBtn.removeEventListener('click', onClick));
  }

  const rejectBtn = qs<HTMLButtonElement>(root, '[data-cw-action="reject"]');
  if (rejectBtn) {
    const onClick = () => {
      store.rejectAll();
      onClose();
    };
    rejectBtn.addEventListener('click', onClick);
    cleanups.push(() => rejectBtn.removeEventListener('click', onClick));
  }

  const toggles = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-cw-toggle]'));
  for (const btn of toggles) {
    const key = btn.getAttribute('data-cw-toggle');
    if (!key) continue;

    const onClick = () => {
      const state = store.getState();
      const current = state.categories[key]?.status ?? 'denied';
      const next = current === 'granted' ? 'denied' : 'granted';
      store.setCategory(key, next);

      // optimistic UI update
      const track = btn.querySelector<HTMLElement>('span');
      const knob = track?.querySelector<HTMLElement>('span');

      const classes = config.ui.classes;
      if (track) {
        track.className = next === 'granted' ? classes.toggleTrackOn : classes.toggleTrackOff;
      }
      if (knob) {
        knob.className =
            classes.toggleKnob + ' ' + (next === 'granted' ? 'translate-x-5' : 'translate-x-1');
      }

      btn.setAttribute('aria-pressed', next === 'granted' ? 'true' : 'false');
    };

    btn.addEventListener('click', onClick);
    cleanups.push(() => btn.removeEventListener('click', onClick));
  }

  // close on ESC only for center modal
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && (config.ui?.position ?? 'bottom-left') === 'center') {
      onClose();
    }
  };
  window.addEventListener('keydown', onKey);
  cleanups.push(() => window.removeEventListener('keydown', onKey));

  return () => cleanups.forEach((fn) => fn());
}
