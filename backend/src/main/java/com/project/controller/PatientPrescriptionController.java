package com.project.controller;

import com.project.dto.request.LogMedicationRequest;
import com.project.dto.response.ApiResponse;
import com.project.dto.response.MedicationScheduleResponse;
import com.project.dto.response.PatientPrescriptionResponse;
import com.project.service.PatientPrescriptionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/patient/prescriptions")
@RequiredArgsConstructor
@PreAuthorize("hasRole('PATIENT')")
@Tag(name = "Patient Prescriptions", description = "Patient prescription management APIs")
public class PatientPrescriptionController {

    private final PatientPrescriptionService service;

    @GetMapping("/active")
    @Operation(summary = "Get active prescriptions")
    public ResponseEntity<ApiResponse<List<PatientPrescriptionResponse>>> getActive() {
        return ResponseEntity.ok(ApiResponse.success(
                "Active prescriptions retrieved", service.getActivePrescriptions()));
    }

    @GetMapping("/history")
    @Operation(summary = "Get prescription history")
    public ResponseEntity<ApiResponse<List<PatientPrescriptionResponse>>> getHistory() {
        return ResponseEntity.ok(ApiResponse.success(
                "Prescription history retrieved", service.getPrescriptionHistory()));
    }

    @GetMapping("/today-schedule")
    @Operation(summary = "Get today's medication schedule")
    public ResponseEntity<ApiResponse<List<MedicationScheduleResponse>>> getTodaySchedule() {
        return ResponseEntity.ok(ApiResponse.success(
                "Today's schedule retrieved", service.getTodaySchedule()));
    }

    @PostMapping("/log-medication")
    @Operation(summary = "Log medication intake")
    public ResponseEntity<ApiResponse<Void>> logMedication(
            @Valid @RequestBody LogMedicationRequest request) {
        service.logMedication(request);
        return ResponseEntity.ok(ApiResponse.success("Medication logged successfully", null));
    }

    @PostMapping("/{id}/request-refill")
    @Operation(summary = "Request prescription refill")
    public ResponseEntity<ApiResponse<Void>> requestRefill(@PathVariable Long id) {
        service.requestRefill(id);
        return ResponseEntity.ok(ApiResponse.success("Refill requested successfully", null));
    }
}
