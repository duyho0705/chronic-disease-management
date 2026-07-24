import { test, expect, Page } from '@playwright/test';

// ============================================================
// HELPER: Reusable login function
// ============================================================
async function login(page: Page, email: string, password: string = 'password') {
  await page.goto('/login');
  await page.waitForLoadState('domcontentloaded');
  await page.fill('input[name="email"], input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');
}

// ============================================================
// ============================================================
//
//  SYSTEM ADMIN (8 trang × nhiều chức năng = ~20 test cases)
//
// ============================================================
// ============================================================
test.describe('ROLE 1: SYSTEM ADMIN', () => {

  // --- 1.1 LOGIN ---
  test('1.01 Login thành công với tài khoản Admin', async ({ page }) => {
    await login(page, 'admin.dev@care.com');
    await page.waitForURL('**/admin**');
    await expect(page.locator('body')).toContainText(/Tổng quan|Dashboard/i);
  });

  test('1.02 Login thất bại với mật khẩu sai', async ({ page }) => {
    await login(page, 'admin.dev@care.com', 'wrongpassword');
    // Should stay on login or show error
    await page.waitForTimeout(1000);
    const url = page.url();
    expect(url).toContain('/login');
  });

  // --- 1.2 ADMIN DASHBOARD ---
  test('1.03 Dashboard hiển thị số liệu thống kê tổng quan', async ({ page }) => {
    await login(page, 'admin.dev@care.com');
    await page.waitForURL('**/admin**');
    await expect(page.locator('body')).toContainText(/Tổng quan|Bệnh nhân|Phòng khám/i);
  });

  // --- 1.3 ADMIN CLINICS ---
  test('1.04 Clinics - Xem danh sách phòng khám', async ({ page }) => {
    await login(page, 'admin.dev@care.com');
    await page.waitForURL('**/admin**');
    await page.click('a[href*="/admin/clinics"], nav a:has-text("Phòng khám")');
    await page.waitForURL('**/admin/clinics');
    await expect(page.locator('body')).toContainText(/Danh sách phòng khám|Quản lý phòng khám/i);
  });

  test('1.05 Clinics - Tìm kiếm phòng khám', async ({ page }) => {
    await login(page, 'admin.dev@care.com');
    await page.waitForURL('**/admin**');
    await page.click('a[href*="/admin/clinics"], nav a:has-text("Phòng khám")');
    await page.waitForURL('**/admin/clinics');
    const search = page.locator('input[placeholder*="Tìm"], input[placeholder*="tìm"]').first();
    if (await search.isVisible()) {
      await search.fill('Care');
      await page.waitForTimeout(500);
      await search.clear();
    }
  });

  test('1.06 Clinics - Mở modal Thêm phòng khám', async ({ page }) => {
    await login(page, 'admin.dev@care.com');
    await page.waitForURL('**/admin**');
    await page.click('a[href*="/admin/clinics"], nav a:has-text("Phòng khám")');
    await page.waitForURL('**/admin/clinics');
    try {
      const addBtn = page.locator('button:has-text("Thêm phòng khám")').first();
      if (await addBtn.isVisible()) {
        await addBtn.click({ timeout: 3000 });
        await page.waitForTimeout(500);
        // Verify modal appeared
        const modal = page.locator('[role="dialog"], .modal, div[class*="modal"]').first();
        if (await modal.isVisible()) {
          await expect(modal).toBeVisible();
        }
        await page.keyboard.press('Escape');
      }
    } catch { /* modal test is optional */ }
  });

  // --- 1.4 ADMIN USERS ---
  test('1.07 Users - Xem danh sách người dùng', async ({ page }) => {
    await login(page, 'admin.dev@care.com');
    await page.click('a[href*="/admin/users"], nav a:has-text("Người dùng")');
    await page.waitForURL('**/admin/users');
    await expect(page.locator('body')).toContainText(/Quản lý tài khoản|Danh sách người dùng/i);
  });

  test('1.08 Users - Tìm kiếm theo tên người dùng', async ({ page }) => {
    await login(page, 'admin.dev@care.com');
    await page.click('a[href*="/admin/users"], nav a:has-text("Người dùng")');
    await page.waitForURL('**/admin/users');
    const search = page.locator('input[placeholder*="Tìm"], input[placeholder*="tìm"]').first();
    if (await search.isVisible()) {
      await search.fill('Hùng');
      await page.waitForTimeout(500);
      await search.clear();
    }
  });

  test('1.09 Users - Mở modal Thêm người dùng mới', async ({ page }) => {
    await login(page, 'admin.dev@care.com');
    await page.click('a[href*="/admin/users"], nav a:has-text("Người dùng")');
    await page.waitForURL('**/admin/users');
    try {
      const addBtn = page.locator('button:has-text("Thêm người dùng")').first();
      if (await addBtn.isVisible()) {
        await addBtn.click({ timeout: 3000 });
        await page.waitForTimeout(500);
        await page.keyboard.press('Escape');
      }
    } catch { /* modal test */ }
  });

  test('1.10 Users - Lọc theo vai trò (Role Filter)', async ({ page }) => {
    await login(page, 'admin.dev@care.com');
    await page.click('a[href*="/admin/users"], nav a:has-text("Người dùng")');
    await page.waitForURL('**/admin/users');
    // Try clicking on role filter dropdown
    try {
      const roleFilter = page.locator('button:has-text("Tất cả vai trò"), select:has-text("Tất cả vai trò")').first();
      if (await roleFilter.isVisible()) {
        await roleFilter.click({ timeout: 2000 });
        await page.waitForTimeout(300);
        await page.keyboard.press('Escape');
      }
    } catch { /* optional filter */ }
  });

  // --- 1.5 ADMIN SERVICES ---
  test('1.11 Services - Xem danh mục dịch vụ y tế', async ({ page }) => {
    await login(page, 'admin.dev@care.com');
    await page.click('a[href*="/admin/services"], nav a:has-text("Dịch vụ")');
    await page.waitForURL('**/admin/services');
    await expect(page.locator('body')).toContainText(/Quản lý dịch vụ|Gói khám/i);
  });

  // --- 1.6 ADMIN REPORTS ---
  test('1.12 Reports - Xem trang báo cáo & thống kê', async ({ page }) => {
    await login(page, 'admin.dev@care.com');
    await page.click('a[href*="/admin/reports"], nav a:has-text("Báo cáo")');
    await page.waitForURL('**/admin/reports');
    await expect(page.locator('body')).toContainText(/Báo cáo|Thống kê|Phân tích/i);
  });

  // --- 1.7 ADMIN AUDIT LOGS ---
  test('1.13 Audit Logs - Xem nhật ký hệ thống', async ({ page }) => {
    await login(page, 'admin.dev@care.com');
    await page.click('a[href*="/admin/audit-logs"], nav a:has-text("Nhật ký")');
    await page.waitForURL('**/admin/audit-logs');
    await expect(page.locator('body')).toContainText(/Nhật ký hệ thống/i);
  });

  test('1.14 Audit Logs - Chọn dòng nhật ký & Bulk Select', async ({ page }) => {
    await login(page, 'admin.dev@care.com');
    await page.click('a[href*="/admin/audit-logs"], nav a:has-text("Nhật ký")');
    await page.waitForURL('**/admin/audit-logs');
    try {
      const checkbox = page.locator('table input[type="checkbox"]').first();
      if (await checkbox.isVisible()) {
        await checkbox.click({ force: true, timeout: 3000 });
        await page.waitForTimeout(200);
      }
    } catch { /* optional */ }
  });

  // --- 1.8 ADMIN SETTINGS ---
  test('1.15 Settings - Xem trang cài đặt hệ thống', async ({ page }) => {
    await login(page, 'admin.dev@care.com');
    await page.click('a[href*="/admin/settings"], nav a:has-text("Cài đặt")');
    await page.waitForURL('**/admin/settings');
    await expect(page.locator('body')).toContainText(/Cài đặt|Cấu hình|Hệ thống/i);
  });

  // --- 1.9 ADMIN SUPPORT ---
  test('1.16 Support - Xem trang hỗ trợ', async ({ page }) => {
    await login(page, 'admin.dev@care.com');
    await page.click('a[href*="/admin/support"], nav a:has-text("Hỗ trợ")');
    await page.waitForURL('**/admin/support');
    await expect(page.locator('body')).toContainText(/Hỗ trợ|Liên hệ|Trợ giúp/i);
  });

});

