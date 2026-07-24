package com.project.service;

import com.project.dto.request.CreateAppointmentRequest;
import com.project.dto.response.DoctorSimpleResponse;
import com.project.dto.response.PatientAppointmentResponse;
import com.project.entity.*;
import com.project.repository.AppointmentRepository;
import com.project.repository.ClinicRepository;
import com.project.repository.PatientRepository;
import com.project.repository.UserRepository;
import com.project.security.CustomUserDetails;
import com.project.service.impl.PatientAppointmentServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

import org.mockito.quality.Strictness;
import org.mockito.junit.jupiter.MockitoSettings;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
@SuppressWarnings("null")
@DisplayName("PatientAppointmentService Unit Tests")
class PatientAppointmentServiceTest {

    @Mock
    private AppointmentRepository appointmentRepository;

    @Mock
    private PatientRepository patientRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ClinicRepository clinicRepository;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private PatientAppointmentServiceImpl appointmentService;

    // Test data
    private Patient testPatient;
    private User testDoctor;
    private Clinic testClinic;
    private Appointment testAppointment;
    private static final Long USER_ID = 1L;
    private static final Long PATIENT_ID = 10L;
    private static final Long DOCTOR_ID = 20L;
    private static final Long CLINIC_ID = 100L;

    @BeforeEach
    void setUp() {
        testPatient = Patient.builder()
                .id(PATIENT_ID)
                .userId(USER_ID)
                .clinicId(CLINIC_ID)
                .fullName("Nguyễn Văn A")
                .phone("0901234567")
                .email("patient@email.com")
                .gender("Nam")
                .build();

        testDoctor = User.builder()
                .id(DOCTOR_ID)
                .fullName("BS. Trần Văn B")
                .email("doctor@email.com")
                .specialization("Nội khoa")
                .avatarUrl("https://example.com/doctor.jpg")
                .role(UserRole.DOCTOR)
                .clinicId(CLINIC_ID)
                .status("ACTIVE")
                .build();

        testClinic = Clinic.builder()
                .id(CLINIC_ID)
                .name("Phòng khám Sức Khỏe Xanh")
                .build();

        testAppointment = Appointment.builder()
                .id(1L)
                .patient(testPatient)
                .doctorId(DOCTOR_ID)
                .doctorName("BS. Trần Văn B")
                .doctorSpecialty("Nội khoa")
                .doctorAvatarUrl("https://example.com/doctor.jpg")
                .appointmentTime(LocalDateTime.of(2026, 6, 15, 10, 0))
                .status(AppointmentStatus.PENDING)
                .type("IN_PERSON")
                .location("Phòng khám Sức Khỏe Xanh")
                .reminderEnabled(false)
                .build();
    }

    private void mockSecurityContext() {
        CustomUserDetails userDetails = CustomUserDetails.builder()
                .id(USER_ID)
                .email("patient@email.com")
                .build();
        Authentication auth = mock(Authentication.class);
        SecurityContext ctx = mock(SecurityContext.class);
        when(ctx.getAuthentication()).thenReturn(auth);
        when(auth.getPrincipal()).thenReturn(userDetails);
        SecurityContextHolder.setContext(ctx);
    }

    // ================================================================
    // create()
    // ================================================================
    @Nested
    @DisplayName("create() - Tạo lịch hẹn mới")
    class CreateAppointmentTests {

        @Test
        @DisplayName("TC-PA-001: Tạo lịch hẹn IN_PERSON thành công")
        void shouldCreateInPersonAppointmentSuccessfully() {
            // Arrange
            mockSecurityContext();
            CreateAppointmentRequest request = CreateAppointmentRequest.builder()
                    .doctorId(DOCTOR_ID)
                    .appointmentTime(LocalDateTime.of(2026, 7, 1, 9, 0))
                    .appointmentType("IN_PERSON")
                    .build();

            when(patientRepository.findByUserId(USER_ID)).thenReturn(Optional.of(testPatient));
            when(userRepository.findById(DOCTOR_ID)).thenReturn(Optional.of(testDoctor));
            when(clinicRepository.findById(CLINIC_ID)).thenReturn(Optional.of(testClinic));
            when(appointmentRepository.save(any(Appointment.class))).thenAnswer(inv -> {
                Appointment a = inv.getArgument(0);
                a.setId(99L);
                return a;
            });

            // Act
            PatientAppointmentResponse result = appointmentService.create(request);

            // Assert
            assertThat(result).isNotNull();
            assertThat(result.getDoctorName()).isEqualTo("BS. Trần Văn B");
            assertThat(result.getStatus()).isEqualTo("PENDING");
            assertThat(result.getLocation()).isEqualTo("Phòng khám Sức Khỏe Xanh");
            assertThat(result.getMeetingLink()).isNull();
            verify(appointmentRepository).save(any(Appointment.class));
            verify(notificationService).sendNotification(eq(DOCTOR_ID), any(), any(), any(), any());
        }

