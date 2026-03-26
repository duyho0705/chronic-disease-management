package com.project.repository;

import com.project.entity.EmergencyContact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmergencyContactRepository extends JpaRepository<EmergencyContact, Long> {

    List<EmergencyContact> findByPatientId(Long patientId);

    List<EmergencyContact> findByPatientIdAndIsPrimaryTrue(Long patientId);
}
