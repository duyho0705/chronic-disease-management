package com.project.service;

import com.project.dto.request.CreateDoctorRequest;
import com.project.dto.request.CreatePatientRequest;
import com.project.dto.response.ClinicDoctorResponse;
import com.project.dto.response.ClinicPatientResponse;
import com.project.dto.response.DoctorSnippetDto;
import com.project.entity.*;
import com.project.mapper.PatientMapper;
import com.project.repository.*;
import com.project.service.impl.ClinicDoctorServiceImpl;
import com.project.service.impl.ClinicPatientServiceImpl;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@SuppressWarnings("null")
@DisplayName("Clinic Service Unit Tests (KCPM-22)")
class ClinicServiceTest {

    private static final Long CLINIC_ID = 100L;

    // ================================================================
    // ClinicDoctorService Tests
    // ================================================================
    @Nested
    @DisplayName("ClinicDoctorService - Quản lý bác sĩ")
    class ClinicDoctorServiceTests {

        @Mock private UserRepository userRepository;
        @Mock private PatientRepository patientRepository;
        @Mock private PasswordEncoder passwordEncoder;
        @InjectMocks private ClinicDoctorServiceImpl doctorService;

        private CreateDoctorRequest buildDoctorRequest(String name, String email, String phone, String specialty, String license) {
            CreateDoctorRequest req = new CreateDoctorRequest();
            req.setName(name);
            req.setEmail(email);
            req.setPhone(phone);
            req.setSpecialty(specialty);
            req.setLicenseNumber(license);
            req.setPassword("Password1!");
            return req;
        }

        @Test
        @DisplayName("TC-CS-001: Lấy danh sách bác sĩ theo phòng khám thành công")
        void shouldGetDoctorRecords() {
            User doc = User.builder().id(20L).fullName("BS. Trần Văn B")
                    .email("doc@email.com").specialization("Nội khoa")
                    .status("ACTIVE").clinicId(CLINIC_ID).build();
            Page<User> page = new PageImpl<>(List.of(doc), PageRequest.of(0, 10), 1);
            when(patientRepository.countPatientsByDoctorIds(CLINIC_ID)).thenReturn(Collections.emptyList());
            when(userRepository.findByFilters(eq(UserRole.DOCTOR), any(), eq(CLINIC_ID), any(), any(), any(), any(), any()))
                    .thenReturn(page);

            Page<ClinicDoctorResponse> result = doctorService.getDoctorRecords(CLINIC_ID, null, null, null, null, null, PageRequest.of(0, 10));

            assertThat(result.getContent()).hasSize(1);
            assertThat(result.getContent().get(0).getName()).isEqualTo("BS. Trần Văn B");
        }