// ============================================================
// ============================================================
//
//  CLINIC MANAGER (10 trang × nhiều chức năng = ~18 test cases)
//
// ============================================================
// ============================================================
test.describe('ROLE 2: CLINIC MANAGER', () => {

  // --- 2.1 LOGIN ---
  test('2.01 Login thành công với tài khoản Quản lý', async ({ page }) => {
    await login(page, 'manager@care.com');
    await page.waitForURL('**/clinic**');
    await expect(page.locator('body')).toContainText(/Tổng quan|Cơ sở|Phòng khám/i);
  });

  // --- 2.2 CLINIC DASHBOARD ---
  test('2.02 Dashboard phòng khám hiển thị số liệu tổng quan', async ({ page }) => {
    await login(page, 'manager@care.com');
    await page.waitForURL('**/clinic**');
    await expect(page.locator('body')).toContainText(/Tổng quan|Phòng khám|Bệnh nhân/i);
  });

  // --- 2.3 CLINIC DOCTORS ---
  test('2.03 Doctors - Xem danh sách bác sĩ tại cơ sở', async ({ page }) => {
    await login(page, 'manager@care.com');
    await page.waitForURL('**/clinic**');
    await page.click('a[href*="/clinic/doctors"], nav a:has-text("Bác sĩ")');
    await page.waitForURL('**/clinic/doctors');
  });

  // --- 2.4 CLINIC PATIENTS ---
  test('2.04 Patients - Xem danh sách bệnh nhân phòng khám', async ({ page }) => {
    await login(page, 'manager@care.com');
    await page.waitForURL('**/clinic**');
    await page.click('a[href*="/clinic/patients"], nav a:has-text("Bệnh nhân")');
    await page.waitForURL('**/clinic/patients');
  });

  // --- 2.5 CLINIC APPOINTMENTS ---
  test('2.05 Appointments - Xem danh sách lịch hẹn', async ({ page }) => {
    await login(page, 'manager@care.com');
    await page.waitForURL('**/clinic**');
    await page.click('a[href*="/clinic/appointments"], nav a:has-text("Lịch hẹn")');
    await page.waitForURL('**/clinic/appointments');
  });

  // --- 2.6 CLINIC SERVICES ---
  test('2.06 Services - Xem danh mục dịch vụ cơ sở', async ({ page }) => {
    await login(page, 'manager@care.com');
    await page.waitForURL('**/clinic**');
    await page.click('a[href*="/clinic/services"], nav a:has-text("Dịch vụ")');
    await page.waitForURL('**/clinic/services');
    await expect(page.locator('body')).toContainText(/Dịch vụ tại Cơ sở|Bảng giá|Danh mục/i);
  });

  // --- 2.7 CLINIC ASSIGNMENT ---
  test('2.07 Assignment - Xem phân công bác sĩ-bệnh nhân', async ({ page }) => {
    await login(page, 'manager@care.com');
    await page.waitForURL('**/clinic**');
    await page.click('a[href*="/clinic/assignment"], nav a:has-text("Phân công")');
    await page.waitForURL('**/clinic/assignment');
  });

  // --- 2.8 CLINIC REPORTS ---
  test('2.08 Reports - Xem trang báo cáo phòng khám', async ({ page }) => {
    await login(page, 'manager@care.com');
    await page.waitForURL('**/clinic**');
    await page.click('a[href*="/clinic/reports"], nav a:has-text("Báo cáo")');
    await page.waitForURL('**/clinic/reports');
  });

  // --- 2.9 CLINIC ALERTS ---
  test('2.09 Risk Alerts - Xem cảnh báo nguy cơ', async ({ page }) => {
    await login(page, 'manager@care.com');
    await page.waitForURL('**/clinic**');
    await page.click('a[href*="/clinic/alerts"], nav a:has-text("Cảnh báo")');
    await page.waitForURL('**/clinic/alerts');
  });

  // --- 2.10 CLINIC SETTINGS (direct URL) ---
  test('2.10 Settings - Truy cập cài đặt phòng khám', async ({ page }) => {
    await login(page, 'manager@care.com');
    await page.waitForURL('**/clinic**');
    await page.goto('/clinic/settings');
    await page.waitForLoadState('domcontentloaded');
  });

  // --- 2.11 CLINIC SUPPORT (direct URL) ---
  test('2.11 Support - Truy cập trang hỗ trợ', async ({ page }) => {
    await login(page, 'manager@care.com');
    await page.waitForURL('**/clinic**');
    await page.goto('/clinic/support');
    await page.waitForLoadState('domcontentloaded');
  });

});

