package com.project.service;

import com.project.dto.request.EmergencyContactRequest;
import com.project.dto.request.UpdatePatientProfileRequest;
import com.project.dto.response.EmergencyContactResponse;
import com.project.dto.response.PatientProfileResponse;
import com.project.entity.EmergencyContact;
import com.project.entity.Patient;
import com.project.entity.User;
import com.project.exception.ResourceNotFoundException;
import com.project.repository.EmergencyContactRepository;
import com.project.repository.PatientRepository;
import com.project.repository.PrescriptionRepository;
import com.project.repository.UserRepository;
import com.project.security.CustomUserDetails;
import com.project.service.impl.PatientProfileServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@SuppressWarnings("null")
@DisplayName("PatientProfileService Unit Tests")
class PatientProfileServiceTest {

    @Mock
    private PatientRepository patientRepository;

    @Mock
    private EmergencyContactRepository emergencyContactRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PrescriptionRepository prescriptionRepository;

    @Mock
    private ExcelExportService excelExportService;

    @InjectMocks
    private PatientProfileServiceImpl patientProfileService;

    // Test data
    private Patient testPatient;
    private User testUser;
    private static final Long USER_ID = 1L;
    private static final Long PATIENT_ID = 10L;

    @BeforeEach
    void setUp() {
        testPatient = Patient.builder()
                .id(PATIENT_ID)
                .userId(USER_ID)
                .clinicId(100L)
                .fullName("Nguyễn Văn A")
                .phone("0901234567")
                .email("nguyenvana@email.com")
                .gender("Nam")
                .dateOfBirth(LocalDate.of(1990, 5, 15))
                .address("123 Đường ABC, Quận 1, TP.HCM")
                .patientCode("BN-001")
                .bloodType("O+")
                .heightCm(new BigDecimal("170.00"))
                .weightKg(new BigDecimal("65.00"))
                .identityCard("012345678901")
                .occupation("Kỹ sư phần mềm")
                .ethnicity("Kinh")
                .healthInsuranceNumber("HS123456789")
                .joinedDate(LocalDate.of(2024, 1, 1))
                .chronicCondition("Tiểu đường")
                .medicalHistory("Tiểu đường Type 2,Cao huyết áp")
                .allergies("Penicillin,Aspirin")
                .build();

        testUser = User.builder()
                .id(USER_ID)
                .email("nguyenvana@email.com")
                .fullName("Nguyễn Văn A")
                .phone("0901234567")
                .build();
    }

    /**
     * Helper: Mock SecurityContextHolder to return the test user ID.
     */
    private void mockSecurityContext() {
        CustomUserDetails userDetails = CustomUserDetails.builder()
                .id(USER_ID)
                .email("nguyenvana@email.com")
                .build();
        Authentication authentication = mock(Authentication.class);
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        SecurityContextHolder.setContext(securityContext);
    }

    // ================================================================
    // getCurrentPatientProfile()
    // ================================================================
    @Nested
    @DisplayName("getCurrentPatientProfile()")
    class GetCurrentPatientProfileTests {

        @Test
        @DisplayName("TC-PP-001: Lấy hồ sơ bệnh nhân hiện tại thành công")
        void shouldReturnCurrentPatientProfile() {
            // Arrange
            mockSecurityContext();
            when(patientRepository.findByUserId(USER_ID)).thenReturn(Optional.of(testPatient));
            when(emergencyContactRepository.findByPatientId(PATIENT_ID)).thenReturn(Collections.emptyList());
            when(prescriptionRepository.findByPatientIdAndStatus(any(), any())).thenReturn(Collections.emptyList());

            // Act
            PatientProfileResponse result = patientProfileService.getCurrentPatientProfile();

            // Assert
            assertThat(result).isNotNull();
            assertThat(result.getId()).isEqualTo(PATIENT_ID);
            assertThat(result.getFullName()).isEqualTo("Nguyễn Văn A");
            assertThat(result.getPhone()).isEqualTo("0901234567");
            assertThat(result.getEmail()).isEqualTo("nguyenvana@email.com");
            assertThat(result.getPatientCode()).isEqualTo("BN-001");
            assertThat(result.getBloodType()).isEqualTo("O+");
            assertThat(result.getChronicCondition()).isEqualTo("Tiểu đường");
            assertThat(result.getChronicDiseases()).containsExactly("Tiểu đường Type 2", "Cao huyết áp");
            assertThat(result.getAllergies()).containsExactly("Penicillin", "Aspirin");
            assertThat(result.getAge()).isGreaterThan(0);

            verify(patientRepository).findByUserId(USER_ID);
        }

