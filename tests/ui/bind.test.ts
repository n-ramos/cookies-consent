import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { bindCookieWall } from '../../src/ui/bind';
import { ConsentStore } from '../../src/core/consent/store';
import { normalizeConfig } from '../../src/core/config/normalize';
import {CookieWallConfig} from "../../src";

describe('bindCookieWall', () => {
    const baseConfig: CookieWallConfig = {
        categories: [
            { key: 'essential', title: 'Essential', required: true },
            { key: 'analytics', title: 'Analytics' },
            { key: 'ads', title: 'Ads' },
        ],
    };

    let root: HTMLElement;
    let store: ConsentStore;
    let config: ReturnType<typeof normalizeConfig>;
    let onClose: any;

    beforeEach(() => {
        localStorage.clear();
        document.body.innerHTML = '';

        config = normalizeConfig(baseConfig);
        store = new ConsentStore({ ...config, storageKey: 'test' });
        onClose = vi.fn();

        // Create a basic UI structure
        root = document.createElement('div');
        root.innerHTML = `
      <div>
        <button data-cw-action="accept">Accept</button>
        <button data-cw-action="reject">Reject</button>
        <button data-cw-action="toggle-advanced">Customize</button>
        <div data-cw-advanced>
          <button data-cw-toggle="analytics">Toggle Analytics</button>
          <button data-cw-toggle="ads">Toggle Ads</button>
        </div>
      </div>
    `;
        document.body.appendChild(root);
    });

    afterEach(() => {
        document.body.innerHTML = '';
        localStorage.clear();
    });

    describe('initialization', () => {
        it('should return cleanup function', () => {
            const cleanup = bindCookieWall(root, store, config, onClose);

            expect(typeof cleanup).toBe('function');
        });

        it('should find advanced section', () => {
            const advanced = root.querySelector('[data-cw-advanced]');
            expect(advanced).toBeTruthy();
        });
    });

    describe('accept button', () => {
        it('should accept all on accept button click', () => {
            const acceptSpy = vi.spyOn(store, 'acceptAll') as any;
            bindCookieWall(root, store, config, onClose);

            const acceptBtn = root.querySelector<HTMLButtonElement>('[data-cw-action="accept"]');
            acceptBtn?.click();

            expect(acceptSpy).toHaveBeenCalled();
        });

        it('should close on accept button click', () => {
            bindCookieWall(root, store, config, onClose);

            const acceptBtn = root.querySelector<HTMLButtonElement>('[data-cw-action="accept"]');
            acceptBtn?.click();

            expect(onClose).toHaveBeenCalled();
        });

        it('should not throw if accept button missing', () => {
            root.querySelector('[data-cw-action="accept"]')?.remove();

            expect(() => {
                bindCookieWall(root, store, config, onClose);
            }).not.toThrow();
        });
    });

    describe('reject button', () => {
        it('should reject all on reject button click', () => {
            const rejectSpy = vi.spyOn(store, 'rejectAll') as any;
            bindCookieWall(root, store, config, onClose);

            const rejectBtn = root.querySelector<HTMLButtonElement>('[data-cw-action="reject"]');
            rejectBtn?.click();

            expect(rejectSpy).toHaveBeenCalled();
        });

        it('should close on reject button click', () => {
            bindCookieWall(root, store, config, onClose);

            const rejectBtn = root.querySelector<HTMLButtonElement>('[data-cw-action="reject"]');
            rejectBtn?.click();

            expect(onClose).toHaveBeenCalled();
        });

        it('should not throw if reject button missing', () => {
            root.querySelector('[data-cw-action="reject"]')?.remove();

            expect(() => {
                bindCookieWall(root, store, config, onClose);
            }).not.toThrow();
        });
    });

    describe('toggle advanced', () => {
        it('should not throw if toggle button missing', () => {
            root.querySelector('[data-cw-action="toggle-advanced"]')?.remove();

            expect(() => {
                bindCookieWall(root, store, config, onClose);
            }).not.toThrow();
        });

        it('should not throw if advanced container missing', () => {
            root.querySelector('[data-cw-advanced]')?.remove();

            expect(() => {
                bindCookieWall(root, store, config, onClose);
            }).not.toThrow();
        });
    });

    describe('toggle category consent', () => {
        it('should toggle category consent', () => {
            const setCategory = vi.spyOn(store, 'setCategory') as any;
            bindCookieWall(root, store, config, onClose);

            const toggle = root.querySelector<HTMLButtonElement>('[data-cw-toggle="analytics"]');
            toggle?.click();

            expect(setCategory).toHaveBeenCalledWith('analytics', 'granted');
        });

        it('should toggle from granted to denied', () => {
            store.setCategory('analytics', 'granted');
            const setCategory = vi.spyOn(store, 'setCategory') as any;
            bindCookieWall(root, store, config, onClose);

            const toggle = root.querySelector<HTMLButtonElement>('[data-cw-toggle="analytics"]');
            toggle?.click();

            expect(setCategory).toHaveBeenCalledWith('analytics', 'denied');
        });

        it('should update toggle UI on click', () => {
            bindCookieWall(root, store, config, onClose);

            const toggle = root.querySelector<HTMLButtonElement>('[data-cw-toggle="analytics"]');
            const initialState = toggle?.getAttribute('aria-pressed');

            toggle?.click();

            const newState = toggle?.getAttribute('aria-pressed');
            expect(newState).not.toBe(initialState);
        });

        it('should handle multiple category toggles', () => {
            const setCategory = vi.spyOn(store, 'setCategory') as any;
            bindCookieWall(root, store, config, onClose);

            const analyticsToggle = root.querySelector<HTMLButtonElement>('[data-cw-toggle="analytics"]');
            const adsToggle = root.querySelector<HTMLButtonElement>('[data-cw-toggle="ads"]');

            analyticsToggle?.click();
            adsToggle?.click();

            expect(setCategory).toHaveBeenCalledTimes(2);
        });

        it('should skip toggles without data-cw-toggle', () => {
            const button = document.createElement('button');
            button.textContent = 'No toggle';
            root.appendChild(button);

            const setCategory = vi.spyOn(store, 'setCategory') as any;
            bindCookieWall(root, store, config, onClose);

            button.click();

            expect(setCategory).not.toHaveBeenCalled();
        });
    });

    describe('escape key', () => {
        it('should close on ESC for center position', () => {
            const centerConfig = normalizeConfig({
                ...baseConfig,
                ui: { position: 'center' },
            });
            bindCookieWall(root, store, centerConfig, onClose);

            const event = new KeyboardEvent('keydown', { key: 'Escape' });
            window.dispatchEvent(event);

            expect(onClose).toHaveBeenCalled();
        });

        it('should not close on ESC for bottom-left position', () => {
            bindCookieWall(root, store, config, onClose);

            const event = new KeyboardEvent('keydown', { key: 'Escape' });
            window.dispatchEvent(event);

            expect(onClose).not.toHaveBeenCalled();
        });

        it('should not close on other keys', () => {
            const centerConfig = normalizeConfig({
                ...baseConfig,
                ui: { position: 'center' },
            });
            bindCookieWall(root, store, centerConfig, onClose);

            const event = new KeyboardEvent('keydown', { key: 'Enter' });
            window.dispatchEvent(event);

            expect(onClose).not.toHaveBeenCalled();
        });
    });

    describe('cleanup', () => {
        it('should be safe to call multiple times', () => {
            const cleanup = bindCookieWall(root, store, config, onClose);

            expect(() => {
                cleanup();
                cleanup();
                cleanup();
            }).not.toThrow();
        });
    });

    describe('aria-pressed attribute', () => {
        it('should update aria-pressed on toggle', () => {
            // Add aria-pressed to toggle buttons since they're in test HTML
            const toggles = root.querySelectorAll('[data-cw-toggle]');
            toggles.forEach((toggle) => {
                toggle.setAttribute('aria-pressed', 'false');
            });

            bindCookieWall(root, store, config, onClose);

            const toggle = root.querySelector<HTMLButtonElement>('[data-cw-toggle="analytics"]');
            const before = toggle?.getAttribute('aria-pressed');

            toggle?.click();

            const after = toggle?.getAttribute('aria-pressed');
            expect(before).not.toBe(after);
        });
    });

    describe('error handling', () => {
        it('should not throw when root has no advanced container', () => {
            root.innerHTML = `
        <button data-cw-action="accept">Accept</button>
        <button data-cw-action="toggle-advanced">Customize</button>
      `;

            expect(() => {
                bindCookieWall(root, store, config, onClose);
            }).not.toThrow();
        });

        it('should not throw when no toggles exist', () => {
            root.innerHTML = `
        <button data-cw-action="accept">Accept</button>
        <div data-cw-advanced></div>
      `;

            expect(() => {
                bindCookieWall(root, store, config, onClose);
            }).not.toThrow();
        });
    });
});
