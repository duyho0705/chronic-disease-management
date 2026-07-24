import { test, expect } from '@playwright/test';

test.describe('Chronic Disease Management - Multi-Role E2E Automation Suite', () => {

  // 1. SYSTEM ADMIN ROLE TEST
  test('ROLE 1: SYSTEM ADMIN - Full System Management Flow', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('domcontentloaded');

    await page.fill('input[name="email"], input[type="email"]', 'admin.dev@care.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');

    await page.waitForURL('**/admin**');
    await page.waitForLoadState('domcontentloaded');

    // Test Admin Clinics Navigation
    await page.click('a[href*="/admin/clinics"], nav a:has-text("Phòng khám")');
    await page.waitForURL('**/admin/clinics');
    await page.waitForLoadState('domcontentloaded');

    // Test Admin Users Navigation
    await page.click('a[href*="/admin/users"], nav a:has-text("Người dùng")');
    await page.waitForURL('**/admin/users');
    await page.waitForLoadState('domcontentloaded');

    // Test Admin Services Navigation
    await page.click('a[href*="/admin/services"], nav a:has-text("Dịch vụ")');
    await page.waitForURL('**/admin/services');
    await page.waitForLoadState('domcontentloaded');

    // Test Admin Audit Logs Navigation
    await page.click('a[href*="/admin/audit-logs"], nav a:has-text("Nhật ký")');
    await page.waitForURL('**/admin/audit-logs');
    await page.waitForLoadState('domcontentloaded');

    console.log('✅ ROLE 1: SYSTEM ADMIN E2E TEST PASSED CLEANLY!');
  });

  // 2. CLINIC MANAGER ROLE TEST
  test('ROLE 2: CLINIC MANAGER - Clinic Operation Flow', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('domcontentloaded');

    await page.fill('input[name="email"], input[type="email"]', 'manager@care.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');

    await page.waitForURL('**/clinic**');
    await page.waitForLoadState('domcontentloaded');

    // Navigate Clinic Services
    await page.click('a[href*="/clinic/services"], nav a:has-text("Dịch vụ")');
    await page.waitForURL('**/clinic/services');
    await page.waitForLoadState('domcontentloaded');

    console.log('✅ ROLE 2: CLINIC MANAGER E2E TEST PASSED CLEANLY!');
  });

  // 3. DOCTOR ROLE TEST
  test('ROLE 3: DOCTOR - Medical Management Flow', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('domcontentloaded');

    await page.fill('input[name="email"], input[type="email"]', 'mai.le@care.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');

    await page.waitForURL('**/doctor**');
    await page.waitForLoadState('domcontentloaded');

    console.log('✅ ROLE 3: DOCTOR E2E TEST PASSED CLEANLY!');
  });

  // 4. PATIENT ROLE TEST
  test('ROLE 4: PATIENT - Health Portal Flow', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('domcontentloaded');

    await page.fill('input[name="email"], input[type="email"]', 'truongquocan@patient.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');

    await page.waitForURL('**/patient**');
    await page.waitForLoadState('domcontentloaded');

    console.log('✅ ROLE 4: PATIENT E2E TEST PASSED CLEANLY!');
  });

});
