package com.project.security;

import com.project.controller.AdminController;
import com.project.controller.DoctorAppointmentController;
import com.project.exception.GlobalExceptionHandler;
import com.project.service.*;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * KCPM-28: Test bảo mật cực đoan
 *
 * - Token giả mạo (sai secret key)
 * - Token hết hạn
 * - Token sai format (malformed)
 * - Token Patient cố truy cập Admin API
 * - Token Doctor cố truy cập Admin API
 * - Không có Authorization header
 * - Header Authorization sai format
 */
@WebMvcTest(controllers = {
        AdminController.class,
        DoctorAppointmentController.class,
        GlobalExceptionHandler.class
})
@AutoConfigureMockMvc
@DisplayName("Security Token Extreme Tests (KCPM-28)")
class SecurityTokenTest {

    @Autowired private MockMvc mockMvc;

    // Admin controller dependencies
    @MockBean private AdminDashboardService adminDashboardService;
    @MockBean private AdminClinicService adminClinicService;
    @MockBean private AdminUserService adminUserService;
    @MockBean private AdminConfigService adminConfigService;

    // Doctor controller dependencies
    @MockBean private DoctorAppointmentService doctorAppointmentService;

    private static final String ADMIN_ENDPOINT = "/api/v1/admin/dashboard";
    private static final String DOCTOR_ENDPOINT = "/api/v1/doctor/appointments";

    // Real JWT secret from application.yml
    private static final String REAL_SECRET = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";
    // A different secret to simulate forgery
    private static final String FAKE_SECRET = "AAAE635266556A586E3272357538782F413F4428472B4B6250645367566BFFFF";

