package com.project.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.dto.request.EmergencyContactRequest;
import com.project.dto.request.UpdatePatientProfileRequest;
import com.project.dto.response.EmergencyContactResponse;
import com.project.dto.response.PatientProfileResponse;
import com.project.exception.GlobalExceptionHandler;
import com.project.exception.ResourceNotFoundException;
import com.project.service.PatientProfileService;
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

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = {PatientProfileController.class, GlobalExceptionHandler.class})
@AutoConfigureMockMvc
@SuppressWarnings("null")
@DisplayName("PatientProfileController Integration Tests (KCPM-15)")
class PatientProfileControllerTest {

    @Autowired
    private MockMvc mockMvc;
    @org.springframework.boot.test.mock.mockito.MockBean
    private JwtTokenProvider jwtTokenProvider;
    @org.springframework.boot.test.mock.mockito.MockBean
    private CustomUserDetailsService customUserDetailsService;


    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private PatientProfileService service;

    private static final String BASE_URL = "/api/v1/patient/profile";

    private PatientProfileResponse testProfile;

    @BeforeEach
    void setUp() {
        testProfile = PatientProfileResponse.builder()
                .id(10L)
                .userId(1L)
                .patientCode("BN-001")
                .fullName("Nguyễn Văn A")
                .dateOfBirth(LocalDate.of(1990, 5, 15))
                .age(36)
                .gender("Nam")
                .phone("0901234567")
                .email("nguyenvana@email.com")
                .address("123 Đường ABC, Quận 1")
                .bloodType("O+")
                .heightCm(new BigDecimal("170.00"))
                .weightKg(new BigDecimal("65.00"))
                .chronicCondition("Tiểu đường")
                .chronicDiseases(List.of("Tiểu đường Type 2"))
                .allergies(List.of("Penicillin"))
                .currentMedications(List.of("Metformin"))
                .build();
    }

    // ================================================================
    // GET /api/v1/patient/profile — Lấy hồ sơ bệnh nhân
    // ================================================================
    @Nested
    @DisplayName("GET /profile - Lấy hồ sơ bệnh nhân")
    class GetProfileTests {

        @Test
        @DisplayName("TC-PC-001: Lấy hồ sơ thành công - HTTP 200")
        @WithMockUser(roles = "PATIENT")
        void shouldReturn200WithProfile() throws Exception {
            when(service.getCurrentPatientProfile()).thenReturn(testProfile);

            mockMvc.perform(get(BASE_URL))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.data.fullName").value("Nguyễn Văn A"))
                    .andExpect(jsonPath("$.data.patientCode").value("BN-001"))
                    .andExpect(jsonPath("$.data.bloodType").value("O+"));
        }

        @Test
        @DisplayName("TC-PC-002: Trả 404 khi không tìm thấy hồ sơ")
        @WithMockUser(roles = "PATIENT")
        void shouldReturn404WhenProfileNotFound() throws Exception {
            when(service.getCurrentPatientProfile())
                    .thenThrow(new ResourceNotFoundException("Patient profile not found"));

            mockMvc.perform(get(BASE_URL))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.success").value(false))
                    .andExpect(jsonPath("$.message").value("Patient profile not found"));
        }
    }

    // ================================================================
    // PUT /api/v1/patient/profile — Cập nhật hồ sơ
    // ================================================================
    @Nested
    @DisplayName("PUT /profile - Cập nhật hồ sơ bệnh nhân")
    class UpdateProfileTests {

