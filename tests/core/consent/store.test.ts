import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {CookieWallConfig} from "../../../src";
import {ConsentStore} from "../../../src/core/consent/store";


describe('ConsentStore', () => {
    const config: CookieWallConfig & { storageKey: string } = {
        storageKey: 'test-consent',
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

    describe('initialization', () => {
        it('should create default state when no stored consent', () => {
            const store = new ConsentStore(config);
            const state = store.getState();

            expect(state.categories.essential!.status).toBe('granted');
            expect(state.categories.analytics!.status).toBe('denied');
            expect(state.timestamp).toBeDefined();
        });

        it('should mark required categories as granted', () => {
            const store = new ConsentStore(config);
            const state = store.getState();

            expect(state.categories.essential!.status).toBe('granted');
        });

        it('should initialize services array', () => {
            const store = new ConsentStore(config);
            const state = store.getState();

            expect(Array.isArray(state.categories.essential!.services)).toBe(true);
            expect(Array.isArray(state.categories.analytics!.services)).toBe(true);
        });

        it('should initialize checksum', () => {
            const store = new ConsentStore(config);
            const state = store.getState();

            expect(typeof state.categories.essential!.checksum).toBe('string');
            expect(state.categories.essential!.checksum.length).toBeGreaterThan(0);
        });
    });

    describe('hasStoredConsent', () => {
        it('should return false when no stored consent', () => {
            const store = new ConsentStore(config);
            expect(store.hasStoredConsent()).toBe(false);
        });

        it('should return true when consent is stored', () => {
            const store = new ConsentStore(config);
            store.acceptAll();

            expect(store.hasStoredConsent()).toBe(true);
        });
    });

    describe('hasStoredConsentForCurrentVersion', () => {
        it('should return false when no stored consent', () => {
            const store = new ConsentStore(config);
            expect(store.hasStoredConsentForCurrentVersion()).toBe(false);
        });

        it('should return true when valid consent is stored', () => {
            const store = new ConsentStore(config);
            store.acceptAll();

            const store2 = new ConsentStore(config);
            expect(store2.hasStoredConsentForCurrentVersion()).toBe(true);
        });

        it('should return false when checksum is invalid', () => {
            const store = new ConsentStore(config);
            store.acceptAll();

            // Change les services dans le DOM
            document.body.innerHTML = `
        <script type="text/plain" data-cookie-category="analytics" data-service="new-service"></script>
      `;

            const store2 = new ConsentStore(config);
            expect(store2.hasStoredConsentForCurrentVersion()).toBe(false);
        });

        it('should return false on invalid JSON', () => {
            localStorage.setItem('test-consent', 'invalid json');

            const store = new ConsentStore(config);
            expect(store.hasStoredConsentForCurrentVersion()).toBe(false);
        });
    });

    describe('getState', () => {
        it('should return a clone of the state', () => {
            const store = new ConsentStore(config);
            const state1 = store.getState();
            const state2 = store.getState();

            expect(state1).toEqual(state2);
            expect(state1).not.toBe(state2);
        });

        it('should not be able to modify internal state through returned value', () => {
            const store = new ConsentStore(config);
            const state = store.getState();

            state.categories.analytics!.status = 'granted';

            const state2 = store.getState();
            expect(state2.categories.analytics!.status).toBe('denied');
        });
    });

    describe('acceptAll', () => {
        it('should accept all non-required categories', () => {
            const store = new ConsentStore(config);
            store.acceptAll();

            const state = store.getState();
            expect(state.categories.essential!.status).toBe('granted');
            expect(state.categories.analytics!.status).toBe('granted');
        });

        it('should persist to localStorage', () => {
            const store = new ConsentStore(config);
            store.acceptAll();

            const stored = JSON.parse(localStorage.getItem('test-consent') || '{}');
            expect(stored.categories.analytics.status).toBe('granted');
        });

        it('should update timestamp', () => {
            const store = new ConsentStore(config);
            const before = new Date().getTime();

            store.acceptAll();

            const state = store.getState();
            const timestamp = new Date(state.timestamp).getTime();

            expect(timestamp).toBeGreaterThanOrEqual(before);
        });
    });

    describe('rejectAll', () => {
        it('should reject all non-required categories', () => {
            const store = new ConsentStore(config);
            store.rejectAll();

            const state = store.getState();
            expect(state.categories.essential!.status).toBe('granted');
            expect(state.categories.analytics!.status).toBe('denied');
        });

        it('should persist to localStorage', () => {
            const store = new ConsentStore(config);
            store.rejectAll();

            const stored = JSON.parse(localStorage.getItem('test-consent') || '{}');
            expect(stored.categories.analytics.status).toBe('denied');
        });
    });

    describe('setCategory', () => {
        it('should set category status', () => {
            const store = new ConsentStore(config);
            store.setCategory('analytics', 'granted');

            const state = store.getState();
            expect(state.categories.analytics!.status).toBe('granted');
        });

        it('should not modify required categories', () => {
            const store = new ConsentStore(config);
            store.setCategory('essential', 'denied');

            const state = store.getState();
            expect(state.categories.essential!.status).toBe('granted');
        });

        it('should persist to localStorage', () => {
            const store = new ConsentStore(config);
            store.setCategory('analytics', 'granted');

            const stored = JSON.parse(localStorage.getItem('test-consent') || '{}');
            expect(stored.categories.analytics.status).toBe('granted');
        });

        it('should update checksum on service change', () => {
            const store = new ConsentStore(config);
            store.setCategory('analytics', 'granted');

            document.body.innerHTML = `
        <script type="text/plain" data-cookie-category="analytics" data-service="new"></script>
      `;

            const store2 = new ConsentStore(config);
            const state = store2.getState();

            expect(state.categories.analytics!.checksum).not.toBe(
                JSON.parse(localStorage.getItem('test-consent') || '{}').categories.analytics.checksum,
            );
        });
    });

    describe('onChange', () => {
        it('should call listener on state change', () => {
            const store = new ConsentStore(config);
            const listener = vi.fn();

            store.onChange(listener);
            store.setCategory('analytics', 'granted');

            expect(listener).toHaveBeenCalled();
        });

        it('should pass prev and next state to listener', () => {
            const store = new ConsentStore(config);
            const listener = vi.fn();

            store.onChange(listener);
            store.setCategory('analytics', 'granted');

            const call = listener.mock.calls[0]![0];
            expect(call.prev).toBeDefined();
            expect(call.next).toBeDefined();
            expect(call.next.categories.analytics!.status).toBe('granted');
        });

        it('should allow unsubscribing', () => {
            const store = new ConsentStore(config);
            const listener = vi.fn();

            const unsubscribe = store.onChange(listener);
            unsubscribe();

            store.setCategory('analytics', 'granted');

            expect(listener).not.toHaveBeenCalled();
        });
    });

    describe('reset', () => {
        it('should remove from localStorage', () => {
            const store = new ConsentStore(config);
            store.acceptAll();
            expect(localStorage.getItem('test-consent')).not.toBeNull();

            store.reset();
            expect(localStorage.getItem('test-consent')).toBeNull();
        });

        it('should reset to default state', () => {
            const store = new ConsentStore(config);
            store.acceptAll();

            store.reset();
            const state = store.getState();

            expect(state.categories.essential!.status).toBe('granted');
            expect(state.categories.analytics!.status).toBe('denied');
        });
    });
});
