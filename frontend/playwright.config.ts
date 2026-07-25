import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  timeout: 60000,
  expect: { timeout: 10000 },
  workers: 1,

  // ── Reporters: HTML + Allure + Console ──
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['allure-playwright', { outputFolder: 'allure-results', suiteTitle: true }],
    ['json', { outputFile: 'test-results/results.json' }],
  ],

  use: {
    baseURL: 'http://localhost:5173',
    headless: false,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    actionTimeout: 15000,
    navigationTimeout: 20000,

    // ── Screenshot, Video, Trace ──
    screenshot: 'on',
    video: 'on',
    trace: 'retain-on-failure',
  },

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
    timeout: 120000,
  },

  projects: [
    // ── GLOBAL SETUP: Auth 1 lần duy nhất cho 4 Roles ──
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    // ── ADMIN TESTS (dùng admin.json auth state) ──
    {
      name: 'admin',
      testDir: './e2e/admin',
      use: {
        ...devices['Desktop Chrome'],
        storageState: './playwright/.auth/admin.json',
      },
      dependencies: ['setup'],
    },
    // ── CLINIC MANAGER TESTS (dùng clinic.json auth state) ──
    {
      name: 'clinic',
      testDir: './e2e/clinic',
      use: {
        ...devices['Desktop Chrome'],
        storageState: './playwright/.auth/clinic.json',
      },
      dependencies: ['setup'],
    },
    // ── DOCTOR TESTS (dùng doctor.json auth state) ──
    {
      name: 'doctor',
      testDir: './e2e/doctor',
      use: {
        ...devices['Desktop Chrome'],
        storageState: './playwright/.auth/doctor.json',
      },
      dependencies: ['setup'],
    },
    // ── PATIENT TESTS (dùng patient.json auth state) ──
    {
      name: 'patient',
      testDir: './e2e/patient',
      use: {
        ...devices['Desktop Chrome'],
        storageState: './playwright/.auth/patient.json',
      },
      dependencies: ['setup'],
    },
  ],
});