        @Test
        @DisplayName("TC-PC-003: Cập nhật hồ sơ thành công - HTTP 200")
        @WithMockUser(roles = "PATIENT")
        void shouldReturn200OnUpdate() throws Exception {
            UpdatePatientProfileRequest request = UpdatePatientProfileRequest.builder()
                    .fullName("Nguyễn Văn B")
                    .phone("0909999888")
                    .email("newmail@email.com")
                    .build();
            when(service.updateProfile(any())).thenReturn(testProfile);

            mockMvc.perform(put(BASE_URL).with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.message").value("Profile updated successfully"));
        }

        @Test
        @DisplayName("TC-PC-004: Trả 400 khi fullName trống (Validation)")
        @WithMockUser(roles = "PATIENT")
        void shouldReturn400WhenFullNameBlank() throws Exception {
            UpdatePatientProfileRequest request = UpdatePatientProfileRequest.builder()
                    .fullName("")  // blank → @NotBlank fails
                    .phone("0909999888")
                    .build();

            mockMvc.perform(put(BASE_URL).with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.success").value(false));
        }

        @Test
        @DisplayName("TC-PC-005: Trả 400 khi email sai định dạng")
        @WithMockUser(roles = "PATIENT")
        void shouldReturn400WhenEmailInvalid() throws Exception {
            UpdatePatientProfileRequest request = UpdatePatientProfileRequest.builder()
                    .fullName("Nguyễn Văn A")
                    .email("not-an-email")
                    .build();

            mockMvc.perform(put(BASE_URL).with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.success").value(false));
        }
    }

    // ================================================================
    // GET /profile/emergency-contacts
    // ================================================================
    @Nested
    @DisplayName("GET /profile/emergency-contacts")
    class GetEmergencyContactsTests {

        @Test
        @DisplayName("TC-PC-006: Lấy danh sách liên hệ khẩn cấp thành công")
        @WithMockUser(roles = "PATIENT")
        void shouldReturn200WithContacts() throws Exception {
            EmergencyContactResponse contact = EmergencyContactResponse.builder()
                    .id(1L).contactName("Trần Thị B").relationship("Vợ")
                    .phone("0912345678").isPrimary(true).build();
            when(service.getEmergencyContacts()).thenReturn(List.of(contact));

            mockMvc.perform(get(BASE_URL + "/emergency-contacts"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.data[0].contactName").value("Trần Thị B"));
        }
    }

    // ================================================================
    // POST /profile/emergency-contacts
    // ================================================================
    @Nested
    @DisplayName("POST /profile/emergency-contacts")
    class AddEmergencyContactTests {

        @Test
        @DisplayName("TC-PC-007: Thêm liên hệ khẩn cấp thành công")
        @WithMockUser(roles = "PATIENT")
        void shouldReturn200OnAddContact() throws Exception {
            EmergencyContactRequest request = EmergencyContactRequest.builder()
                    .contactName("Lê Thị D").relationship("Mẹ")
                    .phone("0934567890").isPrimary(true).build();
            EmergencyContactResponse response = EmergencyContactResponse.builder()
                    .id(5L).contactName("Lê Thị D").relationship("Mẹ")
                    .phone("0934567890").isPrimary(true).build();
            when(service.addEmergencyContact(any())).thenReturn(response);

            mockMvc.perform(post(BASE_URL + "/emergency-contacts").with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.contactName").value("Lê Thị D"));
        }

        @Test
        @DisplayName("TC-PC-008: Trả 400 khi thiếu tên liên hệ")
        @WithMockUser(roles = "PATIENT")
        void shouldReturn400WhenContactNameBlank() throws Exception {
            EmergencyContactRequest request = EmergencyContactRequest.builder()
                    .contactName("").relationship("Mẹ")
                    .phone("0934567890").build();

            mockMvc.perform(post(BASE_URL + "/emergency-contacts").with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.success").value(false));
        }
    }

    // ================================================================
    // PUT /profile/emergency-contacts/{id}
    // ================================================================
    @Nested
    @DisplayName("PUT /profile/emergency-contacts/{id}")
    class UpdateEmergencyContactTests {

        @Test
        @DisplayName("TC-PC-009: Cập nhật liên hệ khẩn cấp thành công")
        @WithMockUser(roles = "PATIENT")
        void shouldReturn200OnUpdateContact() throws Exception {
            EmergencyContactRequest request = EmergencyContactRequest.builder()
                    .contactName("Updated Name").relationship("Anh")
                    .phone("0945678901").isPrimary(false).build();
            EmergencyContactResponse response = EmergencyContactResponse.builder()
                    .id(1L).contactName("Updated Name").relationship("Anh")
                    .phone("0945678901").isPrimary(false).build();
            when(service.updateEmergencyContact(eq(1L), any())).thenReturn(response);

            mockMvc.perform(put(BASE_URL + "/emergency-contacts/1").with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.contactName").value("Updated Name"));
        }

        @Test
        @DisplayName("TC-PC-010: Trả 404 khi liên hệ khẩn cấp không tồn tại")
        @WithMockUser(roles = "PATIENT")
        void shouldReturn404WhenContactNotFound() throws Exception {
            EmergencyContactRequest request = EmergencyContactRequest.builder()
                    .contactName("Test").relationship("Bạn")
                    .phone("0945678901").build();
            when(service.updateEmergencyContact(eq(999L), any()))
                    .thenThrow(new ResourceNotFoundException("Emergency contact not found: 999"));

            mockMvc.perform(put(BASE_URL + "/emergency-contacts/999").with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.success").value(false));
        }
    }

    // ================================================================
    // GET /profile/download-report
    // ================================================================
    @Nested
    @DisplayName("GET /profile/download-report")
    class DownloadReportTests {

        @Test
        @DisplayName("TC-PC-011: Tải báo cáo Excel thành công")
        @WithMockUser(roles = "PATIENT")
        void shouldReturn200WithExcelFile() throws Exception {
            byte[] fakeExcel = new byte[]{1, 2, 3};
            when(service.generateReport()).thenReturn(fakeExcel);

            mockMvc.perform(get(BASE_URL + "/download-report"))
                    .andExpect(status().isOk())
                    .andExpect(header().string("Content-Disposition", "attachment; filename=health_report.xlsx"))
                    .andExpect(header().string("Content-Type",
                            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
        }
    }
}


