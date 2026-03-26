package com.project.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PatientAlertResponse {
    private Long id;
    private String alertType;
    private String severity;
    private String title;
    private String message;
    private boolean isRead;
    private LocalDateTime createdAt;
}