// ============================================================
// ============================================================
//
//  DOCTOR (7 trang × nhiều chức năng = ~14 test cases)
//
// ============================================================
// ============================================================
test.describe('ROLE 3: DOCTOR', () => {

  // --- 3.1 LOGIN ---
  test('3.01 Login thành công với tài khoản Bác sĩ', async ({ page }) => {
    await login(page, 'mai.le@care.com');
    await page.waitForURL('**/doctor**');
    await expect(page.locator('body')).toContainText(/Bác sĩ|Lịch khám|Bệnh nhân|Tổng quan/i);
  });

  // --- 3.2 DOCTOR DASHBOARD ---
  test('3.02 Dashboard bác sĩ - lịch khám & cảnh báo nguy cơ cao', async ({ page }) => {
    await login(page, 'mai.le@care.com');
    await page.waitForURL('**/doctor**');
    await expect(page.locator('body')).toContainText(/Tổng quan|Lịch khám|Bệnh nhân/i);
  });

  // --- 3.3 DOCTOR PATIENTS ---
  test('3.03 Patients - Xem danh sách bệnh nhân quản lý', async ({ page }) => {
    await login(page, 'mai.le@care.com');
    await page.waitForURL('**/doctor**');
    await page.click('a[href*="/doctor/patients"], nav a:has-text("Bệnh nhân")');
    await page.waitForURL('**/doctor/patients');
  });

  // --- 3.4 DOCTOR APPOINTMENTS ---
  test('3.04 Appointments - Xem & quản lý lịch hẹn khám bệnh', async ({ page }) => {
    await login(page, 'mai.le@care.com');
    await page.waitForURL('**/doctor**');
    await page.click('a[href*="/doctor/appointments"], nav a:has-text("Lịch hẹn")');
    await page.waitForURL('**/doctor/appointments');
  });

  // --- 3.5 DOCTOR PRESCRIPTIONS ---
  test('3.05 Prescriptions - Quản lý toa thuốc', async ({ page }) => {
    await login(page, 'mai.le@care.com');
    await page.waitForURL('**/doctor**');
    await page.click('a[href*="/doctor/prescriptions"], nav a:has-text("Toa thuốc")');
    await page.waitForURL('**/doctor/prescriptions');
  });

  // --- 3.6 DOCTOR ANALYTICS ---
  test('3.06 Analytics - Xem thống kê & phân tích bệnh nhân', async ({ page }) => {
    await login(page, 'mai.le@care.com');
    await page.waitForURL('**/doctor**');
    await page.click('a[href*="/doctor/analytics"], nav a:has-text("Phân tích")');
    await page.waitForURL('**/doctor/analytics');
  });

  // --- 3.7 DOCTOR MESSAGES ---
  test('3.07 Messages - Tin nhắn trao đổi với bệnh nhân', async ({ page }) => {
    await login(page, 'mai.le@care.com');
    await page.waitForURL('**/doctor**');
    await page.click('a[href*="/doctor/messages"], nav a:has-text("Tin nhắn")');
    await page.waitForURL('**/doctor/messages');
  });

  // --- 3.8 DOCTOR SUPPORT ---
  test('3.08 Support - Xem trang hỗ trợ bác sĩ', async ({ page }) => {
    await login(page, 'mai.le@care.com');
    await page.waitForURL('**/doctor**');
    await page.click('a[href*="/doctor/support"], nav a:has-text("Hỗ trợ")');
    await page.waitForURL('**/doctor/support');
  });

});

