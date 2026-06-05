package com.project.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.dto.request.CreateDoctorRequest;
import com.project.dto.request.CreatePatientRequest;
import com.project.dto.response.*;
import com.project.exception.GlobalExceptionHandler;
import com.project.security.SecurityService;
import com.project.service.ClinicDashboardService;
import com.project.service.ClinicDoctorService;
import com.project.service.ClinicPatientService;
import com.project.service.PatientHealthMetricService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import com.project.security.JwtTokenProvider;
import com.project.security.CustomUserDetailsService;

import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = {ClinicDashboardController.class, GlobalExceptionHandler.class})
@AutoConfigureMockMvc
@SuppressWarnings("null")
@DisplayName("ClinicDashboardController Integration Tests (KCPM-23)")
class ClinicDashboardControllerTest {

    @Autowired private MockMvc mockMvc;
    @org.springframework.boot.test.mock.mockito.MockBean
    private JwtTokenProvider jwtTokenProvider;
    @org.springframework.boot.test.mock.mockito.MockBean
    private CustomUserDetailsService customUserDetailsService;

    @Autowired private ObjectMapper objectMapper;

    @MockBean private ClinicDashboardService dashboardService;
    @MockBean private ClinicPatientService patientService;
    @MockBean private ClinicDoctorService doctorService;
    @MockBean private PatientHealthMetricService healthMetricService;
    @MockBean private SecurityService securityService;

    private static final String BASE = "/api/v1/clinics/100";

    // ================================================================
    // Dashboard
    // ================================================================
    @Nested
    @DisplayName("GET /dashboard")
    class DashboardTests {

        @Test
        @DisplayName("TC-CC-001: Lấy dashboard phòng khám thành công")
        @WithMockUser(roles = "CLINIC_MANAGER")
        void shouldReturn200() throws Exception {
            when(securityService.isClinicManagerOf(100L)).thenReturn(true);
            when(dashboardService.getDashboardData(100L, "6m"))
                    .thenReturn(ClinicDashboardResponse.builder().build());

            mockMvc.perform(get(BASE + "/dashboard"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true));
        }
    }

    // ================================================================
    // Patients CRUD
    // ================================================================
    @Nested
    @DisplayName("Patients CRUD")
    class PatientTests {

