import { describe, it, expect } from 'vitest';
import {validateConfig} from "../../../src/core/config/validate";
import {CookieWallConfig} from "../../../src";

describe('validateConfig', () => {
    describe('config null/undefined', () => {
        it('should throw if config is null', () => {
            expect(() => {
                validateConfig(null as any);
            }).toThrow();
        });

        it('should throw if config is undefined', () => {
            expect(() => {
                validateConfig(undefined as any);
            }).toThrow();
        });

        it('should throw if config is not an object', () => {
            expect(() => {
                validateConfig('not-an-object' as any);
            }).toThrow();
        });
    });

    describe('version validation', () => {
        it('should accept valid version', () => {
            const config: CookieWallConfig = {
                categories: [{ key: 'test', title: 'Test' }],
            };
            expect(() => {
                validateConfig(config);
            }).not.toThrow();
        });

        it('should accept config without version', () => {
            const config = { categories: [{ key: 'test', title: 'Test' }] };
            expect(() => {
                validateConfig(config as any);
            }).not.toThrow();
        });
    });

    describe('categories validation', () => {
        it('should throw if categories is missing', () => {
            const config = { version: '1.0.0' };
            expect(() => {
                validateConfig(config as any);
            }).toThrow();
        });

        it('should throw if categories is not an array', () => {
            const config = {
                categories: 'not-an-array',
            };
            expect(() => {
                validateConfig(config as any);
            }).toThrow();
        });

        it('should throw if categories is empty array', () => {
            const config = {
                categories: [],
            };
            expect(() => {
                validateConfig(config as any);
            }).toThrow();
        });

        it('should accept valid categories', () => {
            const config: CookieWallConfig = {
                categories: [
                    { key: 'essential', title: 'Essential' },
                    { key: 'analytics', title: 'Analytics' },
                ],
            };
            expect(() => {
                validateConfig(config);
            }).not.toThrow();
        });
    });

    describe('category key validation', () => {
        it('should throw if category key is missing', () => {
            const config = {
                categories: [{ title: 'Test' }],
            };
            expect(() => {
                validateConfig(config as any);
            }).toThrow();
        });

        it('should throw if category key is empty string', () => {
            const config = {
                categories: [{ key: '', title: 'Test' }],
            };
            expect(() => {
                validateConfig(config as any);
            }).toThrow();
        });

        it('should accept valid key', () => {
            const config: CookieWallConfig = {
                categories: [{ key: 'analytics', title: 'Analytics' }],
            };
            expect(() => {
                validateConfig(config);
            }).not.toThrow();
        });
    });

    describe('category key uniqueness', () => {
        it('should throw if duplicate category keys', () => {
            const config = {
                categories: [
                    { key: 'analytics', title: 'Analytics' },
                    { key: 'analytics', title: 'Analytics 2' },
                ],
            };
            expect(() => {
                validateConfig(config as any);
            }).toThrow();
        });

        it('should accept unique keys', () => {
            const config: CookieWallConfig = {
                categories: [
                    { key: 'analytics', title: 'Analytics' },
                    { key: 'ads', title: 'Ads' },
                    { key: 'essential', title: 'Essential' },
                ],
            };
            expect(() => {
                validateConfig(config);
            }).not.toThrow();
        });
    });

    describe('category title validation', () => {
        it('should throw if category title is missing', () => {
            const config = {
                categories: [{ key: 'analytics' }],
            };
            expect(() => {
                validateConfig(config as any);
            }).toThrow();
        });

        it('should throw if category title is empty string', () => {
            const config = {
                categories: [{ key: 'analytics', title: '' }],
            };
            expect(() => {
                validateConfig(config as any);
            }).toThrow();
        });

        it('should accept valid title', () => {
            const config: CookieWallConfig = {
                categories: [{ key: 'analytics', title: 'Analytics Services' }],
            };
            expect(() => {
                validateConfig(config);
            }).not.toThrow();
        });
    });

    describe('googleConsentMode validation', () => {
        it('should accept string googleConsentMode', () => {
            const config: CookieWallConfig = {
                categories: [
                    { key: 'analytics', title: 'Analytics', googleConsentMode: 'analytics_storage' },
                ],
            };
            expect(() => {
                validateConfig(config);
            }).not.toThrow();
        });

        it('should accept array of strings googleConsentMode', () => {
            const config: CookieWallConfig = {
                categories: [
                    {
                        key: 'ads',
                        title: 'Ads',
                        googleConsentMode: ['ad_storage', 'ad_user_data', 'ad_personalization'],
                    },
                ],
            };
            expect(() => {
                validateConfig(config);
            }).not.toThrow();
        });

        it('should throw if googleConsentMode is not string or array', () => {
            const config = {
                categories: [{ key: 'analytics', title: 'Analytics', googleConsentMode: 123 }],
            };
            expect(() => {
                validateConfig(config as any);
            }).toThrow();
        });

        it('should accept missing googleConsentMode', () => {
            const config: CookieWallConfig = {
                categories: [{ key: 'analytics', title: 'Analytics' }],
            };
            expect(() => {
                validateConfig(config);
            }).not.toThrow();
        });
    });

    describe('complex valid configs', () => {
        it('should accept full valid config', () => {
            const config: CookieWallConfig = {
                storageKey: 'my-consent',
                categories: [
                    { key: 'essential', title: 'Essential', required: true },
                    { key: 'analytics', title: 'Analytics', googleConsentMode: 'analytics_storage' },
                    {
                        key: 'ads',
                        title: 'Advertisements',
                        googleConsentMode: ['ad_storage', 'ad_user_data'],
                    },
                ],
                vendors: { googleConsentMode: { enabled: true } },
                cookieCleanup: {
                    analytics: ['_ga', '_gid'],
                    ads: ['IDE', '_fbp'],
                },
            };
            expect(() => {
                validateConfig(config);
            }).not.toThrow();
        });

        it('should accept config with descriptions', () => {
            const config: CookieWallConfig = {
                categories: [
                    { key: 'essential', title: 'Essential', description: 'Required cookies' },
                    {
                        key: 'analytics',
                        title: 'Analytics',
                        description: 'Helps us understand how you use the site',
                    },
                ],
            };
            expect(() => {
                validateConfig(config);
            }).not.toThrow();
        });
    });
});
