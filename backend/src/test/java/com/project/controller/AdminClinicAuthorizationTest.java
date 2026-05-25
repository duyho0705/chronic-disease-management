package com.project.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.dto.request.CreateDoctorRequest;
import com.project.dto.request.CreatePatientRequest;
import com.project.exception.GlobalExceptionHandler;
import com.project.security.CustomUserDetailsService;
import com.project.security.JwtTokenProvider;
import com.project.security.SecurityService;
import com.project.service.AdminClinicService;
import com.project.service.AdminConfigService;
import com.project.service.AdminDashboardService;
import com.project.service.AdminUserService;
import com.project.service.ClinicDashboardService;
import com.project.service.ClinicDoctorService;
import com.project.service.ClinicPatientService;
import com.project.service.PatientHealthMetricService;

/**
 * KCPM-24: Test kịch bản bắt lỗi và phân quyền Admin vs User
 *
 * Clinic endpoints: chỉ CLINIC_MANAGER (hoặc ADMIN) truy cập
 * Admin endpoints: chỉ ADMIN truy cập
 */
@WebMvcTest(controllers = {
        ClinicDashboardController.class,
        AdminController.class,
        GlobalExceptionHandler.class
})
@AutoConfigureMockMvc
@SuppressWarnings("null")
@DisplayName("Admin/Clinic Authorization & Error Tests (KCPM-24)")
class AdminClinicAuthorizationTest {

    @Autowired
    private MockMvc mockMvc;
    @org.springframework.boot.test.mock.mockito.MockBean
    private JwtTokenProvider jwtTokenProvider;
    @org.springframework.boot.test.mock.mockito.MockBean
    private CustomUserDetailsService customUserDetailsService;

    @Autowired
    private ObjectMapper objectMapper;

    // Clinic mocks
    @MockBean
    private ClinicDashboardService clinicDashboardService;
    @MockBean
    private ClinicPatientService clinicPatientService;
    @MockBean
    private ClinicDoctorService clinicDoctorService;
    @MockBean
    private PatientHealthMetricService healthMetricService;
    @MockBean
    private SecurityService securityService;

    // Admin mocks
    @MockBean
    private AdminDashboardService adminDashboardService;
    @MockBean
    private AdminClinicService adminClinicService;
    @MockBean
    private AdminUserService adminUserService;
    @MockBean
    private AdminConfigService adminConfigService;

    // ================================================================
    // 401 UNAUTHORIZED
    // ================================================================
    @Nested
    @DisplayName("401 Unauthorized - Chưa đăng nhập")
    class UnauthorizedTests {

