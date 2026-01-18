// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import { defineConfig, globalIgnores } from 'eslint/config';
import storybook from 'eslint-plugin-storybook';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'commitlint.config.ts',
    'storybook-static/**',
    'coverage/**',
    'playwright-report/**',
  ]),
  {
    rules: {
      '@typescript-eslint/no-empty-object-type': 'off',
    },
  },
  // Storybook plugin configuration
  ...storybook.configs['flat/recommended'],
]);

export default eslintConfig;
