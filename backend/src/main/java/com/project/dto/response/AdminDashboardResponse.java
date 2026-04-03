package com.project.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardResponse {
    private AdminStatsDto stats;
    private List<ClinicPerformanceDto> clinicPerformances;
    private List<SystemActivityDto> recentActivities;
    private List<ChartDataDto> chartData;

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
        private String clinicCode;
        private String name;
        private long patientCount;
        private long doctorCount;
        private String phone;
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

    @Data
    @Builder
    public static class ChartDataDto {
        private String label;
        private long value;
    }
}
