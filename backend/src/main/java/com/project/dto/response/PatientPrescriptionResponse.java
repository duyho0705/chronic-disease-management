package com.project.dto.response;

import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PatientPrescriptionResponse {
    private Long id;
    private String prescriptionCode;
    private String doctorName;
    private String diagnosis;
    private String status;
    private LocalDate createdDate;
    private int remainingDays;
    private double completionPercentage;
    private List<PrescriptionItemDetail> items;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PrescriptionItemDetail {
        private Long id;
        private String medicationName;
        private String dosage;
        private String frequency;
        private String usageInstructions;
        private String category;
    }
}