        @Test
        @DisplayName("TC-PA-002: Tạo lịch hẹn ONLINE - có meeting link")
        void shouldCreateOnlineAppointmentWithMeetingLink() {
            // Arrange
            mockSecurityContext();
            CreateAppointmentRequest request = CreateAppointmentRequest.builder()
                    .doctorId(DOCTOR_ID)
                    .appointmentTime(LocalDateTime.of(2026, 7, 2, 14, 0))
                    .appointmentType("ONLINE")
                    .build();

            when(patientRepository.findByUserId(USER_ID)).thenReturn(Optional.of(testPatient));
            when(userRepository.findById(DOCTOR_ID)).thenReturn(Optional.of(testDoctor));
            when(clinicRepository.findById(CLINIC_ID)).thenReturn(Optional.of(testClinic));
            when(appointmentRepository.save(any(Appointment.class))).thenAnswer(inv -> {
                Appointment a = inv.getArgument(0);
                a.setId(100L);
                return a;
            });

            // Act
            PatientAppointmentResponse result = appointmentService.create(request);

            // Assert
            assertThat(result).isNotNull();
            assertThat(result.getMeetingLink()).isNotNull().contains("meet.google.com");
            assertThat(result.getLocation()).isNull(); // Online has no physical location
        }

        @Test
        @DisplayName("TC-PA-003: Tạo lịch hẹn khi bác sĩ không tồn tại - vẫn thành công (doctor = null)")
        void shouldCreateAppointmentEvenWhenDoctorNotFound() {
            // Arrange
            mockSecurityContext();
            CreateAppointmentRequest request = CreateAppointmentRequest.builder()
                    .doctorId(999L)
                    .appointmentTime(LocalDateTime.of(2026, 7, 3, 8, 0))
                    .appointmentType("IN_PERSON")
                    .build();

            when(patientRepository.findByUserId(USER_ID)).thenReturn(Optional.of(testPatient));
            when(userRepository.findById(999L)).thenReturn(Optional.empty());
            when(clinicRepository.findById(CLINIC_ID)).thenReturn(Optional.of(testClinic));
            when(appointmentRepository.save(any(Appointment.class))).thenAnswer(inv -> {
                Appointment a = inv.getArgument(0);
                a.setId(101L);
                return a;
            });

            // Act
            PatientAppointmentResponse result = appointmentService.create(request);

            // Assert
            assertThat(result).isNotNull();
            assertThat(result.getDoctorName()).isNull(); // no doctor info
            verify(notificationService, never()).sendNotification(any(), any(), any(), any(), any());
        }
    }

    // ================================================================
    // getUpcoming()
    // ================================================================
    @Nested
    @DisplayName("getUpcoming() - Lấy lịch hẹn sắp tới")
    class GetUpcomingTests {

        @Test
        @DisplayName("TC-PA-004: Lấy danh sách lịch hẹn sắp tới thành công")
        void shouldReturnUpcomingAppointments() {
            // Arrange
            mockSecurityContext();
            Appointment appt1 = Appointment.builder()
                    .id(1L).patient(testPatient).doctorId(DOCTOR_ID)
                    .doctorName("BS. Trần Văn B").doctorSpecialty("Nội khoa")
                    .appointmentTime(LocalDateTime.now().plusDays(1))
                    .status(AppointmentStatus.PENDING).type("IN_PERSON").build();

            when(patientRepository.findByUserId(USER_ID)).thenReturn(Optional.of(testPatient));
            when(appointmentRepository.findByPatientIdAndStatusInAndAppointmentTimeAfterOrderByAppointmentTimeAsc(
                    eq(PATIENT_ID), any(), any())).thenReturn(List.of(appt1));

            // Act
            List<PatientAppointmentResponse> result = appointmentService.getUpcoming();

            // Assert
            assertThat(result).hasSize(1);
            assertThat(result.get(0).getStatus()).isEqualTo("PENDING");
        }

