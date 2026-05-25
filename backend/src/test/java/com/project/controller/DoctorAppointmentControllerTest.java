package com.project.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.dto.request.DoctorCreateAppointmentRequest;
import com.project.dto.response.DoctorAppointmentResponse;
import com.project.exception.GlobalExceptionHandler;
import com.project.exception.ResourceNotFoundException;
import com.project.service.DoctorAppointmentService;
import org.junit.jupiter.api.BeforeEach;
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
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = {DoctorAppointmentController.class, GlobalExceptionHandler.class})
@AutoConfigureMockMvc
@SuppressWarnings("null")
@DisplayName("DoctorAppointmentController Integration Tests (KCPM-19)")
class DoctorAppointmentControllerTest {

    @Autowired private MockMvc mockMvc;
    @org.springframework.boot.test.mock.mockito.MockBean
    private JwtTokenProvider jwtTokenProvider;
    @org.springframework.boot.test.mock.mockito.MockBean
    private CustomUserDetailsService customUserDetailsService;

    @Autowired private ObjectMapper objectMapper;
    @MockBean private DoctorAppointmentService service;

    private static final String BASE_URL = "/api/v1/doctor/appointments";
    private DoctorAppointmentResponse testResponse;

    @BeforeEach
    void setUp() {
        testResponse = DoctorAppointmentResponse.builder()
                .id(1L).patientId(10L).patientName("Nguyễn Văn A")
                .appointmentTime(LocalDateTime.of(2026, 7, 1, 9, 0))
                .appointmentType("IN_PERSON").status("SCHEDULED")
                .location("Phòng khám").doctorName("BS. Trần Văn B").build();
    }

    // ================================================================
    // GET /upcoming
    // ================================================================
    @Nested
    @DisplayName("GET /upcoming")
    class UpcomingTests {

        @Test
        @DisplayName("TC-DAC-001: Lấy lịch hẹn sắp tới thành công")
        @WithMockUser(roles = "DOCTOR")
        void shouldReturn200() throws Exception {
            when(service.getUpcomingAppointments()).thenReturn(List.of(testResponse));

            mockMvc.perform(get(BASE_URL + "/upcoming"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.data[0].patientName").value("Nguyễn Văn A"));
        }
    }

    // ================================================================
    // GET / (all)
    // ================================================================
    @Nested
    @DisplayName("GET / (tất cả lịch hẹn)")
    class GetAllTests {

        @Test
        @DisplayName("TC-DAC-002: Lấy tất cả lịch hẹn thành công")
        @WithMockUser(roles = "DOCTOR")
        void shouldReturn200WithAll() throws Exception {
            when(service.getAllAppointments()).thenReturn(List.of(testResponse));

            mockMvc.perform(get(BASE_URL))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data").isArray());
        }
    }

    // ================================================================
    // PUT /{id}/status
    // ================================================================
    @Nested
    @DisplayName("PUT /{id}/status")
    class UpdateStatusTests {

        @Test
        @DisplayName("TC-DAC-003: Cập nhật trạng thái thành công")
        @WithMockUser(roles = "DOCTOR")
        void shouldReturn200OnStatusUpdate() throws Exception {
            when(service.updateStatus(eq(1L), eq("SCHEDULED"), any(), any())).thenReturn(testResponse);

            mockMvc.perform(put(BASE_URL + "/1/status").with(csrf())
                            .param("status", "SCHEDULED"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.status").value("SCHEDULED"));
        }

        @Test
        @DisplayName("TC-DAC-004: Trả 404 khi lịch hẹn không tồn tại")
        @WithMockUser(roles = "DOCTOR")
        void shouldReturn404WhenNotFound() throws Exception {
            when(service.updateStatus(eq(999L), any(), any(), any()))
                    .thenThrow(new ResourceNotFoundException("Lịch hẹn không tồn tại!"));

            mockMvc.perform(put(BASE_URL + "/999/status").with(csrf())
                            .param("status", "SCHEDULED"))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.success").value(false));
        }
    }

    // ================================================================
    // POST / (create)
    // ================================================================
    @Nested
    @DisplayName("POST / (tạo lịch hẹn)")
    class CreateTests {

        @Test
        @DisplayName("TC-DAC-005: Tạo lịch hẹn thành công")
        @WithMockUser(roles = "DOCTOR")
        void shouldReturn200OnCreate() throws Exception {
            DoctorCreateAppointmentRequest request = DoctorCreateAppointmentRequest.builder()
                    .patientId(10L).appointmentDate("2026-08-01")
                    .appointmentTime("10:00").type("IN_PERSON").build();
            when(service.createAppointment(any())).thenReturn(testResponse);

            mockMvc.perform(post(BASE_URL).with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true));
        }

        @Test
        @DisplayName("TC-DAC-006: Trả 400 khi thiếu patientId")
        @WithMockUser(roles = "DOCTOR")
        void shouldReturn400WhenMissingPatient() throws Exception {
            DoctorCreateAppointmentRequest request = DoctorCreateAppointmentRequest.builder()
                    .patientId(null).appointmentDate("2026-08-01")
                    .appointmentTime("10:00").type("IN_PERSON").build();

            mockMvc.perform(post(BASE_URL).with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("TC-DAC-007: Trả 400 khi thiếu tất cả trường bắt buộc")
        @WithMockUser(roles = "DOCTOR")
        void shouldReturn400WhenAllFieldsMissing() throws Exception {
            mockMvc.perform(post(BASE_URL).with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{}"))
                    .andExpect(status().isBadRequest());
        }
    }

    // ================================================================
    // PUT /{id}/reschedule
    // ================================================================
    @Nested
    @DisplayName("PUT /{id}/reschedule")
    class RescheduleTests {

        @Test
        @DisplayName("TC-DAC-008: Dời lịch hẹn thành công")
        @WithMockUser(roles = "DOCTOR")
        void shouldReturn200OnReschedule() throws Exception {
            DoctorCreateAppointmentRequest request = DoctorCreateAppointmentRequest.builder()
                    .patientId(10L).appointmentDate("2026-08-15")
                    .appointmentTime("14:00").type("IN_PERSON").build();
            when(service.rescheduleAppointment(eq(1L), any())).thenReturn(testResponse);

            mockMvc.perform(put(BASE_URL + "/1/reschedule").with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true));
        }
    }

    // ================================================================
    // PUT /batch-reschedule
    // ================================================================
    @Nested
    @DisplayName("PUT /batch-reschedule")
    class BatchRescheduleTests {

        @Test
        @DisplayName("TC-DAC-009: Dời hàng loạt thành công")
        @WithMockUser(roles = "DOCTOR")
        void shouldReturn200OnBatch() throws Exception {
            when(service.batchReschedule(any(), any())).thenReturn(3);

            mockMvc.perform(put(BASE_URL + "/batch-reschedule").with(csrf())
                            .param("sourceDate", "2026-08-01")
                            .param("targetDate", "2026-08-05"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.movedCount").value(3));
        }
    }
}


