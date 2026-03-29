package com.project.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class AdminReportsResponse {

    private ReportSummary summary;
    private List<ChartPoint> growthTrend;
    private AnalyticsSummary analytics;
    private List<ClinicBreakdown> clinicBreakdown;
    private List<ClinicPerformance> clinicPerformances;

    @Data
    @Builder
    public static class ReportSummary {
        private String nps;
        private String avgTime;
        private String returnRate;
        private String retentionRate;
    }

    @Data
    @Builder
    public static class ChartPoint {
        private String label;
        private Integer value;
    }

    @Data
    @Builder
    public static class AnalyticsSummary {
        private String growthRate;
        private String peakMonth;
        private String returnRate;
        private String forecast;
    }

    @Data
    @Builder
    public static class ClinicBreakdown {
        private String name;
        private String value;
        private String percentage;
        private String icon;
    }

    @Data
    @Builder
    public static class ClinicPerformance {
        private String name;
        private String cases;
        private String appointments;
        private String adherence;
        private String status;
        private String color;
    }
}
