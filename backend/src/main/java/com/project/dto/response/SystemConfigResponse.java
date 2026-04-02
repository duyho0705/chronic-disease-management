package com.project.dto.response;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SystemConfigResponse {
    private String language;
    private String timezone;
    private boolean maintenanceMode;
    
    private SecuritySettingsDto security;
    private ThresholdsDto thresholds;
    private NotificationsDto notifications;
    
    private String apiKey;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SecuritySettingsDto {
        private boolean specialChar;
        private boolean upperNumber;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ThresholdsDto {
        private String bp_sys;
        private String bp_dia;
        private String hr;
        private String spo2;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NotificationsDto {
        private boolean vital;
        private boolean support;
        private boolean revenue;
    }
}
