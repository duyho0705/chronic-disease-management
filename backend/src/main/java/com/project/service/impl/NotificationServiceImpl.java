package com.project.service.impl;

import com.project.dto.response.NotificationResponse;
import com.project.entity.Notification;
import com.project.repository.NotificationRepository;
import com.project.service.NotificationService;
import com.project.util.SecurityUtils;
import com.project.util.DateTimeUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@SuppressWarnings("null")
@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final org.springframework.messaging.simp.SimpMessagingTemplate messagingTemplate;
    private final com.project.service.ZaloService zaloService;
    private final com.project.repository.UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse> getMyNotifications() {
        Long userId = SecurityUtils.getCurrentUserId().orElseThrow();
        return notificationRepository.findByUserIdAndIsDeletedFalseOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public long getUnreadCount() {
        Long userId = SecurityUtils.getCurrentUserId().orElseThrow();
        return notificationRepository.countByUserIdAndReadFalseAndIsDeletedFalse(userId);
    }

    @Override
    @Transactional
    public void markAsRead(Long id) {
        notificationRepository.findById(id).ifPresent(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
    }

    @Override
    @Transactional
    public void markAllAsRead() {
        Long userId = SecurityUtils.getCurrentUserId().orElseThrow();
        List<Notification> unread = notificationRepository.findAllByUserIdAndReadFalseAndIsDeletedFalse(userId);
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        notificationRepository.deleteById(id);
    }

    @Override
    @Transactional
    public void sendNotification(Long userId, String title, String message, String type, String targetUrl) {
        Notification notification = Notification.builder()
                .userId(userId)
                .title(title)
                .message(message)
                .type(type)
                .read(false)
                .targetUrl(targetUrl)
                .build();
        Notification saved = notificationRepository.save(notification);
        
        try {
            // Push to WebSocket
            String destination = "/queue/notifications";
            messagingTemplate.convertAndSendToUser(userId.toString(), destination, mapToResponse(saved));
        } catch (Exception e) {
            log.warn("Failed to send WebSocket notification to user {}: {}", userId, e.getMessage());
        }

        try {
            userRepository.findById(userId).ifPresent(user -> {
                if (user.getPhone() != null && !user.getPhone().isEmpty()) {
                    zaloService.sendMessage(user.getPhone(), "[" + title + "] " + message);
                }
            });
        } catch (Exception e) {
            log.error("Failed to send Zalo message", e);
        }
    }

    private NotificationResponse mapToResponse(Notification n) {
        return NotificationResponse.builder()
                .id(n.getId())
                .title(n.getTitle())
                .message(n.getMessage())
                .time(DateTimeUtils.formatForDashboard(n.getCreatedAt()))
                .type(n.getType())
                .read(n.isRead())
                .targetUrl(n.getTargetUrl())
                .build();
    }
}
