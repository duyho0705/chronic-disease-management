package com.project.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateHealthMetricRequest {

    @NotNull(message = "Metric type is required")
    private String metricType; // BLOOD_SUGAR, BLOOD_PRESSURE, HEART_RATE, HBA1C, SPO2

    @NotNull(message = "Value is required")
    private BigDecimal value;

    private BigDecimal valueSecondary; // For blood pressure diastolic

    @NotBlank(message = "Unit is required")
    private String unit;

    private String notes;

    private LocalDateTime measuredAt;
}
