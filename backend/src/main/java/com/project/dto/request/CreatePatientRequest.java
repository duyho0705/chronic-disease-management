package com.project.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CreatePatientRequest {
    @NotBlank(message = "Patient name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;

    @NotBlank(message = "Age is required")
    private String age;

    @NotBlank(message = "Gender is required")
    @Pattern(regexp = "Nam|Nữ|Khác", message = "Gender must be Nam, Nữ, or Khác")
    private String gender;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^(0|\\+84)(\\d{9,10})$", message = "Invalid phone number format")
    private String phone;

    private String address;

    @NotBlank(message = "Chronic condition is required")
    private String condition;

    private String riskLevel;

    @NotBlank(message = "Assigned doctor is required")
    private String assignedDoctor;

    private String notes;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;
}