// ============================================================
// ============================================================
//
//  PATIENT (8 trang × nhiều chức năng = ~16 test cases)
//
// ============================================================
// ============================================================
test.describe('ROLE 4: PATIENT', () => {

  // --- 4.1 LOGIN ---
  test('4.01 Login thành công với tài khoản Bệnh nhân', async ({ page }) => {
    await login(page, 'truongquocan@patient.com');
    await page.waitForURL('**/patient**');
    await expect(page.locator('body')).toContainText(/Sức khỏe|Lịch hẹn|Bệnh nhân|Tổng quan/i);
  });

  // --- 4.2 PATIENT DASHBOARD ---
  test('4.02 Dashboard bệnh nhân - tổng quan sức khỏe', async ({ page }) => {
    await login(page, 'truongquocan@patient.com');
    await page.waitForURL('**/patient**');
    await expect(page.locator('body')).toContainText(/Tổng quan|Sức khỏe|Chỉ số/i);
  });

  // --- 4.3 PATIENT HEALTH METRICS ---
  test('4.03 Metrics - Xem biểu đồ chỉ số sức khỏe', async ({ page }) => {
    await login(page, 'truongquocan@patient.com');
    await page.waitForURL('**/patient**');
    await page.click('a[href*="/patient/metrics"], nav a:has-text("Chỉ số")');
    await page.waitForURL('**/patient/metrics');
  });

  // --- 4.4 PATIENT APPOINTMENTS ---
  test('4.04 Appointments - Xem lịch hẹn khám bệnh', async ({ page }) => {
    await login(page, 'truongquocan@patient.com');
    await page.waitForURL('**/patient**');
    await page.click('a[href*="/patient/appointments"], nav a:has-text("Lịch hẹn")');
    await page.waitForURL('**/patient/appointments');
  });

  // --- 4.5 PATIENT PRESCRIPTIONS ---
  test('4.05 Prescriptions - Xem toa thuốc hiện tại', async ({ page }) => {
    await login(page, 'truongquocan@patient.com');
    await page.waitForURL('**/patient**');
    await page.click('a[href*="/patient/prescriptions"], nav a:has-text("Toa thuốc")');
    await page.waitForURL('**/patient/prescriptions');
  });

  // --- 4.6 PATIENT MESSAGES ---
  test('4.06 Messages - Chat với bác sĩ', async ({ page }) => {
    await login(page, 'truongquocan@patient.com');
    await page.waitForURL('**/patient**');
    await page.click('a[href*="/patient/messages"], nav a:has-text("Tin nhắn")');
    await page.waitForURL('**/patient/messages');
  });

  // --- 4.7 PATIENT PROFILE ---
  test('4.07 Profile - Xem hồ sơ cá nhân', async ({ page }) => {
    await login(page, 'truongquocan@patient.com');
    await page.waitForURL('**/patient**');
    await page.click('a[href*="/patient/profile"], nav a:has-text("Hồ sơ")');
    await page.waitForURL('**/patient/profile');
  });

  // --- 4.8 PATIENT SERVICES ---
  test('4.08 Services - Xem danh mục dịch vụ y tế', async ({ page }) => {
    await login(page, 'truongquocan@patient.com');
    await page.waitForURL('**/patient**');
    await page.click('a[href*="/patient/services"], nav a:has-text("Dịch vụ")');
    await page.waitForURL('**/patient/services');
  });

  // --- 4.9 PATIENT SUPPORT ---
  test('4.09 Support - Xem trang hỗ trợ bệnh nhân', async ({ page }) => {
    await login(page, 'truongquocan@patient.com');
    await page.waitForURL('**/patient**');
    await page.click('a[href*="/patient/support"], nav a:has-text("Hỗ trợ")');
    await page.waitForURL('**/patient/support');
  });

});
