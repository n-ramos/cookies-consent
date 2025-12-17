import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        environment: 'happy-dom',
        include: ['tests/**/*.test.ts'],
        css: true,
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html', 'json'],
            include: ['src/**/*.ts'],
            exclude: [
                'node_modules/',
                'dist/',
                'src/**/*.d.ts',
                'src/main.ts',
                'src/index.ts',
            ],
        },
    },
});
