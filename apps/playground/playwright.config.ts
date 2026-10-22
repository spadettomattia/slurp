import { defineConfig, devices } from '@playwright/test';

const PORT = 4173;
const CI = !!process.env.CI;

// Visual tests of the collapse / expand flow, on the playground served from the library sources.
export default defineConfig({
  testDir: './e2e',
  forbidOnly: CI,
  retries: CI ? 1 : 0,
  reporter: CI ? 'github' : 'list',
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `pnpm exec vite --port ${PORT} --strictPort --host 127.0.0.1`,
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: !CI,
  },
});
