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
}
