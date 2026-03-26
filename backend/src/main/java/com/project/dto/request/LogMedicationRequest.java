package com.project.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LogMedicationRequest {

    @NotNull(message = "Schedule ID is required")
    private Long scheduleId;

    @NotBlank(message = "Status is required")
    private String status; // TAKEN, MISSED, SKIPPED

    private String notes;
}