    /**
     * Build a JWT token with the given parameters.
     */
    private String buildToken(String secret, String subject, long expirationMs) {
        SecretKey key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        Date now = new Date();
        return Jwts.builder()
                .setSubject(subject)
                .setIssuedAt(now)
                .setExpiration(new Date(now.getTime() + expirationMs))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // ================================================================
    // Token giả mạo (Forged Token - sai secret key)
    // ================================================================
    @Nested
    @DisplayName("Token giả mạo (Forged)")
    class ForgedTokenTests {

        @Test
        @DisplayName("TC-SEC-001: Token ký bằng secret giả → Admin 401")
        void shouldReject_ForgedToken_Admin() throws Exception {
            String forgedToken = buildToken(FAKE_SECRET, "hacker@evil.com", 86400000);

            mockMvc.perform(get(ADMIN_ENDPOINT)
                            .header("Authorization", "Bearer " + forgedToken))
                    .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("TC-SEC-002: Token ký bằng secret giả → Doctor 401")
        void shouldReject_ForgedToken_Doctor() throws Exception {
            String forgedToken = buildToken(FAKE_SECRET, "hacker@evil.com", 86400000);

            mockMvc.perform(get(DOCTOR_ENDPOINT)
                            .header("Authorization", "Bearer " + forgedToken))
                    .andExpect(status().isUnauthorized());
        }
    }

    // ================================================================
    // Token hết hạn (Expired Token)
    // ================================================================
    @Nested
    @DisplayName("Token hết hạn (Expired)")
    class ExpiredTokenTests {

        @Test
        @DisplayName("TC-SEC-003: Token hết hạn → Admin 401")
        void shouldReject_ExpiredToken_Admin() throws Exception {
            // Token expired 1 hour ago
            String expiredToken = buildToken(REAL_SECRET, "admin@mail.com", -3600000);

            mockMvc.perform(get(ADMIN_ENDPOINT)
                            .header("Authorization", "Bearer " + expiredToken))
                    .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("TC-SEC-004: Token hết hạn → Doctor 401")
        void shouldReject_ExpiredToken_Doctor() throws Exception {
            String expiredToken = buildToken(REAL_SECRET, "doc@mail.com", -3600000);

            mockMvc.perform(get(DOCTOR_ENDPOINT)
                            .header("Authorization", "Bearer " + expiredToken))
                    .andExpect(status().isUnauthorized());
        }
    }

    // ================================================================
    // Token sai format (Malformed)
    // ================================================================
    @Nested
    @DisplayName("Token sai format (Malformed)")
    class MalformedTokenTests {

        @Test
        @DisplayName("TC-SEC-005: Token ngẫu nhiên → Admin 401")
        void shouldReject_RandomString_Admin() throws Exception {
            mockMvc.perform(get(ADMIN_ENDPOINT)
                            .header("Authorization", "Bearer this-is-not-a-jwt-token"))
                    .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("TC-SEC-006: Token base64 giả → 401")
        void shouldReject_FakeBase64() throws Exception {
            mockMvc.perform(get(ADMIN_ENDPOINT)
                            .header("Authorization", "Bearer eyJhbGciOiJIUzI1NiJ9.FAKE.PAYLOAD"))
                    .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("TC-SEC-007: Token rỗng → 401")
        void shouldReject_EmptyToken() throws Exception {
            mockMvc.perform(get(ADMIN_ENDPOINT)
                            .header("Authorization", "Bearer "))
                    .andExpect(status().isUnauthorized());
        }
    }

    // ================================================================
    // Authorization Header sai format
    // ================================================================
    @Nested
    @DisplayName("Authorization header sai format")
    class BadHeaderTests {

        @Test
        @DisplayName("TC-SEC-008: Không có Authorization header → 401")
        void shouldReject_NoHeader() throws Exception {
            mockMvc.perform(get(ADMIN_ENDPOINT))
                    .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("TC-SEC-009: Header không có prefix 'Bearer ' → 401")
        void shouldReject_NoBearerPrefix() throws Exception {
            String validToken = buildToken(REAL_SECRET, "admin@mail.com", 86400000);

            mockMvc.perform(get(ADMIN_ENDPOINT)
                            .header("Authorization", "Token " + validToken))
                    .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("TC-SEC-010: Header Authorization chỉ có 'Bearer' → 401")
        void shouldReject_BearerOnly() throws Exception {
            mockMvc.perform(get(ADMIN_ENDPOINT)
                            .header("Authorization", "Bearer"))
                    .andExpect(status().isUnauthorized());
        }
    }

    // ================================================================
    // Token hợp lệ nhưng SAI ROLE (PATIENT/DOCTOR cố truy cập Admin API)
    // ================================================================
    @Nested
    @DisplayName("Token hợp lệ nhưng sai role")
    class WrongRoleTests {

        @Test
        @DisplayName("TC-SEC-011: Không có token → Doctor API 401")
        void shouldReject_NoToken_DoctorApi() throws Exception {
            mockMvc.perform(get(DOCTOR_ENDPOINT))
                    .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("TC-SEC-012: Không có token → Admin User API 401")
        void shouldReject_NoToken_AdminUserApi() throws Exception {
            mockMvc.perform(get("/api/v1/admin/users"))
                    .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("TC-SEC-013: Không có token → Admin Clinics API 401")
        void shouldReject_NoToken_AdminClinicApi() throws Exception {
            mockMvc.perform(get("/api/v1/admin/clinics"))
                    .andExpect(status().isUnauthorized());
        }
    }

    // ================================================================
    // Token Tampering (Sửa đổi payload)
    // ================================================================
    @Nested
    @DisplayName("Token bị sửa đổi payload (Tampering)")
    class TamperingTests {

        @Test
        @DisplayName("TC-SEC-014: Sửa payload phần giữa của JWT → 401")
        void shouldReject_TamperedPayload() throws Exception {
            String validToken = buildToken(REAL_SECRET, "admin@mail.com", 86400000);
            // Tamper with the payload part (second segment)
            String[] parts = validToken.split("\\.");
            if (parts.length == 3) {
                // Modify a character in the payload
                String tamperedPayload = parts[1].substring(0, parts[1].length() - 2) + "XX";
                String tamperedToken = parts[0] + "." + tamperedPayload + "." + parts[2];

                mockMvc.perform(get(ADMIN_ENDPOINT)
                                .header("Authorization", "Bearer " + tamperedToken))
                        .andExpect(status().isUnauthorized());
            }
        }

        @Test
        @DisplayName("TC-SEC-015: Xóa signature của JWT → 401")
        void shouldReject_NoSignature() throws Exception {
            String validToken = buildToken(REAL_SECRET, "admin@mail.com", 86400000);
            String[] parts = validToken.split("\\.");
            String unsignedToken = parts[0] + "." + parts[1] + ".";

            mockMvc.perform(get(ADMIN_ENDPOINT)
                            .header("Authorization", "Bearer " + unsignedToken))
                    .andExpect(status().isUnauthorized());
        }
    }

    // ================================================================
    // SQL Injection / XSS trên Authorization header
    // ================================================================
    @Nested
    @DisplayName("Injection attacks trên header")
    class InjectionTests {

        @Test
        @DisplayName("TC-SEC-016: SQL Injection trong Authorization → 401")
        void shouldReject_SQLInjection() throws Exception {
            mockMvc.perform(get(ADMIN_ENDPOINT)
                            .header("Authorization", "Bearer ' OR '1'='1"))
                    .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("TC-SEC-017: XSS trong Authorization → 401")
        void shouldReject_XSSInHeader() throws Exception {
            mockMvc.perform(get(ADMIN_ENDPOINT)
                            .header("Authorization", "Bearer <script>alert('xss')</script>"))
                    .andExpect(status().isUnauthorized());
        }
    }
}

