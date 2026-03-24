package com.project.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardStatsDto {
    private long totalPatients;
    private long highRiskCount;
    private long pendingAppointmentsCount;
    private long unreadMessagesCount;
}
