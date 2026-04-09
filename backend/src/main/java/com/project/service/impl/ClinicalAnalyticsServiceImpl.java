package com.project.service.impl;

import com.project.entity.HealthMetric;
import com.project.entity.MetricType;
import com.project.repository.HealthMetricRepository;
import com.project.repository.PatientRepository;
import com.project.service.ClinicalAnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ClinicalAnalyticsServiceImpl implements ClinicalAnalyticsService {

    private final PatientRepository patientRepository;
    private final HealthMetricRepository healthMetricRepository;

    @Override
    public List<String> getClinicInsights(Long clinicId) {
        List<String> insights = new ArrayList<>();
        LocalDateTime since = LocalDateTime.now().minusWeeks(1);

        // 1. Check for High-Risk trends - Keep as is, it's a count query
        long highRiskCount = patientRepository.countByClinicIdAndRiskLevelAndIsDeletedFalse(clinicId, "Nguy cơ cao");
        if (highRiskCount > 0) {
            insights.add("Phát hiện " + highRiskCount
                    + " bệnh nhân có chỉ số nguy cơ cao. Khuyến nghị Bác sĩ kiểm tra lại phác đồ điều trị.");
        }

        // 2. Optimized: Check for increasing BP trends in the clinic using a single query
        List<HealthMetric> allMetrics = healthMetricRepository.findByClinicIdAndMetricTypeAndSince(clinicId, MetricType.BLOOD_PRESSURE, since);
        
        java.util.Map<Long, List<HealthMetric>> patientMetricsMap = allMetrics.stream()
                .collect(java.util.stream.Collectors.groupingBy(h -> h.getPatient().getId()));

        int increasingBP = 0;
        for (List<HealthMetric> metrics : patientMetricsMap.values()) {
            if (metrics.size() >= 2) {
                if (metrics.get(metrics.size() - 1).getValue().doubleValue() > metrics.get(0).getValue().doubleValue()) {
                    increasingBP++;
                }
            }
        }
        
        if (increasingBP > 0) {
            insights.add("Có " + increasingBP + " bệnh nhân có xu hướng tăng huyết áp trong 7 ngày qua.");
        }

        if (insights.isEmpty()) {
            insights.add("Chưa ghi nhận bất thường đáng kể trong 7 ngày qua.");
        }

        return insights;
    }

    @Override
    public List<String> getDoctorInsights(Long doctorId) {
        List<String> insights = new ArrayList<>();

        long highRiskCount = patientRepository.countByDoctorIdAndRiskLevelAndIsDeletedFalse(doctorId, "Nguy cơ cao");
        if (highRiskCount > 0) {
            insights.add("Cảnh báo: Bạn đang quản lý " + highRiskCount + " bệnh nhân thuộc nhóm nguy cơ cao.");
        }

        // Optimized Suggest follow-up for patients with no recent metrics
        LocalDateTime since = LocalDateTime.now().minusDays(3);
        List<Long> missingMetricPatientIds = healthMetricRepository.findPatientIdsInDoctorWithNoMetricsSince(doctorId, since);
        
        int missingMetrics = missingMetricPatientIds.size();
        
        if (missingMetrics > 0) {
            insights.add(
                    "Nhắc nhở: Có " + missingMetrics + " bệnh nhân chưa cập nhật chỉ số sức khỏe trong 3 ngày qua.");
        }

        if (insights.isEmpty()) {
            insights.add("Hệ thống chưa ghi nhận chỉ số bất thường cho bệnh nhân của bạn.");
        }

        return insights;
    }
}
