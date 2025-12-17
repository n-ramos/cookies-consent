import { describe, it, expect } from 'vitest';
import { renderCookieWall } from '../../src/ui/template';
import { normalizeConfig } from '../../src/core/config/normalize';
import {CookieWallConfig} from "../../src";

describe('renderCookieWall', () => {
    const baseConfig: CookieWallConfig = {
        categories: [
            { key: 'essential', title: 'Essential', required: true },
            { key: 'analytics', title: 'Analytics' },
        ],
    };

    it('should render container', () => {
        const config = normalizeConfig(baseConfig);
        const state = { categories: {} };

        const html = renderCookieWall(config, state);

        expect(html).toContain('data-cw-action');
    });

    it('should render title', () => {
        const config = normalizeConfig(baseConfig);
        const state = { categories: {} };

        const html = renderCookieWall(config, state);

        expect(html).toContain(config.ui.texts.title);
    });

    it('should render description', () => {
        const config = normalizeConfig(baseConfig);
        const state = { categories: {} };

        const html = renderCookieWall(config, state);

        expect(html).toContain(config.ui.texts.description);
    });

    it('should render accept button', () => {
        const config = normalizeConfig(baseConfig);
        const state = { categories: {} };

        const html = renderCookieWall(config, state);

        expect(html).toContain('data-cw-action="accept"');
        expect(html).toContain(config.ui.texts.acceptAllLabel);
    });

    it('should render reject button', () => {
        const config = normalizeConfig(baseConfig);
        const state = { categories: {} };

        const html = renderCookieWall(config, state);

        expect(html).toContain('data-cw-action="reject"');
        expect(html).toContain(config.ui.texts.rejectAllLabel);
    });

    it('should render customize button', () => {
        const config = normalizeConfig(baseConfig);
        const state = { categories: {} };

        const html = renderCookieWall(config, state);

        expect(html).toContain('data-cw-action="toggle-advanced"');
        expect(html).toContain(config.ui.texts.customizeLabel);
    });

    it('should render category cards', () => {
        const config = normalizeConfig(baseConfig);
        const state = { categories: {} };

        const html = renderCookieWall(config, state);

        expect(html).toContain('Essential');
        expect(html).toContain('Analytics');
    });

    it('should render toggles for non-required categories', () => {
        const config = normalizeConfig(baseConfig);
        const state = { categories: {} };

        const html = renderCookieWall(config, state);

        expect(html).toContain('data-cw-toggle="analytics"');
        expect(html).not.toContain('data-cw-toggle="essential"');
    });

    it('should render required badge for required categories', () => {
        const config = normalizeConfig(baseConfig);
        const state = { categories: {} };

        const html = renderCookieWall(config, state);

        expect(html).toContain('Obligatoire');
    });

    it('should show active state for granted status', () => {
        const config = normalizeConfig(baseConfig);
        const state = {
            categories: {
                analytics: { status: 'granted' as const, services: [], checksum: '' },
            },
        };

        const html = renderCookieWall(config, state);

        expect(html).toContain('aria-pressed="true"');
    });

    it('should show inactive state for denied status', () => {
        const config = normalizeConfig(baseConfig);
        const state = {
            categories: {
                analytics: { status: 'denied' as const, services: [], checksum: '' },
            },
        };

        const html = renderCookieWall(config, state);

        expect(html).toContain('aria-pressed="false"');
    });

    it('should apply custom classes', () => {
        const customConfig = normalizeConfig({
            ...baseConfig,
            ui: {
                classes: {
                    container: 'custom-container',
                    title: 'custom-title',
                    buttonPrimary: 'custom-button',
                },
            },
        });
        const state = { categories: {} };

        const html = renderCookieWall(customConfig, state);

        expect(html).toContain('custom-container');
        expect(html).toContain('custom-title');
        expect(html).toContain('custom-button');
    });

    it('should apply custom texts', () => {
        const customConfig = normalizeConfig({
            ...baseConfig,
            ui: {
                texts: {
                    title: 'Custom Title',
                    description: 'Custom Description',
                    acceptAllLabel: 'Custom Accept',
                    rejectAllLabel: 'Custom Reject',
                    customizeLabel: 'Custom Customize',
                },
            },
        });
        const state = { categories: {} };

        const html = renderCookieWall(customConfig, state);

        expect(html).toContain('Custom Title');
        expect(html).toContain('Custom Description');
        expect(html).toContain('Custom Accept');
        expect(html).toContain('Custom Reject');
        expect(html).toContain('Custom Customize');
    });

    it('should escape HTML special characters in title', () => {
        const customConfig = normalizeConfig({
            ...baseConfig,
            ui: {
                texts: {
                    title: '<script>alert("xss")</script>',
                },
            },
        });
        const state = { categories: {} };

        const html = renderCookieWall(customConfig, state);

        expect(html).not.toContain('<script>');
        expect(html).toContain('&lt;');
    });

    it('should escape HTML special characters in description', () => {
        const customConfig = normalizeConfig({
            ...baseConfig,
            ui: {
                texts: {
                    description: '<img src=x onerror="alert(1)">',
                },
            },
        });
        const state = { categories: {} };

        const html = renderCookieWall(customConfig, state);

        expect(html).toContain('&quot;');
        expect(html).toContain('&lt;');
    });

    it('should escape category title', () => {
        const customConfig = normalizeConfig({
            categories: [
                { key: 'test', title: '"><script>alert(1)</script>' },
            ],
        });
        const state = { categories: {} };

        const html = renderCookieWall(customConfig, state);

        expect(html).not.toContain('<script>');
    });

    it('should escape category key in data attribute', () => {
        const customConfig = normalizeConfig({
            categories: [
                { key: 'test" onload="alert(1)' as any, title: 'Test' },
            ],
        });
        const state = { categories: {} };

        const html = renderCookieWall(customConfig, state);

        expect(html).toContain('data-cw-toggle="test&quot; onload=');
    });

    it('should render description for category if present', () => {
        const customConfig = normalizeConfig({
            categories: [
                { key: 'analytics', title: 'Analytics', description: 'Track usage' },
            ],
        });
        const state = { categories: {} };

        const html = renderCookieWall(customConfig, state);

        expect(html).toContain('Track usage');
    });

    it('should not render description for category if absent', () => {
        const customConfig = normalizeConfig({
            categories: [
                { key: 'analytics', title: 'Analytics' },
            ],
        });
        const state = { categories: {} };

        const html = renderCookieWall(customConfig, state);

        // Should not have empty description element
        const docEl = document.createElement('div');
        docEl.innerHTML = html;
        const descriptions = Array.from(docEl.querySelectorAll('[class*="text-xs"]'));
        expect(descriptions.length).toBe(0);
    });

    it('should show correct label for granted status', () => {
        const config = normalizeConfig(baseConfig);
        const state = {
            categories: {
                analytics: { status: 'granted' as const, services: [], checksum: '' },
            },
        };

        const html = renderCookieWall(config, state);

        expect(html).toContain('Activé');
    });

    it('should show correct label for denied status', () => {
        const config = normalizeConfig(baseConfig);
        const state = {
            categories: {
                analytics: { status: 'denied' as const, services: [], checksum: '' },
            },
        };

        const html = renderCookieWall(config, state);

        expect(html).toContain('Désactivé');
    });

    it('should render advanced container', () => {
        const config = normalizeConfig(baseConfig);
        const state = { categories: {} };

        const html = renderCookieWall(config, state);

        expect(html).toContain('data-cw-advanced');
        expect(html).toContain('hidden');
    });

    it('should render transition classes', () => {
        const config = normalizeConfig(baseConfig);
        const state = { categories: {} };

        const html = renderCookieWall(config, state);

        expect(html).toContain('transition-all');
        expect(html).toContain('duration-200');
    });

    it('should handle multiple categories with mixed states', () => {
        const customConfig = normalizeConfig({
            categories: [
                { key: 'essential', title: 'Essential', required: true },
                { key: 'analytics', title: 'Analytics' },
                { key: 'ads', title: 'Ads' },
            ],
        });
        const state = {
            categories: {
                essential: { status: 'granted' as const, services: [], checksum: '' },
                analytics: { status: 'granted' as const, services: [], checksum: '' },
                ads: { status: 'denied' as const, services: [], checksum: '' },
            },
        };

        const html = renderCookieWall(customConfig, state);

        expect(html).toContain('Essential');
        expect(html).toContain('Analytics');
        expect(html).toContain('Ads');
        expect(html).toContain('Obligatoire');
    });

    it('should apply toggle track classes based on status', () => {
        const customConfig = normalizeConfig({
            ...baseConfig,
            ui: {
                classes: {
                    toggleTrackOn: 'track-on',
                    toggleTrackOff: 'track-off',
                },
            },
        });
        const stateGranted = {
            categories: {
                analytics: { status: 'granted' as const, services: [], checksum: '' },
            },
        };
        const stateDenied = {
            categories: {
                analytics: { status: 'denied' as const, services: [], checksum: '' },
            },
        };

        const htmlGranted = renderCookieWall(customConfig, stateGranted);
        const htmlDenied = renderCookieWall(customConfig, stateDenied);

        expect(htmlGranted).toContain('track-on');
        expect(htmlDenied).toContain('track-off');
    });

    it('should apply toggle knob position classes', () => {
        const customConfig = normalizeConfig({
            ...baseConfig,
            ui: {
                classes: {
                    toggleKnob: 'knob',
                },
            },
        });
        const stateGranted = {
            categories: {
                analytics: { status: 'granted' as const, services: [], checksum: '' },
            },
        };
        const stateDenied = {
            categories: {
                analytics: { status: 'denied' as const, services: [], checksum: '' },
            },
        };

        const htmlGranted = renderCookieWall(customConfig, stateGranted);
        const htmlDenied = renderCookieWall(customConfig, stateDenied);

        expect(htmlGranted).toContain('translate-x-5');
        expect(htmlDenied).toContain('translate-x-1');
    });

    it('should render valid HTML', () => {
        const config = normalizeConfig(baseConfig);
        const state = { categories: {} };

        const html = renderCookieWall(config, state);

        expect(() => {
            const temp = document.createElement('div');
            temp.innerHTML = html;
        }).not.toThrow();
    });

    it('should have proper structure for accessibility', () => {
        const config = normalizeConfig(baseConfig);
        const state = { categories: {} };

        const html = renderCookieWall(config, state);

        expect(html).toContain('type="button"');
        expect(html).toContain('aria-pressed');
    });
});
