package com.project.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.dto.request.DoctorCreateAppointmentRequest;
import com.project.exception.GlobalExceptionHandler;
import com.project.exception.ResourceNotFoundException;
import com.project.service.DoctorAppointmentService;
import com.project.service.DoctorPatientService;
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

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * KCPM-20: Test các kịch bản bắt lỗi và phân quyền Role Admin/Doctor
 *
 * - 401: Chưa đăng nhập
 * - 403: PATIENT truy cập endpoint Doctor, PATIENT truy cập endpoint Admin
 * - 400: Validation errors trên Doctor endpoints
 * - 404: Resource không tồn tại
 * - 500: RuntimeException
 */
@SuppressWarnings("null")
@WebMvcTest(controllers = {
        DoctorAppointmentController.class,
        DoctorPatientController.class,
        GlobalExceptionHandler.class
})
@AutoConfigureMockMvc
@DisplayName("Doctor/Admin Error Handling & Authorization Tests (KCPM-20)")
class DoctorAdminAuthorizationTest {

    @Autowired private MockMvc mockMvc;
    @org.springframework.boot.test.mock.mockito.MockBean
    private JwtTokenProvider jwtTokenProvider;
    @org.springframework.boot.test.mock.mockito.MockBean
    private CustomUserDetailsService customUserDetailsService;

    @Autowired private ObjectMapper objectMapper;

    @MockBean private DoctorAppointmentService appointmentService;
    @MockBean private DoctorPatientService patientService;

    // ================================================================
    // 401 UNAUTHORIZED — Chưa đăng nhập truy cập Doctor endpoints
    // ================================================================
    @Nested
    @DisplayName("401 Unauthorized - Doctor endpoints khi chưa đăng nhập")
    class DoctorUnauthorizedTests {

