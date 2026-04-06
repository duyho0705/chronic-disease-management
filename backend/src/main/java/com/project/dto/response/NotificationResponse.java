package com.project.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class NotificationResponse {
    private Long id;
    private String title;
    private String message;
    private String time; // Formatted time string
    private String type;
    private boolean read;
    private String targetUrl;
}
