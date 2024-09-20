import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  {
    test: {
      include: ['**/__test__/unit/**/*.{test,spec}.ts'],
      exclude: ['**/dist/**', '**/node_modules/**', '**/public/**'],
      name: 'unit',
      environment: 'node'
    }
  },
  {
    test: {
      include: ['**/__test__/browser/**/*.{test,spec}.ts'],
      exclude: ['**/dist/**', '**/node_modules/**', '**/public/**'],
      name: 'browser',
      browser: {
        screenshotFailures: false,
        provider: 'playwright',
        headless: true,
        enabled: true,
        name: 'chromium'
      }
    }
  }
]);
