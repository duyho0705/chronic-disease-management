package com.project.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdminClinicStatsResponse {
    private long totalClinics;
    private long activeClinics;
    private long inactiveClinics;
    private long totalDoctors;
}
