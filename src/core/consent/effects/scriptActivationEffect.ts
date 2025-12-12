import type { ConsentEffect } from './types';

function activateScript(el: HTMLScriptElement): void {
  const newScript = document.createElement('script');

  // Copy attributes except blocking ones
  for (const attr of Array.from(el.attributes)) {
    if (attr.name === 'type') continue;
    if (attr.name === 'data-cookie-category') continue;
    newScript.setAttribute(attr.name, attr.value);
  }

  // Default to text/javascript
  newScript.type = el.getAttribute('data-type') || 'text/javascript';

  // Preserve inline code
  if (el.textContent) newScript.textContent = el.textContent;

  // If script has src via data-src, support it
  const dataSrc = el.getAttribute('data-src');
  if (dataSrc) newScript.src = dataSrc;

  el.replaceWith(newScript);
}

export const scriptActivationEffect: ConsentEffect = {
  key: 'script-activation',
  run({ next }) {
    const nodes = Array.from(
      document.querySelectorAll<HTMLScriptElement>(
        'script[type="text/plain"][data-cookie-category]',
      ),
    );

    for (const el of nodes) {
      const cat = el.getAttribute('data-cookie-category');
      if (!cat) continue;

      const allowed = next.categories[cat] === 'granted';
      if (!allowed) continue;

      // prevent double activation
      if (el.getAttribute('data-activated') === '1') continue;
      el.setAttribute('data-activated', '1');

      activateScript(el);
    }
  },
};
