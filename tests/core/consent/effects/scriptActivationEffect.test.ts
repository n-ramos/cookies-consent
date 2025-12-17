import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {CookieWallConfig} from "../../../../src";
import {scriptActivationEffect} from "../../../../src/core/consent/effects/scriptActivationEffect";

describe('scriptActivationEffect', () => {
    const config: CookieWallConfig = {
        categories: [
            { key: 'analytics', title: 'Analytics' },
            { key: 'ads', title: 'Ads' },
        ],
    };

    beforeEach(() => {
        document.body.innerHTML = '';
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('should have correct key', () => {
        expect(scriptActivationEffect.key).toBe('script-activation');
    });

    it('should not throw when no scripts present', () => {
        expect(() => {
            scriptActivationEffect.run({
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

    it('should activate script when consent granted', () => {
        const script = document.createElement('script');
        script.type = 'text/plain';
        script.setAttribute('data-cookie-category', 'analytics');
        script.textContent = 'console.log("test");';
        document.body.appendChild(script);

        scriptActivationEffect.run({
            config,
            next: {
                timestamp: '',
                categories: {
                    analytics: { status: 'granted' as const, services: [], checksum: '' },
                },
            },
        });

        const activated = document.querySelector('script[type="text/javascript"]');
        expect(activated).toBeTruthy();
        expect(activated?.textContent).toBe('console.log("test");');
    });

    it('should not activate script when consent denied', () => {
        const script = document.createElement('script');
        script.type = 'text/plain';
        script.setAttribute('data-cookie-category', 'analytics');
        script.textContent = 'console.log("test");';
        document.body.appendChild(script);

        scriptActivationEffect.run({
            config,
            next: {
                timestamp: '',
                categories: {
                    analytics: { status: 'denied' as const, services: [], checksum: '' },
                },
            },
        });

        const textPlainScript = document.querySelector('script[type="text/plain"]');
        expect(textPlainScript).toBeTruthy();
    });

    it('should skip already activated scripts', () => {
        const script = document.createElement('script');
        script.type = 'text/plain';
        script.setAttribute('data-cookie-category', 'analytics');
        script.setAttribute('data-activated', '1');
        script.textContent = 'console.log("test");';
        document.body.appendChild(script);

        const replaceWithSpy = vi.spyOn(script, 'replaceWith');

        scriptActivationEffect.run({
            config,
            next: {
                timestamp: '',
                categories: {
                    analytics: { status: 'granted' as const, services: [], checksum: '' },
                },
            },
        });

        expect(replaceWithSpy).not.toHaveBeenCalled();
    });

    it('should preserve data-type attribute', () => {
        const script = document.createElement('script');
        script.type = 'text/plain';
        script.setAttribute('data-cookie-category', 'analytics');
        script.setAttribute('data-type', 'module');
        script.textContent = 'console.log("test");';
        document.body.appendChild(script);

        scriptActivationEffect.run({
            config,
            next: {
                timestamp: '',
                categories: {
                    analytics: { status: 'granted' as const, services: [], checksum: '' },
                },
            },
        });

        const activated = document.querySelector('script[type="module"]');
        expect(activated).toBeTruthy();
    });

    it('should handle data-src attribute', () => {
        const script = document.createElement('script');
        script.type = 'text/plain';
        script.setAttribute('data-cookie-category', 'analytics');
        script.setAttribute('data-src', 'https://example.com/script.js');
        document.body.appendChild(script);

        scriptActivationEffect.run({
            config,
            next: {
                timestamp: '',
                categories: {
                    analytics: { status: 'granted' as const, services: [], checksum: '' },
                },
            },
        });

        const activated = document.querySelector('script[src="https://example.com/script.js"]');
        expect(activated).toBeTruthy();
    });

    it('should preserve other attributes', () => {
        const script = document.createElement('script');
        script.type = 'text/plain';
        script.setAttribute('data-cookie-category', 'analytics');
        script.setAttribute('async', '');
        script.setAttribute('defer', '');
        script.textContent = 'console.log("test");';
        document.body.appendChild(script);

        scriptActivationEffect.run({
            config,
            next: {
                timestamp: '',
                categories: {
                    analytics: { status: 'granted' as const, services: [], checksum: '' },
                },
            },
        });

        const activated = document.querySelector('script[async][defer]');
        expect(activated).toBeTruthy();
    });

    it('should activate multiple scripts', () => {
        const script1 = document.createElement('script');
        script1.type = 'text/plain';
        script1.setAttribute('data-cookie-category', 'analytics');
        script1.textContent = 'console.log("test1");';
        document.body.appendChild(script1);

        const script2 = document.createElement('script');
        script2.type = 'text/plain';
        script2.setAttribute('data-cookie-category', 'analytics');
        script2.textContent = 'console.log("test2");';
        document.body.appendChild(script2);

        scriptActivationEffect.run({
            config,
            next: {
                timestamp: '',
                categories: {
                    analytics: { status: 'granted' as const, services: [], checksum: '' },
                },
            },
        });

        const activated = document.querySelectorAll('script[type="text/javascript"]');
        expect(activated.length).toBe(2);
    });

    it('should handle mixed granted/denied categories', () => {
        const analyticsScript = document.createElement('script');
        analyticsScript.type = 'text/plain';
        analyticsScript.setAttribute('data-cookie-category', 'analytics');
        analyticsScript.textContent = 'console.log("analytics");';
        document.body.appendChild(analyticsScript);

        const adsScript = document.createElement('script');
        adsScript.type = 'text/plain';
        adsScript.setAttribute('data-cookie-category', 'ads');
        adsScript.textContent = 'console.log("ads");';
        document.body.appendChild(adsScript);

        scriptActivationEffect.run({
            config,
            next: {
                timestamp: '',
                categories: {
                    analytics: { status: 'granted' as const, services: [], checksum: '' },
                    ads: { status: 'denied' as const, services: [], checksum: '' },
                },
            },
        });

        const activatedAnalytics = document.querySelector('script[type="text/javascript"]');
        const textPlainAds = document.querySelectorAll('script[type="text/plain"]');

        expect(activatedAnalytics).toBeTruthy();
        expect(textPlainAds.length).toBe(1); // Only ads script remains
    });

    it('should handle script with no data-cookie-category', () => {
        const script = document.createElement('script');
        script.type = 'text/plain';
        script.textContent = 'console.log("test");';
        document.body.appendChild(script);

        expect(() => {
            scriptActivationEffect.run({
                config,
                next: {
                    timestamp: '',
                    categories: {
                        analytics: { status: 'granted' as const, services: [], checksum: '' },
                    },
                },
            });
        }).not.toThrow();

        const textPlainScript = document.querySelector('script[type="text/plain"]');
        expect(textPlainScript).toBeTruthy();
    });

    it('should mark script as activated', () => {
        const script = document.createElement('script');
        script.type = 'text/plain';
        script.setAttribute('data-cookie-category', 'analytics');
        script.textContent = 'console.log("test");';
        document.body.appendChild(script);

        scriptActivationEffect.run({
            config,
            next: {
                timestamp: '',
                categories: {
                    analytics: { status: 'granted' as const, services: [], checksum: '' },
                },
            },
        });

        const activated = document.querySelector('script[type="text/javascript"]');
        expect(activated?.getAttribute('data-activated')).toBe('1');
    });

    it('should default to text/javascript type', () => {
        const script = document.createElement('script');
        script.type = 'text/plain';
        script.setAttribute('data-cookie-category', 'analytics');
        script.textContent = 'console.log("test");';
        document.body.appendChild(script);

        scriptActivationEffect.run({
            config,
            next: {
                timestamp: '',
                categories: {
                    analytics: { status: 'granted' as const, services: [], checksum: '' },
                },
            },
        });

        const activated = document.querySelector('script[type="text/javascript"]');
        expect(activated).toBeTruthy();
    });

    it('should handle empty script content', () => {
        const script = document.createElement('script');
        script.type = 'text/plain';
        script.setAttribute('data-cookie-category', 'analytics');
        document.body.appendChild(script);

        expect(() => {
            scriptActivationEffect.run({
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
});
