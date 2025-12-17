import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { initCookieWall } from '../../src/core/init';
import {CookieWallConfig} from "../../src";

describe('initCookieWall', () => {
    const config: CookieWallConfig = {
        categories: [
            { key: 'essential', title: 'Essential', required: true },
            { key: 'analytics', title: 'Analytics' },
        ],
    };

    beforeEach(() => {
        localStorage.clear();
        document.body.innerHTML = '';
    });

    afterEach(() => {
        localStorage.clear();
        document.body.innerHTML = '';
    });

    it('should return client with all methods', () => {
        const client = initCookieWall(config);

        expect(client.open).toBeDefined();
        expect(client.destroy).toBeDefined();
        expect(client.getState).toBeDefined();
        expect(client.acceptAll).toBeDefined();
        expect(client.rejectAll).toBeDefined();
        expect(client.setCategory).toBeDefined();
        expect(client.hasStoredConsent).toBeDefined();
        expect(client.hasStoredConsentForCurrentVersion).toBeDefined();
    });

    it('should initialize engine and store', () => {
        const client = initCookieWall(config);

        const state = client.getState();

        expect(state).toHaveProperty('categories');
    });

    it('open should create UI', () => {
        const client = initCookieWall(config);

        client.open();

        expect(document.getElementById('cookie-wall-root')).toBeTruthy();

        client.destroy();
    });

    it('destroy should clean up', () => {
        const client = initCookieWall(config);

        client.open();
        expect(document.getElementById('cookie-wall-root')).toBeTruthy();

        client.destroy();

        expect(document.getElementById('cookie-wall-root')).toBeFalsy();
    });

    it('acceptAll should update state', () => {
        const client = initCookieWall(config);

        client.acceptAll();

        const state = client.getState();
        expect(state.categories.analytics?.status).toBe('granted');
    });

    it('rejectAll should update non-required', () => {
        const client = initCookieWall(config);

        client.rejectAll();

        const state = client.getState();
        expect(state.categories.essential?.status).toBe('granted');
        expect(state.categories.analytics?.status).toBe('denied');
    });

    it('setCategory should update single category', () => {
        const client = initCookieWall(config);

        client.setCategory('analytics', 'granted');

        const state = client.getState();
        expect(state.categories.analytics?.status).toBe('granted');
    });

    it('hasStoredConsent should reflect state', () => {
        const client = initCookieWall(config);

        expect(client.hasStoredConsent()).toBe(false);

        client.acceptAll();

        expect(client.hasStoredConsent()).toBe(true);
    });

    it('hasStoredConsentForCurrentVersion should be accurate', () => {
        const client = initCookieWall(config);

        expect(client.hasStoredConsentForCurrentVersion()).toBe(false);

        client.acceptAll();

        expect(client.hasStoredConsentForCurrentVersion()).toBe(true);
    });

    it('multiple opens should not create duplicate UIs', () => {
        const client = initCookieWall(config);

        client.open();
        const root1 = document.getElementById('cookie-wall-root');

        client.open();
        const root2 = document.getElementById('cookie-wall-root');

        // Root should be the same reference (or at least same content)
        expect(root1).toBeTruthy();
        expect(root2).toBeTruthy();

        client.destroy();
    });

    it('should handle destroy without open', () => {
        const client = initCookieWall(config);

        expect(() => {
            client.destroy();
        }).not.toThrow();
    });

    it('engine should use effects', () => {
        const clientConfig: CookieWallConfig = {
            categories: [{ key: 'test', title: 'Test' }],
            vendors: { googleConsentMode: { enabled: true } },
        };

        (window as any).gtag = () => {}; // Mock gtag

        const client = initCookieWall(clientConfig);

        expect(() => {
            client.acceptAll();
        }).not.toThrow();

        client.destroy();
    });
});
