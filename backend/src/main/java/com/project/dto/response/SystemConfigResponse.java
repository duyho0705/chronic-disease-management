package com.project.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
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

    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SecuritySettingsDto {
        @JsonProperty("specialChar")
        private boolean specialChar;

        @JsonProperty("upperNumber")
        private boolean upperNumber;

        @JsonProperty("specialChar")
        public boolean isSpecialChar() {
            return specialChar;
        }

        @JsonProperty("specialChar")
        public void setSpecialChar(boolean specialChar) {
            this.specialChar = specialChar;
        }

        @JsonProperty("upperNumber")
        public boolean isUpperNumber() {
            return upperNumber;
        }

        @JsonProperty("upperNumber")
        public void setUpperNumber(boolean upperNumber) {
            this.upperNumber = upperNumber;
        }
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ThresholdsDto {
        @JsonProperty("bp_sys")
        private String bp_sys;
        
        @JsonProperty("bp_dia")
        private String bp_dia;
        
        @JsonProperty("hr")
        private String hr;
        
        @JsonProperty("spo2")
        private String spo2;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NotificationsDto {
        @JsonProperty("vital")
        private boolean vital;
        
        @JsonProperty("support")
        private boolean support;
        
        @JsonProperty("revenue")
        private boolean revenue;
    }
}
