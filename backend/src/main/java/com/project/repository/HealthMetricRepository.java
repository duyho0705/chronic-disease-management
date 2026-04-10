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

    List<HealthMetric> findByPatientIdAndMeasuredAtBetweenAndIsDeletedFalse(
            Long patientId, LocalDateTime from, LocalDateTime to);

    Optional<HealthMetric> findTopByPatientIdAndMetricTypeAndIsDeletedFalseOrderByMeasuredAtDesc(
            Long patientId, MetricType metricType);

    List<HealthMetric> findTop2ByPatientIdAndMetricTypeAndIsDeletedFalseOrderByMeasuredAtDesc(
            Long patientId, MetricType metricType);

    @Query("SELECT h FROM HealthMetric h WHERE h.patient.id = :patientId " +
           "AND h.isDeleted = false ORDER BY h.measuredAt DESC")
    List<HealthMetric> findRecentByPatientId(@Param("patientId") Long patientId, Pageable pageable);

    @Query("SELECT h FROM HealthMetric h WHERE h.patient.clinicId = :clinicId " +
           "AND h.metricType = :metricType AND h.measuredAt >= :since " +
           "AND h.isDeleted = false " +
           "ORDER BY h.patient.id, h.measuredAt ASC")
    List<HealthMetric> findByClinicIdAndMetricTypeAndSince(@Param("clinicId") Long clinicId, 
                                                          @Param("metricType") MetricType metricType, 
                                                          @Param("since") LocalDateTime since);

    @Query("SELECT h FROM HealthMetric h WHERE h.patient.doctorId = :doctorId " +
           "AND h.metricType = :metricType AND h.measuredAt >= :since " +
           "AND h.isDeleted = false " +
           "ORDER BY h.patient.id, h.measuredAt ASC")
    List<HealthMetric> findByDoctorIdAndMetricTypeAndSince(@Param("doctorId") Long doctorId, 
                                                          @Param("metricType") MetricType metricType, 
                                                          @Param("since") LocalDateTime since);

    @Query("SELECT p.id FROM Patient p " +
           "LEFT JOIN HealthMetric h ON p.id = h.patient.id AND h.measuredAt >= :since AND h.isDeleted = false " +
           "WHERE p.clinicId = :clinicId AND p.isDeleted = false " +
           "GROUP BY p.id HAVING COUNT(h.id) = 0")
    List<Long> findPatientIdsInClinicWithNoMetricsSince(@Param("clinicId") Long clinicId, 
                                                       @Param("since") LocalDateTime since);

    @Query("SELECT p.id FROM Patient p " +
           "LEFT JOIN HealthMetric h ON p.id = h.patient.id AND h.measuredAt >= :since AND h.isDeleted = false " +
           "WHERE p.doctorId = :doctorId AND p.isDeleted = false " +
           "GROUP BY p.id HAVING COUNT(h.id) = 0")
    List<Long> findPatientIdsInDoctorWithNoMetricsSince(@Param("doctorId") Long doctorId, 
                                                       @Param("since") LocalDateTime since);
}
