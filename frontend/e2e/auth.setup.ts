import { test as setup, expect } from '@playwright/test';

const authFiles = {
  admin: './playwright/.auth/admin.json',
  clinic: './playwright/.auth/clinic.json',
  doctor: './playwright/.auth/doctor.json',
  patient: './playwright/.auth/patient.json',
};

// ============================================================
// SETUP 1: ADMIN AUTH
// ============================================================
setup('authenticate as admin', async ({ page }) => {
  await page.goto('/login');
  await page.waitForLoadState('domcontentloaded');
  await page.fill('input[name="email"], input[type="email"]', 'admin.dev@care.com');
  await page.fill('input[type="password"]', 'password');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/admin**');
  await expect(page.locator('body')).toContainText(/Tổng quan|Dashboard/i);
  await page.context().storageState({ path: authFiles.admin });
});

// ============================================================
// SETUP 2: CLINIC MANAGER AUTH
// ============================================================
setup('authenticate as clinic manager', async ({ page }) => {
  await page.goto('/login');
  await page.waitForLoadState('domcontentloaded');
  await page.fill('input[name="email"], input[type="email"]', 'manager@care.com');
  await page.fill('input[type="password"]', 'password');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/clinic**');
  await expect(page.locator('body')).toContainText(/Tổng quan|Phòng khám|Cơ sở/i);
  await page.context().storageState({ path: authFiles.clinic });
});

// ============================================================
// SETUP 3: DOCTOR AUTH
// ============================================================
setup('authenticate as doctor', async ({ page }) => {
  await page.goto('/login');
  await page.waitForLoadState('domcontentloaded');
  await page.fill('input[name="email"], input[type="email"]', 'mai.le@care.com');
  await page.fill('input[type="password"]', 'password');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/doctor**');
  await expect(page.locator('body')).toContainText(/Bác sĩ|Lịch khám|Bệnh nhân|Tổng quan/i);
  await page.context().storageState({ path: authFiles.doctor });
});

// ============================================================
// SETUP 4: PATIENT AUTH
// ============================================================
setup('authenticate as patient', async ({ page }) => {
  await page.goto('/login');
  await page.waitForLoadState('domcontentloaded');
  await page.fill('input[name="email"], input[type="email"]', 'truongquocan@patient.com');
  await page.fill('input[type="password"]', 'password');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/patient**');
  await expect(page.locator('body')).toContainText(/Sức khỏe|Lịch hẹn|Bệnh nhân|Tổng quan/i);
  await page.context().storageState({ path: authFiles.patient });
});
