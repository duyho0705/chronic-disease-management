package com.project.dto.request;

import lombok.Data;

@Data
public class CreatePatientRequest {
    private String name;
    private String age;
    private String gender;
    private String phone;
    private String address;
    private String condition;
    private String riskLevel;
    private String assignedDoctor;
    private String notes;
}
