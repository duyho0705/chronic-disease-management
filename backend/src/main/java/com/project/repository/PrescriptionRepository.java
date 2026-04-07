package com.project.repository;

import com.project.entity.Prescription;
import com.project.entity.PrescriptionStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {

    @Query("SELECT p FROM Prescription p JOIN p.patient pat WHERE p.doctorId = :doctorId AND " +
           "(LOWER(pat.fullName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.prescriptionCode) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Prescription> findByDoctorIdAndSearchTerm(Long doctorId, String search, Pageable pageable);

    Page<Prescription> findByDoctorIdAndStatus(Long doctorId, PrescriptionStatus status, Pageable pageable);
    
    Page<Prescription> findByDoctorId(Long doctorId, Pageable pageable);

    long countByDoctorId(Long doctorId);
    
    long countByDoctorIdAndStatus(Long doctorId, PrescriptionStatus status);

    // === Patient-side queries ===
    java.util.List<Prescription> findByPatientIdAndStatus(Long patientId, PrescriptionStatus status);

    java.util.List<Prescription> findByPatientIdAndStatusNot(Long patientId, PrescriptionStatus status);

    java.util.List<Prescription> findByPatientIdOrderByCreatedAtDesc(Long patientId);
    
    long countByDoctorIdInAndCreatedAtBetweenAndIsDeletedFalse(java.util.List<Long> doctorIds, java.time.LocalDateTime start, java.time.LocalDateTime end);

    @Query("SELECT FUNCTION('DATE', p.createdAt), COUNT(p) FROM Prescription p WHERE p.doctorId IN :doctorIds AND p.isDeleted = false AND p.createdAt >= :startDate GROUP BY FUNCTION('DATE', p.createdAt)")
    java.util.List<Object[]> countDailyPrescriptionsByDoctorIds(java.util.List<Long> doctorIds, java.time.LocalDateTime startDate);

    @Query("SELECT FUNCTION('YEAR', p.createdAt), FUNCTION('MONTH', p.createdAt), COUNT(p) FROM Prescription p WHERE p.doctorId IN :doctorIds AND p.isDeleted = false AND p.createdAt >= :startDate GROUP BY FUNCTION('YEAR', p.createdAt), FUNCTION('MONTH', p.createdAt)")
    java.util.List<Object[]> countMonthlyPrescriptionsByDoctorIds(java.util.List<Long> doctorIds, java.time.LocalDateTime startDate);

    @Query("SELECT p.doctorId, COUNT(p) FROM Prescription p WHERE p.doctorId IN :doctorIds AND p.isDeleted = false GROUP BY p.doctorId")
    java.util.List<Object[]> countPrescriptionsByDoctorIds(java.util.List<Long> doctorIds);
}
