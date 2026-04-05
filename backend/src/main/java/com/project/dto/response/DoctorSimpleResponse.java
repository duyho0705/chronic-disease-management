package com.project.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DoctorSimpleResponse {
    private Long id;
    private String name;
    private String specialty;
    private String avatarUrl;
}
