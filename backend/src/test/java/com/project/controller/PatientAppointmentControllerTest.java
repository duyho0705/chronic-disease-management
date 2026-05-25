package com.project.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.dto.request.CreateAppointmentRequest;
import com.project.dto.response.DoctorSimpleResponse;
import com.project.dto.response.PatientAppointmentResponse;
import com.project.exception.GlobalExceptionHandler;
import com.project.service.PatientAppointmentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import com.project.security.JwtTokenProvider;
import com.project.security.CustomUserDetailsService;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = {PatientAppointmentController.class, GlobalExceptionHandler.class})
@AutoConfigureMockMvc
@SuppressWarnings("null")
@DisplayName("PatientAppointmentController Integration Tests (KCPM-15)")
class PatientAppointmentControllerTest {

    @Autowired
    private MockMvc mockMvc;
    @org.springframework.boot.test.mock.mockito.MockBean
    private JwtTokenProvider jwtTokenProvider;
    @org.springframework.boot.test.mock.mockito.MockBean
    private CustomUserDetailsService customUserDetailsService;


    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private PatientAppointmentService service;

    private static final String BASE_URL = "/api/v1/patient/appointments";
    private PatientAppointmentResponse testAppointment;

    @BeforeEach
    void setUp() {
        testAppointment = PatientAppointmentResponse.builder()
                .id(1L)
                .doctorName("BS. Trần Văn B")
                .doctorSpecialty("Nội khoa")
                .appointmentTime(LocalDateTime.of(2026, 7, 1, 9, 0))
                .appointmentType("IN_PERSON")
                .location("Phòng khám Sức Khỏe Xanh")
                .status("PENDING")
                .reminderEnabled(false)
                .build();
    }

    // ================================================================
    // POST /appointments — Tạo lịch hẹn mới
    // ================================================================
    @Nested
    @DisplayName("POST /appointments - Đặt lịch hẹn")
    class CreateAppointmentTests {

