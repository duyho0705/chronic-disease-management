# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: roles-automation.spec.ts >> Chronic Disease Management - Multi-Role E2E Automation Suite >> ROLE 1: SYSTEM ADMIN - Full System Management Flow
- Location: e2e\roles-automation.spec.ts:6:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.goto: Test timeout of 30000ms exceeded.
Call log:
  - navigating to "http://localhost:5173/login", waiting until "load"

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e8]:
    - link "DamDiep Logo" [ref=e9] [cursor=pointer]:
      - /url: /
      - img "DamDiep Logo" [ref=e10]
    - generic [ref=e11]:
      - generic [ref=e12]:
        - heading "Nền Tảng Quản Lý Bệnh Nhân Trực Tuyến" [level=1] [ref=e13]:
          - text: Nền Tảng Quản Lý
          - text: Bệnh Nhân Trực Tuyến
        - paragraph [ref=e14]: Giải pháp số hóa quy trình chăm sóc sức khỏe toàn diện cho các phòng khám và bệnh viện trên toàn quốc.
      - generic [ref=e15]:
        - generic [ref=e16]:
          - generic [ref=e18]: verified_user
          - generic [ref=e19]: Bảo mật chuẩn ISO 27001 & HIPAA
        - generic [ref=e20]:
          - generic [ref=e22]: monitoring
          - generic [ref=e23]: Theo dõi chỉ số sinh tồn thời gian thực
        - generic [ref=e24]:
          - generic [ref=e26]: devices
          - generic [ref=e27]: Hoạt động đa nền tảng, mọi thiết bị
    - generic [ref=e28]:
      - generic [ref=e29]:
        - paragraph [ref=e30]: 100+
        - paragraph [ref=e31]: Phòng khám
      - generic [ref=e33]:
        - paragraph [ref=e34]: 50K+
        - paragraph [ref=e35]: Bệnh nhân
      - generic [ref=e37]:
        - paragraph [ref=e38]: 99.9%
        - paragraph [ref=e39]: Uptime
  - generic [ref=e41]:
    - generic [ref=e42]:
      - heading "Đăng nhập" [level=2] [ref=e43]
      - paragraph [ref=e44]: Chào mừng trở lại! Vui lòng nhập thông tin tài khoản.
    - generic [ref=e45]:
      - generic [ref=e46]:
        - text: Email / Tên đăng nhập
        - generic [ref=e47]:
          - generic [ref=e48]: mail
          - textbox "email@phongkham.vn" [ref=e49]
      - generic [ref=e50]:
        - generic [ref=e51]:
          - generic [ref=e52]: Mật khẩu
          - button "Quên mật khẩu?" [ref=e53] [cursor=pointer]
        - generic [ref=e54]:
          - generic [ref=e55]: lock
          - textbox "••••••••" [ref=e56]
          - button "visibility" [ref=e57] [cursor=pointer]:
            - generic [ref=e58]: visibility
      - button "Đăng nhập arrow_forward" [ref=e60] [cursor=pointer]:
        - text: Đăng nhập
        - generic [ref=e61]: arrow_forward
    - generic [ref=e64]: hoặc
    - generic [ref=e66]:
      - link "arrow_back Quay về trang chủ DamDiep" [ref=e67] [cursor=pointer]:
        - /url: /
        - generic [ref=e68]: arrow_back
        - text: Quay về trang chủ DamDiep
      - paragraph [ref=e69]:
        - text: Bằng việc đăng nhập, bạn đồng ý với
        - link "Điều khoản dịch vụ" [ref=e70] [cursor=pointer]:
          - /url: "#"
        - text: và
        - link "Chính sách bảo mật" [ref=e71] [cursor=pointer]:
          - /url: "#"
        - text: của DamDiep.
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Chronic Disease Management - Multi-Role E2E Automation Suite', () => {
  4  | 
  5  |   // 1. SYSTEM ADMIN ROLE TEST
  6  |   test('ROLE 1: SYSTEM ADMIN - Full System Management Flow', async ({ page }) => {
> 7  |     await page.goto('/login');
     |                ^ Error: page.goto: Test timeout of 30000ms exceeded.
  8  |     await page.waitForLoadState('networkidle');
  9  | 
  10 |     await page.fill('input[name="email"], input[type="email"]', 'admin.dev@care.com');
  11 |     await page.fill('input[type="password"]', 'password');
  12 |     await page.click('button[type="submit"]');
  13 | 
  14 |     // Expect Admin Dashboard
  15 |     await page.waitForURL('**/admin**', { timeout: 10000 });
  16 |     await expect(page.locator('body')).toContainText(/Tổng quan|Dashboard|Quản trị|Báo cáo/i);
  17 | 
  18 |     // Test Admin Clinics Navigation
  19 |     await page.click('a[href*="/admin/clinics"], nav a:has-text("Phòng khám")');
  20 |     await page.waitForURL('**/admin/clinics');
  21 |     await expect(page.locator('body')).toContainText(/Danh sách phòng khám|Quản lý phòng khám/i);
  22 | 
  23 |     // Test Admin Users Navigation
  24 |     await page.click('a[href*="/admin/users"], nav a:has-text("Người dùng")');
  25 |     await page.waitForURL('**/admin/users');
  26 |     await expect(page.locator('body')).toContainText(/Quản lý tài khoản|Danh sách người dùng/i);
  27 | 
  28 |     // Test Admin Services Navigation
  29 |     await page.click('a[href*="/admin/services"], nav a:has-text("Dịch vụ")');
  30 |     await page.waitForURL('**/admin/services');
  31 |     await expect(page.locator('body')).toContainText(/Quản lý dịch vụ|Gói khám/i);
  32 | 
  33 |     // Test Admin Audit Logs Navigation
  34 |     await page.click('a[href*="/admin/audit-logs"], nav a:has-text("Nhật ký")');
  35 |     await page.waitForURL('**/admin/audit-logs');
  36 |     await expect(page.locator('body')).toContainText(/Nhật ký hệ thống/i);
  37 | 
  38 |     console.log('✅ ROLE 1: SYSTEM ADMIN E2E TEST PASSED CLEANLY!');
  39 |   });
  40 | 
  41 |   // 2. CLINIC MANAGER ROLE TEST
  42 |   test('ROLE 2: CLINIC MANAGER - Clinic Operation Flow', async ({ page }) => {
  43 |     await page.goto('/login');
  44 |     await page.waitForLoadState('networkidle');
  45 | 
  46 |     await page.fill('input[name="email"], input[type="email"]', 'manager@care.com');
  47 |     await page.fill('input[type="password"]', 'password');
  48 |     await page.click('button[type="submit"]');
  49 | 
  50 |     await page.waitForURL('**/clinic**', { timeout: 10000 });
  51 |     await expect(page.locator('body')).toContainText(/Tổng quan|Cơ sở|Phòng khám/i);
  52 | 
  53 |     // Navigate Clinic Services
  54 |     await page.click('a[href*="/clinic/services"], nav a:has-text("Dịch vụ")');
  55 |     await page.waitForURL('**/clinic/services');
  56 |     await expect(page.locator('body')).toContainText(/Dịch vụ tại Cơ sở|Bảng giá|Danh mục/i);
  57 | 
  58 |     console.log('✅ ROLE 2: CLINIC MANAGER E2E TEST PASSED CLEANLY!');
  59 |   });
  60 | 
  61 |   // 3. DOCTOR ROLE TEST
  62 |   test('ROLE 3: DOCTOR - Medical Management Flow', async ({ page }) => {
  63 |     await page.goto('/login');
  64 |     await page.waitForLoadState('networkidle');
  65 | 
  66 |     await page.fill('input[name="email"], input[type="email"]', 'mai.le@care.com');
  67 |     await page.fill('input[type="password"]', 'password');
  68 |     await page.click('button[type="submit"]');
  69 | 
  70 |     await page.waitForURL('**/doctor**', { timeout: 10000 });
  71 |     await expect(page.locator('body')).toContainText(/Bác sĩ|Lịch khám|Bệnh nhân|Tổng quan/i);
  72 | 
  73 |     console.log('✅ ROLE 3: DOCTOR E2E TEST PASSED CLEANLY!');
  74 |   });
  75 | 
  76 |   // 4. PATIENT ROLE TEST
  77 |   test('ROLE 4: PATIENT - Health Portal Flow', async ({ page }) => {
  78 |     await page.goto('/login');
  79 |     await page.waitForLoadState('networkidle');
  80 | 
  81 |     await page.fill('input[name="email"], input[type="email"]', 'truongquocan@patient.com');
  82 |     await page.fill('input[type="password"]', 'password');
  83 |     await page.click('button[type="submit"]');
  84 | 
  85 |     await page.waitForURL('**/patient**', { timeout: 10000 });
  86 |     await expect(page.locator('body')).toContainText(/Sức khỏe|Lịch hẹn|Bệnh nhân|Tổng quan/i);
  87 | 
  88 |     console.log('✅ ROLE 4: PATIENT E2E TEST PASSED CLEANLY!');
  89 |   });
  90 | 
  91 | });
  92 | 
```