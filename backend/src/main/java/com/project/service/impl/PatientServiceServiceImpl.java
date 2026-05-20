package com.project.service.impl;

import com.project.dto.response.ServiceSubscriptionResponse;
import com.project.entity.MedicalService;
import com.project.entity.Patient;
import com.project.entity.ServiceSubscription;
import com.project.repository.MedicalServiceRepository;
import com.project.repository.PatientRepository;
import com.project.repository.ServiceSubscriptionRepository;
import com.project.service.PatientServiceService;
import com.project.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@SuppressWarnings("null")
@Slf4j
@Service
@RequiredArgsConstructor
public class PatientServiceServiceImpl implements PatientServiceService {

    private final ServiceSubscriptionRepository subscriptionRepository;
    private final MedicalServiceRepository medicalServiceRepository;
    private final PatientRepository patientRepository;

    @Override
    @Transactional
    public ServiceSubscriptionResponse subscribeToService(Long serviceId) {
        Long userId = SecurityUtils.getCurrentUserId().orElseThrow(() -> new RuntimeException("Unauthorized"));
        Patient patient = patientRepository.findByUserIdAndIsDeletedFalse(userId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        MedicalService service = medicalServiceRepository.findById(serviceId)
                .orElseThrow(() -> new RuntimeException("Service not found"));

        if (!"Đang kinh doanh".equals(service.getStatus())) {
            throw new RuntimeException("Service is not available");
        }

        // Cancel existing active subscriptions
        subscriptionRepository.findFirstByPatientIdAndStatusOrderByCreatedAtDesc(patient.getId(), "ACTIVE")
                .ifPresent(sub -> {
                    sub.setStatus("CANCELLED");
                    subscriptionRepository.save(sub);
                });

        // Determine expiration based on duration string (simple parsing for demo)
        LocalDateTime expiresAt = LocalDateTime.now().plusMonths(1); // Default
        String duration = service.getDuration().toLowerCase();
        if (duration.contains("năm")) {
            expiresAt = LocalDateTime.now().plusYears(1);
        } else if (duration.contains("tháng")) {
            try {
                String numStr = duration.replaceAll("[^0-9]", "");
                if (!numStr.isEmpty()) {
                    int months = Integer.parseInt(numStr);
                    expiresAt = LocalDateTime.now().plusMonths(months);
                }
            } catch (Exception ignored) {}
        }

        ServiceSubscription newSub = ServiceSubscription.builder()
                .patientId(patient.getId())
                .service(service)
                .status("ACTIVE")
                .subscribedAt(LocalDateTime.now())
                .expiresAt(expiresAt)
                .build();

        newSub = subscriptionRepository.save(newSub);
        return mapToResponse(newSub);
    }

    @Override
    @Transactional
    public void cancelSubscription() {
        Long userId = SecurityUtils.getCurrentUserId().orElseThrow(() -> new RuntimeException("Unauthorized"));
        Patient patient = patientRepository.findByUserIdAndIsDeletedFalse(userId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        ServiceSubscription activeSub = subscriptionRepository.findFirstByPatientIdAndStatusOrderByCreatedAtDesc(patient.getId(), "ACTIVE")
                .orElseThrow(() -> new RuntimeException("No active subscription found"));

        activeSub.setStatus("CANCELLED");
        subscriptionRepository.save(activeSub);
    }

    @Override
    @Transactional(readOnly = true)
    public ServiceSubscriptionResponse getCurrentSubscription() {
        Long userId = SecurityUtils.getCurrentUserId().orElseThrow(() -> new RuntimeException("Unauthorized"));
        Patient patient = patientRepository.findByUserIdAndIsDeletedFalse(userId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        return subscriptionRepository.findFirstByPatientIdAndStatusOrderByCreatedAtDesc(patient.getId(), "ACTIVE")
                .map(this::mapToResponse)
                .orElse(null);
    }

    private ServiceSubscriptionResponse mapToResponse(ServiceSubscription sub) {
        return ServiceSubscriptionResponse.builder()
                .id(sub.getId())
                .serviceId(sub.getService().getId())
                .serviceName(sub.getService().getName())
                .category(sub.getService().getCategory())
                .price(sub.getService().getPrice())
                .duration(sub.getService().getDuration())
                .status(sub.getStatus())
                .subscribedAt(sub.getSubscribedAt())
                .expiresAt(sub.getExpiresAt())
                .build();
    }
}