        @Test
        @DisplayName("TC-AC-001: Tạo lịch hẹn thành công - HTTP 201")
        @WithMockUser(roles = "PATIENT")
        void shouldReturn201OnCreate() throws Exception {
            CreateAppointmentRequest request = CreateAppointmentRequest.builder()
                    .doctorId(20L)
                    .appointmentTime(LocalDateTime.of(2026, 7, 1, 9, 0))
                    .appointmentType("IN_PERSON")
                    .build();
            when(service.create(any())).thenReturn(testAppointment);

            mockMvc.perform(post(BASE_URL).with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.data.doctorName").value("BS. Trần Văn B"))
                    .andExpect(jsonPath("$.data.status").value("PENDING"));
        }

        @Test
        @DisplayName("TC-AC-002: Trả 400 khi thiếu doctorId")
        @WithMockUser(roles = "PATIENT")
        void shouldReturn400WhenDoctorIdNull() throws Exception {
            CreateAppointmentRequest request = CreateAppointmentRequest.builder()
                    .doctorId(null)  // null → @NotNull fails
                    .appointmentTime(LocalDateTime.of(2026, 7, 1, 9, 0))
                    .appointmentType("IN_PERSON")
                    .build();

            mockMvc.perform(post(BASE_URL).with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.success").value(false));
        }

        @Test
        @DisplayName("TC-AC-003: Trả 400 khi thiếu appointmentType")
        @WithMockUser(roles = "PATIENT")
        void shouldReturn400WhenTypeBlank() throws Exception {
            CreateAppointmentRequest request = CreateAppointmentRequest.builder()
                    .doctorId(20L)
                    .appointmentTime(LocalDateTime.of(2026, 7, 1, 9, 0))
                    .appointmentType("")  // blank → @NotBlank fails
                    .build();

            mockMvc.perform(post(BASE_URL).with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest());
        }
    }

    // ================================================================
    // GET /appointments/upcoming
    // ================================================================
    @Nested
    @DisplayName("GET /appointments/upcoming")
    class GetUpcomingTests {

        @Test
        @DisplayName("TC-AC-004: Lấy lịch hẹn sắp tới thành công - HTTP 200")
        @WithMockUser(roles = "PATIENT")
        void shouldReturn200WithUpcoming() throws Exception {
            when(service.getUpcoming()).thenReturn(List.of(testAppointment));

            mockMvc.perform(get(BASE_URL + "/upcoming"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.data").isArray())
                    .andExpect(jsonPath("$.data[0].status").value("PENDING"));
        }

        @Test
        @DisplayName("TC-AC-005: Trả danh sách rỗng khi không có lịch hẹn")
        @WithMockUser(roles = "PATIENT")
        void shouldReturn200WithEmptyList() throws Exception {
            when(service.getUpcoming()).thenReturn(Collections.emptyList());

            mockMvc.perform(get(BASE_URL + "/upcoming"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data").isEmpty());
        }
    }

    // ================================================================
    // GET /appointments/history
    // ================================================================
    @Nested
    @DisplayName("GET /appointments/history")
    class GetHistoryTests {

        @Test
        @DisplayName("TC-AC-006: Lấy lịch sử khám có phân trang thành công")
        @WithMockUser(roles = "PATIENT")
        void shouldReturn200WithHistory() throws Exception {
            PatientAppointmentResponse completed = PatientAppointmentResponse.builder()
                    .id(50L).doctorName("BS. Trần Văn B").status("COMPLETED")
                    .appointmentTime(LocalDateTime.of(2026, 1, 10, 9, 0))
                    .diagnosisSummary("Ổn định").build();
            Page<PatientAppointmentResponse> page = new PageImpl<>(List.of(completed), PageRequest.of(0, 10), 1);
            when(service.getHistory(any())).thenReturn(page);

            mockMvc.perform(get(BASE_URL + "/history").param("page", "0").param("size", "10"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.data.content[0].status").value("COMPLETED"));
        }
    }

    // ================================================================
    // PUT /appointments/{id}/cancel
    // ================================================================
    @Nested
    @DisplayName("PUT /appointments/{id}/cancel")
    class CancelTests {

        @Test
        @DisplayName("TC-AC-007: Hủy lịch hẹn thành công - HTTP 200")
        @WithMockUser(roles = "PATIENT")
        void shouldReturn200OnCancel() throws Exception {
            doNothing().when(service).cancel(1L);

            mockMvc.perform(put(BASE_URL + "/1/cancel").with(csrf()))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.message").value("Appointment cancelled successfully"));
        }

        @Test
        @DisplayName("TC-AC-008: Trả 404 khi lịch hẹn không tồn tại")
        @WithMockUser(roles = "PATIENT")
        void shouldReturn500WhenCancelFails() throws Exception {
            doThrow(new RuntimeException("Lỗi hệ thống khi hủy lịch hẹn: Lịch hẹn không tồn tại với ID: 999"))
                    .when(service).cancel(999L);

            mockMvc.perform(put(BASE_URL + "/999/cancel").with(csrf()))
                    .andExpect(status().isInternalServerError())
                    .andExpect(jsonPath("$.success").value(false));
        }
    }

    // ================================================================
    // PUT /appointments/{id}/reminder
    // ================================================================
    @Nested
    @DisplayName("PUT /appointments/{id}/reminder")
    class ToggleReminderTests {

        @Test
        @DisplayName("TC-AC-009: Bật nhắc nhở thành công")
        @WithMockUser(roles = "PATIENT")
        void shouldReturn200OnToggleReminder() throws Exception {
            doNothing().when(service).toggleReminder(1L, true);

            mockMvc.perform(put(BASE_URL + "/1/reminder").with(csrf())
                            .param("enabled", "true"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true));
        }
    }

    // ================================================================
    // GET /appointments/doctors
    // ================================================================
    @Nested
    @DisplayName("GET /appointments/doctors")
    class GetDoctorsTests {

        @Test
        @DisplayName("TC-AC-010: Lấy danh sách bác sĩ khả dụng thành công")
        @WithMockUser(roles = "PATIENT")
        void shouldReturn200WithDoctors() throws Exception {
            DoctorSimpleResponse doc = DoctorSimpleResponse.builder()
                    .id(20L).name("BS. Trần Văn B").specialty("Nội khoa").build();
            when(service.getAvailableDoctors()).thenReturn(List.of(doc));

            mockMvc.perform(get(BASE_URL + "/doctors"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data[0].name").value("BS. Trần Văn B"))
                    .andExpect(jsonPath("$.data[0].specialty").value("Nội khoa"));
        }
    }
}


