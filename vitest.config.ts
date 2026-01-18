import path from 'node:path';
import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';

import { playwright } from '@vitest/browser-playwright';

const dirname =
  typeof __dirname !== 'undefined'
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

const rootPath = path.resolve(dirname);

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': rootPath,
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./__tests__/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        '__tests__/',
        '**/*.config.*',
        '**/*.d.ts',
        '**/__mocks__/**',
        '**/.storybook/**',
        '**/stories/**',
        'app/**', // Pages tested via E2E
        'middlewares/**',
        'providers/**', // Complex providers, many dependencies
        'tests/**', // Playwright E2E tests
      ],
      thresholds: {
        lines: 60,
        functions: 60,
        branches: 60,
        statements: 60,
      },
    },
    projects: [
      // Unit tests project
      {
        test: {
          include: [
            '**/__tests__/unit/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
          ],
          name: 'unit',
          environment: 'node',
        },
        resolve: {
          alias: {
            '@': rootPath,
          },
        },
      },
      // Component tests project
      {
        test: {
          name: 'components',
          include: [
            '**/__tests__/components/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
          ],
          environment: 'jsdom',
        },
        resolve: {
          alias: {
            '@': rootPath,
          },
        },
      },
      // Snapshot tests project
      {
        test: {
          name: 'snapshot',
          include: [
            '**/__tests__/**/*.snapshot.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
          ],
          environment: 'jsdom',
        },
        resolve: {
          alias: {
            '@': rootPath,
          },
        },
      },
      // Storybook tests project
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({ configDir: path.join(dirname, '.storybook') }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: 'chromium' }],
          },
          setupFiles: ['.storybook/vitest.setup.ts'],
        },
      },
    ],
  },
});
