package com.project.service;

import com.project.dto.response.DoctorAppointmentResponse;
import com.project.entity.*;
import com.project.exception.ResourceNotFoundException;
import com.project.repository.AppointmentRepository;
import com.project.repository.PatientRepository;
import com.project.repository.UserRepository;
import com.project.security.CustomUserDetails;
import com.project.service.impl.DoctorAppointmentServiceImpl;
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

import java.time.LocalDate;
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
@DisplayName("DoctorAppointmentService Unit Tests (KCPM-18)")
class DoctorAppointmentServiceTest {

    @Mock private AppointmentRepository appointmentRepository;
    @Mock private NotificationService notificationService;
    @Mock private PatientRepository patientRepository;
    @Mock private UserRepository userRepository;

    @InjectMocks
    private DoctorAppointmentServiceImpl service;

    private static final Long DOCTOR_ID = 20L;
    private static final Long PATIENT_ID = 10L;
    private Patient testPatient;
    private User testDoctor;
    private Appointment testAppointment;

    @BeforeEach
    void setUp() {
        testPatient = Patient.builder()
                .id(PATIENT_ID).userId(1L).fullName("Nguyễn Văn A")
                .phone("0901234567").gender("Nam").build();

        testDoctor = User.builder()
                .id(DOCTOR_ID).fullName("BS. Trần Văn B")
                .specialization("Nội khoa").avatarUrl("https://doc.jpg")
                .role(UserRole.DOCTOR).build();

        testAppointment = Appointment.builder()
                .id(1L).patient(testPatient).doctorId(DOCTOR_ID)
                .doctorName("BS. Trần Văn B").doctorSpecialty("Nội khoa")
                .appointmentTime(LocalDateTime.of(2026, 7, 1, 9, 0))
                .status(AppointmentStatus.PENDING).type("IN_PERSON")
                .location("Phòng khám").build();
    }

    private void mockDoctor() {
        CustomUserDetails ud = CustomUserDetails.builder().id(DOCTOR_ID).email("doc@email.com").build();
        Authentication auth = mock(Authentication.class);
        SecurityContext ctx = mock(SecurityContext.class);
        when(ctx.getAuthentication()).thenReturn(auth);
        when(auth.getPrincipal()).thenReturn(ud);
        SecurityContextHolder.setContext(ctx);
    }

    // ================================================================
    // getUpcomingAppointments()
    // ================================================================
    @Nested
    @DisplayName("getUpcomingAppointments()")
    class GetUpcomingTests {

        @Test
        @DisplayName("TC-DA-001: Lấy lịch hẹn sắp tới của bác sĩ")
        void shouldReturnUpcoming() {
            mockDoctor();
            when(appointmentRepository.findByDoctorIdAndStatusInAndAppointmentTimeAfterOrderByAppointmentTimeAsc(
                    eq(DOCTOR_ID), any(), any())).thenReturn(List.of(testAppointment));

            List<DoctorAppointmentResponse> result = service.getUpcomingAppointments();

            assertThat(result).hasSize(1);
            assertThat(result.get(0).getPatientName()).isEqualTo("Nguyễn Văn A");
            assertThat(result.get(0).getStatus()).isEqualTo("PENDING");
        }

        @Test
        @DisplayName("TC-DA-002: Trả danh sách rỗng khi không có lịch hẹn")
        void shouldReturnEmpty() {
            mockDoctor();
            when(appointmentRepository.findByDoctorIdAndStatusInAndAppointmentTimeAfterOrderByAppointmentTimeAsc(
                    eq(DOCTOR_ID), any(), any())).thenReturn(Collections.emptyList());

            assertThat(service.getUpcomingAppointments()).isEmpty();
        }
    }

    // ================================================================
    // getAllAppointments()
    // ================================================================
    @Nested
    @DisplayName("getAllAppointments()")
    class GetAllTests {

        @Test
        @DisplayName("TC-DA-003: Lấy tất cả lịch hẹn của bác sĩ")
        void shouldReturnAll() {
            mockDoctor();
            when(appointmentRepository.findByDoctorIdOrderByAppointmentTimeDesc(DOCTOR_ID))
                    .thenReturn(List.of(testAppointment));

            List<DoctorAppointmentResponse> result = service.getAllAppointments();
            assertThat(result).hasSize(1);
        }
    }

    // ================================================================
    // updateStatus()
    // ================================================================
    @Nested
    @DisplayName("updateStatus()")
    class UpdateStatusTests {

