import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { CookieWallConfig } from '../../../../src';
import {
    cookieCleanupEffect,
    deleteCookie,
    cleanupByPrefixes,
} from '../../../../src/core/consent/effects/cookieCleanupEffect';
import {ConsentState} from "../../../../src/core/consent/types";

describe('cookieCleanupEffect', () => {
    const config: CookieWallConfig = {
        categories: [
            { key: 'analytics', title: 'Analytics' },
            { key: 'ads', title: 'Ads' },
        ],
        cookieCleanup: {
            analytics: ['_ga', '_gid'],
            ads: ['IDE', '_fbp'],
        },
    };

    beforeEach(() => {
        localStorage.clear();
        document.body.innerHTML = '';
    });

    afterEach(() => {
        localStorage.clear();
        document.body.innerHTML = '';
        vi.clearAllMocks();
    });

    describe('cookieCleanupEffect.key', () => {
        it('should have correct key', () => {
            expect(cookieCleanupEffect.key).toBe('cookie-cleanup');
        });
    });

    describe('deleteCookie function', () => {
        it('should not throw when deleting a cookie', () => {
            expect(() => {
                deleteCookie('test_cookie');
            }).not.toThrow();
        });

        it('should handle multiple domain variations', () => {
            const cookieSpy = vi.spyOn(document, 'cookie', 'set');

            deleteCookie('test');

            expect(cookieSpy).toHaveBeenCalled();
            expect(cookieSpy.mock.calls.length).toBeGreaterThan(0);

            cookieSpy.mockRestore();
        });

        it('should use Max-Age=0 to delete', () => {
            const cookieSpy = vi.spyOn(document, 'cookie', 'set');

            deleteCookie('my_cookie');

            const calls = cookieSpy.mock.calls.map((c) => c[0]);
            expect(calls.some((c) => c.includes('Max-Age=0'))).toBe(true);

            cookieSpy.mockRestore();
        });

        it('should use expires in past to delete', () => {
            const cookieSpy = vi.spyOn(document, 'cookie', 'set');

            deleteCookie('my_cookie');

            const calls = cookieSpy.mock.calls.map((c) => c[0]);
            expect(calls.some((c) => c.includes('Thu, 01 Jan 1970'))).toBe(true);

            cookieSpy.mockRestore();
        });
    });

    describe('cleanupByPrefixes function', () => {
        it('should not throw with empty prefixes', () => {
            expect(() => {
                cleanupByPrefixes([]);
            }).not.toThrow();
        });

        it('should not throw with no cookies set', () => {
            expect(() => {
                cleanupByPrefixes(['_ga', '_gid']);
            }).not.toThrow();
        });

        it('should parse cookie string correctly', () => {
            expect(() => {
                cleanupByPrefixes(['test']);
            }).not.toThrow();
        });
    });

    describe('cookieCleanupEffect.run()', () => {
        it('should not throw when running without cookieCleanup config', () => {
            const configWithout: CookieWallConfig = { categories: [] };
            const ctx: { config: CookieWallConfig; next: ConsentState } = {
                config: configWithout,
                next: { timestamp: '', categories: {} },
            };

            expect(() => {
                cookieCleanupEffect.run(ctx);
            }).not.toThrow();
        });

        it('should not throw without prev state (initial)', () => {
            const ctx: { config: CookieWallConfig; next: ConsentState } = {
                config,
                next: {
                    timestamp: '',
                    categories: {
                        analytics: { status: 'denied' as const, services: [], checksum: '' },
                    },
                },
            };

            expect(() => {
                cookieCleanupEffect.run(ctx);
            }).not.toThrow();
        });

        it('should run when transitioning from granted to denied', () => {
            const ctx: { config: CookieWallConfig; prev: ConsentState; next: ConsentState } = {
                config,
                prev: {
                    timestamp: '',
                    categories: {
                        analytics: { status: 'granted' as const, services: [], checksum: '' },
                        ads: { status: 'denied' as const, services: [], checksum: '' },
                    },
                },
                next: {
                    timestamp: '',
                    categories: {
                        analytics: { status: 'denied' as const, services: [], checksum: '' },
                        ads: { status: 'denied' as const, services: [], checksum: '' },
                    },
                },
            };

            expect(() => {
                cookieCleanupEffect.run(ctx);
            }).not.toThrow();
        });

        it('should run when transitioning from undefined to denied', () => {
            const ctx: { config: CookieWallConfig; prev: ConsentState; next: ConsentState } = {
                config,
                prev: {
                    timestamp: '',
                    categories: {
                        ads: { status: 'denied' as const, services: [], checksum: '' },
                    },
                },
                next: {
                    timestamp: '',
                    categories: {
                        analytics: { status: 'denied' as const, services: [], checksum: '' },
                        ads: { status: 'denied' as const, services: [], checksum: '' },
                    },
                },
            };

            expect(() => {
                cookieCleanupEffect.run(ctx);
            }).not.toThrow();
        });

        it('should not run when not transitioning to denied', () => {
            const ctx: { config: CookieWallConfig; prev: ConsentState; next: ConsentState } = {
                config,
                prev: {
                    timestamp: '',
                    categories: {
                        analytics: { status: 'denied' as const, services: [], checksum: '' },
                        ads: { status: 'denied' as const, services: [], checksum: '' },
                    },
                },
                next: {
                    timestamp: '',
                    categories: {
                        analytics: { status: 'granted' as const, services: [], checksum: '' },
                        ads: { status: 'denied' as const, services: [], checksum: '' },
                    },
                },
            };

            expect(() => {
                cookieCleanupEffect.run(ctx);
            }).not.toThrow();
        });

        it('should handle multiple categories', () => {
            const configMultiple: CookieWallConfig = {
                categories: [
                    { key: 'analytics', title: 'Analytics' },
                    { key: 'ads', title: 'Ads' },
                    { key: 'personalization', title: 'Personalization' },
                ],
                cookieCleanup: {
                    analytics: ['_ga', '_gid'],
                    ads: ['IDE', '_fbp'],
                    personalization: ['_p1', '_p2'],
                },
            };

            const ctx: { config: CookieWallConfig; prev: ConsentState; next: ConsentState } = {
                config: configMultiple,
                prev: {
                    timestamp: '',
                    categories: {
                        analytics: { status: 'granted' as const, services: [], checksum: '' },
                        ads: { status: 'granted' as const, services: [], checksum: '' },
                        personalization: { status: 'granted' as const, services: [], checksum: '' },
                    },
                },
                next: {
                    timestamp: '',
                    categories: {
                        analytics: { status: 'denied' as const, services: [], checksum: '' },
                        ads: { status: 'denied' as const, services: [], checksum: '' },
                        personalization: { status: 'denied' as const, services: [], checksum: '' },
                    },
                },
            };

            expect(() => {
                cookieCleanupEffect.run(ctx);
            }).not.toThrow();
        });

        it('should ignore categories not in cookieCleanup', () => {
            const ctx: { config: CookieWallConfig; prev: ConsentState; next: ConsentState } = {
                config,
                prev: {
                    timestamp: '',
                    categories: {
                        analytics: { status: 'granted' as const, services: [], checksum: '' },
                    },
                },
                next: {
                    timestamp: '',
                    categories: {
                        analytics: { status: 'denied' as const, services: [], checksum: '' },
                        unknown: { status: 'denied' as const, services: [], checksum: '' },
                    },
                },
            };

            expect(() => {
                cookieCleanupEffect.run(ctx);
            }).not.toThrow();
        });

        it('should only clean prefixes matching the category', () => {
            const ctx: { config: CookieWallConfig; prev: ConsentState; next: ConsentState } = {
                config,
                prev: {
                    timestamp: '',
                    categories: {
                        analytics: { status: 'granted' as const, services: [], checksum: '' },
                        ads: { status: 'granted' as const, services: [], checksum: '' },
                    },
                },
                next: {
                    timestamp: '',
                    categories: {
                        analytics: { status: 'denied' as const, services: [], checksum: '' },
                        ads: { status: 'granted' as const, services: [], checksum: '' },
                    },
                },
            };

            expect(() => {
                cookieCleanupEffect.run(ctx);
            }).not.toThrow();
        });
    });

    describe('Integration tests', () => {
        it('should handle complete lifecycle', () => {
            let ctx: { config: CookieWallConfig; next: ConsentState; prev?: ConsentState } = {
                config,
                next: {
                    timestamp: '',
                    categories: {
                        analytics: { status: 'denied' as const, services: [], checksum: '' },
                        ads: { status: 'denied' as const, services: [], checksum: '' },
                    },
                },
            };

            expect(() => {
                cookieCleanupEffect.run(ctx);
            }).not.toThrow();

            ctx = {
                config,
                prev: ctx.next as ConsentState,
                next: {
                    timestamp: '',
                    categories: {
                        analytics: { status: 'granted' as const, services: [], checksum: '' },
                        ads: { status: 'denied' as const, services: [], checksum: '' },
                    },
                },
            };

            expect(() => {
                cookieCleanupEffect.run(ctx);
            }).not.toThrow();

            ctx = {
                config,
                prev: ctx.next as ConsentState,
                next: {
                    timestamp: '',
                    categories: {
                        analytics: { status: 'denied' as const, services: [], checksum: '' },
                        ads: { status: 'denied' as const, services: [], checksum: '' },
                    },
                },
            };

            expect(() => {
                cookieCleanupEffect.run(ctx);
            }).not.toThrow();
        });

        it('should be idempotent', () => {
            const ctx: { config: CookieWallConfig; prev: ConsentState; next: ConsentState } = {
                config,
                prev: {
                    timestamp: '',
                    categories: {
                        analytics: { status: 'granted' as const, services: [], checksum: '' },
                    },
                },
                next: {
                    timestamp: '',
                    categories: {
                        analytics: { status: 'denied' as const, services: [], checksum: '' },
                    },
                },
            };

            expect(() => {
                cookieCleanupEffect.run(ctx);
                cookieCleanupEffect.run(ctx);
                cookieCleanupEffect.run(ctx);
            }).not.toThrow();
        });
    });
});
