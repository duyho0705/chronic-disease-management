import { test, expect } from '@playwright/test';
import { openModal, submitModal, verifyModalVisible } from '../helpers/test-utils';

// ============================================================
//  PATIENT - DASHBOARD & NAVIGATION
// ============================================================
test.describe('@patient Dashboard & Navigation', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/patient');
    await page.waitForLoadState('domcontentloaded');
  });

  test('4.01 Dashboard bệnh nhân hiển thị tổng quan sức khỏe', async ({ page }) => {
    await expect(page.locator('body')).toContainText(/Tổng quan|Sức khỏe|Chỉ số/i);
  });

  test('4.02 Navigate qua tất cả trang Patient', async ({ page }) => {
    const pages = [
      { href: '/patient/metrics', text: 'Chỉ số' },
      { href: '/patient/appointments', text: 'Lịch hẹn' },
      { href: '/patient/prescriptions', text: 'Toa thuốc' },
      { href: '/patient/messages', text: 'Tin nhắn' },
      { href: '/patient/profile', text: 'Hồ sơ' },
      { href: '/patient/services', text: 'Gói dịch vụ' },
      { href: '/patient/support', text: 'Hỗ trợ' },
    ];

    for (const p of pages) {
      await page.goto(p.href);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(300);
    }
  });
});

// ============================================================
//  PATIENT - CHỈ SỐ SỨC KHỎE (Chức năng cốt lõi!)
// ============================================================
test.describe('@patient @health-metrics Chỉ số Sức khỏe', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/patient/metrics');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500);
  });

  test('4.03 Xem biểu đồ chỉ số sức khỏe', async ({ page }) => {
    await page.waitForTimeout(800);
    const body = page.locator('body');
    await expect(body).toContainText(/Chỉ số|Biểu đồ|Lịch sử|Huyết áp|Đường huyết/i);
  });

  test('4.04 Chuyển đổi tab thời gian (Ngày/Tuần/Tháng)', async ({ page }) => {
    const tabs = ['WEEK', 'MONTH', 'DAY'];
    for (const tab of tabs) {
      try {
        const tabTexts: Record<string, string[]> = {
          'DAY': ['Ngày', '24h', 'Hôm nay'],
          'WEEK': ['Tuần', '7 ngày'],
          'MONTH': ['Tháng', '30 ngày'],
        };
        for (const text of tabTexts[tab]) {
          const tabBtn = page.locator(`button:has-text("${text}")`).first();
          if (await tabBtn.isVisible({ timeout: 2000 })) {
            await tabBtn.click();
            await page.waitForTimeout(500);
            break;
          }
        }
      } catch { /* optional */ }
    }
  });

  test('4.05 Mở modal Nhập chỉ số → Điền Huyết áp → Submit', async ({ page }) => {
    const addBtnTexts = ['Nhập chỉ số', 'Thêm chỉ số', 'Ghi chỉ số'];
    let modalOpened = false;
    
    for (const text of addBtnTexts) {
      try {
        const btn = page.locator(`button:has-text("${text}")`).first();
        if (await btn.isVisible({ timeout: 2000 })) {
          await btn.click();
          await page.waitForTimeout(500);
          modalOpened = true;
          break;
        }
      } catch { continue; }
    }

    if (!modalOpened) {
      try {
        const metricCard = page.locator('button:has-text("Nhập"), button:has-text("Ghi nhận")').first();
        if (await metricCard.isVisible({ timeout: 2000 })) {
          await metricCard.click();
          await page.waitForTimeout(500);
          modalOpened = true;
        }
      } catch { /* optional */ }
    }

    if (modalOpened) {
      await verifyModalVisible(page, 'Nhập chỉ số sức khỏe');

      const valueInput = page.locator('input[placeholder*="120/80"], input[placeholder*="5.6"]').first();
      if (await valueInput.isVisible({ timeout: 2000 })) {
        await valueInput.click();
        await valueInput.fill('120/80');
      }

      const noteInput = page.locator('textarea[placeholder*="tình trạng"], textarea[placeholder*="Nhập"]').first();
      if (await noteInput.isVisible({ timeout: 2000 })) {
        await noteInput.fill('E2E Test - Tình trạng sức khỏe bình thường');
      }

      await submitModal(page, 'Lưu chỉ số');
      await page.waitForTimeout(1000);
    }
  });

  test('4.06 Xem lịch sử chỉ số đã nhập', async ({ page }) => {
    await page.waitForTimeout(800);
    const historySection = page.locator('text=/Lịch sử|Gần đây|Đã ghi nhận/i').first();
    if (await historySection.isVisible({ timeout: 2000 })) {
      await historySection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
    }
  });
});

// ============================================================
//  PATIENT - LỊCH HẸN
// ============================================================
test.describe('@patient @appointment Lịch hẹn', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/patient/appointments');
    await page.waitForLoadState('domcontentloaded');
  });

  test('4.07 Xem danh sách lịch hẹn khám bệnh', async ({ page }) => {
    await page.waitForTimeout(500);
  });
});

// ============================================================
//  PATIENT - TOA THUỐC, TIN NHẮN, HỒ SƠ, DỊCH VỤ
// ============================================================
test.describe('@patient Toa thuốc & Hồ sơ & Tin nhắn', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/patient');
    await page.waitForLoadState('domcontentloaded');
  });

  test('4.08 Prescriptions - Xem toa thuốc hiện tại', async ({ page }) => {
    await page.goto('/patient/prescriptions');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500);
  });

  test('4.09 Messages - Chat với bác sĩ', async ({ page }) => {
    await page.goto('/patient/messages');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500);

    try {
      const conversation = page.locator('div[class*="cursor-pointer"]').first();
      if (await conversation.isVisible({ timeout: 2000 })) {
        await conversation.click();
        await page.waitForTimeout(500);

        const msgInput = page.locator('input[placeholder*="Nhập tin nhắn"], textarea[placeholder*="Nhập tin nhắn"]').first();
        if (await msgInput.isVisible({ timeout: 2000 })) {
          await msgInput.fill('E2E Test - Tin nhắn thử nghiệm');
          await page.waitForTimeout(300);
          await msgInput.clear();
        }
      }
    } catch { /* optional */ }
  });

  test('4.10 Profile - Xem hồ sơ cá nhân', async ({ page }) => {
    await page.goto('/patient/profile');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500);
    const body = page.locator('body');
    await expect(body).toContainText(/Hồ sơ|Thông tin|Cá nhân/i);
  });

  test('4.11 Services - Xem danh mục dịch vụ y tế', async ({ page }) => {
    await page.goto('/patient/services');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500);
  });

  test('4.12 Support - Xem trang hỗ trợ', async ({ page }) => {
    await page.goto('/patient/support');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500);
  });
});
