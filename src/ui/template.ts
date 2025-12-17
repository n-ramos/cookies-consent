import type { ConsentCategoryState } from '../core/consent/types';
import type { NormalizedCookieWallConfig } from '../core/config/normalize';

function escapeHtml(s: string): string {
    return s.replace(
        /[&<>"']/g,
        (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[c]!,
    );
}

export function renderCookieWall(
    config: NormalizedCookieWallConfig,
    state: { categories: Record<string, ConsentCategoryState> },
): string {
    const ui = config.ui;
    const t = ui.texts;
    const c = ui.classes;

    return `
  <div class="${c.container}">
    <h2 class="${c.title}">${escapeHtml(t.title)}</h2>
    <p class="${c.description}">${escapeHtml(t.description)}</p>

    <button type="button" data-cw-action="toggle-advanced" class="${c.buttonGhost}">
      ${escapeHtml(t.customizeLabel)}
    </button>

    <div data-cw-advanced class="${c.advancedContainer} hidden opacity-0 translate-y-1 transition-all duration-200">
      ${config.categories
        .map((cat) => {
            const categoryState = state.categories[cat.key];
            const granted = categoryState?.status === 'granted';
            const required = !!cat.required;

            const trackClass = granted ? c.toggleTrackOn : c.toggleTrackOff;
            const knobPos = granted ? 'translate-x-5' : 'translate-x-1';
            const label = granted ? 'Activé' : 'Désactivé';

            return `
          <div class="${c.categoryCard}">
            <div class="min-w-0 flex-1">
              <div class="text-sm font-medium">${escapeHtml(cat.title)}</div>
              ${cat.description ? `<div class="text-xs text-slate-500">${escapeHtml(cat.description)}</div>` : ''}
              ${required ? `<div class="mt-0.5 text-[10px] uppercase tracking-wide text-emerald-600">Obligatoire</div>` : ''}
            </div>

            ${
                required
                    ? ''
                    : `
              <button type="button" class="flex items-center gap-2 select-none" data-cw-toggle="${escapeHtml(cat.key)}" aria-pressed="${granted}">
                <span class="${trackClass}">
                  <span class="${c.toggleKnob} ${knobPos}"></span>
                </span>
                <span class="text-[11px] text-slate-500">${label}</span>
              </button>
            `
            }
          </div>
        `;
        })
        .join('')}
    </div>

    <div class="mt-3 flex items-center justify-between gap-2">
      <button type="button" data-cw-action="reject" class="${c.buttonSecondary}">
        ${escapeHtml(t.rejectAllLabel)}
      </button>
      <button type="button" data-cw-action="accept" class="${c.buttonPrimary}">
        ${escapeHtml(t.acceptAllLabel)}
      </button>
    </div>
  </div>
  `;
}
