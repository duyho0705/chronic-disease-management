package com.project.service;

import com.project.dto.response.NotificationResponse;
import java.util.List;

public interface NotificationService {
    List<NotificationResponse> getMyNotifications();
    long getUnreadCount();
    void markAsRead(Long id);
    void markAllAsRead();
    void delete(Long id);
    void sendNotification(Long userId, String title, String message, String type, String targetUrl);
}