        @Test
        @DisplayName("TC-PP-002: Ném ResourceNotFoundException khi user chưa đăng nhập")
        void shouldThrowExceptionWhenUserNotAuthenticated() {
            // Arrange - empty security context
            SecurityContextHolder.clearContext();

            // Act & Assert
            assertThatThrownBy(() -> patientProfileService.getCurrentPatientProfile())
                    .isInstanceOf(ResourceNotFoundException.class);
        }

        @Test
        @DisplayName("TC-PP-003: Ném ResourceNotFoundException khi không tìm thấy hồ sơ bệnh nhân")
        void shouldThrowExceptionWhenPatientNotFound() {
            // Arrange
            mockSecurityContext();
            when(patientRepository.findByUserId(USER_ID)).thenReturn(Optional.empty());

            // Act & Assert
            assertThatThrownBy(() -> patientProfileService.getCurrentPatientProfile())
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining("Patient profile not found");
        }
    }

    // ================================================================
    // getPatientProfileById()
    // ================================================================
    @Nested
    @DisplayName("getPatientProfileById()")
    class GetPatientProfileByIdTests {

        @Test
        @DisplayName("TC-PP-004: Lấy hồ sơ theo ID thành công")
        void shouldReturnPatientProfileById() {
            // Arrange
            when(patientRepository.findById(PATIENT_ID)).thenReturn(Optional.of(testPatient));
            when(emergencyContactRepository.findByPatientId(PATIENT_ID)).thenReturn(Collections.emptyList());
            when(prescriptionRepository.findByPatientIdAndStatus(any(), any())).thenReturn(Collections.emptyList());

            // Act
            PatientProfileResponse result = patientProfileService.getPatientProfileById(PATIENT_ID);

            // Assert
            assertThat(result).isNotNull();
            assertThat(result.getId()).isEqualTo(PATIENT_ID);
            assertThat(result.getFullName()).isEqualTo("Nguyễn Văn A");
            verify(patientRepository).findById(PATIENT_ID);
        }

        @Test
        @DisplayName("TC-PP-005: Ném exception khi ID không tồn tại")
        void shouldThrowExceptionWhenPatientIdNotFound() {
            // Arrange
            when(patientRepository.findById(999L)).thenReturn(Optional.empty());

            // Act & Assert
            assertThatThrownBy(() -> patientProfileService.getPatientProfileById(999L))
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining("Patient not found: 999");
        }
    }

    // ================================================================
    // updateProfile()
    // ================================================================
    @Nested
    @DisplayName("updateProfile()")
    class UpdateProfileTests {

        @Test
        @DisplayName("TC-PP-006: Cập nhật hồ sơ bệnh nhân thành công")
        void shouldUpdatePatientProfileSuccessfully() {
            // Arrange
            mockSecurityContext();
            UpdatePatientProfileRequest request = UpdatePatientProfileRequest.builder()
                    .fullName("Nguyễn Văn B")
                    .gender("Nam")
                    .phone("0909999888")
                    .email("nguyenvanb@email.com")
                    .address("456 Đường XYZ, Quận 3")
                    .bloodType("A+")
                    .heightCm(new BigDecimal("175.00"))
                    .weightKg(new BigDecimal("70.00"))
                    .identityCard("098765432101")
                    .occupation("Bác sĩ")
                    .ethnicity("Kinh")
                    .healthInsuranceNumber("HS999888777")
                    .dateOfBirth(LocalDate.of(1985, 3, 20))
                    .avatarUrl("https://example.com/avatar.jpg")
                    .medicalHistory("Cao huyết áp")
                    .allergies("Ibuprofen")
                    .build();

            when(patientRepository.findByUserId(USER_ID)).thenReturn(Optional.of(testPatient));
            when(userRepository.findById(USER_ID)).thenReturn(Optional.of(testUser));
            when(patientRepository.save(any(Patient.class))).thenReturn(testPatient);
            when(emergencyContactRepository.findByPatientId(PATIENT_ID)).thenReturn(Collections.emptyList());
            when(prescriptionRepository.findByPatientIdAndStatus(any(), any())).thenReturn(Collections.emptyList());

            // Act
            PatientProfileResponse result = patientProfileService.updateProfile(request);

            // Assert
            assertThat(result).isNotNull();
            verify(patientRepository).save(any(Patient.class));
            verify(userRepository).save(any(User.class));  // Sync to User table
            // Verify patient fields were updated
            assertThat(testPatient.getFullName()).isEqualTo("Nguyễn Văn B");
            assertThat(testPatient.getPhone()).isEqualTo("0909999888");
            assertThat(testPatient.getEmail()).isEqualTo("nguyenvanb@email.com");
            assertThat(testPatient.getBloodType()).isEqualTo("A+");
            assertThat(testPatient.getDateOfBirth()).isEqualTo(LocalDate.of(1985, 3, 20));
            assertThat(testPatient.getAvatarUrl()).isEqualTo("https://example.com/avatar.jpg");
        }

