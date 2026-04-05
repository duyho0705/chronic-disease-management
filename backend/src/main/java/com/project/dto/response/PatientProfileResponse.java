package com.project.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PatientProfileResponse {
    private Long id;
    private String patientCode;
    private String fullName;
    private LocalDate dateOfBirth;
    private int age;
    private String gender;
    private String phone;
    private String email;
    private String address;
    private String bloodType;
    private BigDecimal heightCm;
    private BigDecimal weightKg;
    private String identityCard;
    private String occupation;
    private String ethnicity;
    private String healthInsuranceNumber;
    private String avatarUrl;
    private LocalDate joinedDate;
    private String chronicCondition;
    private List<String> chronicDiseases;
    private List<String> allergies;
    private List<String> currentMedications;
    private EmergencyContactResponse emergencyContact;
}
