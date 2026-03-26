package com.project.repository;

import com.project.entity.HealthMetric;
import com.project.entity.MetricType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface HealthMetricRepository extends JpaRepository<HealthMetric, Long> {

    Page<HealthMetric> findByPatientIdAndIsDeletedFalseOrderByMeasuredAtDesc(
            Long patientId, Pageable pageable);

    List<HealthMetric> findByPatientIdAndMetricTypeAndMeasuredAtBetweenAndIsDeletedFalse(
            Long patientId, MetricType metricType, LocalDateTime from, LocalDateTime to);

    Optional<HealthMetric> findTopByPatientIdAndMetricTypeAndIsDeletedFalseOrderByMeasuredAtDesc(
            Long patientId, MetricType metricType);

    @Query("SELECT h FROM HealthMetric h WHERE h.patient.id = :patientId " +
           "AND h.isDeleted = false ORDER BY h.measuredAt DESC")
    List<HealthMetric> findRecentByPatientId(@Param("patientId") Long patientId, Pageable pageable);
}
