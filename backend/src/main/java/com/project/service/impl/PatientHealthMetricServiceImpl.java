package com.project.service.impl;

import com.project.dto.request.CreateHealthMetricRequest;
import com.project.dto.response.HealthMetricResponse;
import com.project.dto.response.HealthMetricSummaryResponse;
import com.project.entity.HealthMetric;
import com.project.entity.MetricType;
import com.project.entity.Patient;
import com.project.exception.ResourceNotFoundException;
import com.project.repository.HealthMetricRepository;
import com.project.repository.PatientRepository;
import com.project.service.PatientHealthMetricService;
import com.project.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PatientHealthMetricServiceImpl implements PatientHealthMetricService {

    private final HealthMetricRepository healthMetricRepository;
    private final PatientRepository patientRepository;

    private static final Map<MetricType, String> DISPLAY_NAMES = Map.of(
            MetricType.BLOOD_SUGAR, "Blood Sugar",
            MetricType.BLOOD_PRESSURE, "Blood Pressure",
            MetricType.HEART_RATE, "Heart Rate",
            MetricType.HBA1C, "HbA1c",
            MetricType.SPO2, "SpO2"
    );

    private static final Map<MetricType, String> UNITS = Map.of(
            MetricType.BLOOD_SUGAR, "mmol/L",
            MetricType.BLOOD_PRESSURE, "mmHg",
            MetricType.HEART_RATE, "bpm",
            MetricType.HBA1C, "%",
            MetricType.SPO2, "%"
    );

    private static final Map<MetricType, String> ICONS = Map.of(
            MetricType.BLOOD_SUGAR, "glucose",
            MetricType.BLOOD_PRESSURE, "vital_signs",
            MetricType.HEART_RATE, "favorite",
            MetricType.HBA1C, "science",
            MetricType.SPO2, "air"
    );

    @Override
    @Transactional
    public HealthMetricResponse create(CreateHealthMetricRequest request) {
        Patient patient = getCurrentPatient();
        MetricType metricType = MetricType.valueOf(request.getMetricType());

        String status = evaluateStatus(metricType, request.getValue(), request.getValueSecondary());

        HealthMetric metric = HealthMetric.builder()
                .patient(patient)
                .metricType(metricType)
                .value(request.getValue())
                .valueSecondary(request.getValueSecondary())
                .unit(request.getUnit())
                .status(status)
                .notes(request.getNotes())
                .measuredAt(request.getMeasuredAt() != null ? request.getMeasuredAt() : LocalDateTime.now())
                .build();

        HealthMetric saved = healthMetricRepository.save(metric);
        log.info("Health metric created: type={}, patientId={}", metricType, patient.getId());
        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<HealthMetricSummaryResponse> getMetricsSummary(String period) {
        Patient patient = getCurrentPatient();
        LocalDateTime[] range = getDateRange(period);
        List<HealthMetricSummaryResponse> summaries = new ArrayList<>();

        for (MetricType type : MetricType.values()) {
            Optional<HealthMetric> latest = healthMetricRepository
                    .findTopByPatientIdAndMetricTypeAndIsDeletedFalseOrderByMeasuredAtDesc(patient.getId(), type);

            if (latest.isPresent()) {
                HealthMetric m = latest.get();
                List<HealthMetric> chartMetrics = healthMetricRepository
                        .findByPatientIdAndMetricTypeAndMeasuredAtBetweenAndIsDeletedFalse(
                                patient.getId(), type, range[0], range[1]);

                String changePercentage = calculateChange(chartMetrics);

                summaries.add(HealthMetricSummaryResponse.builder()
                        .metricType(type.name())
                        .displayName(DISPLAY_NAMES.get(type))
                        .icon(ICONS.get(type))
                        .latestValue(m.getValue())
                        .latestValueSecondary(m.getValueSecondary())
                        .unit(UNITS.get(type))
                        .status(m.getStatus())
                        .trend(determineTrend(chartMetrics))
                        .changePercentage(changePercentage)
                        .chartData(chartMetrics.stream().map(this::mapToResponse).collect(Collectors.toList()))
                        .build());
            }
        }
        return summaries;
    }

    @Override
    @Transactional(readOnly = true)
    public List<HealthMetricResponse> getChartData(String metricType, String period) {
        Patient patient = getCurrentPatient();
        MetricType type = MetricType.valueOf(metricType);
        LocalDateTime[] range = getDateRange(period);

        return healthMetricRepository
                .findByPatientIdAndMetricTypeAndMeasuredAtBetweenAndIsDeletedFalse(
                        patient.getId(), type, range[0], range[1])
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<HealthMetricResponse> getHistory(Pageable pageable) {
        Patient patient = getCurrentPatient();
        return healthMetricRepository
                .findByPatientIdAndIsDeletedFalseOrderByMeasuredAtDesc(patient.getId(), pageable)
                .map(this::mapToResponse);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        HealthMetric metric = healthMetricRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Health metric not found: " + id));
        metric.setDeleted(true);
        healthMetricRepository.save(metric);
        log.info("Health metric soft-deleted: id={}", id);
    }

    // === Private Helpers ===

    private Patient getCurrentPatient() {
        // --- DEVELOPMENT BYPASS ---
        // Fetch the first patient in the database if no user is authenticated
        return patientRepository.findAll().stream().findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("No patient profile found in database. Please create one."));
    }

    private HealthMetricResponse mapToResponse(HealthMetric m) {
        return HealthMetricResponse.builder()
                .id(m.getId())
                .metricType(m.getMetricType().name())
                .metricDisplayName(DISPLAY_NAMES.get(m.getMetricType()))
                .value(m.getValue())
                .valueSecondary(m.getValueSecondary())
                .unit(m.getUnit())
                .status(m.getStatus())
                .notes(m.getNotes())
                .measuredAt(m.getMeasuredAt())
                .build();
    }

    private String evaluateStatus(MetricType type, BigDecimal value, BigDecimal secondary) {
        return switch (type) {
            case BLOOD_SUGAR -> {
                double v = value.doubleValue();
                if (v < 3.9) yield "LOW";
                else if (v <= 6.1) yield "NORMAL";
                else if (v <= 7.0) yield "BORDERLINE_HIGH";
                else yield "HIGH";
            }
            case BLOOD_PRESSURE -> {
                double systolic = value.doubleValue();
                double diastolic = secondary != null ? secondary.doubleValue() : 0;
                if (systolic < 120 && diastolic < 80) yield "NORMAL";
                else if (systolic <= 130 && diastolic <= 85) yield "BORDERLINE_HIGH";
                else yield "HIGH";
            }
            case HEART_RATE -> {
                double v = value.doubleValue();
                if (v >= 60 && v <= 100) yield "NORMAL";
                else if (v < 60) yield "LOW";
                else yield "HIGH";
            }
            case HBA1C -> {
                double v = value.doubleValue();
                if (v < 5.7) yield "NORMAL";
                else if (v <= 6.4) yield "BORDERLINE_HIGH";
                else yield "HIGH";
            }
            case SPO2 -> {
                double v = value.doubleValue();
                if (v >= 95) yield "NORMAL";
                else if (v >= 90) yield "BORDERLINE_LOW";
                else yield "LOW";
            }
        };
    }

    private String calculateChange(List<HealthMetric> metrics) {
        if (metrics.size() < 2) return "0%";
        BigDecimal latest = metrics.get(metrics.size() - 1).getValue();
        BigDecimal previous = metrics.get(metrics.size() - 2).getValue();
        if (previous.compareTo(BigDecimal.ZERO) == 0) return "0%";
        BigDecimal change = latest.subtract(previous)
                .divide(previous, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100));
        return (change.compareTo(BigDecimal.ZERO) > 0 ? "+" : "") + change.setScale(1, RoundingMode.HALF_UP) + "%";
    }

    private String determineTrend(List<HealthMetric> metrics) {
        if (metrics.size() < 2) return "STABLE";
        BigDecimal latest = metrics.get(metrics.size() - 1).getValue();
        BigDecimal previous = metrics.get(metrics.size() - 2).getValue();
        int cmp = latest.compareTo(previous);
        if (cmp > 0) return "UP";
        if (cmp < 0) return "DOWN";
        return "STABLE";
    }

    private LocalDateTime[] getDateRange(String period) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime from = switch (period.toUpperCase()) {
            case "DAY" -> now.minusDays(1);
            case "WEEK" -> now.minusWeeks(1);
            case "MONTH" -> now.minusMonths(1);
            case "YEAR" -> now.minusYears(1);
            default -> now.minusWeeks(1);
        };
        return new LocalDateTime[]{from, now};
    }
}