        @Test
        @DisplayName("TC-CS-002: Tạo bác sĩ mới thành công")
        void shouldCreateDoctor() {
            CreateDoctorRequest request = buildDoctorRequest("BS. Mới", "newdoc@email.com", "0912345678", "Tim mạch", "LN-001");
            when(userRepository.findByEmail("newdoc@email.com")).thenReturn(Optional.empty());
            when(passwordEncoder.encode(any())).thenReturn("encoded");
            when(userRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

            assertThatCode(() -> doctorService.createDoctor(CLINIC_ID, request))
                    .doesNotThrowAnyException();
            verify(userRepository).save(any(User.class));
        }

        @Test
        @DisplayName("TC-CS-003: Ném lỗi khi tạo bác sĩ với email đã tồn tại")
        void shouldThrowWhenDuplicateEmail() {
            CreateDoctorRequest request = buildDoctorRequest("BS. Trùng", "existing@email.com", "0912345678", "Nội", "LN-002");
            when(userRepository.findByEmail("existing@email.com")).thenReturn(Optional.of(new User()));

            assertThatThrownBy(() -> doctorService.createDoctor(CLINIC_ID, request))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("Email already exists");
        }

        @Test
        @DisplayName("TC-CS-004: Cập nhật bác sĩ thành công")
        void shouldUpdateDoctor() {
            User existing = User.builder().id(20L).clinicId(CLINIC_ID)
                    .fullName("BS. Cũ").role(UserRole.DOCTOR).build();
            CreateDoctorRequest request = buildDoctorRequest("BS. Mới", null, "0999888777", "Da liễu", "LN-003");
            when(userRepository.findById(20L)).thenReturn(Optional.of(existing));
            when(userRepository.save(any())).thenReturn(existing);

            assertThatCode(() -> doctorService.updateDoctor(CLINIC_ID, 20L, request))
                    .doesNotThrowAnyException();
            assertThat(existing.getFullName()).isEqualTo("BS. Mới");
        }

        @Test
        @DisplayName("TC-CS-005: Ném lỗi khi cập nhật bác sĩ khác phòng khám")
        void shouldThrowWhenUpdateDoctorFromOtherClinic() {
            User doctorOther = User.builder().id(20L).clinicId(999L).build();
            when(userRepository.findById(20L)).thenReturn(Optional.of(doctorOther));

            assertThatThrownBy(() -> doctorService.updateDoctor(CLINIC_ID, 20L, new CreateDoctorRequest()))
                    .isInstanceOf(AccessDeniedException.class);
        }

        @Test
        @DisplayName("TC-CS-006: Xóa mềm bác sĩ thành công")
        void shouldSoftDeleteDoctor() {
            User doc = User.builder().id(20L).clinicId(CLINIC_ID).fullName("BS. Xóa").build();
            when(userRepository.findById(20L)).thenReturn(Optional.of(doc));
            when(userRepository.save(any())).thenReturn(doc);

            doctorService.deleteDoctor(CLINIC_ID, 20L);

            assertThat(doc.isDeleted()).isTrue();
        }

        @Test
        @DisplayName("TC-CS-007: Lấy danh sách bác sĩ khả dụng")
        void shouldGetAvailableDoctors() {
            User doc1 = User.builder().id(20L).fullName("BS. A").specialization("Nội").clinicId(CLINIC_ID).build();
            when(userRepository.findByClinicIdAndRoleAndIsDeletedFalse(CLINIC_ID, UserRole.DOCTOR)).thenReturn(List.of(doc1));
            when(patientRepository.countPatientsByDoctorIds(CLINIC_ID)).thenReturn(Collections.emptyList());

            List<DoctorSnippetDto> result = doctorService.getAvailableDoctors(CLINIC_ID);

            assertThat(result).hasSize(1);
            assertThat(result.get(0).getName()).isEqualTo("BS. A");
        }
    }

    // ================================================================
    // ClinicPatientService Tests
    // ================================================================
    @Nested
    @DisplayName("ClinicPatientService - Quản lý bệnh nhân")
    class ClinicPatientServiceTests {

        @Mock private PatientRepository patientRepository;
        @Mock private UserRepository userRepository;
        @Mock private PasswordEncoder passwordEncoder;
        @Mock private PatientMapper patientMapper;
        @Mock private NotificationRepository notificationRepository;
        @Mock private AppointmentRepository appointmentRepository;
        @Mock private PatientHealthMetricService healthMetricService;
        @InjectMocks private ClinicPatientServiceImpl patientService;

        private CreatePatientRequest buildPatientRequest(String name, String phone, String gender, String email) {
            CreatePatientRequest req = new CreatePatientRequest();
            req.setName(name);
            req.setPhone(phone);
            req.setGender(gender);
            req.setEmail(email);
            req.setPassword("Password1!");
            return req;
        }

        @Test
        @DisplayName("TC-CS-008: Lấy danh sách bệnh nhân với bộ lọc")
        void shouldGetPatientRecords() {
            Patient p = Patient.builder().id(10L).fullName("Nguyễn A").clinicId(CLINIC_ID).build();
            Page<Patient> page = new PageImpl<>(List.of(p), PageRequest.of(0, 10), 1);
            when(patientRepository.findByClinicIdAndFilters(eq(CLINIC_ID), any(), any(), any(), any(), any(), any()))
                    .thenReturn(page);
            when(userRepository.findByFilters(any(), any(), any(), any(), any(), any(), any(), any()))
                    .thenReturn(new PageImpl<>(Collections.emptyList()));
            when(patientMapper.toClinicPatientResponse(any(), any()))
                    .thenReturn(ClinicPatientResponse.builder().dbId(10L).name("Nguyễn A").build());

            Page<ClinicPatientResponse> result = patientService.getPatientRecords(CLINIC_ID, null, null, null, null, null, PageRequest.of(0, 10));

            assertThat(result.getContent()).hasSize(1);
        }

