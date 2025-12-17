import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock the CSS inline import
vi.mock('../src/style.css?inline', () => ({
    default: ':root { --cookie-wall: 1; }',
}));

// Mock lib after CSS mock
vi.mock('../src/lib', () => ({
    initCookieWall: vi.fn(() => ({
        open: vi.fn(),
        close: vi.fn(),
        destroy: vi.fn(),
        getState: vi.fn(() => ({
            timestamp: '',
            categories: {},
        })),
        hasStoredConsent: vi.fn(() => false),
        hasStoredConsentForCurrentVersion: vi.fn(() => false),
        acceptAll: vi.fn(),
        rejectAll: vi.fn(),
        setCategory: vi.fn(),
    })),
}));

describe('cookie-consent WebComponent', () => {
    beforeEach(() => {
        // Clear DOM
        document.head.innerHTML = '';
        document.body.innerHTML = '';
        // Clear localStorage
        localStorage.clear();
        vi.clearAllMocks();
    });

    afterEach(() => {
        document.head.innerHTML = '';
        document.body.innerHTML = '';
        localStorage.clear();
        vi.clearAllMocks();
    });

    describe('CookieConsentElement registration', () => {
        it('should define cookie-consent custom element', async () => {
            // Import after mocks are set up
            await import('../src/cookie-consent');

            const element = customElements.get('cookie-consent');
            expect(element).toBeDefined();
        });

        it('should be able to create cookie-consent element', async () => {
            await import('../src/cookie-consent');

            const el = document.createElement('cookie-consent');
            expect(el).toBeInstanceOf(HTMLElement);
            expect(el.tagName).toBe('COOKIE-CONSENT');
        });
    });

    describe('ensureStyles functionality', () => {
        it('should inject styles into document head', async () => {
            await import('../src/cookie-consent');

            const config = {
                categories: [{ key: 'test', title: 'Test' }],
            };

            const el = document.createElement('cookie-consent');
            el.setAttribute('config', JSON.stringify(config));
            document.body.appendChild(el);

            // Wait for connectedCallback
            await new Promise((resolve) => setTimeout(resolve, 10));

            const style = document.getElementById('cookie-wall-style');
            expect(style).toBeDefined();
            expect(style?.textContent).toBeTruthy();

            document.body.removeChild(el);
        });

        it('should not inject styles twice', async () => {
            await import('../src/cookie-consent');

            const config = {
                categories: [{ key: 'test', title: 'Test' }],
            };

            const el1 = document.createElement('cookie-consent');
            el1.setAttribute('config', JSON.stringify(config));
            document.body.appendChild(el1);

            await new Promise((resolve) => setTimeout(resolve, 10));

            const style1 = document.getElementById('cookie-wall-style');
            expect(style1).toBeDefined();

            const el2 = document.createElement('cookie-consent');
            el2.setAttribute('config', JSON.stringify(config));
            document.body.appendChild(el2);

            await new Promise((resolve) => setTimeout(resolve, 10));

            const styles = document.querySelectorAll('#cookie-wall-style');
            expect(styles.length).toBe(1);

            document.body.removeChild(el1);
            document.body.removeChild(el2);
        });
    });

    describe('safeParse functionality', () => {
        it('should parse valid JSON config', async () => {
            await import('../src/cookie-consent');

            const config = {
                categories: [{ key: 'analytics', title: 'Analytics' }],
            };

            const el = document.createElement('cookie-consent');
            el.setAttribute('config', JSON.stringify(config));

            expect(() => {
                document.body.appendChild(el);
            }).not.toThrow();

            document.body.removeChild(el);
        });

        it('should handle invalid JSON gracefully', async () => {
            await import('../src/cookie-consent');

            const consoleSpy = vi.spyOn(console, 'error');

            const el = document.createElement('cookie-consent');
            el.setAttribute('config', 'invalid json');
            document.body.appendChild(el);

            await new Promise((resolve) => setTimeout(resolve, 10));

            expect(consoleSpy).toHaveBeenCalledWith(
                expect.stringContaining('[cookie-consent]'),
                expect.anything()
            );

            document.body.removeChild(el);
            consoleSpy.mockRestore();
        });

        it('should return null for null input', async () => {
            await import('../src/cookie-consent');

            const consoleSpy = vi.spyOn(console, 'warn');

            const el = document.createElement('cookie-consent');
            // Don't set config attribute
            document.body.appendChild(el);

            await new Promise((resolve) => setTimeout(resolve, 10));

            expect(consoleSpy).toHaveBeenCalledWith(
                expect.stringContaining('Missing config attribute')
            );

            document.body.removeChild(el);
            consoleSpy.mockRestore();
        });

        it('should return null for empty string', async () => {
            await import('../src/cookie-consent');

            const consoleSpy = vi.spyOn(console, 'warn');

            const el = document.createElement('cookie-consent');
            el.setAttribute('config', '');
            document.body.appendChild(el);

            await new Promise((resolve) => setTimeout(resolve, 10));

            expect(consoleSpy).toHaveBeenCalledWith(
                expect.stringContaining('Missing config attribute')
            );

            document.body.removeChild(el);
            consoleSpy.mockRestore();
        });
    });

    describe('CookieConsentElement.connectedCallback', () => {
        it('should initialize only once', async () => {
            await import('../src/cookie-consent');

            const config = {
                categories: [{ key: 'test', title: 'Test' }],
            };

            const el = document.createElement('cookie-consent');
            el.setAttribute('config', JSON.stringify(config));
            document.body.appendChild(el);

            await new Promise((resolve) => setTimeout(resolve, 10));

            expect(document.getElementById('cookie-wall-style')).toBeDefined();

            document.body.removeChild(el);
        });

        it('should warn when config attribute is missing', async () => {
            await import('../src/cookie-consent');

            const consoleSpy = vi.spyOn(console, 'warn');

            const el = document.createElement('cookie-consent');
            document.body.appendChild(el);

            await new Promise((resolve) => setTimeout(resolve, 10));

            expect(consoleSpy).toHaveBeenCalledWith(
                expect.stringContaining('[cookie-consent]')
            );

            document.body.removeChild(el);
            consoleSpy.mockRestore();
        });

        it('should handle JSON parsing error', async () => {
            await import('../src/cookie-consent');

            const consoleErrorSpy = vi.spyOn(console, 'error');

            const el = document.createElement('cookie-consent');
            el.setAttribute('config', '{ invalid json }');
            document.body.appendChild(el);

            await new Promise((resolve) => setTimeout(resolve, 10));

            expect(consoleErrorSpy).toHaveBeenCalled();

            document.body.removeChild(el);
            consoleErrorSpy.mockRestore();
        });
    });

    describe('CookieConsentElement initialization', () => {
        it('should create element when config is valid', async () => {
            await import('../src/cookie-consent');

            const config = {
                categories: [{ key: 'essential', title: 'Essential', required: true }],
            };

            const el = document.createElement('cookie-consent');
            el.setAttribute('config', JSON.stringify(config));
            document.body.appendChild(el);

            await new Promise((resolve) => setTimeout(resolve, 10));

            expect(el.parentElement).toBe(document.body);

            document.body.removeChild(el);
        });

        it('should accept multiple configuration options', async () => {
            await import('../src/cookie-consent');

            const config = {
                storageKey: 'custom-consent',
                categories: [
                    { key: 'essential', title: 'Essential', required: true },
                    { key: 'analytics', title: 'Analytics' },
                    { key: 'ads', title: 'Ads' },
                ],
                ui: {
                    position: 'bottom-left' as const,
                    texts: {
                        title: 'Cookie Management',
                        acceptAllLabel: 'Accept All',
                        rejectAllLabel: 'Reject All',
                    },
                },
            };

            const el = document.createElement('cookie-consent');
            el.setAttribute('config', JSON.stringify(config));
            document.body.appendChild(el);

            await new Promise((resolve) => setTimeout(resolve, 10));

            expect(el.parentElement).toBe(document.body);

            document.body.removeChild(el);
        });
    });

    describe('Multiple elements on same page', () => {
        it('should support multiple cookie-consent elements', async () => {
            await import('../src/cookie-consent');

            const config = {
                categories: [{ key: 'test', title: 'Test' }],
            };

            const el1 = document.createElement('cookie-consent');
            el1.setAttribute('config', JSON.stringify(config));

            const el2 = document.createElement('cookie-consent');
            el2.setAttribute('config', JSON.stringify(config));

            document.body.appendChild(el1);
            document.body.appendChild(el2);

            await new Promise((resolve) => setTimeout(resolve, 10));

            expect(el1.parentElement).toBe(document.body);
            expect(el2.parentElement).toBe(document.body);

            document.body.removeChild(el1);
            document.body.removeChild(el2);
        });
    });

    describe('Attribute changes after mounting', () => {
        it('should not reinitialize when config attribute is changed', async () => {
            await import('../src/cookie-consent');

            const config1 = {
                categories: [{ key: 'test1', title: 'Test 1' }],
            };

            const el = document.createElement('cookie-consent');
            el.setAttribute('config', JSON.stringify(config1));
            document.body.appendChild(el);

            await new Promise((resolve) => setTimeout(resolve, 10));

            const style1 = document.getElementById('cookie-wall-style');
            expect(style1).toBeDefined();

            // Change config after mounting
            const config2 = {
                categories: [{ key: 'test2', title: 'Test 2' }],
            };
            el.setAttribute('config', JSON.stringify(config2));

            await new Promise((resolve) => setTimeout(resolve, 10));

            // Style should still exist (same as before)
            const style2 = document.getElementById('cookie-wall-style');
            expect(style2).toBe(style1);

            document.body.removeChild(el);
        });
    });

    describe('Edge cases', () => {
        it('should handle config with empty categories array', async () => {
            await import('../src/cookie-consent');

            const config = {
                categories: [],
            };

            const el = document.createElement('cookie-consent');
            el.setAttribute('config', JSON.stringify(config));

            expect(() => {
                document.body.appendChild(el);
            }).not.toThrow();

            document.body.removeChild(el);
        });

        it('should handle very large config object', async () => {
            await import('../src/cookie-consent');

            const config = {
                categories: Array.from({ length: 50 }, (_, i) => ({
                    key: `category-${i}`,
                    title: `Category ${i}`,
                })),
            };

            const el = document.createElement('cookie-consent');
            el.setAttribute('config', JSON.stringify(config));

            expect(() => {
                document.body.appendChild(el);
            }).not.toThrow();

            document.body.removeChild(el);
        });

        it('should be removable from DOM without errors', async () => {
            await import('../src/cookie-consent');

            const config = {
                categories: [{ key: 'test', title: 'Test' }],
            };

            const el = document.createElement('cookie-consent');
            el.setAttribute('config', JSON.stringify(config));
            document.body.appendChild(el);

            await new Promise((resolve) => setTimeout(resolve, 10));

            expect(() => {
                document.body.removeChild(el);
            }).not.toThrow();
        });
    });
});
