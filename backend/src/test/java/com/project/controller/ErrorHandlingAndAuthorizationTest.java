package com.project.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.dto.request.CreateAppointmentRequest;
import com.project.dto.request.EmergencyContactRequest;
import com.project.dto.request.UpdatePatientProfileRequest;
import com.project.exception.GlobalExceptionHandler;
import com.project.exception.ResourceNotFoundException;
import com.project.service.PatientAppointmentService;
import com.project.service.PatientProfileService;
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
import com.project.security.JwtTokenProvider;
import com.project.security.CustomUserDetailsService;

import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * KCPM-16: Test các kịch bản bắt lỗi và phân quyền
 *
 * Kiểm thử các trường hợp:
 * - 400 Bad Request: Validation errors (thiếu field, sai format)
 * - 401 Unauthorized: Chưa đăng nhập
 * - 403 Forbidden: Sai role (Doctor/Admin truy cập endpoint Patient)
 * - 404 Not Found: Resource không tồn tại
 * - 500 Internal Server Error: RuntimeException từ service
 */
@SuppressWarnings("null")
@WebMvcTest(controllers = {
        PatientProfileController.class,
        PatientAppointmentController.class,
        GlobalExceptionHandler.class
})
@AutoConfigureMockMvc
@DisplayName("Error Handling & Authorization Tests (KCPM-16)")
class ErrorHandlingAndAuthorizationTest {

    @Autowired
    private MockMvc mockMvc;
    @org.springframework.boot.test.mock.mockito.MockBean
    private JwtTokenProvider jwtTokenProvider;
    @org.springframework.boot.test.mock.mockito.MockBean
    private CustomUserDetailsService customUserDetailsService;


    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private PatientProfileService profileService;

    @MockBean
    private PatientAppointmentService appointmentService;

    // ================================================================
    // 401 UNAUTHORIZED — Chưa đăng nhập
    // ================================================================
    @Nested
    @DisplayName("401 Unauthorized - Chưa đăng nhập")
    class UnauthorizedTests {

