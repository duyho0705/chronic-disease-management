package com.project.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PrescriptionItemRequest {
    @NotBlank(message = "Medication name is required")
    private String medicationName;
    
    @NotBlank(message = "Dosage is required")
    private String dosage;
    
    private String usageInstructions;
}
