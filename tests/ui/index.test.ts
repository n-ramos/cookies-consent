import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import { ConsentStore } from '../../src/core/consent/store';
import { normalizeConfig } from '../../src/core/config/normalize';
import {CookieWallConfig} from "../../src";
import {openCookieWall} from "../../src/ui";

describe('UI exports', () => {
    const config: CookieWallConfig = {
        categories: [{ key: 'test', title: 'Test' }],
    };

    let store: ConsentStore;

    beforeEach(() => {
        localStorage.clear();
        document.body.innerHTML = '';

        const normalized = normalizeConfig(config);
        store = new ConsentStore({ ...normalized, storageKey: 'test' });
    });

    afterEach(() => {
        document.body.innerHTML = '';
        localStorage.clear();
    });

    describe('openCookieWall', () => {
        it('should return UI handle', () => {
            const normalized = normalizeConfig(config);
            const handle = openCookieWall(store, normalized);

            expect(handle).toBeDefined();
            expect(typeof handle.close).toBe('function');
            expect(typeof handle.destroy).toBe('function');
        });

        it('handle.close should remove UI', () => {
            const normalized = normalizeConfig(config);
            const handle = openCookieWall(store, normalized);

            expect(document.getElementById('cookie-wall-root')).toBeTruthy();

            handle.close();

            expect(document.getElementById('cookie-wall-root')).toBeFalsy();
        });

        it('handle.destroy should clean up and close', () => {
            const normalized = normalizeConfig(config);
            const handle = openCookieWall(store, normalized);

            expect(document.getElementById('cookie-wall-root')).toBeTruthy();

            handle.destroy();

            expect(document.getElementById('cookie-wall-root')).toBeFalsy();
        });

        it('should mount UI to DOM', () => {
            const normalized = normalizeConfig(config);
            openCookieWall(store, normalized);

            const root = document.getElementById('cookie-wall-root');

            expect(root).toBeTruthy();
            expect(root?.querySelector('[data-cw-action="accept"]')).toBeTruthy();
            expect(root?.querySelector('[data-cw-action="reject"]')).toBeTruthy();
        });

        it('should respect position config', () => {
            const posConfig = normalizeConfig({
                ...config,
                ui: { position: 'center' },
            });
            const handle = openCookieWall(store, posConfig);
            const root = document.getElementById('cookie-wall-root');

            expect(root?.className).toContain('items-center');

            handle.destroy();
        });

        it('should reuse existing root', () => {
            const normalized = normalizeConfig(config);
            const handle1 = openCookieWall(store, normalized);
            const root1 = document.getElementById('cookie-wall-root');

            const handle2 = openCookieWall(store, normalized);
            const root2 = document.getElementById('cookie-wall-root');

            expect(root1).toBe(root2);

            handle1.destroy();
            handle2.destroy();
        });

        it('handle can be called multiple times', () => {
            const normalized = normalizeConfig(config);
            const handle = openCookieWall(store, normalized);

            expect(() => {
                handle.close();
                handle.close();
                handle.close();
            }).not.toThrow();
        });
    });
});
