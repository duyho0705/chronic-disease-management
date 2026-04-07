package com.project.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ClinicResponse {
    private Long id;
    private String clinicCode;
    private String name;
    private String address;
    private String phone;
    private String imageUrl;
    private String status;
    private Integer doctorCount;
    private Integer patientCount;
}
