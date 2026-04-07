package com.project.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ClinicDashboardResponse {

    private long totalPatients;
    private long highRiskAlerts;
    private long pendingFollowUps;
    
    private String patientGrowth;
    private String highRiskGrowth;

    private List<DiseaseRatioDto> diseaseRatios;
    private List<PatientGrowthChartDto> patientGrowthChart;
    private List<PatientGrowthChartDto> riskIndexChart;
    private List<PatientGrowthChartDto> doctorLoadChart;
    private GrowthStatsDto growthStats;
    private List<DoctorPerformanceDto> doctorPerformances;
    private List<String> insights;

    @Data
    @Builder
    public static class DiseaseRatioDto {
        private String label;
        private String percentage;
        private String color;
    }

    @Data
    @Builder
    public static class PatientGrowthChartDto {
        private String month;
        private int value;
        private boolean active;
    }

    @Data
    @Builder
    public static class GrowthStatsDto {
        private String growth;
        private String average;
        private String peakMonth;
    }

    @Data
    @Builder
    public static class DoctorPerformanceDto {
        private Long dbId;
        private String id;
        private String name;
        private String img;
        private String specialty;
        private String email;
        private String phone;
        private String licenseNumber;
        private String degree;
        private String bio;
        private int load;
        private String color;
        private String progress;
        private String rating;
        private int reviews;
        private String status;
        private boolean active;
    }
}
