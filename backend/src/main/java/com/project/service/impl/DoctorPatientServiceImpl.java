package com.project.service.impl;

import java.time.LocalDate;
import java.time.Period;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.dto.response.DoctorPatientResponse;
import com.project.entity.HealthMetric;
import com.project.entity.MetricType;
import com.project.entity.Patient;
import com.project.repository.HealthMetricRepository;
import com.project.repository.PatientRepository;
import com.project.service.DoctorPatientService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@SuppressWarnings("null")
@Slf4j
@Service
@RequiredArgsConstructor
public class DoctorPatientServiceImpl implements DoctorPatientService {

    private final PatientRepository patientRepository;
    private final HealthMetricRepository healthMetricRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<DoctorPatientResponse> getMyPatients(Long doctorUserId, String search, String condition,
            String riskLevel, Pageable pageable) {
        // The doctorId on Patient entity maps to User.id for doctors
        Page<Patient> patients = patientRepository.findByDoctorIdAndFilters(
                doctorUserId, search, condition, riskLevel, pageable);

        return patients.map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public long getTotalPatientCount(Long doctorUserId) {
        return patientRepository.countByDoctorIdAndIsDeletedFalse(doctorUserId);
    }

    @Override
    @Transactional(readOnly = true)
    public long getHighRiskCount(Long doctorUserId) {
        return patientRepository.countByDoctorIdAndRiskLevelAndIsDeletedFalse(doctorUserId, "Nguy cơ cao");
    }

    private DoctorPatientResponse mapToResponse(Patient p) {
        int age = 0;
        if (p.getDateOfBirth() != null) {
            age = Period.between(p.getDateOfBirth(), LocalDate.now()).getYears();
        }

        // Fetch latest glucose
        String latestGlucose = "N/A";
        try {
            Optional<HealthMetric> glucose = healthMetricRepository
                    .findTopByPatientIdAndMetricTypeAndIsDeletedFalseOrderByMeasuredAtDesc(p.getId(),
                            MetricType.BLOOD_SUGAR);
            if (glucose.isPresent()) {
                latestGlucose = glucose.get().getValue().toPlainString() + " mmol/L";
            }
        } catch (Exception e) {
            log.debug("No glucose data for patient {}", p.getId());
        }

        // Fetch latest blood pressure
        String latestBp = "N/A";
        try {
            Optional<HealthMetric> bp = healthMetricRepository
                    .findTopByPatientIdAndMetricTypeAndIsDeletedFalseOrderByMeasuredAtDesc(p.getId(),
                            MetricType.BLOOD_PRESSURE);
            if (bp.isPresent()) {
                HealthMetric bpMetric = bp.get();
                latestBp = bpMetric.getValue().intValue() + "/" +
                        (bpMetric.getValueSecondary() != null ? bpMetric.getValueSecondary().intValue() : "?")
                        + " mmHg";
            }
        } catch (Exception e) {
            log.debug("No BP data for patient {}", p.getId());
        }

        // Determine last update time
        String lastUpdate = "Chưa ghi nhận";
        try {
            var recentMetrics = healthMetricRepository.findRecentByPatientId(p.getId(), PageRequest.of(0, 1));
            if (!recentMetrics.isEmpty()) {
                var latest = recentMetrics.get(0);
                lastUpdate = latest.getMeasuredAt().format(DateTimeFormatter.ofPattern("HH:mm dd/MM"));
            }
        } catch (Exception e) {
            log.debug("No metrics for patient {}", p.getId());
        }

        return DoctorPatientResponse.builder()
                .id(p.getId())
                .patientCode(p.getPatientCode())
                .fullName(p.getFullName())
                .age(age)
                .gender(p.getGender())
                .phone(p.getPhone())
                .email(p.getEmail())
                .chronicCondition(p.getChronicCondition())
                .riskLevel(p.getRiskLevel() != null ? p.getRiskLevel() : "STABLE")
                .treatmentStatus(p.getTreatmentStatus())
                .lastUpdate(lastUpdate)
                .latestGlucose(latestGlucose)
                .latestBp(latestBp)
                .avatarUrl(p.getAvatarUrl())
                .build();
    }
}
