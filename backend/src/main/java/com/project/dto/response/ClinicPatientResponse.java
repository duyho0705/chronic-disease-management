package com.project.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ClinicPatientResponse {
    private String id;
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
