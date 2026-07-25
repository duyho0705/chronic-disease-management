import { Page, expect } from '@playwright/test';

// ============================================================
// LOGIN HELPER
// ============================================================
export async function login(page: Page, email: string, password: string = 'password') {
  await page.goto('/login');
  await page.waitForLoadState('domcontentloaded');
  await page.fill('input[name="email"], input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');
}

// ============================================================
// ACCOUNTS
// ============================================================
export const ACCOUNTS = {
  ADMIN: 'admin.dev@care.com',
  CLINIC_MANAGER: 'manager@care.com',
  DOCTOR: 'mai.le@care.com',
  PATIENT: 'truongquocan@patient.com',
};

// ============================================================
// FILL INPUT HELPER - Tự động điền input theo name attribute
// ============================================================
export async function fillInput(page: Page, nameAttr: string, value: string) {
  const input = page.locator(`input[name="${nameAttr}"]`);
  await input.waitFor({ state: 'visible', timeout: 5000 });
  await input.click();
  await input.fill(value);
}

// ============================================================
// FILL FORM HELPER - Điền nhiều fields cùng lúc
// ============================================================
export async function fillForm(page: Page, fields: Record<string, string>) {
  for (const [name, value] of Object.entries(fields)) {
    try {
      const input = page.locator(`input[name="${name}"], textarea[name="${name}"]`).first();
      if (await input.isVisible({ timeout: 2000 })) {
        await input.click();
        await input.fill(value);
      }
    } catch {
      // Field not found, skip
    }
  }
}

// ============================================================
// FILL INPUT BY PLACEHOLDER
// ============================================================
export async function fillByPlaceholder(page: Page, placeholder: string, value: string) {
  const input = page.locator(`input[placeholder*="${placeholder}"], textarea[placeholder*="${placeholder}"]`).first();
  if (await input.isVisible({ timeout: 3000 })) {
    await input.click();
    await input.fill(value);
  }
}

// ============================================================
// SELECT CUSTOM DROPDOWN (Dropdown component tùy chỉnh)
// ============================================================
export async function selectDropdown(page: Page, container: string, optionText: string) {
  // Click the dropdown trigger button within the container
  const dropdownTrigger = page.locator(container).locator('button, [role="button"], div[class*="cursor-pointer"]').first();
  await dropdownTrigger.click();
  await page.waitForTimeout(300);

  // Click the option
  const option = page.locator(`text="${optionText}"`).last();
  if (await option.isVisible({ timeout: 2000 })) {
    await option.click();
    await page.waitForTimeout(200);
  }
}

// ============================================================
// WAIT FOR TOAST / NOTIFICATION
// ============================================================
export async function waitForToast(page: Page, textPattern?: RegExp | string) {
  try {
    const toastSelector = '[class*="toast"], [class*="Toast"], [role="alert"], [class*="notification"]';
    const toast = page.locator(toastSelector).first();
    await toast.waitFor({ state: 'visible', timeout: 8000 });

    if (textPattern) {
      if (typeof textPattern === 'string') {
        await expect(toast).toContainText(textPattern, { timeout: 5000 });
      } else {
        await expect(toast).toContainText(textPattern, { timeout: 5000 });
      }
    }
    return true;
  } catch {
    return false;
  }
}

// ============================================================
// NAVIGATE TO SIDEBAR LINK
// ============================================================
export async function navigateTo(page: Page, href: string, menuText?: string) {
  try {
    const hrefLink = page.locator(`a[href*="${href}"]`).first();
    if (await hrefLink.isVisible({ timeout: 3000 })) {
      await hrefLink.click();
      await page.waitForLoadState('domcontentloaded');
      return;
    }
  } catch { /* fallback */ }

  if (menuText) {
    const link = page.locator(`a:has-text("${menuText}")`).first();
    if (await link.isVisible({ timeout: 2000 })) {
      await link.click();
      await page.waitForLoadState('domcontentloaded');
      return;
    }
  }
  await page.goto(href);
  await page.waitForLoadState('domcontentloaded');
}

