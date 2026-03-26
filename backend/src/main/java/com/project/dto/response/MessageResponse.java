package com.project.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageResponse {
    private Long id;
    private Long senderId;
    private String senderType;
    private String senderName;
    private String senderAvatarUrl;
    private String content;
    private String messageType;
    private String attachmentUrl;
    private boolean isRead;
    private LocalDateTime sentAt;
}
