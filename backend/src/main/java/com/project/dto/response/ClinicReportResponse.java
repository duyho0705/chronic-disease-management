package com.project.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ClinicReportResponse {
    private Long clinicId;
    
    // Summary Metrics
    private SummaryMetrics summary;
    
    // Chart Data
    private List<ChartPoint> patientTrends;
    private List<ChartPoint> riskTrends;
    private List<ChartPoint> staffLoadTrends;
    
    // Disease Analysis
    private List<DiseaseRiskDistribution> riskDistributions;
    private List<DiseaseImpactDetail> diseaseDetails;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class SummaryMetrics {
        private long totalPatients;
        private long highRiskPatients;
        private double adherenceRate; // Calculated from real prescription/appointment data
        private double improvementRate; // Calculated from health metric trends
        private double avgConsultationTime;
        private String growthPercentage;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ChartPoint {
        private String label;
        private double value;
        private double secondaryValue;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class DiseaseRiskDistribution {
        private String diseaseName;
        private double stablePercentage;
        private double moderatePercentage;
        private double riskPercentage;
        private long count;
        private String totalDisplay;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class DiseaseImpactDetail {
        private String diseaseName;
        private int caseCount;
        private String avgMetric;
        private String riskTrend;
        private String overallAssessment;
        private String statusColor;
    }
}