// ============================================================
// SEARCH HELPER - Tìm kiếm và kiểm tra kết quả
// ============================================================
export async function searchAndVerify(page: Page, searchText: string) {
  const search = page.locator('input[placeholder*="Tìm"], input[placeholder*="tìm"], input[type="search"]').first();
  if (await search.isVisible({ timeout: 3000 })) {
    await search.click();
    await search.fill(searchText);
    await page.waitForTimeout(800); // Debounce
    return true;
  }
  return false;
}

// ============================================================
// CLEAR SEARCH
// ============================================================
export async function clearSearch(page: Page) {
  const search = page.locator('input[placeholder*="Tìm"], input[placeholder*="tìm"], input[type="search"]').first();
  if (await search.isVisible({ timeout: 2000 })) {
    await search.clear();
    await page.waitForTimeout(500);
  }
}

// ============================================================
// OPEN MODAL BY BUTTON TEXT
// ============================================================
export async function openModal(page: Page, buttonText: string) {
  const btn = page.locator(`button:has-text("${buttonText}")`).first();
  await btn.waitFor({ state: 'visible', timeout: 8000 });
  await btn.click();
  await page.waitForTimeout(500); // Wait for animation
}

// ============================================================
// CLOSE MODAL
// ============================================================
export async function closeModal(page: Page) {
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
}

// ============================================================
// SUBMIT MODAL (Click button save/submit in modal)
// ============================================================
export async function submitModal(page: Page, buttonText?: string) {
  if (buttonText) {
    const btn = page.locator(`button:has-text("${buttonText}")`).first();
    if (await btn.isVisible({ timeout: 3000 })) {
      await btn.click();
      return;
    }
  }
  
  // Try common submit buttons
  const submitTexts = ['Xác nhận thêm', 'Kích hoạt dịch vụ', 'Lưu thay đổi', 'Lưu chỉ số', 'Lưu', 'Tạo mới', 'Xác nhận', 'Thêm', 'Cập nhật', 'Hoàn tất'];
  for (const text of submitTexts) {
    const btn = page.locator(`button:has-text("${text}")`).first();
    if (await btn.isVisible({ timeout: 1000 })) {
      await btn.click();
      return;
    }
  }
}

// ============================================================
// VERIFY MODAL VISIBLE
// ============================================================
export async function verifyModalVisible(page: Page, titleText?: string) {
  const modal = page.locator('[role="dialog"], .fixed.inset-0, div[class*="fixed inset-0"], form').first();
  await expect(modal).toBeVisible({ timeout: 8000 });

  if (titleText) {
    await expect(page.locator(`text="${titleText}"`).first()).toBeVisible({ timeout: 5000 });
  }
}

// ============================================================
// VERIFY VALIDATION ERROR
// ============================================================
export async function verifyValidationError(page: Page, errorText: string) {
  const errorEl = page.locator(`text="${errorText}"`).first();
  await expect(errorEl).toBeVisible({ timeout: 3000 });
}

// ============================================================
// RANDOM TEST DATA
// ============================================================
const timestamp = () => Date.now().toString().slice(-6);

export function testData() {
  const ts = timestamp();
  return {
    clinicName: `E2E Phòng khám Test ${ts}`,
    clinicAddress: `123 Đường Test, Q.1, TP.HCM`,
    clinicPhone: `0912${ts}`,
    userName: `E2E User ${ts}`,
    userEmail: `e2e.test.${ts}@care.com`,
    userPhone: `0987${ts}`,
    userPassword: 'Test@123456',
    doctorName: `E2E BS. Nguyễn ${ts}`,
    doctorEmail: `e2e.doctor.${ts}@care.com`,
    doctorPhone: `0956${ts}`,
    doctorLicense: `CCHN${ts}`,
    patientName: `E2E BN. Trần ${ts}`,
    patientEmail: `e2e.patient.${ts}@care.com`,
    patientPhone: `0934${ts}`,
    patientAge: '45',
    serviceName: `E2E Dịch vụ ${ts}`,
    servicePrice: '500000',
    serviceDuration: '12 tháng',
  };
}

// ============================================================
// SCROLL TO ELEMENT
// ============================================================
export async function scrollToElement(page: Page, selector: string) {
  const el = page.locator(selector).first();
  if (await el.isVisible({ timeout: 3000 })) {
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
  }
}
