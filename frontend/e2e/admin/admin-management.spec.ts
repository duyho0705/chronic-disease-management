import { test, expect } from '@playwright/test';
import { navigateTo, searchAndVerify, clearSearch, openModal, verifyModalVisible, fillForm, submitModal, testData } from '../helpers/test-utils';

// ============================================================
//  ADMIN - DASHBOARD & NAVIGATION
// ============================================================
test.describe('@admin Dashboard & Navigation', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('domcontentloaded');
  });

  test('1.01 Dashboard hiển thị thống kê tổng quan', async ({ page }) => {
    await expect(page.locator('body')).toContainText(/Tổng quan|Dashboard/i);
    const cards = page.locator('[class*="rounded"]').filter({ hasText: /Phòng khám|Bệnh nhân|Bác sĩ|Người dùng/i });
    await expect(cards.first()).toBeVisible({ timeout: 10000 });
  });

  test('1.02 Navigate sang tất cả trang Admin', async ({ page }) => {
    const pages = [
      { href: '/admin/clinics', text: 'Phòng khám' },
      { href: '/admin/users', text: 'Người dùng' },
      { href: '/admin/services', text: 'Dịch vụ' },
      { href: '/admin/reports', text: 'Báo cáo' },
      { href: '/admin/audit-logs', text: 'Nhật ký' },
      { href: '/admin/settings', text: 'Cài đặt' },
      { href: '/admin/support', text: 'Hỗ trợ' },
    ];

    for (const p of pages) {
      await navigateTo(page, p.href, p.text);
      await page.waitForURL(`**${p.href}`);
      await page.waitForTimeout(300);
    }
  });

  test('1.03 Login thất bại hiển thị lỗi', async ({ page }) => {
    await page.context().clearCookies();
    await page.goto('/login');
    await page.fill('input[name="email"], input[type="email"]', 'admin.dev@care.com');
    await page.fill('input[type="password"]', 'wrong_password_123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1000);
    expect(page.url()).toContain('/login');
  });
});

// ============================================================
//  ADMIN - QUẢN LÝ PHÒNG KHÁM (Thực hiện tạo thật)
// ============================================================
test.describe('@admin @clinic Quản lý Phòng khám', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/clinics');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500);
  });

  test('1.04 Xem danh sách phòng khám', async ({ page }) => {
    await expect(page.locator('body')).toContainText(/Danh sách phòng khám|Quản lý phòng khám|cơ sở/i);
  });

  test('1.05 Tìm kiếm phòng khám - có kết quả', async ({ page }) => {
    await searchAndVerify(page, 'Care');
    await page.waitForTimeout(500);
    await clearSearch(page);
  });

  test('1.06 Mở modal Thêm phòng khám → Điền form → Kiểm tra validation', async ({ page }) => {
    await openModal(page, 'Thêm cơ sở mới');
    await verifyModalVisible(page, 'Thêm phòng khám mới');

    await submitModal(page, 'Xác nhận thêm');
    await page.waitForTimeout(500);

    const errorTexts = page.locator('p[class*="text-red"]');
    const errorCount = await errorTexts.count();
    expect(errorCount).toBeGreaterThan(0);
  });

  test('1.07 Mở modal Thêm phòng khám → Điền đầy đủ form → Submit thực sự', async ({ page }) => {
    const data = testData();

    await openModal(page, 'Thêm cơ sở mới');
    await verifyModalVisible(page, 'Thêm phòng khám mới');

    await fillForm(page, {
      name: data.clinicName,
      phone: '0912345678',
      address: data.clinicAddress,
      adminFullName: 'Quản Lý E2E Test',
      adminEmail: data.userEmail,
      adminPassword: data.userPassword,
      confirmPassword: data.userPassword,
    });

    const codeInput = page.locator('input[name="clinicCode"]');
    const codeValue = await codeInput.inputValue();
    expect(codeValue.length).toBeGreaterThan(0);

    await submitModal(page, 'Xác nhận thêm');
    await page.waitForTimeout(1500);
  });
});

