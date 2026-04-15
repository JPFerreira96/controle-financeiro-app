import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : "html",
  timeout: 30_000,
  use: {
    baseURL: process.env.E2E_BASE_URL ?? "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" },
    },
  ],
  /* Start backend + frontend before E2E tests (only in local) */
  webServer: process.env.CI
    ? undefined
    : [
        {
          command: "cd ../backend && npm run dev",
          port: 3333,
          reuseExistingServer: true,
          env: {
            USE_MOCK_MODE: "true",
            JWT_SECRET: "e2e-test-secret-key",
            DATABASE_URL: "postgresql://localhost/unused",
            NODE_ENV: "test",
          },
        },
        {
          command: "cd ../frontend && npm run dev",
          port: 3000,
          reuseExistingServer: true,
        },
      ],
});
