package com.project.service.impl;

import com.project.dto.response.AppointmentSnippetDto;
import com.project.dto.response.DashboardStatsDto;
import com.project.dto.response.DoctorDashboardResponse;
import com.project.dto.response.DoctorPatientResponse;
import com.project.repository.AppointmentRepository;
import com.project.repository.MessageRepository;
import com.project.service.ClinicalAnalyticsService;
import com.project.service.DoctorDashboardService;
import com.project.service.DoctorPatientService;
import com.project.util.AppConstants;
import com.project.util.DateTimeUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DoctorDashboardServiceImpl implements DoctorDashboardService {

        private final AppointmentRepository appointmentRepository;
        private final MessageRepository messageRepository;
        private final DoctorPatientService doctorPatientService;
        private final ClinicalAnalyticsService clinicalAnalyticsService;

        @Override
        @Transactional(readOnly = true)
        public DoctorDashboardResponse getDashboardData(Long doctorId) {
                LocalDateTime now = LocalDateTime.now();
                LocalDateTime startOfToday = LocalDate.now().atStartOfDay();

                // 1. Fetch Stats - real data
                long totalPatients = doctorPatientService.getTotalPatientCount(doctorId);
                long highRiskCount = doctorPatientService.getHighRiskCount(doctorId);
                long pendingAppointments = appointmentRepository.countByDoctorIdAndStatusInAndAppointmentTimeAfter(
                                doctorId,
                                java.util.List.of(AppConstants.APPT_STATUS_PENDING, AppConstants.APPT_STATUS_SCHEDULED),
                                now);

                long unreadMessages = messageRepository
                                .countByConversationDoctorIdAndIsReadFalseAndSenderIdNot(doctorId, doctorId);

                DashboardStatsDto stats = DashboardStatsDto.builder()
                                .totalPatients(totalPatients)
                                .highRiskCount(highRiskCount)
                                .pendingAppointmentsCount(pendingAppointments)
                                .unreadMessagesCount(unreadMessages)
                                .build();

                // 2. Fetch Upcoming Appointments
                List<AppointmentSnippetDto> upcomingAppointments = appointmentRepository.findUpcomingAppointments(
                                doctorId, startOfToday, PageRequest.of(0, 5))
                                .stream()
                                .map(apt -> AppointmentSnippetDto.builder()
                                                .id(apt.getId())
                                                .patientName(apt.getPatient() != null ? apt.getPatient().getFullName()
                                                                : "N/A")
                                                .displayTime(apt.getAppointmentTime() != null
                                                                ? DateTimeUtils.formatForDashboard(
                                                                                apt.getAppointmentTime())
                                                                : "N/A")
                                                .type(apt.getType())
                                                .isPast(apt.getAppointmentTime() != null
                                                                && apt.getAppointmentTime().isBefore(now))
                                                .build())
                                .collect(Collectors.toList());

                // 3. Recent patients (paginated, top 5)
                List<DoctorPatientResponse> recentPatients = doctorPatientService
                                .getMyPatients(doctorId, null, null, null, PageRequest.of(0, 5))
                                .getContent();

                // 4. High risk patients
                List<DoctorPatientResponse> highRiskPatients = doctorPatientService
                                .getMyPatients(doctorId, null, null, AppConstants.RISK_HIGH, PageRequest.of(0, 5))
                                .getContent();

                return DoctorDashboardResponse.builder()
                                .stats(stats)
                                .upcomingAppointments(upcomingAppointments)
                                .recentPatients(recentPatients)
                                .highRiskPatients(highRiskPatients.stream()
                                                .map(p -> DoctorDashboardResponse.DoctorPatientResponseSnippet.builder()
                                                                .id(p.getId())
                                                                .name(p.getFullName())
                                                                .condition(p.getChronicCondition())
                                                                .riskLevel(p.getRiskLevel())
                                                                .lastUpdate(p.getLastUpdate() != null
                                                                                ? p.getLastUpdate()
                                                                                : "Vừa xong")
                                                                .img(p.getAvatarUrl())
                                                                .build())
                                                .collect(Collectors.toList()))
                                .insights(clinicalAnalyticsService.getDoctorInsights(doctorId))
                                .build();
        }
}
