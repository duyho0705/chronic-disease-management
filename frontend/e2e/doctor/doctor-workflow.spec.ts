import { test, expect } from '@playwright/test';
import { searchAndVerify, clearSearch } from '../helpers/test-utils';

// ============================================================
//  DOCTOR - DASHBOARD & NAVIGATION
// ============================================================
test.describe('@doctor Dashboard & Navigation', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/doctor');
    await page.waitForLoadState('domcontentloaded');
  });

  test('3.01 Dashboard bác sĩ hiển thị thống kê tổng quan', async ({ page }) => {
    await expect(page.locator('body')).toContainText(/Bác sĩ|Lịch khám|Bệnh nhân|Tổng quan/i);
  });

  test('3.02 Navigate qua tất cả trang Doctor', async ({ page }) => {
    const pages = [
      { href: '/doctor/patients', text: 'Bệnh nhân' },
      { href: '/doctor/appointments', text: 'Lịch hẹn' },
      { href: '/doctor/prescriptions', text: 'Toa thuốc' },
      { href: '/doctor/analytics', text: 'Phân tích' },
      { href: '/doctor/messages', text: 'Tin nhắn' },
      { href: '/doctor/support', text: 'Hỗ trợ' },
    ];

    for (const p of pages) {
      await page.goto(p.href);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(300);
    }
  });
});

// ============================================================
//  DOCTOR - QUẢN LÝ BỆNH NHÂN
// ============================================================
test.describe('@doctor @patient Danh sách Bệnh nhân', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/doctor/patients');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500);
  });

  test('3.03 Xem danh sách bệnh nhân quản lý', async ({ page }) => {
    const body = page.locator('body');
    await expect(body).toContainText(/Bệnh nhân|Danh sách|Quản lý/i);
  });

  test('3.04 Tìm kiếm bệnh nhân', async ({ page }) => {
    await searchAndVerify(page, 'Trần');
    await page.waitForTimeout(500);
    await clearSearch(page);
  });

  test('3.05 Click xem chi tiết bệnh nhân (nếu có)', async ({ page }) => {
    try {
      const detailBtn = page.locator('button:has-text("Chi tiết"), button:has-text("Xem"), a:has-text("Chi tiết")').first();
      if (await detailBtn.isVisible({ timeout: 2000 })) {
        await detailBtn.click();
        await page.waitForTimeout(500);
      } else {
        const row = page.locator('table tbody tr, div[class*="card"]').first();
        if (await row.isVisible({ timeout: 2000 })) {
          await row.click();
          await page.waitForTimeout(500);
        }
      }
    } catch { /* optional */ }
  });
});

// ============================================================
//  DOCTOR - LỊCH HẸN KHÁM BỆNH
// ============================================================
test.describe('@doctor @appointment Lịch hẹn khám bệnh', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/doctor/appointments');
    await page.waitForLoadState('domcontentloaded');
  });

  test('3.06 Xem danh sách lịch hẹn', async ({ page }) => {
    await page.waitForTimeout(500);
  });

  test('3.07 Tương tác với lịch hẹn (tab/filter)', async ({ page }) => {
    await page.waitForTimeout(500);
    try {
      const tabs = ['Hôm nay', 'Sắp tới', 'Tất cả'];
      for (const tab of tabs) {
        const tabBtn = page.locator(`button:has-text("${tab}")`).first();
        if (await tabBtn.isVisible({ timeout: 2000 })) {
          await tabBtn.click();
          await page.waitForTimeout(300);
        }
      }
    } catch { /* optional */ }
  });
});

// ============================================================
//  DOCTOR - TOA THUỐC
// ============================================================
test.describe('@doctor @prescription Quản lý Toa thuốc', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/doctor/prescriptions');
    await page.waitForLoadState('domcontentloaded');
  });

  test('3.08 Xem danh sách toa thuốc', async ({ page }) => {
    await page.waitForTimeout(500);
  });

  test('3.09 Tìm kiếm toa thuốc', async ({ page }) => {
    await page.waitForTimeout(500);
    await searchAndVerify(page, 'Trần');
    await page.waitForTimeout(500);
  });
});

// ============================================================
//  DOCTOR - PHÂN TÍCH & TIN NHẮN
// ============================================================
test.describe('@doctor Analytics & Messages', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/doctor');
    await page.waitForLoadState('domcontentloaded');
  });

  test('3.10 Analytics - Xem thống kê & biểu đồ phân tích', async ({ page }) => {
    await page.goto('/doctor/analytics');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500);
    const body = page.locator('body');
    await expect(body).toContainText(/Phân tích|Thống kê|Biểu đồ|Xu hướng/i);
  });

  test('3.11 Messages - Xem danh sách tin nhắn', async ({ page }) => {
    await page.goto('/doctor/messages');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500);
  });

  test('3.12 Messages - Click chọn cuộc hội thoại (nếu có)', async ({ page }) => {
    await page.goto('/doctor/messages');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500);

    try {
      const conversation = page.locator('div[class*="cursor-pointer"], li[class*="cursor-pointer"]').first();
      if (await conversation.isVisible({ timeout: 2000 })) {
        await conversation.click();
        await page.waitForTimeout(500);
      }
    } catch { /* optional */ }
  });

  test('3.13 Support - Xem trang hỗ trợ bác sĩ', async ({ page }) => {
    await page.goto('/doctor/support');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(300);
  });
});
