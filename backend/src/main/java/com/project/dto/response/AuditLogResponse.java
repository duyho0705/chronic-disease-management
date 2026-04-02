package com.project.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class AuditLogResponse {
    private Long id;
    private String time;
    private LocalDateTime createdAt;
    private UserDto user;
    private String action;
    private String module;
    private String details;
    private String ip;
    private String status;

    @Data
    @Builder
    public static class UserDto {
        private String name;
        private String avatar;
    }
}
