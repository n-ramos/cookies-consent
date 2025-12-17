import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {CookieWallConfig} from "../../../../src";
import {googleConsentModeEffect} from "../../../../src/core/consent/effects/googleConsentModeEffect";

describe('googleConsentModeEffect', () => {
    const config: CookieWallConfig = {
        categories: [
            { key: 'analytics', title: 'Analytics', googleConsentMode: 'analytics_storage' },
            { key: 'ads', title: 'Ads', googleConsentMode: ['ad_storage', 'ad_user_data'] },
        ],
        vendors: {
            googleConsentMode: { enabled: true },
        },
    };

    beforeEach(() => {
        // Mock window.gtag
        (window as any).gtag = vi.fn();
    });

    afterEach(() => {
        delete (window as any).gtag;
    });

    it('should have correct key', () => {
        expect(googleConsentModeEffect.key).toBe('google-consent-mode');
    });

    it('should not run when googleConsentMode is disabled', () => {
        const configDisabled = {
            ...config,
            vendors: { googleConsentMode: { enabled: false } },
        };

        const gtag = vi.fn();
        (window as any).gtag = gtag;

        googleConsentModeEffect.run({
            config: configDisabled,
            next: {
                timestamp: '',
                categories: {
                    analytics: { status: 'granted' as const, services: [], checksum: '' },
                },
            },
        });

        expect(gtag).not.toHaveBeenCalled();
    });

    it('should not run when gtag is not available', () => {
        delete (window as any).gtag;

        const mockRun = vi.fn();

        expect(() => {
            googleConsentModeEffect.run({
                config,
                next: {
                    timestamp: '',
                    categories: {
                        analytics: { status: 'granted' as const, services: [], checksum: '' },
                    },
                },
            });
        }).not.toThrow();
    });

    it('should call gtag with granted consent', () => {
        const gtag = vi.fn();
        (window as any).gtag = gtag;

        googleConsentModeEffect.run({
            config,
            next: {
                timestamp: '',
                categories: {
                    analytics: { status: 'granted' as const, services: [], checksum: '' },
                    ads: { status: 'granted' as const, services: [], checksum: '' },
                },
            },
        });

        expect(gtag).toHaveBeenCalledWith('consent', 'update', {
            analytics_storage: 'granted',
            ad_storage: 'granted',
            ad_user_data: 'granted',
        });
    });

    it('should call gtag with denied consent', () => {
        const gtag = vi.fn();
        (window as any).gtag = gtag;

        googleConsentModeEffect.run({
            config,
            next: {
                timestamp: '',
                categories: {
                    analytics: { status: 'denied' as const, services: [], checksum: '' },
                    ads: { status: 'denied' as const, services: [], checksum: '' },
                },
            },
        });

        expect(gtag).toHaveBeenCalledWith('consent', 'update', {
            analytics_storage: 'denied',
            ad_storage: 'denied',
            ad_user_data: 'denied',
        });
    });

    it('should handle mixed consent states', () => {
        const gtag = vi.fn();
        (window as any).gtag = gtag;

        googleConsentModeEffect.run({
            config,
            next: {
                timestamp: '',
                categories: {
                    analytics: { status: 'granted' as const, services: [], checksum: '' },
                    ads: { status: 'denied' as const, services: [], checksum: '' },
                },
            },
        });

        expect(gtag).toHaveBeenCalledWith('consent', 'update', {
            analytics_storage: 'granted',
            ad_storage: 'denied',
            ad_user_data: 'denied',
        });
    });

    it('should handle undefined consent as denied', () => {
        const gtag = vi.fn();
        (window as any).gtag = gtag;

        const configWithoutDefault = {
            categories: [
                { key: 'analytics', title: 'Analytics', googleConsentMode: 'analytics_storage' },
            ],
            vendors: {
                googleConsentMode: { enabled: true },
            },
        };

        googleConsentModeEffect.run({
            config: configWithoutDefault,
            next: {
                timestamp: '',
                categories: {},
            },
        });

        expect(gtag).toHaveBeenCalledWith('consent', 'update', {
            analytics_storage: 'denied',
        });
    });

    it('should not call gtag when no categories have googleConsentMode', () => {
        const gtag = vi.fn();
        (window as any).gtag = gtag;

        const configNoGCM = {
            categories: [
                { key: 'analytics', title: 'Analytics' },
            ],
            vendors: {
                googleConsentMode: { enabled: true },
            },
        };

        googleConsentModeEffect.run({
            config: configNoGCM,
            next: {
                timestamp: '',
                categories: {
                    analytics: { status: 'granted' as const, services: [], checksum: '' },
                },
            },
        });

        expect(gtag).not.toHaveBeenCalled();
    });

    it('should handle string googleConsentMode', () => {
        const gtag = vi.fn();
        (window as any).gtag = gtag;

        googleConsentModeEffect.run({
            config,
            next: {
                timestamp: '',
                categories: {
                    analytics: { status: 'granted' as const, services: [], checksum: '' },
                    ads: { status: 'denied' as const, services: [], checksum: '' },
                },
            },
        });

        expect(gtag).toHaveBeenCalled();
    });

    it('should handle array googleConsentMode', () => {
        const gtag = vi.fn();
        (window as any).gtag = gtag;

        googleConsentModeEffect.run({
            config,
            next: {
                timestamp: '',
                categories: {
                    ads: { status: 'granted' as const, services: [], checksum: '' },
                },
            },
        });

        expect(gtag).toHaveBeenCalled();
    });
});
