import { describe, it, expect } from 'vitest';
import {CookieWallConfig} from "../../../src";
import {normalizeConfig} from "../../../src/core/config/normalize";


describe('normalizeConfig', () => {
    const baseConfig: CookieWallConfig = {
        categories: [
            { key: 'essential', title: 'Essential', required: true },
            { key: 'analytics', title: 'Analytics' },
        ],
    };

    describe('storageKey', () => {
        it('should use provided storageKey', () => {
            const config = { ...baseConfig, storageKey: 'custom-key' };
            const normalized = normalizeConfig(config);
            expect(normalized.storageKey).toBe('custom-key');
        });

        it('should use default storageKey if not provided', () => {
            const normalized = normalizeConfig(baseConfig);
            expect(normalized.storageKey).toBe('cookie-wall-consent');
        });
    });

    describe('ui position', () => {
        it('should use provided position', () => {
            const config = {
                ...baseConfig,
                ui: { position: 'center' as const },
            };
            const normalized = normalizeConfig(config);
            expect(normalized.ui.position).toBe('center');
        });

        it('should default to bottom-left', () => {
            const normalized = normalizeConfig(baseConfig);
            expect(normalized.ui.position).toBe('bottom-left');
        });

        it('should accept bottom-right', () => {
            const config = {
                ...baseConfig,
                ui: { position: 'bottom-right' as const },
            };
            const normalized = normalizeConfig(config);
            expect(normalized.ui.position).toBe('bottom-right');
        });

        it('should accept center', () => {
            const config = {
                ...baseConfig,
                ui: { position: 'center' as const },
            };
            const normalized = normalizeConfig(config);
            expect(normalized.ui.position).toBe('center');
        });
    });

    describe('ui texts', () => {
        it('should merge custom texts with defaults', () => {
            const config = {
                ...baseConfig,
                ui: {
                    texts: {
                        title: 'Custom Title',
                    },
                },
            };
            const normalized = normalizeConfig(config);
            expect(normalized.ui.texts.title).toBe('Custom Title');
            expect(normalized.ui.texts.description).toBeDefined();
        });

        it('should include all default texts', () => {
            const normalized = normalizeConfig(baseConfig);
            const texts = normalized.ui.texts;

            expect(texts.title).toBeDefined();
            expect(texts.description).toBeDefined();
            expect(texts.acceptAllLabel).toBeDefined();
            expect(texts.rejectAllLabel).toBeDefined();
            expect(texts.customizeLabel).toBeDefined();
        });

        it('should override all text properties', () => {
            const config = {
                ...baseConfig,
                ui: {
                    texts: {
                        title: 'T1',
                        description: 'D1',
                        acceptAllLabel: 'A1',
                        rejectAllLabel: 'R1',
                        customizeLabel: 'C1',
                    },
                },
            };
            const normalized = normalizeConfig(config);
            const texts = normalized.ui.texts;

            expect(texts.title).toBe('T1');
            expect(texts.description).toBe('D1');
            expect(texts.acceptAllLabel).toBe('A1');
            expect(texts.rejectAllLabel).toBe('R1');
            expect(texts.customizeLabel).toBe('C1');
        });
    });

    describe('ui classes', () => {
        it('should merge custom classes with defaults', () => {
            const config = {
                ...baseConfig,
                ui: {
                    classes: {
                        container: 'custom-class',
                    },
                },
            };
            const normalized = normalizeConfig(config);
            expect(normalized.ui.classes.container).toBe('custom-class');
            expect(normalized.ui.classes.title).toBeDefined();
        });

        it('should include all default classes', () => {
            const normalized = normalizeConfig(baseConfig);
            const classes = normalized.ui.classes;

            expect(classes.backdrop).toBeDefined();
            expect(classes.container).toBeDefined();
            expect(classes.title).toBeDefined();
            expect(classes.description).toBeDefined();
            expect(classes.buttonPrimary).toBeDefined();
            expect(classes.buttonSecondary).toBeDefined();
            expect(classes.buttonGhost).toBeDefined();
            expect(classes.categoryCard).toBeDefined();
            expect(classes.toggleTrackOn).toBeDefined();
            expect(classes.toggleTrackOff).toBeDefined();
            expect(classes.toggleKnob).toBeDefined();
            expect(classes.advancedContainer).toBeDefined();
        });

        it('should override class properties', () => {
            const config = {
                ...baseConfig,
                ui: {
                    classes: {
                        buttonPrimary: 'custom-button',
                        container: 'custom-container',
                    },
                },
            };
            const normalized = normalizeConfig(config);

            expect(normalized.ui.classes.buttonPrimary).toBe('custom-button');
            expect(normalized.ui.classes.container).toBe('custom-container');
            expect(normalized.ui.classes.title).toBeDefined();
        });
    });

    describe('preserved properties', () => {
        it('should preserve categories', () => {
            const normalized = normalizeConfig(baseConfig);
            expect(normalized.categories).toEqual(baseConfig.categories);
        });

        it('should preserve vendors config', () => {
            const config = {
                ...baseConfig,
                vendors: { googleConsentMode: { enabled: true } },
            };
            const normalized = normalizeConfig(config);
            expect(normalized.vendors).toEqual(config.vendors);
        });

        it('should preserve cookieCleanup config', () => {
            const config = {
                ...baseConfig,
                cookieCleanup: { analytics: ['_ga', '_gid'] },
            };
            const normalized = normalizeConfig(config);
            expect(normalized.cookieCleanup).toEqual(config.cookieCleanup);
        });
    });

    describe('validation', () => {
        it('should throw on empty categories', () => {
            const config: CookieWallConfig = {
                categories: [],
            };
            expect(() => normalizeConfig(config)).toThrow();
        });

        it('should throw on missing category key', () => {
            const config: CookieWallConfig = {
                categories: [
                    { key: '', title: 'Test' },
                ],
            };
            expect(() => normalizeConfig(config)).toThrow();
        });

        it('should throw on missing category title', () => {
            const config: CookieWallConfig = {
                categories: [
                    { key: 'test', title: '' },
                ],
            };
            expect(() => normalizeConfig(config)).toThrow();
        });

        it('should throw on duplicate category keys', () => {
            const config: CookieWallConfig = {
                categories: [
                    { key: 'analytics', title: 'Analytics' },
                    { key: 'analytics', title: 'Analytics 2' },
                ],
            };
            expect(() => normalizeConfig(config)).toThrow();
        });
    });

    describe('type safety', () => {
        it('should have Required ui type', () => {
            const normalized = normalizeConfig(baseConfig);
            expect(normalized.ui).toBeDefined();
            expect(normalized.ui.position).toBeDefined();
            expect(normalized.ui.texts).toBeDefined();
            expect(normalized.ui.classes).toBeDefined();
        });

        it('should have Required storageKey', () => {
            const normalized = normalizeConfig(baseConfig);
            expect(typeof normalized.storageKey).toBe('string');
            expect(normalized.storageKey.length).toBeGreaterThan(0);
        });
    });

    describe('ui config merging', () => {
        it('should work with minimal ui config', () => {
            const config = {
                ...baseConfig,
                ui: {},
            };
            const normalized = normalizeConfig(config);

            expect(normalized.ui.position).toBe('bottom-left');
            expect(normalized.ui.texts.title).toBeDefined();
            expect(normalized.ui.classes.container).toBeDefined();
        });

        it('should work with no ui config', () => {
            const normalized = normalizeConfig(baseConfig);

            expect(normalized.ui.position).toBe('bottom-left');
            expect(normalized.ui.texts.title).toBeDefined();
            expect(normalized.ui.classes.container).toBeDefined();
        });

        it('should merge texts partially', () => {
            const config = {
                ...baseConfig,
                ui: {
                    texts: {
                        title: 'Custom',
                    },
                },
            };
            const normalized = normalizeConfig(config);

            expect(normalized.ui.texts.title).toBe('Custom');
            expect(normalized.ui.texts.description).toBeDefined();
            expect(normalized.ui.texts.acceptAllLabel).toBeDefined();
        });

        it('should merge classes partially', () => {
            const config = {
                ...baseConfig,
                ui: {
                    classes: {
                        container: 'my-container',
                    },
                },
            };
            const normalized = normalizeConfig(config);

            expect(normalized.ui.classes.container).toBe('my-container');
            expect(normalized.ui.classes.title).toBeDefined();
            expect(normalized.ui.classes.buttonPrimary).toBeDefined();
        });
    });
});
