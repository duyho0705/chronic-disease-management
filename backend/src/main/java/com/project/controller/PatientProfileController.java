package com.project.controller;

import com.project.dto.request.EmergencyContactRequest;
import com.project.dto.request.UpdatePatientProfileRequest;
import com.project.dto.response.ApiResponse;
import com.project.dto.response.EmergencyContactResponse;
import com.project.dto.response.PatientProfileResponse;
import com.project.service.PatientProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/patient/profile")
@RequiredArgsConstructor
@PreAuthorize("hasRole('PATIENT')")
@Tag(name = "Patient Profile", description = "Patient profile management APIs")
public class PatientProfileController {

    private final PatientProfileService service;

    @GetMapping
    @Operation(summary = "Get current patient profile")
    public ResponseEntity<ApiResponse<PatientProfileResponse>> getProfile() {
        return ResponseEntity.ok(ApiResponse.success(
                "Profile retrieved successfully", service.getCurrentPatientProfile()));
    }

    @PutMapping
    @Operation(summary = "Update patient profile")
    public ResponseEntity<ApiResponse<PatientProfileResponse>> updateProfile(
            @Valid @RequestBody UpdatePatientProfileRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                "Profile updated successfully", service.updateProfile(request)));
    }

    @GetMapping("/emergency-contacts")
    @Operation(summary = "Get emergency contacts list")
    public ResponseEntity<ApiResponse<List<EmergencyContactResponse>>> getEmergencyContacts() {
        return ResponseEntity.ok(ApiResponse.success(
                "Emergency contacts retrieved", service.getEmergencyContacts()));
    }

    @PostMapping("/emergency-contacts")
    @Operation(summary = "Add emergency contact")
    public ResponseEntity<ApiResponse<EmergencyContactResponse>> addEmergencyContact(
            @Valid @RequestBody EmergencyContactRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                "Emergency contact added", service.addEmergencyContact(request)));
    }

    @PutMapping("/emergency-contacts/{id}")
    @Operation(summary = "Update emergency contact")
    public ResponseEntity<ApiResponse<EmergencyContactResponse>> updateEmergencyContact(
            @PathVariable Long id, @Valid @RequestBody EmergencyContactRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                "Emergency contact updated", service.updateEmergencyContact(id, request)));
    }

    @GetMapping("/download-report")
    @Operation(summary = "Download patient health report")
    public ResponseEntity<byte[]> downloadReport() {
        byte[] data = service.generateReport();
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=health_report.txt")
                .header("Content-Type", "text/plain")
                .body(data);
    }
}