        @Test
        @DisplayName("TC-PP-007: Cập nhật hồ sơ - không thay đổi ngày sinh khi null")
        void shouldNotUpdateDateOfBirthWhenNull() {
            // Arrange
            mockSecurityContext();
            LocalDate originalDob = testPatient.getDateOfBirth();
            UpdatePatientProfileRequest request = UpdatePatientProfileRequest.builder()
                    .fullName("Nguyễn Văn A")
                    .dateOfBirth(null) // intentionally null
                    .build();

            when(patientRepository.findByUserId(USER_ID)).thenReturn(Optional.of(testPatient));
            when(userRepository.findById(USER_ID)).thenReturn(Optional.of(testUser));
            when(patientRepository.save(any(Patient.class))).thenReturn(testPatient);
            when(emergencyContactRepository.findByPatientId(PATIENT_ID)).thenReturn(Collections.emptyList());
            when(prescriptionRepository.findByPatientIdAndStatus(any(), any())).thenReturn(Collections.emptyList());

            // Act
            patientProfileService.updateProfile(request);

            // Assert - dateOfBirth should remain unchanged
            assertThat(testPatient.getDateOfBirth()).isEqualTo(originalDob);
        }

        @Test
        @DisplayName("TC-PP-008: Cập nhật hồ sơ - không thay đổi avatar khi URL rỗng")
        void shouldNotUpdateAvatarWhenEmpty() {
            // Arrange
            mockSecurityContext();
            testPatient.setAvatarUrl("https://old-avatar.com/img.jpg");
            UpdatePatientProfileRequest request = UpdatePatientProfileRequest.builder()
                    .fullName("Test")
                    .avatarUrl("") // empty string
                    .build();

            when(patientRepository.findByUserId(USER_ID)).thenReturn(Optional.of(testPatient));
            when(userRepository.findById(USER_ID)).thenReturn(Optional.of(testUser));
            when(patientRepository.save(any(Patient.class))).thenReturn(testPatient);
            when(emergencyContactRepository.findByPatientId(PATIENT_ID)).thenReturn(Collections.emptyList());
            when(prescriptionRepository.findByPatientIdAndStatus(any(), any())).thenReturn(Collections.emptyList());

            // Act
            patientProfileService.updateProfile(request);

            // Assert
            assertThat(testPatient.getAvatarUrl()).isEqualTo("https://old-avatar.com/img.jpg");
        }
    }

    // ================================================================
    // getEmergencyContacts()
    // ================================================================
    @Nested
    @DisplayName("getEmergencyContacts()")
    class GetEmergencyContactsTests {

        @Test
        @DisplayName("TC-PP-009: Lấy danh sách liên hệ khẩn cấp thành công")
        void shouldReturnEmergencyContacts() {
            // Arrange
            mockSecurityContext();
            EmergencyContact contact1 = EmergencyContact.builder()
                    .id(1L).patient(testPatient)
                    .contactName("Trần Thị B").relationship("Vợ")
                    .phone("0912345678").isPrimary(true).build();
            EmergencyContact contact2 = EmergencyContact.builder()
                    .id(2L).patient(testPatient)
                    .contactName("Nguyễn Văn C").relationship("Anh trai")
                    .phone("0923456789").isPrimary(false).build();

            when(patientRepository.findByUserId(USER_ID)).thenReturn(Optional.of(testPatient));
            when(emergencyContactRepository.findByPatientId(PATIENT_ID)).thenReturn(List.of(contact1, contact2));

            // Act
            List<EmergencyContactResponse> result = patientProfileService.getEmergencyContacts();

            // Assert
            assertThat(result).hasSize(2);
            assertThat(result.get(0).getContactName()).isEqualTo("Trần Thị B");
            assertThat(result.get(0).isPrimary()).isTrue();
            assertThat(result.get(1).getContactName()).isEqualTo("Nguyễn Văn C");
        }

        @Test
        @DisplayName("TC-PP-010: Trả về danh sách rỗng khi không có liên hệ khẩn cấp")
        void shouldReturnEmptyListWhenNoContacts() {
            // Arrange
            mockSecurityContext();
            when(patientRepository.findByUserId(USER_ID)).thenReturn(Optional.of(testPatient));
            when(emergencyContactRepository.findByPatientId(PATIENT_ID)).thenReturn(Collections.emptyList());

            // Act
            List<EmergencyContactResponse> result = patientProfileService.getEmergencyContacts();

            // Assert
            assertThat(result).isEmpty();
        }
    }