        @Test
        @DisplayName("TC-PA-005: Trả về danh sách rỗng khi không có lịch hẹn sắp tới")
        void shouldReturnEmptyWhenNoUpcoming() {
            // Arrange
            mockSecurityContext();
            when(patientRepository.findByUserId(USER_ID)).thenReturn(Optional.of(testPatient));
            when(appointmentRepository.findByPatientIdAndStatusInAndAppointmentTimeAfterOrderByAppointmentTimeAsc(
                    eq(PATIENT_ID), any(), any())).thenReturn(Collections.emptyList());

            // Act
            List<PatientAppointmentResponse> result = appointmentService.getUpcoming();

            // Assert
            assertThat(result).isEmpty();
        }
    }

    // ================================================================
    // getHistory()
    // ================================================================
    @Nested
    @DisplayName("getHistory() - Lấy lịch sử khám bệnh")
    class GetHistoryTests {

        @Test
        @DisplayName("TC-PA-006: Lấy lịch sử khám bệnh có phân trang thành công")
        void shouldReturnAppointmentHistory() {
            // Arrange
            mockSecurityContext();
            Appointment completed = Appointment.builder()
                    .id(50L).patient(testPatient).doctorId(DOCTOR_ID)
                    .doctorName("BS. Trần Văn B").doctorSpecialty("Nội khoa")
                    .appointmentTime(LocalDateTime.of(2026, 1, 10, 9, 0))
                    .status(AppointmentStatus.COMPLETED).type("IN_PERSON")
                    .diagnosisSummary("Huyết áp bình thường").build();
            Pageable pageable = PageRequest.of(0, 10);
            Page<Appointment> page = new PageImpl<>(List.of(completed), pageable, 1);

            when(patientRepository.findByUserId(USER_ID)).thenReturn(Optional.of(testPatient));
            when(appointmentRepository.findByPatientIdAndStatusOrderByAppointmentTimeDesc(
                    PATIENT_ID, AppointmentStatus.COMPLETED, pageable)).thenReturn(page);

            // Act
            Page<PatientAppointmentResponse> result = appointmentService.getHistory(pageable);

            // Assert
            assertThat(result.getContent()).hasSize(1);
            assertThat(result.getContent().get(0).getStatus()).isEqualTo("COMPLETED");
            assertThat(result.getContent().get(0).getDiagnosisSummary()).isEqualTo("Huyết áp bình thường");
            assertThat(result.getTotalElements()).isEqualTo(1);
        }
    }

    // ================================================================
    // cancel()
    // ================================================================
    @Nested
    @DisplayName("cancel() - Hủy lịch hẹn")
    class CancelTests {

        @Test
        @DisplayName("TC-PA-007: Hủy lịch hẹn PENDING thành công")
        void shouldCancelPendingAppointmentSuccessfully() {
            // Arrange
            mockSecurityContext();
            Appointment pending = Appointment.builder()
                    .id(1L).patient(testPatient).doctorId(DOCTOR_ID)
                    .status(AppointmentStatus.PENDING).build();

            when(patientRepository.findByUserId(USER_ID)).thenReturn(Optional.of(testPatient));
            when(appointmentRepository.findById(1L)).thenReturn(Optional.of(pending));

            // Act
            appointmentService.cancel(1L);

            // Assert
            assertThat(pending.getStatus()).isEqualTo(AppointmentStatus.CANCELLED);
            verify(appointmentRepository).saveAndFlush(pending);
        }

