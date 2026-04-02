package com.project.repository;

import com.project.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {

    List<Patient> findByDoctorId(Long doctorId);

    Optional<Patient> findByUserId(Long userId);

    Optional<Patient> findByPatientCode(String patientCode);

    List<Patient> findByClinicId(Long clinicId);

    @Query("SELECT p FROM Patient p WHERE (:clinicId IS NULL OR p.clinicId = :clinicId) AND " +
           "(:keyword IS NULL OR :keyword = '' OR " +
           "LOWER(p.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.patientCode) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Patient> findByClinicIdAndFilters(Long clinicId, String keyword);
}