        @Test
        @DisplayName("TC-ACA-001: GET /admin/dashboard → 401")
        void shouldReturn401_AdminDashboard() throws Exception {
            mockMvc.perform(get("/api/v1/admin/dashboard"))
                    .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("TC-ACA-002: GET /clinics/100/dashboard → 401")
        void shouldReturn401_ClinicDashboard() throws Exception {
            mockMvc.perform(get("/api/v1/clinics/100/dashboard"))
                    .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("TC-ACA-003: POST /admin/users → 401")
        void shouldReturn401_AdminCreateUser() throws Exception {
            mockMvc.perform(post("/api/v1/admin/users").with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("{}"))
                    .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("TC-ACA-004: DELETE /admin/users/1 → 401")
        void shouldReturn401_AdminDeleteUser() throws Exception {
            mockMvc.perform(delete("/api/v1/admin/users/1").with(csrf()))
                    .andExpect(status().isUnauthorized());
        }
    }

    // ================================================================
    // 403 FORBIDDEN — PATIENT truy cập Admin endpoints
    // ================================================================
    @Nested
    @DisplayName("403 Forbidden - PATIENT truy cập Admin endpoints")
    class PatientAccessAdminTests {

        @Test
        @DisplayName("TC-ACA-005: PATIENT GET /admin/dashboard → 403")
        @WithMockUser(roles = "PATIENT")
        void shouldReturn403_PatientAccessAdminDashboard() throws Exception {
            mockMvc.perform(get("/api/v1/admin/dashboard"))
                    .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName("TC-ACA-006: PATIENT GET /admin/clinics → 403")
        @WithMockUser(roles = "PATIENT")
        void shouldReturn403_PatientAccessAdminClinics() throws Exception {
            mockMvc.perform(get("/api/v1/admin/clinics"))
                    .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName("TC-ACA-007: PATIENT GET /admin/users → 403")
        @WithMockUser(roles = "PATIENT")
        void shouldReturn403_PatientAccessAdminUsers() throws Exception {
            mockMvc.perform(get("/api/v1/admin/users"))
                    .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName("TC-ACA-008: PATIENT DELETE /admin/users/1 → 403")
        @WithMockUser(roles = "PATIENT")
        void shouldReturn403_PatientDeleteUser() throws Exception {
            mockMvc.perform(delete("/api/v1/admin/users/1").with(csrf()))
                    .andExpect(status().isForbidden());
        }
    }

    // ================================================================
    // 403 FORBIDDEN — DOCTOR truy cập Admin endpoints
    // ================================================================
    @Nested
    @DisplayName("403 Forbidden - DOCTOR truy cập Admin endpoints")
    class DoctorAccessAdminTests {

        @Test
        @DisplayName("TC-ACA-009: DOCTOR GET /admin/dashboard → 403")
        @WithMockUser(roles = "DOCTOR")
        void shouldReturn403_DoctorAccessAdminDashboard() throws Exception {
            mockMvc.perform(get("/api/v1/admin/dashboard"))
                    .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName("TC-ACA-010: DOCTOR POST /admin/clinics → 403")
        @WithMockUser(roles = "DOCTOR")
        void shouldReturn403_DoctorCreateClinic() throws Exception {
            mockMvc.perform(post("/api/v1/admin/clinics").with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("{}"))
                    .andExpect(status().isForbidden());
        }
    }

    // ================================================================
    // 403 FORBIDDEN — PATIENT truy cập Clinic endpoints
    // ================================================================
    @Nested
    @DisplayName("403 Forbidden - PATIENT truy cập Clinic endpoints")
    class PatientAccessClinicTests {

        @Test
        @DisplayName("TC-ACA-011: PATIENT GET /clinics/100/dashboard → 403")
        @WithMockUser(roles = "PATIENT")
        void shouldReturn403_PatientAccessClinicDashboard() throws Exception {
            when(securityService.isClinicManagerOf(100L)).thenReturn(false);

            mockMvc.perform(get("/api/v1/clinics/100/dashboard"))
                    .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName("TC-ACA-012: PATIENT POST /clinics/100/patients → 403")
        @WithMockUser(roles = "PATIENT")
        void shouldReturn403_PatientCreatePatient() throws Exception {
            when(securityService.isClinicManagerOf(100L)).thenReturn(false);
            when(securityService.isDoctorOfClinic(100L)).thenReturn(false);
            CreatePatientRequest req = new CreatePatientRequest();
            req.setName("Test");
            req.setPhone("0912345678");
            req.setGender("Nam");

            mockMvc.perform(post("/api/v1/clinics/100/patients").with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(req)))
                    .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName("TC-ACA-013: PATIENT DELETE /clinics/100/doctors/20 → 403")
        @WithMockUser(roles = "PATIENT")
        void shouldReturn403_PatientDeleteDoctor() throws Exception {
            when(securityService.isClinicManagerOf(100L)).thenReturn(false);

            mockMvc.perform(delete("/api/v1/clinics/100/doctors/20").with(csrf()))
                    .andExpect(status().isForbidden());
        }
    }

    // ================================================================
    // 403 FORBIDDEN — CLINIC_MANAGER khác phòng khám
    // ================================================================
    @Nested
    @DisplayName("403 Forbidden - CLINIC_MANAGER khác phòng khám")
    class OtherClinicManagerTests {

        @Test
        @DisplayName("TC-ACA-014: CLINIC_MANAGER phòng khám A truy cập phòng khám B → 403")
        @WithMockUser(roles = "CLINIC_MANAGER")
        void shouldReturn403_OtherClinicManager() throws Exception {
            when(securityService.isClinicManagerOf(100L)).thenReturn(false); // Not manager of clinic 100

            mockMvc.perform(get("/api/v1/clinics/100/dashboard"))
                    .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName("TC-ACA-015: CLINIC_MANAGER phòng khám A xóa bệnh nhân phòng khám B → 403")
        @WithMockUser(roles = "CLINIC_MANAGER")
        void shouldReturn403_OtherClinicDeletePatient() throws Exception {
            when(securityService.isClinicManagerOf(100L)).thenReturn(false);

            mockMvc.perform(delete("/api/v1/clinics/100/patients/10").with(csrf()))
                    .andExpect(status().isForbidden());
        }
    }

    // ================================================================
    // 400 BAD REQUEST — Validation trên Admin
    // ================================================================
    @Nested
    @DisplayName("400 Bad Request - Admin validation")
    class AdminValidationTests {

        @Test
        @DisplayName("TC-ACA-016: POST /admin/clinics thiếu trường bắt buộc → 400")
        @WithMockUser(roles = "ADMIN")
        void shouldReturn400_CreateClinicMissingFields() throws Exception {
            mockMvc.perform(post("/api/v1/admin/clinics").with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("{}"))
                    .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("TC-ACA-017: POST /admin/users thiếu trường bắt buộc → 400")
        @WithMockUser(roles = "ADMIN")
        void shouldReturn400_CreateUserMissingFields() throws Exception {
            mockMvc.perform(post("/api/v1/admin/users").with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("{}"))
                    .andExpect(status().isBadRequest());
        }
    }

    // ================================================================
    // 400 BAD REQUEST — Validation trên Clinic
    // ================================================================
    @Nested
    @DisplayName("400 Bad Request - Clinic validation")
    class ClinicValidationTests {

        @Test
        @DisplayName("TC-ACA-018: POST /clinics/100/doctors thiếu email → 400")
        @WithMockUser(roles = "CLINIC_MANAGER")
        void shouldReturn400_CreateDoctorMissingEmail() throws Exception {
            when(securityService.isClinicManagerOf(100L)).thenReturn(true);
            CreateDoctorRequest req = new CreateDoctorRequest();
            req.setName("BS. X");
            req.setEmail(""); // blank
            req.setPhone("0912345678");
            req.setSpecialty("Nội");
            req.setLicenseNumber("LN");

            mockMvc.perform(post("/api/v1/clinics/100/doctors").with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(req)))
                    .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("TC-ACA-019: POST /clinics/100/patients thiếu phone → 400")
        @WithMockUser(roles = "CLINIC_MANAGER")
        void shouldReturn400_CreatePatientMissingPhone() throws Exception {
            when(securityService.isClinicManagerOf(100L)).thenReturn(true);
            when(securityService.isDoctorOfClinic(100L)).thenReturn(false);
            CreatePatientRequest req = new CreatePatientRequest();
            req.setName("Test");
            req.setPhone(""); // blank
            req.setGender("Nam");

            mockMvc.perform(post("/api/v1/clinics/100/patients").with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(req)))
                    .andExpect(status().isBadRequest());
        }
    }

    // ================================================================
    // 500 INTERNAL SERVER ERROR
    // ================================================================
    @Nested
    @DisplayName("500 Internal Server Error")
    class ServerErrorTests {

        @Test
        @DisplayName("TC-ACA-020: RuntimeException trên Admin dashboard")
        @WithMockUser(roles = "ADMIN")
        void shouldReturn500_AdminDashboardFails() throws Exception {
            when(adminDashboardService.getDashboardData(any(), any()))
                    .thenThrow(new RuntimeException("DB down"));

            mockMvc.perform(get("/api/v1/admin/dashboard"))
                    .andExpect(status().isInternalServerError());
        }

        @Test
        @DisplayName("TC-ACA-021: RuntimeException khi xóa bệnh nhân phòng khám")
        @WithMockUser(roles = "CLINIC_MANAGER")
        void shouldReturn500_ClinicDeleteFails() throws Exception {
            when(securityService.isClinicManagerOf(100L)).thenReturn(true);
            doThrow(new RuntimeException("Không tìm thấy bệnh nhân"))
                    .when(clinicPatientService).deletePatient(100L, 999L);

            mockMvc.perform(delete("/api/v1/clinics/100/patients/999").with(csrf()))
                    .andExpect(status().isInternalServerError());
        }
    }
}
