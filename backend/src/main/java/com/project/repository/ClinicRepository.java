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

    long countByStatus(String status);

    Page<Clinic> findByStatusAndNameContainingIgnoreCase(String status, String name, Pageable pageable);

    Page<Clinic> findByNameContainingIgnoreCase(String name, Pageable pageable);

    @Query("SELECT COALESCE(SUM(c.doctorCount), 0) FROM Clinic c WHERE c.status = 'ACTIVE'")
    long sumDoctorCountByActiveStatus();

    @Query("SELECT COALESCE(SUM(c.patientCount), 0) FROM Clinic c")
    long sumPatientCount();

    @Query("SELECT COALESCE(SUM(c.highRiskPatientCount), 0) FROM Clinic c")
    long sumHighRiskPatientCount();
}
