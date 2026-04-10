package com.project.service.impl;

import com.project.dto.response.RiskAlertResponse;
import com.project.entity.Patient;
import com.project.entity.PatientAlert;
import com.project.entity.User;
import com.project.entity.HealthMetric;
import com.project.entity.Appointment;
import com.project.repository.PatientRepository;
import com.project.repository.PatientAlertRepository;
import com.project.repository.AppointmentRepository;
import com.project.repository.HealthMetricRepository;
import com.project.repository.UserRepository;
import com.project.service.RiskAlertService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RiskAlertServiceImpl implements RiskAlertService {

    private final PatientRepository patientRepository;
    private final PatientAlertRepository patientAlertRepository;
    private final AppointmentRepository appointmentRepository;
    private final HealthMetricRepository healthMetricRepository;
    private final UserRepository userRepository;

    @Override
    public RiskAlertResponse getRiskAlertDashboard(Long clinicId) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime thirtyDaysAgo = now.minusDays(30);

        // Summary
        long total = patientRepository.countByClinicIdAndIsDeletedFalse(clinicId);
        long highRisk = patientRepository.countByClinicIdAndRiskLevelAndIsDeletedFalse(clinicId, "Rủi ro cao");
        long midRisk = patientRepository.countByClinicIdAndRiskLevelAndIsDeletedFalse(clinicId, "Trung bình");
        long stableCount = patientRepository.countByClinicIdAndRiskLevelAndIsDeletedFalse(clinicId, "Ổn định");
        
        List<Long> unmonitoredIds = healthMetricRepository.findPatientIdsInClinicWithNoMetricsSince(clinicId, thirtyDaysAgo);
        long unmonitoredCount = unmonitoredIds.size();
        
        long overdueCount = appointmentRepository.countOverdueByClinicId(clinicId, now);

        RiskAlertResponse.RiskSummary summary = RiskAlertResponse.RiskSummary.builder()
                .totalPatients(total)
                .highRiskCount(highRisk)
                .mediumRiskCount(midRisk)
                .stableCount(stableCount)
                .unmonitoredCount(unmonitoredCount)
                .overdueAppointments(overdueCount)
                .highRiskPercentage(total > 0 ? (double) highRisk * 100 / total : 0)
                .build();

        // High Risk Patients (top 5)
        Pageable topFive = PageRequest.of(0, 5);
        Page<Patient> highRiskPage = patientRepository.findByClinicIdAndFilters(clinicId, null, null, "Rủi ro cao", null, null, topFive);
        
        List<RiskAlertResponse.RiskPatientItem> patientItems = highRiskPage.getContent().stream()
                .map(p -> mapToRiskPatientItem(p, clinicId))
                .collect(Collectors.toList());

        // Recent Alerts
        Pageable topTen = PageRequest.of(0, 10);
        List<PatientAlert> recentAlerts = patientAlertRepository.findRecentAlertsByClinic(clinicId, topTen);
        
        List<RiskAlertResponse.AlertItem> alertItems = recentAlerts.stream()
                .map(this::mapToAlertItem)
                .collect(Collectors.toList());

        return RiskAlertResponse.builder()
                .summary(summary)
                .highRiskPatients(patientItems)
                .recentAlerts(alertItems)
                .build();
    }

    @Override
    public Page<RiskAlertResponse.RiskPatientItem> getHighRiskPatients(Long clinicId, Pageable pageable) {
        Page<Patient> patients = patientRepository.findByClinicIdAndFilters(clinicId, null, null, "Rủi ro cao", null, null, pageable);
        return patients.map(p -> mapToRiskPatientItem(p, clinicId));
    }

    @Override
    @Transactional
    public void dismissAlert(Long alertId) {
        patientAlertRepository.findById(alertId).ifPresent(a -> {
            a.setDismissed(true);
            patientAlertRepository.save(a);
        });
    }

    @Override
    @Transactional
    public void markAlertAsRead(Long alertId) {
        patientAlertRepository.findById(alertId).ifPresent(a -> {
            a.setRead(true);
            patientAlertRepository.save(a);
        });
    }

    private RiskAlertResponse.RiskPatientItem mapToRiskPatientItem(Patient p, Long clinicId) {
        HealthMetric lastMetric = healthMetricRepository.findRecentByPatientId(p.getId(), PageRequest.of(0, 1))
                .stream().findFirst().orElse(null);
        
        String doctorName = "Chưa phân công";
        if (p.getDoctorId() != null) {
            doctorName = userRepository.findById(p.getDoctorId())
                    .map(User::getFullName)
                    .orElse("Chưa phân công");
        }

        List<Appointment> nextApps = appointmentRepository.findNextAppointmentsByPatient(clinicId, p.getId(), PageRequest.of(0, 1));
        Appointment nextApp = nextApps.isEmpty() ? null : nextApps.get(0);
        
        boolean overdue = nextApp != null && nextApp.getAppointmentTime().isBefore(LocalDateTime.now());

        return RiskAlertResponse.RiskPatientItem.builder()
                .patientId(p.getId())
                .fullName(p.getFullName())
                .patientCode(p.getPatientCode())
                .avatarUrl(p.getAvatarUrl())
                .chronicCondition(p.getChronicCondition())
                .riskLevel(p.getRiskLevel())
                .lastMetricStatus(lastMetric != null ? lastMetric.getStatus() : "Chưa có dữ liệu")
                .lastMetricDate(lastMetric != null ? lastMetric.getMeasuredAt() : null)
                .doctorName(doctorName)
                .alertCount(patientAlertRepository.countUnreadAlertsByPatientId(p.getId()))
                .nextAppointment(nextApp != null ? nextApp.getAppointmentTime() : null)
                .appointmentOverdue(overdue)
                .build();
    }

    private RiskAlertResponse.AlertItem mapToAlertItem(PatientAlert a) {
        return RiskAlertResponse.AlertItem.builder()
                .alertId(a.getId())
                .patientId(a.getPatient().getId())
                .patientName(a.getPatient().getFullName())
                .alertType(a.getAlertType())
                .severity(a.getSeverity())
                .title(a.getTitle())
                .message(a.getMessage())
                .isRead(a.isRead())
                .createdAt(a.getCreatedAt())
                .build();
    }
}
