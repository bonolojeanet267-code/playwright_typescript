import { defineConfig, devices } from '@playwright/test';
import { config } from 'dotenv';

if (process.env.ENVIRONMENT) {
  config({ path: `.env.${process.env.ENVIRONMENT}`, override: true });
} else {
  config();
}

export default defineConfig({
  testDir: './e2e/tests',
  testMatch: '**/*.spec.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 3,
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  reporter: [
    ['list'],
    ['junit', { outputFile: 'test-results/playwright-junit.xml' }],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],
  outputDir: 'test-results',
  use: {
    baseURL: process.env.URL ?? 'https://www.saucedemo.com',
    trace: 'retain-on-failure',
    screenshot: 'on',
    video: 'on',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testDir: './e2e/tests/ui',
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      testDir: './e2e/tests/ui',
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      testDir: './e2e/tests/ui',
    },
    {
      name: 'api',
      testDir: './e2e/tests/api',
    },
  ],
});
