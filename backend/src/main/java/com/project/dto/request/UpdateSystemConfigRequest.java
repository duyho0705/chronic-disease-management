package com.project.dto.request;

import com.project.dto.response.SystemConfigResponse; // Use response DTO markers or just define fields
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateSystemConfigRequest {
    @NotNull
    private String language;
    @NotNull
    private String timezone;
    private boolean maintenanceMode;
    
    private SystemConfigResponse.SecuritySettingsDto security;
    private SystemConfigResponse.ThresholdsDto thresholds;
    private SystemConfigResponse.NotificationsDto notifications;
}
