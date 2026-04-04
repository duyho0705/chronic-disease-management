package com.project.repository;

import com.project.entity.Clinic;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClinicRepository extends JpaRepository<Clinic, Long> {

    Optional<Clinic> findByClinicCode(String clinicCode);

    @Query("SELECT COUNT(c) FROM Clinic c WHERE c.isDeleted = false")
    long countClinics();

    @Query("SELECT COUNT(c) FROM Clinic c WHERE c.isDeleted = false AND c.status = :status")
    long countByStatusAndIsDeletedFalse(String status);

    @Query("SELECT c FROM Clinic c WHERE c.isDeleted = false")
    java.util.List<Clinic> findAllActive();

    @Query("SELECT c FROM Clinic c WHERE c.isDeleted = false AND (:status IS NULL OR c.status = :status) AND (:name IS NULL OR LOWER(c.name) LIKE :name)")
    Page<Clinic> findByFilters(String status, String name, Pageable pageable);

    @Query("SELECT COALESCE(SUM(c.doctorCount), 0) FROM Clinic c WHERE c.isDeleted = false AND c.status = 'ACTIVE'")
    long sumDoctorCountByActiveStatus();

    @Query("SELECT COALESCE(SUM(c.patientCount), 0) FROM Clinic c WHERE c.isDeleted = false")
    long sumPatientCount();

    @Query("SELECT COALESCE(SUM(c.highRiskPatientCount), 0) FROM Clinic c WHERE c.isDeleted = false")
    long sumHighRiskPatientCount();

    java.util.List<Clinic> findByManagerId(Long managerId);
}
