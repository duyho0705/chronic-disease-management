package com.project.controller;

import com.project.dto.response.ApiResponse;
import com.project.dto.response.DoctorDashboardResponse;
import com.project.service.DoctorDashboardService;
import com.project.util.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/doctor/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "Dashboard Aggregation APIs")
public class DashboardController {

    private final DoctorDashboardService dashboardService;

    @GetMapping
    @PreAuthorize("hasRole('DOCTOR')")
    @Operation(summary = "Get consolidated dashboard data")
    public ApiResponse<DoctorDashboardResponse> getDashboard() {
        Long doctorId = SecurityUtils.getCurrentUserId().orElseThrow();
        DoctorDashboardResponse data = dashboardService.getDashboardData(doctorId);
        return ApiResponse.success("Dashboard data fetched successfully", data);
    }
}
