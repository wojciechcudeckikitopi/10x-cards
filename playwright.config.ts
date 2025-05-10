import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.test") });

export default defineConfig({
  testDir: "./src/tests/e2e",
  timeout: 10 * 1000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    // Use only Chromium for e2e tests
    ...devices["Desktop Chrome"],
    baseURL: "http://localhost:3000",
    actionTimeout: 0,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  // Run local dev server before running tests
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 10 * 1000,
  },
  // Configure projects for different viewport sizes if needed
  projects: [
    {
      name: "cleanup db",
      testMatch: /global\.teardown\.ts/,
    },
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      teardown: "cleanup db",
    },
  ],
});