        @Test
        @DisplayName("TC-DA-004: Xác nhận lịch hẹn (PENDING → SCHEDULED)")
        void shouldConfirmAppointment() {
            mockDoctor();
            when(appointmentRepository.findById(1L)).thenReturn(Optional.of(testAppointment));
            when(appointmentRepository.save(any())).thenReturn(testAppointment);

            service.updateStatus(1L, "SCHEDULED", null, null);

            assertThat(testAppointment.getStatus()).isEqualTo(AppointmentStatus.SCHEDULED);
            verify(notificationService).sendNotification(eq(1L), any(), any(), eq("success"), any());
        }

        @Test
        @DisplayName("TC-DA-005: Hoàn tất lịch hẹn (→ COMPLETED) kèm chẩn đoán")
        void shouldCompleteWithDiagnosis() {
            mockDoctor();
            testAppointment.setStatus(AppointmentStatus.SCHEDULED);
            when(appointmentRepository.findById(1L)).thenReturn(Optional.of(testAppointment));
            when(appointmentRepository.save(any())).thenReturn(testAppointment);

            service.updateStatus(1L, "COMPLETED", null, "Huyết áp ổn định");

            assertThat(testAppointment.getStatus()).isEqualTo(AppointmentStatus.COMPLETED);
            assertThat(testAppointment.getDiagnosisSummary()).isEqualTo("Huyết áp ổn định");
        }

        @Test
        @DisplayName("TC-DA-006: Hủy lịch hẹn (→ CANCELLED)")
        void shouldCancelAppointment() {
            mockDoctor();
            when(appointmentRepository.findById(1L)).thenReturn(Optional.of(testAppointment));
            when(appointmentRepository.save(any())).thenReturn(testAppointment);

            service.updateStatus(1L, "CANCELLED", null, null);

            assertThat(testAppointment.getStatus()).isEqualTo(AppointmentStatus.CANCELLED);
            verify(notificationService).sendNotification(eq(1L), any(), any(), eq("warning"), any());
        }

        @Test
        @DisplayName("TC-DA-007: Ném exception khi lịch hẹn không tồn tại")
        void shouldThrowWhenNotFound() {
            mockDoctor();
            when(appointmentRepository.findById(999L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> service.updateStatus(999L, "SCHEDULED", null, null))
                    .isInstanceOf(ResourceNotFoundException.class);
        }

        @Test
        @DisplayName("TC-DA-008: Ném exception khi bác sĩ khác cố sửa lịch hẹn")
        void shouldThrowWhenUnauthorized() {
            mockDoctor();
            Appointment otherDoctorAppt = Appointment.builder()
                    .id(2L).patient(testPatient).doctorId(999L)
                    .status(AppointmentStatus.PENDING).build();
            when(appointmentRepository.findById(2L)).thenReturn(Optional.of(otherDoctorAppt));

            assertThatThrownBy(() -> service.updateStatus(2L, "SCHEDULED", null, null))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("Unauthorized");
        }

        @Test
        @DisplayName("TC-DA-009: Xác nhận ONLINE tự tạo meeting link khi chưa có")
        void shouldAutoCreateMeetingLinkForOnline() {
            mockDoctor();
            testAppointment.setType("ONLINE");
            testAppointment.setMeetingLink(null);
            when(appointmentRepository.findById(1L)).thenReturn(Optional.of(testAppointment));
            when(appointmentRepository.save(any())).thenReturn(testAppointment);

            service.updateStatus(1L, "SCHEDULED", null, null);

            assertThat(testAppointment.getMeetingLink()).contains("meet.google.com");
        }
    }

    // ================================================================
    // createAppointment()
    // ================================================================
    @Nested
    @DisplayName("createAppointment()")
    class CreateTests {

        @Test
        @DisplayName("TC-DA-010: Bác sĩ tạo lịch hẹn cho bệnh nhân thành công")
        void shouldCreate() {
            mockDoctor();
            var request = com.project.dto.request.DoctorCreateAppointmentRequest.builder()
                    .patientId(PATIENT_ID).appointmentDate("2026-08-01")
                    .appointmentTime("10:00").type("IN_PERSON").build();
            when(patientRepository.findById(PATIENT_ID)).thenReturn(Optional.of(testPatient));
            when(userRepository.findById(DOCTOR_ID)).thenReturn(Optional.of(testDoctor));
            when(appointmentRepository.save(any())).thenAnswer(inv -> {
                Appointment a = inv.getArgument(0); a.setId(50L); return a;
            });

            DoctorAppointmentResponse result = service.createAppointment(request);

            assertThat(result).isNotNull();
            assertThat(result.getPatientName()).isEqualTo("Nguyễn Văn A");
            assertThat(result.getStatus()).isEqualTo("SCHEDULED");
            verify(notificationService).sendNotification(eq(1L), any(), any(), any(), any());
        }

