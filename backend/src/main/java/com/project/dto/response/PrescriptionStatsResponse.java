package com.project.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PrescriptionStatsResponse {
    private long totalPrescriptions;
    private long activePrescriptions;
    private long pendingRenewals;
    private long completedPrescriptions;
    private double recoveryRate;
}