        @Test
        @DisplayName("TC-DA-ERR-001: GET /doctor/appointments → 401")
        void shouldReturn401_GetAppointments() throws Exception {
            mockMvc.perform(get("/api/v1/doctor/appointments"))
                    .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("TC-DA-ERR-002: GET /doctor/appointments/upcoming → 401")
        void shouldReturn401_GetUpcoming() throws Exception {
            mockMvc.perform(get("/api/v1/doctor/appointments/upcoming"))
                    .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("TC-DA-ERR-003: POST /doctor/appointments → 401")
        void shouldReturn401_CreateAppointment() throws Exception {
            DoctorCreateAppointmentRequest request = DoctorCreateAppointmentRequest.builder()
                    .patientId(1L).appointmentDate("2026-08-01")
                    .appointmentTime("10:00").type("IN_PERSON").build();

            mockMvc.perform(post("/api/v1/doctor/appointments").with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("TC-DA-ERR-004: PUT /doctor/appointments/1/status → 401")
        void shouldReturn401_UpdateStatus() throws Exception {
            mockMvc.perform(put("/api/v1/doctor/appointments/1/status").with(csrf())
                            .param("status", "SCHEDULED"))
                    .andExpect(status().isUnauthorized());
        }
    }

    // ================================================================
    // 403 FORBIDDEN — PATIENT truy cập Doctor endpoints
    // ================================================================
    @Nested
    @DisplayName("403 Forbidden - PATIENT truy cập Doctor endpoints")
    class PatientAccessDoctorTests {

        @Test
        @DisplayName("TC-DA-ERR-005: PATIENT không được GET /doctor/appointments")
        @WithMockUser(roles = "PATIENT")
        void shouldReturn403_PatientGetAppointments() throws Exception {
            mockMvc.perform(get("/api/v1/doctor/appointments"))
                    .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName("TC-DA-ERR-006: PATIENT không được POST /doctor/appointments")
        @WithMockUser(roles = "PATIENT")
        void shouldReturn403_PatientCreateAppointment() throws Exception {
            DoctorCreateAppointmentRequest request = DoctorCreateAppointmentRequest.builder()
                    .patientId(1L).appointmentDate("2026-08-01")
                    .appointmentTime("10:00").type("IN_PERSON").build();

            mockMvc.perform(post("/api/v1/doctor/appointments").with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName("TC-DA-ERR-007: PATIENT không được PUT /doctor/appointments/1/status")
        @WithMockUser(roles = "PATIENT")
        void shouldReturn403_PatientUpdateStatus() throws Exception {
            mockMvc.perform(put("/api/v1/doctor/appointments/1/status").with(csrf())
                            .param("status", "COMPLETED"))
                    .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName("TC-DA-ERR-008: CLINIC_MANAGER không được GET /doctor/appointments/upcoming")
        @WithMockUser(roles = "CLINIC_MANAGER")
        void shouldReturn403_ClinicManagerGetUpcoming() throws Exception {
            mockMvc.perform(get("/api/v1/doctor/appointments/upcoming"))
                    .andExpect(status().isForbidden());
        }
    }

    // ================================================================
    // 403 FORBIDDEN — PATIENT/DOCTOR truy cập Doctor Patient Management
    // ================================================================
    @Nested
    @DisplayName("403 Forbidden - Phân quyền Doctor Patient Management")
    class PatientAccessDoctorPatientTests {

        @Test
        @DisplayName("TC-DA-ERR-009: PATIENT không được GET /doctor/patients")
        @WithMockUser(roles = "PATIENT")
        void shouldReturn403_PatientGetDoctorPatients() throws Exception {
            mockMvc.perform(get("/api/v1/doctor/patients"))
                    .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName("TC-DA-ERR-010: ADMIN không được GET /doctor/patients")
        @WithMockUser(roles = "ADMIN")
        void shouldReturn403_AdminGetDoctorPatients() throws Exception {
            mockMvc.perform(get("/api/v1/doctor/patients"))
                    .andExpect(status().isForbidden());
        }
    }

    // ================================================================
    // 400 BAD REQUEST — Validation lỗi trên Doctor endpoints
    // ================================================================
    @Nested
    @DisplayName("400 Bad Request - Validation errors trên Doctor")
    class DoctorValidationTests {

        @Test
        @DisplayName("TC-DA-ERR-011: Tạo lịch hẹn thiếu patientId")
        @WithMockUser(roles = "DOCTOR")
        void shouldReturn400_MissingPatientId() throws Exception {
            DoctorCreateAppointmentRequest request = DoctorCreateAppointmentRequest.builder()
                    .patientId(null)
                    .appointmentDate("2026-08-01")
                    .appointmentTime("10:00").type("IN_PERSON").build();

            mockMvc.perform(post("/api/v1/doctor/appointments").with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.success").value(false));
        }

        @Test
        @DisplayName("TC-DA-ERR-012: Tạo lịch hẹn thiếu appointmentDate")
        @WithMockUser(roles = "DOCTOR")
        void shouldReturn400_MissingDate() throws Exception {
            DoctorCreateAppointmentRequest request = DoctorCreateAppointmentRequest.builder()
                    .patientId(10L).appointmentDate("")
                    .appointmentTime("10:00").type("IN_PERSON").build();

            mockMvc.perform(post("/api/v1/doctor/appointments").with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("TC-DA-ERR-013: Tạo lịch hẹn thiếu type")
        @WithMockUser(roles = "DOCTOR")
        void shouldReturn400_MissingType() throws Exception {
            DoctorCreateAppointmentRequest request = DoctorCreateAppointmentRequest.builder()
                    .patientId(10L).appointmentDate("2026-08-01")
                    .appointmentTime("10:00").type("").build();

            mockMvc.perform(post("/api/v1/doctor/appointments").with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("TC-DA-ERR-014: Body request không phải JSON")
        @WithMockUser(roles = "DOCTOR")
        void shouldReturn400_InvalidJson() throws Exception {
            mockMvc.perform(post("/api/v1/doctor/appointments").with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("not-json-body"))
                    .andExpect(status().isBadRequest());
        }
    }

    // ================================================================
    // 404 NOT FOUND — Resource không tồn tại
    // ================================================================
    @Nested
    @DisplayName("404 Not Found trên Doctor endpoints")
    class DoctorNotFoundTests {

        @Test
        @DisplayName("TC-DA-ERR-015: Cập nhật trạng thái lịch hẹn không tồn tại")
        @WithMockUser(roles = "DOCTOR")
        void shouldReturn404_UpdateStatusNotFound() throws Exception {
            when(appointmentService.updateStatus(eq(999L), any(), any(), any()))
                    .thenThrow(new ResourceNotFoundException("Lịch hẹn không tồn tại!"));

            mockMvc.perform(put("/api/v1/doctor/appointments/999/status").with(csrf())
                            .param("status", "SCHEDULED"))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.success").value(false));
        }

        @Test
        @DisplayName("TC-DA-ERR-016: Dời lịch hẹn không tồn tại")
        @WithMockUser(roles = "DOCTOR")
        void shouldReturn404_RescheduleNotFound() throws Exception {
            DoctorCreateAppointmentRequest request = DoctorCreateAppointmentRequest.builder()
                    .patientId(10L).appointmentDate("2026-08-15")
                    .appointmentTime("14:00").type("IN_PERSON").build();
            when(appointmentService.rescheduleAppointment(eq(999L), any()))
                    .thenThrow(new ResourceNotFoundException("Lịch hẹn không tồn tại"));

            mockMvc.perform(put("/api/v1/doctor/appointments/999/reschedule").with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isNotFound());
        }
    }

    // ================================================================
    // 500 INTERNAL SERVER ERROR
    // ================================================================
    @Nested
    @DisplayName("500 Internal Server Error trên Doctor endpoints")
    class DoctorServerErrorTests {

        @Test
        @DisplayName("TC-DA-ERR-017: RuntimeException khi bác sĩ khác cập nhật lịch")
        @WithMockUser(roles = "DOCTOR")
        void shouldReturn500_UnauthorizedModify() throws Exception {
            when(appointmentService.updateStatus(eq(2L), any(), any(), any()))
                    .thenThrow(new RuntimeException("Unauthorized to modify this appointment"));

            mockMvc.perform(put("/api/v1/doctor/appointments/2/status").with(csrf())
                            .param("status", "COMPLETED"))
                    .andExpect(status().isInternalServerError())
                    .andExpect(jsonPath("$.success").value(false));
        }

        @Test
        @DisplayName("TC-DA-ERR-018: RuntimeException khi tạo lịch lỗi hệ thống")
        @WithMockUser(roles = "DOCTOR")
        void shouldReturn500_CreateFails() throws Exception {
            DoctorCreateAppointmentRequest request = DoctorCreateAppointmentRequest.builder()
                    .patientId(10L).appointmentDate("2026-08-01")
                    .appointmentTime("10:00").type("IN_PERSON").build();
            when(appointmentService.createAppointment(any()))
                    .thenThrow(new RuntimeException("DB connection timeout"));

            mockMvc.perform(post("/api/v1/doctor/appointments").with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isInternalServerError());
        }
    }
}