    // ================================================================
    // addEmergencyContact()
    // ================================================================
    @Nested
    @DisplayName("addEmergencyContact()")
    class AddEmergencyContactTests {

        @Test
        @DisplayName("TC-PP-011: Thêm liên hệ khẩn cấp thành công")
        void shouldAddEmergencyContactSuccessfully() {
            // Arrange
            mockSecurityContext();
            EmergencyContactRequest request = EmergencyContactRequest.builder()
                    .contactName("Lê Thị D")
                    .relationship("Mẹ")
                    .phone("0934567890")
                    .isPrimary(true)
                    .build();
            EmergencyContact savedContact = EmergencyContact.builder()
                    .id(5L).patient(testPatient)
                    .contactName("Lê Thị D").relationship("Mẹ")
                    .phone("0934567890").isPrimary(true).build();

            when(patientRepository.findByUserId(USER_ID)).thenReturn(Optional.of(testPatient));
            when(emergencyContactRepository.save(any(EmergencyContact.class))).thenReturn(savedContact);

            // Act
            EmergencyContactResponse result = patientProfileService.addEmergencyContact(request);

            // Assert
            assertThat(result).isNotNull();
            assertThat(result.getId()).isEqualTo(5L);
            assertThat(result.getContactName()).isEqualTo("Lê Thị D");
            assertThat(result.getRelationship()).isEqualTo("Mẹ");
            assertThat(result.isPrimary()).isTrue();
            verify(emergencyContactRepository).save(any(EmergencyContact.class));
        }
    }

    // ================================================================
    // updateEmergencyContact()
    // ================================================================
    @Nested
    @DisplayName("updateEmergencyContact()")
    class UpdateEmergencyContactTests {

        @Test
        @DisplayName("TC-PP-012: Cập nhật liên hệ khẩn cấp thành công")
        void shouldUpdateEmergencyContactSuccessfully() {
            // Arrange
            EmergencyContact existing = EmergencyContact.builder()
                    .id(1L).patient(testPatient)
                    .contactName("Old Name").relationship("Bạn")
                    .phone("0900000000").isPrimary(false).build();
            EmergencyContactRequest request = EmergencyContactRequest.builder()
                    .contactName("New Name").relationship("Vợ")
                    .phone("0911111111").isPrimary(true).build();

            when(emergencyContactRepository.findById(1L)).thenReturn(Optional.of(existing));
            when(emergencyContactRepository.save(any(EmergencyContact.class))).thenReturn(existing);

            // Act
            EmergencyContactResponse result = patientProfileService.updateEmergencyContact(1L, request);

            // Assert
            assertThat(result).isNotNull();
            assertThat(existing.getContactName()).isEqualTo("New Name");
            assertThat(existing.getRelationship()).isEqualTo("Vợ");
            assertThat(existing.getPhone()).isEqualTo("0911111111");
            verify(emergencyContactRepository).save(existing);
        }

        @Test
        @DisplayName("TC-PP-013: Ném exception khi liên hệ khẩn cấp không tồn tại")
        void shouldThrowExceptionWhenContactNotFound() {
            // Arrange
            when(emergencyContactRepository.findById(999L)).thenReturn(Optional.empty());

            // Act & Assert
            assertThatThrownBy(() -> patientProfileService.updateEmergencyContact(999L,
                    EmergencyContactRequest.builder().contactName("X").relationship("Y").phone("0900000000").build()))
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining("Emergency contact not found: 999");
        }
    }

    // ================================================================
    // generateReport()
    // ================================================================
    @Nested
    @DisplayName("generateReport()")
    class GenerateReportTests {

        @Test
        @DisplayName("TC-PP-014: Tạo báo cáo Excel thành công")
        void shouldGenerateReportSuccessfully() throws Exception {
            // Arrange
            mockSecurityContext();
            byte[] fakeReport = new byte[]{1, 2, 3, 4, 5};
            when(excelExportService.generatePatientReport(USER_ID)).thenReturn(fakeReport);

            // Act
            byte[] result = patientProfileService.generateReport();

            // Assert
            assertThat(result).isEqualTo(fakeReport);
            verify(excelExportService).generatePatientReport(USER_ID);
        }

        @Test
        @DisplayName("TC-PP-015: Ném RuntimeException khi tạo báo cáo lỗi I/O")
        void shouldThrowRuntimeExceptionOnIOError() throws Exception {
            // Arrange
            mockSecurityContext();
            when(excelExportService.generatePatientReport(USER_ID))
                    .thenThrow(new java.io.IOException("Disk error"));

            // Act & Assert
            assertThatThrownBy(() -> patientProfileService.generateReport())
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("Failed to generate report");
        }
    }
}
