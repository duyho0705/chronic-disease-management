package com.project.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HealthMetricResponse {
    private Long id;
    private String metricType;
    private String metricDisplayName;
    private BigDecimal value;
    private BigDecimal valueSecondary;
    private String unit;
    private String status;
    private String notes;
    private LocalDateTime measuredAt;
}
