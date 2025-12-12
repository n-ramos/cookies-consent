import type { ConsentStore } from "./consentStore";
import type { CookieWallConfig, CookieWallUIClasses } from "./types";
import Alpine from "alpinejs";

const defaultClasses: Required<CookieWallUIClasses> = {
    backdrop: "fixed bottom-4 left-4 z-[9999] w-80",
    container:
        "bg-[#fff7e8] rounded-2xl shadow-xl border border-orange-200 p-4 text-slate-900",
    title: "font-bold text-lg mb-1",
    description: "text-sm mb-2",
    buttonPrimary:
        "bg-amber-400 px-3 py-1 rounded-full text-sm font-semibold text-slate-900 hover:bg-amber-300",
    buttonSecondary: "text-sm text-slate-700",
    buttonGhost: "underline text-sm text-amber-800 mb-3",
    categoryCard:
        "flex justify-between items-center border border-orange-100 bg-white rounded-xl px-3 py-2",
    toggleTrackOn:
        "relative inline-flex h-6 w-11 items-center rounded-full bg-emerald-500 transition-colors duration-200",
    toggleTrackOff:
        "relative inline-flex h-6 w-11 items-center rounded-full bg-slate-300 transition-colors duration-200",
    toggleKnob:
        "inline-block h-5 w-5 bg-white rounded-full shadow transform transition-transform duration-200"
};

function getPositionClasses(pos: string | undefined): string {
    switch (pos) {
        case "bottom-right":
            return "fixed bottom-4 right-4 z-[9999] w-80";
        case "center":
            return "fixed inset-0 z-[9999] flex items-center justify-center";
        case "bottom-left":
        default:
            return "fixed bottom-4 left-4 z-[9999] w-80";
    }
}

export function openCookieWall(store: ConsentStore, config: CookieWallConfig) {
    const existing = document.getElementById("cookie-wall-root");
    if (existing) return;

    const root = document.createElement("div");
    root.id = "cookie-wall-root";

    const state = store.getState();
    const ui = config.ui ?? {};
    const classes: Required<CookieWallUIClasses> = {
        ...defaultClasses,
        ...(ui.classes ?? {})
    };

    const posClass = ui.position
        ? getPositionClasses(ui.position)
        : classes.backdrop;

    const titleText = ui.texts?.title ?? "🍪 Les cookies";
    const descText =
        ui.texts?.description ??
        "On utilise des cookies pour améliorer votre expérience.";
    const acceptLabel = ui.texts?.acceptAllLabel ?? "OK pour moi";
    const rejectLabel = ui.texts?.rejectAllLabel ?? "Non merci";
    const customizeLabel = ui.texts?.customizeLabel ?? "Je choisis";

    root.innerHTML = `
    <div
      class="${posClass}"
      x-data="{ advanced: true }"
    >
      <div class="${classes.container}">
        <!-- Header -->
        <h2 class="${classes.title}">${titleText}</h2>
        <p class="${classes.description}">
          ${descText}
        </p>

        <!-- Bouton "Je choisis" -->
        <button
          id="cw-choose"
          type="button"
          class="${classes.buttonGhost}"
          @click="advanced = !advanced"
        >
          ${customizeLabel}
        </button>

        <!-- Zone avancée (catégories) -->
        <div
          id="cw-advanced"
          class="flex flex-col gap-2 mb-3 max-h-40 overflow-y-auto"
          x-show="advanced"
          x-transition.opacity.scale.origin-top-left
          x-cloak
        >
          ${config.categories
        .map((c) => {
            const val = state.categories[c.key];
            const isGranted = val === "granted";
            const isRequired = c.required;

            const trackClass = isGranted
                ? classes.toggleTrackOn
                : classes.toggleTrackOff;
            const knobTranslate = isGranted ? "translate-x-5" : "translate-x-1";
            const label = isGranted ? "Activé" : "Désactivé";

            return `
              <div class="${classes.categoryCard}">
                <div class="flex-1 min-w-0">
                  <div class="text-sm font-medium">${c.title}</div>
                  ${
                c.description
                    ? `<div class="text-xs text-slate-500">${c.description}</div>`
                    : ""
            }
                  ${
                isRequired
                    ? `<div class="text-[10px] uppercase tracking-wide text-emerald-600 mt-0.5">Obligatoire</div>`
                    : ""
            }
                </div>
                ${
                isRequired
                    ? ""
                    : `
                <button
                  type="button"
                  class="cw-toggle flex items-center gap-2"
                  data-cat="${c.key}"
                  aria-pressed="${isGranted}"
                >
                  <span class="${trackClass}">
                    <span class="${classes.toggleKnob} ${knobTranslate}"></span>
                  </span>
                  <span class="text-[11px] text-slate-500">${label}</span>
                </button>
                `
            }
              </div>
              `;
        })
        .join("")}
        </div>

        <!-- Actions principales -->
        <div class="flex justify-between items-center gap-2">
          <button
            id="cw-reject"
            type="button"
            class="${classes.buttonSecondary}"
          >
            ${rejectLabel}
          </button>
          <button
            id="cw-accept"
            type="button"
            class="${classes.buttonPrimary}"
          >
            ${acceptLabel}
          </button>
        </div>
      </div>
    </div>
  `;

    document.body.appendChild(root);

    // Alpine init
    if (!(window as any).__COOKIE_WALL_ALPINE__) {
        (window as any).__COOKIE_WALL_ALPINE__ = true;
        (window as any).Alpine = Alpine;
        Alpine.start();
    } else {
        Alpine.initTree(root);
    }

    // Fallback JS "Je choisis" si Alpine plante
    const adv = root.querySelector<HTMLElement>("#cw-advanced");
    const chooseBtn = root.querySelector<HTMLButtonElement>("#cw-choose");

    if (chooseBtn && adv) {
        let open = false;
        chooseBtn.addEventListener(
            "click",
            () => {
                open = !open;
                adv.style.display = open ? "flex" : "none";
            },
            { passive: true }
        );
    }

    // Toggles
    root.querySelectorAll<HTMLButtonElement>(".cw-toggle").forEach((btn) => {
        btn.addEventListener("click", () => {
            const key = btn.dataset.cat!;
            const current = store.getState().categories[key];
            const next = current === "granted" ? "denied" : "granted";

            store.setCategory(key, next);

            const track = btn.querySelector<HTMLSpanElement>("span:nth-child(1)");
            const knob = track?.querySelector<HTMLSpanElement>("span");
            const label = btn.querySelector<HTMLSpanElement>("span:nth-child(2)");

            if (track) {
                track.className =
                    (next === "granted"
                        ? classes.toggleTrackOn
                        : classes.toggleTrackOff) + " transition-colors duration-200";
            }

            if (knob) {
                knob.className =
                    classes.toggleKnob +
                    " " +
                    (next === "granted" ? "translate-x-5" : "translate-x-1");
            }

            if (label) {
                label.textContent = next === "granted" ? "Activé" : "Désactivé";
            }

            btn.setAttribute("aria-pressed", next === "granted" ? "true" : "false");
        });
    });

    // OK pour moi
    root
        .querySelector<HTMLButtonElement>("#cw-accept")
        ?.addEventListener("click", () => {
            store.acceptAll();
            root.remove();
        });

    // Non merci
    root
        .querySelector<HTMLButtonElement>("#cw-reject")
        ?.addEventListener("click", () => {
            store.rejectAll();
            root.remove();
        });
}