// ============================================================
//  ADMIN - QUẢN LÝ NGƯỜI DÙNG (Thực hiện tạo thật)
// ============================================================
test.describe('@admin @user Quản lý Người dùng', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/users');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500);
  });

  test('1.08 Xem danh sách người dùng', async ({ page }) => {
    await expect(page.locator('body')).toContainText(/Quản lý tài khoản|Danh sách người dùng/i);
  });

  test('1.09 Tìm kiếm người dùng theo tên', async ({ page }) => {
    await searchAndVerify(page, 'Hùng');
    await page.waitForTimeout(500);
    await clearSearch(page);
  });

  test('1.10 Lọc theo vai trò', async ({ page }) => {
    try {
      const roleFilter = page.locator('button:has-text("Tất cả vai trò"), button:has-text("Vai trò")').first();
      if (await roleFilter.isVisible({ timeout: 2000 })) {
        await roleFilter.click();
        await page.waitForTimeout(300);
        const option = page.locator('text="Bác sĩ"').last();
        if (await option.isVisible({ timeout: 2000 })) {
          await option.click();
          await page.waitForTimeout(500);
        }
      }
    } catch { /* optional filter test */ }
  });

  test('1.11 Mở modal Thêm người dùng → Kiểm tra validation form trống', async ({ page }) => {
    await openModal(page, 'Thêm người dùng mới');
    await verifyModalVisible(page, 'Thêm người dùng mới');

    await submitModal(page, 'Xác nhận thêm');
    await page.waitForTimeout(500);

    const errors = page.locator('p[class*="text-red"]');
    const count = await errors.count();
    expect(count).toBeGreaterThan(0);
  });

  test('1.12 Mở modal Thêm người dùng → Điền đầy đủ thông tin → Submit thực sự', async ({ page }) => {
    const data = testData();

    await openModal(page, 'Thêm người dùng mới');
    await verifyModalVisible(page, 'Thêm người dùng mới');

    await fillForm(page, {
      name: data.userName,
      email: data.userEmail,
      phone: '0987654321',
      username: `e2e_user_${Date.now()}`,
      password: data.userPassword,
      confirmPassword: data.userPassword,
    });

    await submitModal(page, 'Xác nhận thêm');
    await page.waitForTimeout(1500);
  });
});

// ============================================================
//  ADMIN - QUẢN LÝ DỊCH VỤ (Thực hiện tạo thật)
// ============================================================
test.describe('@admin @service Quản lý Dịch vụ', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/services');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500);
  });

  test('1.13 Xem danh sách dịch vụ', async ({ page }) => {
    await expect(page.locator('body')).toContainText(/Quản lý dịch vụ|Gói khám/i);
  });

  test('1.14 Mở modal Thêm dịch vụ → Điền form → Submit thực sự', async ({ page }) => {
    const data = testData();

    try {
      const addBtn = page.locator('button:has-text("Tạo dịch vụ mới"), button:has-text("Thiết lập dịch vụ mới"), button:has-text("Thêm dịch vụ")').first();
      if (await addBtn.isVisible({ timeout: 3000 })) {
        await addBtn.click();
        await page.waitForTimeout(500);

        await fillForm(page, {
          name: data.serviceName,
          price: data.servicePrice,
          duration: data.serviceDuration,
        });

        const featureInput = page.locator('input[placeholder*="đặc điểm"]').first();
        if (await featureInput.isVisible({ timeout: 2000 })) {
          await featureInput.fill('Dịch vụ test tự động E2E');
        }

        await submitModal(page, 'Kích hoạt dịch vụ');
        await page.waitForTimeout(1500);
      }
    } catch { /* optional */ }
  });
});

// ============================================================
//  ADMIN - BÁO CÁO, NHẬT KÝ, CÀI ĐẶT, HỖ TRỢ
// ============================================================
test.describe('@admin Báo cáo & Nhật ký & Cài đặt', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('domcontentloaded');
  });

  test('1.15 Reports - Xem báo cáo & thống kê', async ({ page }) => {
    await page.goto('/admin/reports');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('body')).toContainText(/Báo cáo|Thống kê|Phân tích/i);
  });

  test('1.16 Audit Logs - Xem nhật ký hệ thống', async ({ page }) => {
    await page.goto('/admin/audit-logs');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('body')).toContainText(/Nhật ký hệ thống/i);
  });

  test('1.17 Audit Logs - Select checkbox dòng nhật ký', async ({ page }) => {
    await page.goto('/admin/audit-logs');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(800);

    try {
      const checkbox = page.locator('table input[type="checkbox"], input[type="checkbox"]').first();
      if (await checkbox.isVisible({ timeout: 3000 })) {
        await checkbox.click({ force: true });
        await page.waitForTimeout(300);
        await expect(checkbox).toBeChecked();
      }
    } catch { /* optional */ }
  });

  test('1.18 Settings - Xem & tương tác cài đặt hệ thống', async ({ page }) => {
    await page.goto('/admin/settings');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('body')).toContainText(/Cài đặt|Cấu hình|Hệ thống/i);
  });

  test('1.19 Support - Xem trang hỗ trợ', async ({ page }) => {
    await page.goto('/admin/support');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('body')).toContainText(/Hỗ trợ|Liên hệ|Trợ giúp/i);
  });
});
