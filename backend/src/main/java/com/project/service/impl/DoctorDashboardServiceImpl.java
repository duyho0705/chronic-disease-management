package com.project.service.impl;

import com.project.dto.response.AppointmentSnippetDto;
import com.project.dto.response.DashboardStatsDto;
import com.project.dto.response.DoctorDashboardResponse;
import com.project.repository.AppointmentRepository;
import com.project.repository.PatientRepository;
import com.project.service.DoctorDashboardService;
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

    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;

    @Override
    @Transactional(readOnly = true)
    public DoctorDashboardResponse getDashboardData(Long doctorId) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfToday = LocalDate.now().atStartOfDay();
        
        // 1. Fetch Stats
        long totalPatients = patientRepository.count(); // Simplified for now, should count by doctorId
        long pendingAppointments = appointmentRepository.countByDoctorIdAndStatusAndAppointmentTimeAfter(
                doctorId, "SCHEDULED", now);
        
        DashboardStatsDto stats = DashboardStatsDto.builder()
                .totalPatients(totalPatients)
                .highRiskCount(12) // Mock until RiskProfile service is implemented
                .pendingAppointmentsCount(pendingAppointments)
                .unreadMessagesCount(3) // Mock
                .build();

        // 2. Fetch Upcoming Appointments
        List<AppointmentSnippetDto> upcomingAppointments = appointmentRepository.findUpcomingAppointments(
                doctorId, startOfToday, PageRequest.of(0, 5))
                .stream()
                .map(apt -> AppointmentSnippetDto.builder()
                        .id(apt.getId())
                        .patientName(apt.getPatient().getFullName())
                        .displayTime(DateTimeUtils.formatForDashboard(apt.getAppointmentTime()))
                        .type(apt.getType())
                        .isPast(apt.getAppointmentTime().isBefore(now))
                        .build())
                .collect(Collectors.toList());

        return DoctorDashboardResponse.builder()
                .stats(stats)
                .upcomingAppointments(upcomingAppointments)
                .build();
    }
}
