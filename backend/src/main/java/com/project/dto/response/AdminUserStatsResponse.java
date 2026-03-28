package com.project.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdminUserStatsResponse {
    private long totalUsers;
    private long adminCount;
    private long doctorCount;
    private long clinicManagerCount;
    private long patientCount;
}
