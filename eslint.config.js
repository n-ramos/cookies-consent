// eslint.config.js
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: [
      'dist/**',
      'dist-lib/**',
      'dist-cdn/**',
      'node_modules/**',

      // ✅ ignore configs (pas de typed-lint dessus)
      'prettier.config.cjs',
      'eslint.config.js',
      'vite.*.ts',
      '*.config.*',
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
];
