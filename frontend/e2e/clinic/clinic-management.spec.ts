import { test, expect } from '@playwright/test';
import { searchAndVerify, clearSearch, openModal, verifyModalVisible, fillForm, submitModal, testData } from '../helpers/test-utils';

// ============================================================
//  CLINIC MANAGER - DASHBOARD & NAVIGATION
// ============================================================
test.describe('@clinic Dashboard & Navigation', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/clinic');
    await page.waitForLoadState('domcontentloaded');
  });

  test('2.01 Dashboard phòng khám hiển thị số liệu tổng quan', async ({ page }) => {
    await expect(page.locator('body')).toContainText(/Tổng quan|Cơ sở|Phòng khám|Bệnh nhân/i);
  });

  test('2.02 Navigate qua tất cả trang Clinic Manager', async ({ page }) => {
    const pages = [
      { href: '/clinic/doctors', text: 'Bác sĩ' },
      { href: '/clinic/patients', text: 'Bệnh nhân' },
      { href: '/clinic/appointments', text: 'Lịch hẹn' },
      { href: '/clinic/services', text: 'Dịch vụ' },
      { href: '/clinic/assignment', text: 'Phân công' },
      { href: '/clinic/reports', text: 'Báo cáo' },
      { href: '/clinic/alerts', text: 'Cảnh báo' },
    ];

    for (const p of pages) {
      await page.goto(p.href);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(300);
    }
  });
});

// ============================================================
//  CLINIC MANAGER - QUẢN LÝ BÁC SĨ (Tạo thực sự)
// ============================================================
test.describe('@clinic @doctor Quản lý Bác sĩ', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/clinic/doctors');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500);
  });

  test('2.03 Xem danh sách bác sĩ tại cơ sở', async ({ page }) => {
    const content = page.locator('body');
    await expect(content).toContainText(/Bác sĩ|Danh sách|Quản lý/i);
  });

  test('2.04 Mở modal Thêm bác sĩ → Kiểm tra validation form trống', async ({ page }) => {
    await openModal(page, 'Thêm bác sĩ mới');
    await verifyModalVisible(page, 'Thêm hồ sơ bác sĩ mới');

    await submitModal(page, 'Xác nhận thêm');
    await page.waitForTimeout(500);

    const errors = page.locator('p[class*="text-red"]');
    const count = await errors.count();
    expect(count).toBeGreaterThan(0);
  });

  test('2.05 Mở modal Thêm bác sĩ → Điền đầy đủ thông tin → Submit thực sự', async ({ page }) => {
    const data = testData();

    await openModal(page, 'Thêm bác sĩ mới');
    await verifyModalVisible(page, 'Thêm hồ sơ bác sĩ mới');

    await fillForm(page, {
      name: data.doctorName,
      email: data.doctorEmail,
      phone: '0956789012',
      password: data.userPassword,
      confirmPassword: data.userPassword,
      licenseNumber: data.doctorLicense,
      experience: '5',
      maxPatients: '100',
    });

    const bioInput = page.locator('textarea[name="bio"]').first();
    if (await bioInput.isVisible({ timeout: 2000 })) {
      await bioInput.fill('Bác sĩ chuyên khoa nội - Dữ liệu test E2E');
    }

    await submitModal(page, 'Xác nhận thêm');
    await page.waitForTimeout(1500);
  });

  test('2.06 Tìm kiếm bác sĩ theo tên', async ({ page }) => {
    await searchAndVerify(page, 'Mai');
    await page.waitForTimeout(500);
    await clearSearch(page);
  });
});

// ============================================================
//  CLINIC MANAGER - QUẢN LÝ BỆNH NHÂN (Tạo thực sự)
// ============================================================
test.describe('@clinic @patient Quản lý Bệnh nhân', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/clinic/patients');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500);
  });

  test('2.07 Xem danh sách bệnh nhân phòng khám', async ({ page }) => {
    const content = page.locator('body');
    await expect(content).toContainText(/Bệnh nhân|Danh sách|Quản lý/i);
  });

  test('2.08 Mở modal Thêm bệnh nhân → Kiểm tra validation', async ({ page }) => {
    await openModal(page, 'Thêm bệnh nhân mới');
    await verifyModalVisible(page, 'Thêm hồ sơ bệnh nhân mới');

    await submitModal(page, 'Xác nhận thêm');
    await page.waitForTimeout(500);

    const errors = page.locator('p[class*="text-red"]');
    const count = await errors.count();
    expect(count).toBeGreaterThan(0);
  });

  test('2.09 Mở modal Thêm bệnh nhân → Điền đầy đủ form → Submit thực sự', async ({ page }) => {
    const data = testData();

    await openModal(page, 'Thêm bệnh nhân mới');
    await verifyModalVisible(page, 'Thêm hồ sơ bệnh nhân mới');

    await fillForm(page, {
      name: data.patientName,
      age: data.patientAge,
      phone: '0934567890',
      email: data.patientEmail,
      address: '456 Đường Test, Q.3, TP.HCM',
      password: data.userPassword,
      confirmPassword: data.userPassword,
      identityCard: '012345678901',
      occupation: 'Nhân viên văn phòng',
      insuranceNumber: 'BH123456789',
    });

    await submitModal(page, 'Xác nhận thêm');
    await page.waitForTimeout(1500);
  });

  test('2.10 Tìm kiếm bệnh nhân theo tên', async ({ page }) => {
    await searchAndVerify(page, 'Trần');
    await page.waitForTimeout(500);
    await clearSearch(page);
  });
});

// ============================================================
//  CLINIC MANAGER - LỊCH HẸN, PHÂN CÔNG, BÁO CÁO
// ============================================================
test.describe('@clinic Lịch hẹn & Phân công & Báo cáo', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/clinic');
    await page.waitForLoadState('domcontentloaded');
  });

  test('2.11 Appointments - Xem danh sách lịch hẹn', async ({ page }) => {
    await page.goto('/clinic/appointments');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500);
  });

  test('2.12 Services - Xem danh mục dịch vụ cơ sở', async ({ page }) => {
    await page.goto('/clinic/services');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('body')).toContainText(/Dịch vụ tại Cơ sở|Bảng giá|Danh mục|Dịch vụ/i);
  });

  test('2.13 Assignment - Xem & tương tác phân công bác sĩ-bệnh nhân', async ({ page }) => {
    await page.goto('/clinic/assignment');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500);
  });

  test('2.14 Reports - Xem báo cáo phòng khám', async ({ page }) => {
    await page.goto('/clinic/reports');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500);
  });

  test('2.15 Risk Alerts - Xem cảnh báo nguy cơ', async ({ page }) => {
    await page.goto('/clinic/alerts');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500);
  });

  test('2.16 Settings - Truy cập cài đặt phòng khám', async ({ page }) => {
    await page.goto('/clinic/settings');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500);
  });

  test('2.17 Support - Truy cập trang hỗ trợ', async ({ page }) => {
    await page.goto('/clinic/support');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500);
  });
});
