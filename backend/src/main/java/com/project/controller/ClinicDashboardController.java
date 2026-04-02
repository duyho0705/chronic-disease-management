package com.project.controller;

import com.project.dto.request.CreatePatientRequest;
import com.project.dto.response.ApiResponse;
import com.project.dto.response.ClinicDashboardResponse;
import com.project.dto.response.ClinicPatientResponse;
import com.project.service.ClinicDashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/clinic")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('CLINIC_MANAGER', 'ADMIN')")
@Tag(name = "Clinic Management", description = "APIs for clinic managers")
public class ClinicDashboardController {

    private final ClinicDashboardService clinicDashboardService;

    @GetMapping("/dashboard")
    @Operation(summary = "Get clinic dashboard data", description = "Returns aggregated statistical data for a specific clinic")
    public ApiResponse<ClinicDashboardResponse> getDashboard(
            @RequestParam(required = false) Long clinicId
    ) {
        Long targetClinicId = clinicId != null ? clinicId : 1L;
        return ApiResponse.success("Clinic dashboard data fetched successfully", 
                clinicDashboardService.getDashboardData(targetClinicId));
    }

    @GetMapping("/patients")
    @Operation(summary = "Get clinic patients list", description = "Returns list of patients belonging to a clinic")
    public ApiResponse<List<ClinicPatientResponse>> getPatients(
            @RequestParam(required = false) Long clinicId,
            @RequestParam(required = false) String keyword
    ) {
        Long targetClinicId = clinicId != null ? clinicId : 1L;
        return ApiResponse.success("Clinic patients fetched successfully", 
                clinicDashboardService.getPatientRecords(targetClinicId, keyword));
    }

    @PostMapping("/patients")
    @Operation(summary = "Create new patient record", description = "Add a new chronic patient record to the clinic")
    public ApiResponse<Void> createPatient(
            @RequestParam(required = false) Long clinicId,
            @RequestBody CreatePatientRequest request
    ) {
        Long targetClinicId = clinicId != null ? clinicId : 1L;
        clinicDashboardService.createPatient(targetClinicId, request);
        return ApiResponse.success("Patient record created successfully", null);
    }
}
