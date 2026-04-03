package com.project.dto.response;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ClinicPatientResponse {
    private Long dbId;
    private String id; // This is the patientCode (BN-xxxx) for display
    private String name;
    private int age;
    private String phone;
    private String condition;
    private String riskLevel;
    private String doctor;
    private String location;
    private String status;
    private String img;
}