        @Test
        @DisplayName("TC-PA-008: Không thể hủy lịch hẹn đã hoàn tất (COMPLETED)")
        void shouldNotCancelCompletedAppointment() {
            // Arrange
            mockSecurityContext();
            Appointment completed = Appointment.builder()
                    .id(2L).patient(testPatient).doctorId(DOCTOR_ID)
                    .status(AppointmentStatus.COMPLETED).build();

            when(patientRepository.findByUserId(USER_ID)).thenReturn(Optional.of(testPatient));
            when(appointmentRepository.findById(2L)).thenReturn(Optional.of(completed));

            // Act & Assert
            assertThatThrownBy(() -> appointmentService.cancel(2L))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("hủy");
        }

        @Test
        @DisplayName("TC-PA-009: Không thể hủy lịch hẹn đã xác nhận (SCHEDULED)")
        void shouldNotCancelScheduledAppointment() {
            // Arrange
            mockSecurityContext();
            Appointment scheduled = Appointment.builder()
                    .id(3L).patient(testPatient).doctorId(DOCTOR_ID)
                    .status(AppointmentStatus.SCHEDULED).build();

            when(patientRepository.findByUserId(USER_ID)).thenReturn(Optional.of(testPatient));
            when(appointmentRepository.findById(3L)).thenReturn(Optional.of(scheduled));

            // Act & Assert
            assertThatThrownBy(() -> appointmentService.cancel(3L))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("bác sĩ xác nhận");
        }

        @Test
        @DisplayName("TC-PA-010: Không thể hủy lịch hẹn của người khác (Unauthorized)")
        void shouldNotCancelOtherPatientsAppointment() {
            // Arrange
            mockSecurityContext();
            Patient otherPatient = Patient.builder().id(999L).userId(888L).build();
            Appointment otherAppt = Appointment.builder()
                    .id(4L).patient(otherPatient).doctorId(DOCTOR_ID)
                    .status(AppointmentStatus.PENDING).build();

            when(patientRepository.findByUserId(USER_ID)).thenReturn(Optional.of(testPatient));
            when(appointmentRepository.findById(4L)).thenReturn(Optional.of(otherAppt));

            // Act & Assert
            assertThatThrownBy(() -> appointmentService.cancel(4L))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("quyền");
        }

        @Test
        @DisplayName("TC-PA-011: Ném exception khi lịch hẹn không tồn tại")
        void shouldThrowExceptionWhenAppointmentNotFound() {
            // Arrange
            mockSecurityContext();
            when(patientRepository.findByUserId(USER_ID)).thenReturn(Optional.of(testPatient));
            when(appointmentRepository.findById(999L)).thenReturn(Optional.empty());

            // Act & Assert
            assertThatThrownBy(() -> appointmentService.cancel(999L))
                    .isInstanceOf(RuntimeException.class);
        }
    }

    // ================================================================
    // getAvailableDoctors()
    // ================================================================
    @Nested
    @DisplayName("getAvailableDoctors() - Lấy danh sách bác sĩ khả dụng")
    class GetAvailableDoctorsTests {

        @Test
        @DisplayName("TC-PA-012: Lấy danh sách bác sĩ thuộc phòng khám của bệnh nhân")
        void shouldReturnDoctorsFromPatientClinic() {
            // Arrange
            mockSecurityContext();
            User doctor2 = User.builder()
                    .id(21L).fullName("BS. Lê Thị C").specialization("Tim mạch")
                    .role(UserRole.DOCTOR).clinicId(CLINIC_ID).status("ACTIVE")
                    .avatarUrl("https://example.com/doctor2.jpg").build();

            when(patientRepository.findByUserId(USER_ID)).thenReturn(Optional.of(testPatient));
            when(userRepository.findByClinicIdAndRoleAndIsDeletedFalse(CLINIC_ID, UserRole.DOCTOR))
                    .thenReturn(List.of(testDoctor, doctor2));

            // Act
            List<DoctorSimpleResponse> result = appointmentService.getAvailableDoctors();

            // Assert
            assertThat(result).hasSize(2);
            assertThat(result.get(0).getName()).isEqualTo("BS. Trần Văn B");
            assertThat(result.get(0).getSpecialty()).isEqualTo("Nội khoa");
            assertThat(result.get(1).getName()).isEqualTo("BS. Lê Thị C");
        }

