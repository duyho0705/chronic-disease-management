package com.project.repository;

import com.project.entity.PatientAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PatientAlertRepository extends JpaRepository<PatientAlert, Long> {

    List<PatientAlert> findByPatientIdAndIsDismissedFalseOrderByCreatedAtDesc(Long patientId);

    long countByPatientIdAndIsReadFalse(Long patientId);

    @org.springframework.data.jpa.repository.Query("SELECT a FROM PatientAlert a WHERE a.patient.clinicId = :clinicId AND a.isDismissed = false ORDER BY a.createdAt DESC")
    List<PatientAlert> findRecentAlertsByClinic(@org.springframework.data.repository.query.Param("clinicId") Long clinicId, org.springframework.data.domain.Pageable pageable);

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(a) FROM PatientAlert a WHERE a.patient.id = :patientId AND a.isRead = false")
    int countUnreadAlertsByPatientId(@org.springframework.data.repository.query.Param("patientId") Long patientId);
}
