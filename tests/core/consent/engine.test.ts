import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {CookieWallConfig} from "../../../src";
import {ConsentStore} from "../../../src/core/consent/store";
import {ConsentEngine} from "../../../src/core/consent/engine";
import {ConsentEffect} from "../../../src/core/consent/effects/types";


describe('ConsentEngine', () => {
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
        it('should create engine with config and store', () => {
            const store = new ConsentStore(config);
            const engine = new ConsentEngine(config, store);

            expect(engine).toBeDefined();
        });

        it('should have use method for chaining', () => {
            const store = new ConsentStore(config);
            const engine = new ConsentEngine(config, store);

            const mockEffect: ConsentEffect = {
                key: 'test',
                run: vi.fn(),
            };

            const result = engine.use(mockEffect);
            expect(result).toBe(engine); // chainable
        });
    });

    describe('start and stop', () => {
        it('should run effect on start', () => {
            const store = new ConsentStore(config);
            const engine = new ConsentEngine(config, store);

            const mockEffect: ConsentEffect = {
                key: 'test',
                run: vi.fn(),
            };

            engine.use(mockEffect);
            engine.start();

            expect(mockEffect.run).toHaveBeenCalled();
        });

        it('should run effect on state change', () => {
            const store = new ConsentStore(config);
            const engine = new ConsentEngine(config, store);

            const mockEffect: ConsentEffect = {
                key: 'test',
                run: vi.fn(),
            };

            engine.use(mockEffect);
            engine.start();

            const callCountAfterStart = (mockEffect.run as any).mock.calls.length;

            store.setCategory('analytics', 'granted');

            expect((mockEffect.run as any).mock.calls.length).toBeGreaterThan(callCountAfterStart);
        });

        it('should not run effect after stop', () => {
            const store = new ConsentStore(config);
            const engine = new ConsentEngine(config, store);

            const mockEffect: ConsentEffect = {
                key: 'test',
                run: vi.fn(),
            };

            engine.use(mockEffect);
            engine.start();
            engine.stop();

            const callCount = (mockEffect.run as any).mock.calls.length;

            store.setCategory('analytics', 'granted');

            expect((mockEffect.run as any).mock.calls.length).toBe(callCount);
        });

        it('should call destroy on effects when stopping', () => {
            const store = new ConsentStore(config);
            const engine = new ConsentEngine(config, store);

            const mockEffect: ConsentEffect = {
                key: 'test',
                run: vi.fn(),
                destroy: vi.fn(),
            };

            engine.use(mockEffect);
            engine.start();
            engine.stop();

            expect(mockEffect.destroy).toHaveBeenCalled();
        });
    });

    describe('effects execution', () => {
        it('should pass prev and next state on change', () => {
            const store = new ConsentStore(config);
            const engine = new ConsentEngine(config, store);

            const mockEffect: ConsentEffect = {
                key: 'test',
                run: vi.fn(),
            };

            engine.use(mockEffect);
            engine.start();

            (mockEffect.run as any).mockClear();

            store.setCategory('analytics', 'granted');

            const ctx = (mockEffect.run as any).mock.calls[0]![0];
            expect(ctx.prev).toBeDefined();
            expect(ctx.next).toBeDefined();
            expect(ctx.config).toEqual(config);
        });

        it('should not pass prev on initial run', () => {
            const store = new ConsentStore(config);
            const engine = new ConsentEngine(config, store);

            const mockEffect: ConsentEffect = {
                key: 'test',
                run: vi.fn(),
            };

            engine.use(mockEffect);
            engine.start();

            const ctx = (mockEffect.run as any).mock.calls[0]![0];
            expect(ctx.next).toBeDefined();
            expect(ctx.prev).toBeUndefined();
        });

        it('should handle effect errors gracefully', () => {
            const store = new ConsentStore(config);
            const engine = new ConsentEngine(config, store);

            const errorEffect: ConsentEffect = {
                key: 'error',
                run: () => {
                    throw new Error('Test error');
                },
            };

            const normalEffect: ConsentEffect = {
                key: 'normal',
                run: vi.fn(),
            };

            engine.use(errorEffect);
            engine.use(normalEffect);

            expect(() => {
                engine.start();
            }).not.toThrow();

            expect(normalEffect.run).toHaveBeenCalled();
        });

        it('should run multiple effects', () => {
            const store = new ConsentStore(config);
            const engine = new ConsentEngine(config, store);

            const effect1: ConsentEffect = {
                key: 'effect1',
                run: vi.fn(),
            };

            const effect2: ConsentEffect = {
                key: 'effect2',
                run: vi.fn(),
            };

            engine.use(effect1).use(effect2);
            engine.start();

            expect(effect1.run).toHaveBeenCalled();
            expect(effect2.run).toHaveBeenCalled();
        });
    });

    describe('effect context', () => {
        it('should provide correct config in context', () => {
            const store = new ConsentStore(config);
            const engine = new ConsentEngine(config, store);

            const mockEffect: ConsentEffect = {
                key: 'test',
                run: vi.fn(),
            };

            engine.use(mockEffect);
            engine.start();

            const ctx = (mockEffect.run as any).mock.calls[0]![0];
            expect(ctx.config).toEqual(config);
        });

        it('should provide state changes in context', () => {
            const store = new ConsentStore(config);
            const engine = new ConsentEngine(config, store);

            const mockEffect: ConsentEffect = {
                key: 'test',
                run: vi.fn(),
            };

            engine.use(mockEffect);
            engine.start();

            const initialState = (mockEffect.run as any).mock.calls[0]![0].next;
            expect(initialState.categories.essential!.status).toBe('granted');
            expect(initialState.categories.analytics!.status).toBe('denied');
        });
    });

    describe('chaining', () => {
        it('should allow multiple use() calls', () => {
            const store = new ConsentStore(config);
            const engine = new ConsentEngine(config, store);

            const effect1: ConsentEffect = { key: '1', run: vi.fn() };
            const effect2: ConsentEffect = { key: '2', run: vi.fn() };
            const effect3: ConsentEffect = { key: '3', run: vi.fn() };

            engine.use(effect1).use(effect2).use(effect3);
            engine.start();

            expect(effect1.run).toHaveBeenCalled();
            expect(effect2.run).toHaveBeenCalled();
            expect(effect3.run).toHaveBeenCalled();
        });
    });
});
