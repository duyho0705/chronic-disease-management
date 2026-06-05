package com.project.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClinicAppointmentGrowthStatsResponse {
    private int totalGrowth;
    private int inPersonGrowth;
    private int onlineGrowth;
    private int pendingGrowth;
}
