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
        notificationRepository.save(notification);
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
