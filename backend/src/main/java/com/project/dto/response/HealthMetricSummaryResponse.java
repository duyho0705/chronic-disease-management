package com.project.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HealthMetricSummaryResponse {
    private String metricType;
    private String displayName;
    private String icon;
    private BigDecimal latestValue;
    private BigDecimal latestValueSecondary;
    private String unit;
    private String status;
    private String trend;
    private String changePercentage;
    private List<HealthMetricResponse> chartData;
}
