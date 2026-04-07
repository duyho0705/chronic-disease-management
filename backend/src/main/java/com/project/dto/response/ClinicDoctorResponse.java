package com.project.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ClinicDoctorResponse {
    private Long dbId;
    private String id; // Mock ID like D-1024
    private String name;
    private String specialty;
    private String email;
    private String phone;
    private int load;
    private String rating;
    private int reviews;
    private String status;
    private String statusColor;
    private String img;
    private String licenseNumber;
    private String degree;
    private String bio;
}
