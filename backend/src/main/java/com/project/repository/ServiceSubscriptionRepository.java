package com.project.repository;

import com.project.entity.ServiceSubscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ServiceSubscriptionRepository extends JpaRepository<ServiceSubscription, Long> {
    Optional<ServiceSubscription> findFirstByPatientIdAndStatusOrderByCreatedAtDesc(Long patientId, String status);
    List<ServiceSubscription> findByPatientIdOrderByCreatedAtDesc(Long patientId);
    boolean existsByPatientIdAndStatus(Long patientId, String status);
}
