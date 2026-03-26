package com.project.dto.response;

import lombok.*;

import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MedicationScheduleResponse {
    private Long id;
    private String medicationName;
    private String dosage;
    private LocalTime scheduledTime;
    private String frequency;
    private String instructions;
    private int remainingDays;
    private String todayStatus;  // TAKEN, PENDING, UPCOMING
    private String takenAt;
}
