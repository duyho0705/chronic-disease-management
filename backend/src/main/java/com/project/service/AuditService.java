package com.project.service;

import com.project.entity.AuditLog;
import com.project.repository.AuditLogRepository;
import com.project.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    @Async
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void recordActivity(String action, String module, String details, String status) {
        try {
            Long userId = 1L;
            String userName = "Hệ thống";

            // Note: SecurityContext is not automatically propagated to @Async threads unless configured.
            // But we pass the user info if needed, or rely on the principal being available if the context is propagated.
            // For now, we take the info from the context, but in a real @Async method, 
            // you should pass the user info as parameters.
            
            try {
                Authentication auth = SecurityContextHolder.getContext().getAuthentication();
                if (auth != null && auth.getPrincipal() instanceof CustomUserDetails) {
                    CustomUserDetails user = (CustomUserDetails) auth.getPrincipal();
                    userId = user.getId();
                    userName = user.getFullName();
                }
            } catch (Exception ignored) {}

            auditLogRepository.save(Objects.requireNonNull(AuditLog.builder()
                    .userId(userId)
                    .userName(userName)
                    .action(action)
                    .module(module)
                    .details(details)
                    .status(status)
                    .build()));
        } catch (Exception e) {
            log.error("Failed to record audit activity: {}", e.getMessage());
        }
    }

    /**
     * Version that accepts explicit user info, better for @Async
     */
    @Async
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void recordActivity(Long userId, String userName, String action, String module, String details, String status) {
        try {
            auditLogRepository.save(Objects.requireNonNull(AuditLog.builder()
                    .userId(userId)
                    .userName(userName)
                    .action(action)
                    .module(module)
                    .details(details)
                    .status(status)
                    .build()));
        } catch (Exception e) {
            log.error("Failed to record audit activity: {}", e.getMessage());
        }
    }
}
