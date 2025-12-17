import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mountCookieWall } from '../../src/ui/mount';
import { ConsentStore } from '../../src/core/consent/store';
import { normalizeConfig } from '../../src/core/config/normalize';
import {CookieWallConfig} from "../../src";

describe('mountCookieWall', () => {
    const baseConfig: CookieWallConfig = {
        categories: [
            { key: 'essential', title: 'Essential', required: true },
            { key: 'analytics', title: 'Analytics' },
        ],
    };

    beforeEach(() => {
        document.body.innerHTML = '';
        localStorage.clear();
    });

    afterEach(() => {
        document.body.innerHTML = '';
        localStorage.clear();
    });

    it('should mount cookie wall with bottom-left position', () => {
        const config = normalizeConfig(baseConfig);
        const store = new ConsentStore({ ...config, storageKey: 'test' });

        const root = mountCookieWall(store, config);

        expect(root).toBeTruthy();
        expect(root.id).toBe('cookie-wall-root');
        expect(root.className).toContain('bottom-4');
        expect(root.className).toContain('left-4');
    });

    it('should mount cookie wall with bottom-right position', () => {
        const customConfig = normalizeConfig({
            ...baseConfig,
            ui: { position: 'bottom-right' },
        });
        const store = new ConsentStore({ ...customConfig, storageKey: 'test' });

        const root = mountCookieWall(store, customConfig);

        expect(root.className).toContain('bottom-4');
        expect(root.className).toContain('right-4');
        expect(root.className).not.toContain('left-4');
    });

    it('should mount cookie wall with center position', () => {
        const customConfig = normalizeConfig({
            ...baseConfig,
            ui: { position: 'center' },
        });
        const store = new ConsentStore({ ...customConfig, storageKey: 'test' });

        const root = mountCookieWall(store, customConfig);

        expect(root.className).toContain('fixed');
        expect(root.className).toContain('inset-0');
        expect(root.className).toContain('flex');
        expect(root.className).toContain('items-center');
        expect(root.className).toContain('justify-center');
    });

    it('should return existing root if already mounted', () => {
        const config = normalizeConfig(baseConfig);
        const store = new ConsentStore({ ...config, storageKey: 'test' });

        const root1 = mountCookieWall(store, config);
        const root2 = mountCookieWall(store, config);

        expect(root1).toBe(root2);
        expect(document.querySelectorAll('#cookie-wall-root').length).toBe(1);
    });

    it('should append to document.body', () => {
        const config = normalizeConfig(baseConfig);
        const store = new ConsentStore({ ...config, storageKey: 'test' });

        expect(document.body.children.length).toBe(0);

        mountCookieWall(store, config);

        expect(document.body.children.length).toBeGreaterThan(0);
        const root = document.getElementById('cookie-wall-root');
        expect(root?.parentElement).toBe(document.body);
    });

    it('should set z-index to 9999', () => {
        const config = normalizeConfig(baseConfig);
        const store = new ConsentStore({ ...config, storageKey: 'test' });

        const root = mountCookieWall(store, config);

        expect(root.className).toContain('z-[9999]');
    });

    it('should add fixed positioning', () => {
        const config = normalizeConfig(baseConfig);
        const store = new ConsentStore({ ...config, storageKey: 'test' });

        const root = mountCookieWall(store, config);

        expect(root.className).toContain('fixed');
    });

    it('should render HTML content', () => {
        const config = normalizeConfig(baseConfig);
        const store = new ConsentStore({ ...config, storageKey: 'test' });

        const root = mountCookieWall(store, config);

        expect(root.innerHTML.length).toBeGreaterThan(0);
        expect(root.querySelector('[data-cw-action]')).toBeTruthy();
    });

    it('should have correct width for bottom positions', () => {
        const config = normalizeConfig({ ...baseConfig, ui: { position: 'bottom-left' } });
        const store = new ConsentStore({ ...config, storageKey: 'test' });

        const root = mountCookieWall(store, config);

        expect(root.className).toContain('w-[340px]');
    });

    it('should have padding for center position', () => {
        const config = normalizeConfig({ ...baseConfig, ui: { position: 'center' } });
        const store = new ConsentStore({ ...config, storageKey: 'test' });

        const root = mountCookieWall(store, config);

        expect(root.className).toContain('p-4');
    });

    it('should have backdrop styling for center position', () => {
        const config = normalizeConfig({ ...baseConfig, ui: { position: 'center' } });
        const store = new ConsentStore({ ...config, storageKey: 'test' });

        const root = mountCookieWall(store, config);

        expect(root.className).toContain('bg-black/40');
    });

    it('should handle multiple positions correctly', () => {
        const positions: Array<'bottom-left' | 'bottom-right' | 'center'> = [
            'bottom-left',
            'bottom-right',
            'center',
        ];

        for (const pos of positions) {
            document.body.innerHTML = '';
            const config = normalizeConfig({ ...baseConfig, ui: { position: pos } });
            const store = new ConsentStore({ ...config, storageKey: 'test' });

            const root = mountCookieWall(store, config);

            expect(root).toBeTruthy();
            if (pos === 'center') {
                expect(root.className).toContain('inset-0');
            } else if (pos === 'bottom-right') {
                expect(root.className).toContain('right-4');
            } else {
                expect(root.className).toContain('left-4');
            }
        }
    });

    it('should create div element', () => {
        const config = normalizeConfig(baseConfig);
        const store = new ConsentStore({ ...config, storageKey: 'test' });

        const root = mountCookieWall(store, config);

        expect(root.tagName).toBe('DIV');
    });
});