        @Test
        @DisplayName("TC-PA-013: Trả về danh sách rỗng khi bệnh nhân chưa thuộc phòng khám nào")
        void shouldReturnEmptyWhenPatientHasNoClinic() {
            // Arrange
            mockSecurityContext();
            Patient noClinicPatient = Patient.builder()
                    .id(PATIENT_ID).userId(USER_ID).clinicId(null).build();

            when(patientRepository.findByUserId(USER_ID)).thenReturn(Optional.of(noClinicPatient));

            // Act
            List<DoctorSimpleResponse> result = appointmentService.getAvailableDoctors();

            // Assert
            assertThat(result).isEmpty();
        }

        @Test
        @DisplayName("TC-PA-014: Lọc bỏ bác sĩ đã bị xóa hoặc không hoạt động")
        void shouldFilterOutDeletedAndInactiveDoctors() {
            // Arrange
            mockSecurityContext();
            User deletedDoctor = User.builder()
                    .id(22L).fullName("BS. Deleted").role(UserRole.DOCTOR)
                    .clinicId(CLINIC_ID).status("ACTIVE").build();
            deletedDoctor.setDeleted(true);

            User inactiveDoctor = User.builder()
                    .id(23L).fullName("BS. Inactive").role(UserRole.DOCTOR)
                    .clinicId(CLINIC_ID).status("INACTIVE").build();

            when(patientRepository.findByUserId(USER_ID)).thenReturn(Optional.of(testPatient));
            when(userRepository.findByClinicIdAndRoleAndIsDeletedFalse(CLINIC_ID, UserRole.DOCTOR))
                    .thenReturn(List.of(testDoctor, deletedDoctor, inactiveDoctor));

            // Act
            List<DoctorSimpleResponse> result = appointmentService.getAvailableDoctors();

            // Assert - only the active, non-deleted doctor should remain
            assertThat(result).hasSize(1);
            assertThat(result.get(0).getName()).isEqualTo("BS. Trần Văn B");
        }
    }

    // ================================================================
    // toggleReminder()
    // ================================================================
    @Nested
    @DisplayName("toggleReminder() - Bật/tắt nhắc nhở lịch hẹn")
    class ToggleReminderTests {

        @Test
        @DisplayName("TC-PA-015: Bật nhắc nhở lịch hẹn thành công")
        void shouldEnableReminderSuccessfully() {
            // Arrange
            mockSecurityContext();
            when(patientRepository.findByUserId(USER_ID)).thenReturn(Optional.of(testPatient));
            when(appointmentRepository.findById(1L)).thenReturn(Optional.of(testAppointment));

            // Act
            appointmentService.toggleReminder(1L, true);

            // Assert
            assertThat(testAppointment.isReminderEnabled()).isTrue();
            verify(appointmentRepository).saveAndFlush(testAppointment);
        }

        @Test
        @DisplayName("TC-PA-016: Tắt nhắc nhở lịch hẹn thành công")
        void shouldDisableReminderSuccessfully() {
            // Arrange
            mockSecurityContext();
            testAppointment.setReminderEnabled(true);
            when(patientRepository.findByUserId(USER_ID)).thenReturn(Optional.of(testPatient));
            when(appointmentRepository.findById(1L)).thenReturn(Optional.of(testAppointment));

            // Act
            appointmentService.toggleReminder(1L, false);

            // Assert
            assertThat(testAppointment.isReminderEnabled()).isFalse();
        }

        @Test
        @DisplayName("TC-PA-017: Ném exception khi toggle nhắc nhở cho lịch hẹn không phải của mình")
        void shouldThrowExceptionWhenToggleOtherPatientsReminder() {
            // Arrange
            mockSecurityContext();
            Patient other = Patient.builder().id(999L).userId(888L).build();
            Appointment otherAppt = Appointment.builder()
                    .id(5L).patient(other).doctorId(DOCTOR_ID)
                    .status(AppointmentStatus.PENDING).build();

            when(patientRepository.findByUserId(USER_ID)).thenReturn(Optional.of(testPatient));
            when(appointmentRepository.findById(5L)).thenReturn(Optional.of(otherAppt));

            // Act & Assert
            assertThatThrownBy(() -> appointmentService.toggleReminder(5L, true))
                    .isInstanceOf(RuntimeException.class);
        }
    }
}
