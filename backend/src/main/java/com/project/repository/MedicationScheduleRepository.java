package com.project.repository;

import com.project.entity.MedicationSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicationScheduleRepository extends JpaRepository<MedicationSchedule, Long> {

    List<MedicationSchedule> findByPatientIdAndIsActiveTrue(Long patientId);

    List<MedicationSchedule> findByPatientIdAndIsActiveTrueOrderByScheduledTimeAsc(Long patientId);
}