        @Test
        @DisplayName("TC-CC-002: Lấy danh sách bệnh nhân thành công")
        @WithMockUser(roles = "CLINIC_MANAGER")
        void shouldGetPatients() throws Exception {
            when(securityService.isClinicManagerOf(100L)).thenReturn(true);
            ClinicPatientResponse p = ClinicPatientResponse.builder().dbId(10L).name("Nguyễn A").build();
            when(patientService.getPatientRecords(eq(100L), any(), any(), any(), any(), any(), any()))
                    .thenReturn(new PageImpl<>(List.of(p)));

            mockMvc.perform(get(BASE + "/patients"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.content[0].name").value("Nguyễn A"));
        }

        @Test
        @DisplayName("TC-CC-003: Tạo bệnh nhân mới thành công")
        @WithMockUser(roles = "CLINIC_MANAGER")
        void shouldCreatePatient() throws Exception {
            when(securityService.isClinicManagerOf(100L)).thenReturn(true);
            CreatePatientRequest request = new CreatePatientRequest();
            request.setName("Lê Văn C");
            request.setPhone("0901234567");
            request.setGender("Nam");
            doNothing().when(patientService).createPatient(eq(100L), any());

            mockMvc.perform(post(BASE + "/patients").with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true));
        }

        @Test
        @DisplayName("TC-CC-004: Trả 400 khi thiếu tên bệnh nhân")
        @WithMockUser(roles = "CLINIC_MANAGER")
        void shouldReturn400WhenNameBlank() throws Exception {
            when(securityService.isClinicManagerOf(100L)).thenReturn(true);
            CreatePatientRequest request = new CreatePatientRequest();
            request.setName("");
            request.setPhone("0901234567");
            request.setGender("Nam");

            mockMvc.perform(post(BASE + "/patients").with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("TC-CC-005: Xóa bệnh nhân thành công")
        @WithMockUser(roles = "CLINIC_MANAGER")
        void shouldDeletePatient() throws Exception {
            when(securityService.isClinicManagerOf(100L)).thenReturn(true);
            doNothing().when(patientService).deletePatient(100L, 10L);

            mockMvc.perform(delete(BASE + "/patients/10").with(csrf()))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.message").value("Patient deleted successfully"));
        }
    }

    // ================================================================
    // Doctors CRUD
    // ================================================================
    @Nested
    @DisplayName("Doctors CRUD")
    class DoctorTests {

        @Test
        @DisplayName("TC-CC-006: Lấy danh sách bác sĩ thành công")
        @WithMockUser(roles = "CLINIC_MANAGER")
        void shouldGetDoctors() throws Exception {
            when(securityService.isClinicManagerOf(100L)).thenReturn(true);
            ClinicDoctorResponse doc = ClinicDoctorResponse.builder().dbId(20L).name("BS. B").build();
            when(doctorService.getDoctorRecords(eq(100L), any(), any(), any(), any(), any(), any()))
                    .thenReturn(new PageImpl<>(List.of(doc)));

            mockMvc.perform(get(BASE + "/doctors"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.content[0].name").value("BS. B"));
        }

        @Test
        @DisplayName("TC-CC-007: Tạo bác sĩ mới thành công")
        @WithMockUser(roles = "CLINIC_MANAGER")
        void shouldCreateDoctor() throws Exception {
            when(securityService.isClinicManagerOf(100L)).thenReturn(true);
            CreateDoctorRequest request = new CreateDoctorRequest();
            request.setName("BS. Mới");
            request.setEmail("newdoc@mail.com");
            request.setPhone("0912345678");
            request.setSpecialty("Nội khoa");
            request.setLicenseNumber("LN-100");
            doNothing().when(doctorService).createDoctor(eq(100L), any());

            mockMvc.perform(post(BASE + "/doctors").with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true));
        }

        @Test
        @DisplayName("TC-CC-008: Trả 400 khi tạo bác sĩ thiếu email")
        @WithMockUser(roles = "CLINIC_MANAGER")
        void shouldReturn400WhenDoctorEmailBlank() throws Exception {
            when(securityService.isClinicManagerOf(100L)).thenReturn(true);
            CreateDoctorRequest request = new CreateDoctorRequest();
            request.setName("BS. X");
            request.setEmail("");
            request.setPhone("0912345678");
            request.setSpecialty("Nội");
            request.setLicenseNumber("LN-X");

            mockMvc.perform(post(BASE + "/doctors").with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("TC-CC-009: Xóa bác sĩ thành công")
        @WithMockUser(roles = "CLINIC_MANAGER")
        void shouldDeleteDoctor() throws Exception {
            when(securityService.isClinicManagerOf(100L)).thenReturn(true);
            doNothing().when(doctorService).deleteDoctor(100L, 20L);

            mockMvc.perform(delete(BASE + "/doctors/20").with(csrf()))
                    .andExpect(status().isOk());
        }
    }

    // ================================================================
    // Appointments
    // ================================================================
    @Nested
    @DisplayName("Appointments")
    class AppointmentTests {

        @Test
        @DisplayName("TC-CC-010: Lấy danh sách lịch hẹn phòng khám thành công")
        @WithMockUser(roles = "CLINIC_MANAGER")
        void shouldGetAppointments() throws Exception {
            when(securityService.isClinicManagerOf(100L)).thenReturn(true);
            when(dashboardService.getAppointmentRecords(eq(100L), isNull(), isNull(), any()))
                    .thenReturn(new PageImpl<>(Collections.emptyList()));

            mockMvc.perform(get(BASE + "/appointments"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true));
        }
    }

    // ================================================================
    // Clinic Profile
    // ================================================================
    @Nested
    @DisplayName("Clinic Profile")
    class ProfileTests {

        @Test
        @DisplayName("TC-CC-011: Lấy hồ sơ phòng khám thành công")
        @WithMockUser(roles = "CLINIC_MANAGER")
        void shouldGetClinicProfile() throws Exception {
            when(securityService.isClinicManagerOf(100L)).thenReturn(true);
            when(dashboardService.getClinicDetails(100L))
                    .thenReturn(ClinicResponse.builder().id(100L).name("Phòng khám ABC").build());

            mockMvc.perform(get(BASE + "/profile"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.name").value("Phòng khám ABC"));
        }
    }
}


