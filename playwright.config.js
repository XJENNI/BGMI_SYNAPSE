const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  expect: { timeout: 5000 },
  fullyParallel: false,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:8080',
    headless: true,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 5000,
    ignoreHTTPSErrors: true
  },
  projects: [
    { name: 'Desktop Chromium', use: { browserName: 'chromium' } },
    { name: 'Mobile Safari (iPhone 12)', use: { ...devices['iPhone 12'] } }
  ]
});