        @Test
        @DisplayName("TC-ERR-001: GET /profile → 401 khi chưa đăng nhập")
        void shouldReturn401WhenNotAuthenticated_GetProfile() throws Exception {
            mockMvc.perform(get("/api/v1/patient/profile"))
                    .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("TC-ERR-002: POST /appointments → 401 khi chưa đăng nhập")
        void shouldReturn401WhenNotAuthenticated_CreateAppointment() throws Exception {
            CreateAppointmentRequest request = CreateAppointmentRequest.builder()
                    .doctorId(1L).appointmentTime(LocalDateTime.now().plusDays(1))
                    .appointmentType("IN_PERSON").build();

            mockMvc.perform(post("/api/v1/patient/appointments").with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("TC-ERR-003: PUT /profile → 401 khi chưa đăng nhập")
        void shouldReturn401WhenNotAuthenticated_UpdateProfile() throws Exception {
            UpdatePatientProfileRequest request = UpdatePatientProfileRequest.builder()
                    .fullName("Test").build();

            mockMvc.perform(put("/api/v1/patient/profile").with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isUnauthorized());
        }
    }

    // ================================================================
    // 403 FORBIDDEN — Sai role (Phân quyền)
    // ================================================================
    @Nested
    @DisplayName("403 Forbidden - Sai vai trò (Phân quyền)")
    class ForbiddenTests {

        @Test
        @DisplayName("TC-ERR-004: DOCTOR không được truy cập GET /patient/profile")
        @WithMockUser(roles = "DOCTOR")
        void shouldReturn403WhenDoctorAccessPatientProfile() throws Exception {
            mockMvc.perform(get("/api/v1/patient/profile"))
                    .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName("TC-ERR-005: ADMIN không được truy cập POST /patient/appointments")
        @WithMockUser(roles = "ADMIN")
        void shouldReturn403WhenAdminCreatePatientAppointment() throws Exception {
            CreateAppointmentRequest request = CreateAppointmentRequest.builder()
                    .doctorId(1L).appointmentTime(LocalDateTime.now().plusDays(1))
                    .appointmentType("IN_PERSON").build();

            mockMvc.perform(post("/api/v1/patient/appointments").with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName("TC-ERR-006: CLINIC_MANAGER không được truy cập PUT /patient/profile")
        @WithMockUser(roles = "CLINIC_MANAGER")
        void shouldReturn403WhenClinicManagerUpdatePatientProfile() throws Exception {
            UpdatePatientProfileRequest request = UpdatePatientProfileRequest.builder()
                    .fullName("Hacked Name").build();

            mockMvc.perform(put("/api/v1/patient/profile").with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName("TC-ERR-007: DOCTOR không được hủy lịch hẹn của bệnh nhân")
        @WithMockUser(roles = "DOCTOR")
        void shouldReturn403WhenDoctorCancelPatientAppointment() throws Exception {
            mockMvc.perform(put("/api/v1/patient/appointments/1/cancel").with(csrf()))
                    .andExpect(status().isForbidden());
        }
    }

    // ================================================================
    // 400 BAD REQUEST — Validation Errors
    // ================================================================
    @Nested
    @DisplayName("400 Bad Request - Lỗi xác thực dữ liệu")
    class ValidationTests {

        @Test
        @DisplayName("TC-ERR-008: Tạo lịch hẹn thiếu tất cả các trường bắt buộc")
        @WithMockUser(roles = "PATIENT")
        void shouldReturn400WhenAllFieldsMissing() throws Exception {
            // Empty request body → multiple @NotNull / @NotBlank violations
            mockMvc.perform(post("/api/v1/patient/appointments").with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{}"))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.success").value(false));
        }

        @Test
        @DisplayName("TC-ERR-009: Cập nhật hồ sơ với phone sai định dạng")
        @WithMockUser(roles = "PATIENT")
        void shouldReturn400WhenPhoneInvalid() throws Exception {
            UpdatePatientProfileRequest request = UpdatePatientProfileRequest.builder()
                    .fullName("Nguyễn Văn A")
                    .phone("abc-invalid-phone")  // violates @Pattern
                    .build();

            mockMvc.perform(put("/api/v1/patient/profile").with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.success").value(false));
        }

        @Test
        @DisplayName("TC-ERR-010: Thêm liên hệ khẩn cấp thiếu tất cả trường bắt buộc")
        @WithMockUser(roles = "PATIENT")
        void shouldReturn400WhenEmergencyContactFieldsMissing() throws Exception {
            mockMvc.perform(post("/api/v1/patient/profile/emergency-contacts").with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{}"))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.success").value(false));
        }

        @Test
        @DisplayName("TC-ERR-011: Cập nhật hồ sơ với fullName quá dài (>100 ký tự)")
        @WithMockUser(roles = "PATIENT")
        void shouldReturn400WhenFullNameTooLong() throws Exception {
            String longName = "A".repeat(150); // 150 chars > max 100
            UpdatePatientProfileRequest request = UpdatePatientProfileRequest.builder()
                    .fullName(longName)
                    .build();

            mockMvc.perform(put("/api/v1/patient/profile").with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.success").value(false));
        }

        @Test
        @DisplayName("TC-ERR-012: Gửi request body không phải JSON")
        @WithMockUser(roles = "PATIENT")
        void shouldReturn400WhenNotJson() throws Exception {
            mockMvc.perform(post("/api/v1/patient/appointments").with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("this is not json"))
                    .andExpect(status().isBadRequest());
        }
    }

    // ================================================================
    // 404 NOT FOUND — Resource không tồn tại
    // ================================================================
    @Nested
    @DisplayName("404 Not Found - Tài nguyên không tồn tại")
    class NotFoundTests {

        @Test
        @DisplayName("TC-ERR-013: GET /profile → 404 khi chưa tạo hồ sơ bệnh nhân")
        @WithMockUser(roles = "PATIENT")
        void shouldReturn404WhenPatientProfileNotFound() throws Exception {
            when(profileService.getCurrentPatientProfile())
                    .thenThrow(new ResourceNotFoundException("Patient profile not found"));

            mockMvc.perform(get("/api/v1/patient/profile"))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.success").value(false))
                    .andExpect(jsonPath("$.message").value("Patient profile not found"));
        }

        @Test
        @DisplayName("TC-ERR-014: PUT /emergency-contacts/999 → 404 khi ID không tồn tại")
        @WithMockUser(roles = "PATIENT")
        void shouldReturn404WhenEmergencyContactNotFound() throws Exception {
            EmergencyContactRequest request = EmergencyContactRequest.builder()
                    .contactName("X").relationship("Y").phone("0901234567").build();
            when(profileService.updateEmergencyContact(eq(999L), any()))
                    .thenThrow(new ResourceNotFoundException("Emergency contact not found: 999"));

            mockMvc.perform(put("/api/v1/patient/profile/emergency-contacts/999").with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.message").value("Emergency contact not found: 999"));
        }
    }

    // ================================================================
    // 500 INTERNAL SERVER ERROR — Lỗi hệ thống
    // ================================================================
    @Nested
    @DisplayName("500 Internal Server Error - Lỗi hệ thống")
    class InternalServerErrorTests {

        @Test
        @DisplayName("TC-ERR-015: RuntimeException khi tạo lịch hẹn")
        @WithMockUser(roles = "PATIENT")
        void shouldReturn500WhenServiceThrowsRuntimeException() throws Exception {
            CreateAppointmentRequest request = CreateAppointmentRequest.builder()
                    .doctorId(1L).appointmentTime(LocalDateTime.now().plusDays(1))
                    .appointmentType("IN_PERSON").build();
            when(appointmentService.create(any()))
                    .thenThrow(new RuntimeException("Database connection lost"));

            mockMvc.perform(post("/api/v1/patient/appointments").with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isInternalServerError())
                    .andExpect(jsonPath("$.success").value(false));
        }

        @Test
        @DisplayName("TC-ERR-016: RuntimeException khi tải báo cáo")
        @WithMockUser(roles = "PATIENT")
        void shouldReturn500WhenReportGenerationFails() throws Exception {
            when(profileService.generateReport())
                    .thenThrow(new RuntimeException("Failed to generate report"));

            mockMvc.perform(get("/api/v1/patient/profile/download-report"))
                    .andExpect(status().isInternalServerError());
        }

        @Test
        @DisplayName("TC-ERR-017: RuntimeException khi hủy lịch hẹn không hợp lệ")
        @WithMockUser(roles = "PATIENT")
        void shouldReturn500WhenCancelThrowsRuntime() throws Exception {
            doThrow(new RuntimeException("Không thể hủy lịch hẹn đã hoàn tất."))
                    .when(appointmentService).cancel(2L);

            mockMvc.perform(put("/api/v1/patient/appointments/2/cancel").with(csrf()))
                    .andExpect(status().isInternalServerError())
                    .andExpect(jsonPath("$.success").value(false));
        }
    }
}