        @Test
        @DisplayName("TC-CS-009: Tạo bệnh nhân mới thành công")
        void shouldCreatePatient() {
            CreatePatientRequest request = buildPatientRequest("Lê Văn C", "0901234567", "Nam", "lvc@email.com");
            when(userRepository.findByEmail("lvc@email.com")).thenReturn(Optional.empty());
            when(passwordEncoder.encode(any())).thenReturn("encoded");
            when(userRepository.save(any())).thenAnswer(inv -> {
                User u = inv.getArgument(0); u.setId(99L); return u;
            });
            when(patientRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

            assertThatCode(() -> patientService.createPatient(CLINIC_ID, request))
                    .doesNotThrowAnyException();
            verify(patientRepository).save(any(Patient.class));
        }

        @Test
        @DisplayName("TC-CS-010: Ném lỗi khi tạo bệnh nhân với email trùng")
        void shouldThrowWhenPatientEmailDuplicate() {
            CreatePatientRequest request = buildPatientRequest("Trùng", "0901234567", "Nam", "dup@email.com");
            when(userRepository.findByEmail("dup@email.com")).thenReturn(Optional.of(new User()));

            assertThatThrownBy(() -> patientService.createPatient(CLINIC_ID, request))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("Email");
        }

        @Test
        @DisplayName("TC-CS-011: Cập nhật bệnh nhân thành công")
        void shouldUpdatePatient() {
            Patient p = Patient.builder().id(10L).userId(1L).clinicId(CLINIC_ID)
                    .fullName("Cũ").build();
            CreatePatientRequest request = buildPatientRequest("Mới", "0909999888", null, null);
            when(patientRepository.findById(10L)).thenReturn(Optional.of(p));
            when(userRepository.findById(1L)).thenReturn(Optional.of(User.builder().id(1L).build()));
            when(userRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
            when(patientRepository.save(any())).thenReturn(p);

            assertThatCode(() -> patientService.updatePatient(CLINIC_ID, 10L, request))
                    .doesNotThrowAnyException();
            assertThat(p.getFullName()).isEqualTo("Mới");
        }

        @Test
        @DisplayName("TC-CS-012: Ném lỗi khi cập nhật bệnh nhân khác phòng khám")
        void shouldThrowWhenUpdatePatientFromOtherClinic() {
            Patient p = Patient.builder().id(10L).clinicId(999L).build();
            when(patientRepository.findById(10L)).thenReturn(Optional.of(p));

            assertThatThrownBy(() -> patientService.updatePatient(CLINIC_ID, 10L, new CreatePatientRequest()))
                    .isInstanceOf(AccessDeniedException.class);
        }

        @Test
        @DisplayName("TC-CS-013: Xóa mềm bệnh nhân thành công")
        void shouldSoftDeletePatient() {
            Patient p = Patient.builder().id(10L).userId(1L).clinicId(CLINIC_ID).build();
            when(patientRepository.findById(10L)).thenReturn(Optional.of(p));
            when(userRepository.findById(1L)).thenReturn(Optional.of(User.builder().id(1L).build()));
            when(patientRepository.save(any())).thenReturn(p);
            when(userRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

            patientService.deletePatient(CLINIC_ID, 10L);

            assertThat(p.isDeleted()).isTrue();
        }

        @Test
        @DisplayName("TC-CS-014: Ném lỗi khi xóa bệnh nhân khác phòng khám")
        void shouldThrowWhenDeletePatientFromOtherClinic() {
            Patient p = Patient.builder().id(10L).clinicId(999L).build();
            when(patientRepository.findById(10L)).thenReturn(Optional.of(p));

            assertThatThrownBy(() -> patientService.deletePatient(CLINIC_ID, 10L))
                    .isInstanceOf(AccessDeniedException.class);
        }

        @Test
        @DisplayName("TC-CS-015: Gửi thông báo cho bệnh nhân thành công")
        void shouldSendNotification() {
            Patient p = Patient.builder().id(10L).userId(1L).clinicId(CLINIC_ID).build();
            when(patientRepository.findById(10L)).thenReturn(Optional.of(p));
            when(notificationRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

            assertThatCode(() -> patientService.sendNotificationToPatient(CLINIC_ID, 10L, "Nhắc nhở tái khám"))
                    .doesNotThrowAnyException();
            verify(notificationRepository).save(any());
        }

        @Test
        @DisplayName("TC-CS-016: Ném lỗi khi bệnh nhân không tồn tại")
        void shouldThrowWhenPatientNotFound() {
            when(patientRepository.findById(999L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> patientService.deletePatient(CLINIC_ID, 999L))
                    .isInstanceOf(RuntimeException.class);
        }
    }
}
