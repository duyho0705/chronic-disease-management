package com.project.repository;

import com.project.entity.PatientAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PatientAlertRepository extends JpaRepository<PatientAlert, Long> {

    List<PatientAlert> findByPatientIdAndIsDismissedFalseOrderByCreatedAtDesc(Long patientId);

    long countByPatientIdAndIsReadFalse(Long patientId);
}
