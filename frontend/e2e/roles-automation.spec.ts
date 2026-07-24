import { test, expect } from '@playwright/test';

test.describe('Chronic Disease Management - Multi-Role E2E Automation Suite', () => {

  // 1. SYSTEM ADMIN ROLE TEST
  test('ROLE 1: SYSTEM ADMIN - Full System Management Flow', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    await page.fill('input[name="email"], input[type="email"]', 'admin.dev@care.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');

    // Expect Admin Dashboard
    await page.waitForURL('**/admin**', { timeout: 10000 });
    await expect(page.locator('body')).toContainText(/Tổng quan|Dashboard|Quản trị|Báo cáo/i);

    // Test Admin Clinics Navigation
    await page.click('a[href*="/admin/clinics"], nav a:has-text("Phòng khám")');
    await page.waitForURL('**/admin/clinics');
    await expect(page.locator('body')).toContainText(/Danh sách phòng khám|Quản lý phòng khám/i);

    // Test Admin Users Navigation
    await page.click('a[href*="/admin/users"], nav a:has-text("Người dùng")');
    await page.waitForURL('**/admin/users');
    await expect(page.locator('body')).toContainText(/Quản lý tài khoản|Danh sách người dùng/i);

    // Test Admin Services Navigation
    await page.click('a[href*="/admin/services"], nav a:has-text("Dịch vụ")');
    await page.waitForURL('**/admin/services');
    await expect(page.locator('body')).toContainText(/Quản lý dịch vụ|Gói khám/i);

    // Test Admin Audit Logs Navigation
    await page.click('a[href*="/admin/audit-logs"], nav a:has-text("Nhật ký")');
    await page.waitForURL('**/admin/audit-logs');
    await expect(page.locator('body')).toContainText(/Nhật ký hệ thống/i);

    console.log('✅ ROLE 1: SYSTEM ADMIN E2E TEST PASSED CLEANLY!');
  });

  // 2. CLINIC MANAGER ROLE TEST
  test('ROLE 2: CLINIC MANAGER - Clinic Operation Flow', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    await page.fill('input[name="email"], input[type="email"]', 'manager@care.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');

    await page.waitForURL('**/clinic**', { timeout: 10000 });
    await expect(page.locator('body')).toContainText(/Tổng quan|Cơ sở|Phòng khám/i);

    // Navigate Clinic Services
    await page.click('a[href*="/clinic/services"], nav a:has-text("Dịch vụ")');
    await page.waitForURL('**/clinic/services');
    await expect(page.locator('body')).toContainText(/Dịch vụ tại Cơ sở|Bảng giá|Danh mục/i);

    console.log('✅ ROLE 2: CLINIC MANAGER E2E TEST PASSED CLEANLY!');
  });

  // 3. DOCTOR ROLE TEST
  test('ROLE 3: DOCTOR - Medical Management Flow', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    await page.fill('input[name="email"], input[type="email"]', 'mai.le@care.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');

    await page.waitForURL('**/doctor**', { timeout: 10000 });
    await expect(page.locator('body')).toContainText(/Bác sĩ|Lịch khám|Bệnh nhân|Tổng quan/i);

    console.log('✅ ROLE 3: DOCTOR E2E TEST PASSED CLEANLY!');
  });

  // 4. PATIENT ROLE TEST
  test('ROLE 4: PATIENT - Health Portal Flow', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    await page.fill('input[name="email"], input[type="email"]', 'truongquocan@patient.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');

    await page.waitForURL('**/patient**', { timeout: 10000 });
    await expect(page.locator('body')).toContainText(/Sức khỏe|Lịch hẹn|Bệnh nhân|Tổng quan/i);

    console.log('✅ ROLE 4: PATIENT E2E TEST PASSED CLEANLY!');
  });

});
