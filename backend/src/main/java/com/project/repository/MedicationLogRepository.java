package com.project.repository;

import com.project.entity.MedicationLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MedicationLogRepository extends JpaRepository<MedicationLog, Long> {

    List<MedicationLog> findByPatientIdAndCreatedAtBetween(
            Long patientId, LocalDateTime from, LocalDateTime to);

    List<MedicationLog> findByScheduleIdAndCreatedAtBetween(
            Long scheduleId, LocalDateTime from, LocalDateTime to);
}