        @Test
        @DisplayName("TC-DA-011: Ném exception khi bệnh nhân không tồn tại")
        void shouldThrowWhenPatientNotFound() {
            mockDoctor();
            var request = com.project.dto.request.DoctorCreateAppointmentRequest.builder()
                    .patientId(999L).appointmentDate("2026-08-01")
                    .appointmentTime("10:00").type("IN_PERSON").build();
            when(patientRepository.findById(999L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> service.createAppointment(request))
                    .isInstanceOf(ResourceNotFoundException.class);
        }
    }

    // ================================================================
    // rescheduleAppointment()
    // ================================================================
    @Nested
    @DisplayName("rescheduleAppointment()")
    class RescheduleTests {

        @Test
        @DisplayName("TC-DA-012: Dời lịch hẹn thành công")
        void shouldReschedule() {
            mockDoctor();
            var request = com.project.dto.request.DoctorCreateAppointmentRequest.builder()
                    .patientId(PATIENT_ID).appointmentDate("2026-08-15")
                    .appointmentTime("14:00").type("IN_PERSON").build();
            when(appointmentRepository.findById(1L)).thenReturn(Optional.of(testAppointment));
            when(userRepository.findById(DOCTOR_ID)).thenReturn(Optional.of(testDoctor));
            when(appointmentRepository.save(any())).thenReturn(testAppointment);

            service.rescheduleAppointment(1L, request);

            assertThat(testAppointment.getAppointmentTime())
                    .isEqualTo(LocalDateTime.of(2026, 8, 15, 14, 0));
            assertThat(testAppointment.getStatus()).isEqualTo(AppointmentStatus.SCHEDULED);
            verify(notificationService).sendNotification(eq(1L), any(), any(), eq("warning"), any());
        }

        @Test
        @DisplayName("TC-DA-013: Ném exception khi dời lịch hẹn không tồn tại")
        void shouldThrowWhenRescheduleNotFound() {
            var request = com.project.dto.request.DoctorCreateAppointmentRequest.builder()
                    .patientId(PATIENT_ID).appointmentDate("2026-08-15")
                    .appointmentTime("14:00").type("IN_PERSON").build();
            when(appointmentRepository.findById(999L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> service.rescheduleAppointment(999L, request))
                    .isInstanceOf(ResourceNotFoundException.class);
        }
    }

    // ================================================================
    // batchReschedule()
    // ================================================================
    @Nested
    @DisplayName("batchReschedule()")
    class BatchRescheduleTests {

        @Test
        @DisplayName("TC-DA-014: Dời hàng loạt lịch hẹn thành công")
        void shouldBatchReschedule() {
            mockDoctor();
            Appointment a1 = Appointment.builder()
                    .id(1L).patient(testPatient).doctorId(DOCTOR_ID)
                    .appointmentTime(LocalDateTime.of(2026, 8, 1, 9, 0))
                    .status(AppointmentStatus.PENDING).build();
            when(appointmentRepository.findByDoctorIdAndDateRangeAndStatuses(eq(DOCTOR_ID), any(), any(), any()))
                    .thenReturn(List.of(a1));
            when(appointmentRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

            int count = service.batchReschedule(LocalDate.of(2026, 8, 1), LocalDate.of(2026, 8, 5));

            assertThat(count).isEqualTo(1);
            assertThat(a1.getAppointmentTime()).isEqualTo(LocalDateTime.of(2026, 8, 5, 9, 0));
        }

        @Test
        @DisplayName("TC-DA-015: Trả 0 khi không có lịch hẹn nào trong ngày nguồn")
        void shouldReturnZeroWhenNoAppointments() {
            mockDoctor();
            when(appointmentRepository.findByDoctorIdAndDateRangeAndStatuses(eq(DOCTOR_ID), any(), any(), any()))
                    .thenReturn(Collections.emptyList());

            int count = service.batchReschedule(LocalDate.of(2026, 9, 1), LocalDate.of(2026, 9, 5));
            assertThat(count).isEqualTo(0);
        }
    }
}
