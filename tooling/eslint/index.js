// Shared flat config for the Slurp monorepo.
import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/storybook-static/**',
      '**/src/generated/**',
      '**/.turbo/**',
      '.ds-source/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.strict,
  reactHooks.configs.flat['recommended-latest'],
  {
    languageOptions: {
      globals: { ...globals.browser },
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
      // `import { type A } from 'x'` keeps a side-effect `import 'x'` under verbatimModuleSyntax.
      '@typescript-eslint/no-import-type-side-effects': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  {
    files: ['**/scripts/**', '**/*.config.{js,ts}', 'tooling/**', '**/.storybook/**'],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
];
