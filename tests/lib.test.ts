import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {CookieWall, CookieWallConfig, initCookieWall} from "../src";

describe('CookieWall API', () => {
    const config: CookieWallConfig = {
        categories: [
            { key: 'essential', title: 'Essential', required: true },
            { key: 'analytics', title: 'Analytics' },
        ],
    };

    beforeEach(() => {
        localStorage.clear();
    });

    afterEach(() => {
        localStorage.clear();
    });

    describe('initCookieWall', () => {
        it('should return client with all methods', () => {
            const client = initCookieWall(config);

            expect(typeof client.open).toBe('function');
            expect(typeof client.destroy).toBe('function');
            expect(typeof client.getState).toBe('function');
            expect(typeof client.acceptAll).toBe('function');
            expect(typeof client.rejectAll).toBe('function');
            expect(typeof client.setCategory).toBe('function');
            expect(typeof client.hasStoredConsent).toBe('function');
            expect(typeof client.hasStoredConsentForCurrentVersion).toBe('function');
        });

        it('should store client instance globally', () => {
            const client = initCookieWall(config);

            expect(CookieWall.getState).toBeDefined();
        });

        it('client.getState should return valid state', () => {
            const client = initCookieWall(config);
            const state = client.getState();

            expect(state).toHaveProperty('timestamp');
            expect(state).toHaveProperty('categories');
        });

        it('client.hasStoredConsent should reflect localStorage', () => {
            const client = initCookieWall(config);

            expect(client.hasStoredConsent()).toBe(false);

            client.acceptAll();

            expect(client.hasStoredConsent()).toBe(true);
        });

        it('client.acceptAll should set all categories to granted', () => {
            const client = initCookieWall(config);

            client.acceptAll();

            const state = client.getState();
            expect(state.categories.essential?.status).toBe('granted');
            expect(state.categories.analytics?.status).toBe('granted');
        });

        it('client.rejectAll should set non-required to denied', () => {
            const client = initCookieWall(config);

            client.rejectAll();

            const state = client.getState();
            expect(state.categories.essential?.status).toBe('granted'); // required
            expect(state.categories.analytics?.status).toBe('denied');
        });

        it('client.setCategory should update single category', () => {
            const client = initCookieWall(config);

            client.setCategory('analytics', 'granted');

            const state = client.getState();
            expect(state.categories.analytics?.status).toBe('granted');
        });

        it('client.destroy should clean up', () => {
            const client = initCookieWall(config);

            expect(() => {
                client.destroy();
            }).not.toThrow();
        });
    });

    describe('CookieWall static API', () => {
        it('CookieWall.init should create and return client', () => {
            const client = CookieWall.init(config);

            expect(client).toBeDefined();
            expect(typeof client.open).toBe('function');
        });

        it('CookieWall.open should work', () => {
            const client = initCookieWall(config);

            expect(() => {
                CookieWall.open();
            }).not.toThrow();
        });

        it('CookieWall.destroy should work', () => {
            initCookieWall(config);

            expect(() => {
                CookieWall.destroy();
            }).not.toThrow();
        });

        it('CookieWall.getState should return state', () => {
            initCookieWall(config);

            const state = CookieWall.getState();

            expect(state).toBeDefined();
            expect(state).toHaveProperty('categories');
        });

        it('CookieWall.hasStoredConsent should return boolean', () => {
            initCookieWall(config);

            const has = CookieWall.hasStoredConsent();

            expect(typeof has).toBe('boolean');
        });

        it('CookieWall.hasStoredConsentForCurrentVersion should return boolean', () => {
            initCookieWall(config);

            const has = CookieWall.hasStoredConsentForCurrentVersion();

            expect(typeof has).toBe('boolean');
        });

        it('CookieWall should be exposed on window', () => {
            initCookieWall(config);

            expect((window as any).CookieWall).toBeDefined();
        });
    });
});
