package com.project.controller;

import com.project.dto.response.ApiResponse;
import com.project.dto.response.ClinicDashboardResponse;
import com.project.service.ClinicDashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
        // Normally extract clinicId from current authenticated user context if not provided
        Long targetClinicId = clinicId != null ? clinicId : 1L; // Mock clinic ID
        return ApiResponse.success("Clinic dashboard data fetched successfully", clinicDashboardService.getDashboardData(targetClinicId));
    }
}
