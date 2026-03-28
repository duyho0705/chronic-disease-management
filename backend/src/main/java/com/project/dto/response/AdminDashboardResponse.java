package com.project.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class AdminDashboardResponse {

    private AdminStatsDto stats;
    private List<ClinicPerformanceDto> clinicPerformances;
    private List<SystemActivityDto> recentActivities;

    @Data
    @Builder
    public static class AdminStatsDto {
        private long totalPatients;
        private long activeClinics;
        private long totalDoctors;
        private long highRiskAlerts;
        private String patientGrowth;
        private String clinicTrend;
        private String doctorTrend;
    }

    @Data
    @Builder
    public static class ClinicPerformanceDto {
        private Long id;
        private String name;
        private long patientCount;
        private String growth;
        private String status;
    }

    @Data
    @Builder
    public static class SystemActivityDto {
        private String title;
        private String description;
        private String timeAgo;
        private String icon;
        private String color;
    }
}
