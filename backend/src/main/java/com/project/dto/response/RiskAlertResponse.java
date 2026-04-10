package com.project.dto.response;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RiskAlertResponse {

    private RiskSummary summary;
    private List<RiskPatientItem> highRiskPatients;
    private List<AlertItem> recentAlerts;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RiskSummary {
        private long totalPatients;
        private long highRiskCount;
        private long mediumRiskCount;
        private long stableCount;
        private long unmonitoredCount;       // Bệnh nhân chưa có chỉ số gần đây
        private long overdueAppointments;    // Lịch tái khám quá hạn
        private double highRiskPercentage;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RiskPatientItem {
        private Long patientId;
        private String fullName;
        private String patientCode;
        private String avatarUrl;
        private String chronicCondition;
        private String riskLevel;
        private String lastMetricStatus;      // Trạng thái chỉ số gần nhất
        private LocalDateTime lastMetricDate; // Ngày đo gần nhất
        private String doctorName;
        private Integer alertCount;           // Số cảnh báo chưa đọc
        private LocalDateTime nextAppointment;
        private boolean appointmentOverdue;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AlertItem {
        private Long alertId;
        private Long patientId;
        private String patientName;
        private String alertType;
        private String severity;
        private String title;
        private String message;
        private boolean isRead;
        private LocalDateTime createdAt;
    }
}
