package com.project.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "health_metrics")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HealthMetric extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @Enumerated(EnumType.STRING)
    @Column(name = "metric_type", nullable = false, length = 50)
    private MetricType metricType;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal value;

    @Column(name = "value_secondary", precision = 10, scale = 2)
    private BigDecimal valueSecondary; // For blood pressure diastolic

    @Column(nullable = false, length = 20)
    private String unit;

    @Column(length = 50)
    private String status; // NORMAL, BORDERLINE_HIGH, HIGH, LOW

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "measured_at", nullable = false)
    private LocalDateTime measuredAt;
}
