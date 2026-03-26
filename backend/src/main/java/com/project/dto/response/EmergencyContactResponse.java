package com.project.dto.response;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmergencyContactResponse {
    private Long id;
    private String contactName;
    private String relationship;
    private String phone;
    private boolean isPrimary;
}
