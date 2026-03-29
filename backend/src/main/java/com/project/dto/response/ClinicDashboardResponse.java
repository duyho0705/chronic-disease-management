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
    private GrowthStatsDto growthStats;
    private List<DoctorPerformanceDto> doctorPerformances;

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
        private String height;
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
        private String id;
        private String name;
        private String img;
        private String dept;
        private int load;
        private String color;
        private String progress;
        private String rating;
        private int reviews;
        private String status;
        private boolean active;
    }
}
