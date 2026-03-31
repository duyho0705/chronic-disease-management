package com.project.controller;

import com.project.dto.request.CreateClinicRequest;
import com.project.dto.request.CreateUserRequest;
import com.project.dto.request.UpdateClinicRequest;
import com.project.dto.request.UpdateUserRequest;
import com.project.dto.response.*;
import com.project.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
// @PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin Management", description = "APIs for system administration: dashboard, clinics, and users")
public class AdminController {

    private final AdminService adminService;

    // ========================
    // DASHBOARD
    // ========================

    @GetMapping("/dashboard")
    @Operation(summary = "Get admin dashboard data", description = "Returns aggregated system stats, clinic performances, and recent activities")
    public ApiResponse<AdminDashboardResponse> getDashboard() {
        return ApiResponse.success("Dashboard data fetched successfully", adminService.getDashboardData());
    }

    // ========================
    // CLINIC MANAGEMENT
    // ========================

    @GetMapping("/clinics/stats")
    @Operation(summary = "Get clinic statistics", description = "Returns summary counts for all/active/inactive clinics and total doctors")
    public ApiResponse<AdminClinicStatsResponse> getClinicStats() {
        return ApiResponse.success("Clinic stats fetched successfully", adminService.getClinicStats());
    }

    @GetMapping("/clinics")
    @Operation(summary = "Get paginated clinics list", description = "Returns filtered and paginated list of clinics")
    public ApiResponse<Page<AdminClinicResponse>> getClinics(
            @Parameter(description = "Filter by status: ACTIVE, INACTIVE") @RequestParam(required = false) String status,
            @Parameter(description = "Search by clinic name") @RequestParam(required = false) String keyword,
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ApiResponse.success("Clinics fetched successfully", adminService.getClinics(status, keyword, pageable));
    }

    @GetMapping("/clinics/{id}")
    @Operation(summary = "Get clinic by ID")
    public ApiResponse<AdminClinicResponse> getClinicById(@PathVariable Long id) {
        return ApiResponse.success("Clinic fetched successfully", adminService.getClinicById(id));
    }

    @PostMapping("/clinics")
    @Operation(summary = "Create a new clinic")
    public ApiResponse<AdminClinicResponse> createClinic(@Valid @RequestBody CreateClinicRequest request) {
        return ApiResponse.success("Clinic created successfully", adminService.createClinic(request));
    }

    @PutMapping("/clinics/{id}")
    @Operation(summary = "Update an existing clinic")
    public ApiResponse<AdminClinicResponse> updateClinic(
            @PathVariable Long id,
            @Valid @RequestBody UpdateClinicRequest request
    ) {
        return ApiResponse.success("Clinic updated successfully", adminService.updateClinic(id, request));
    }

    @PatchMapping("/clinics/{id}/toggle-status")
    @Operation(summary = "Toggle clinic active/inactive status")
    public ApiResponse<Void> toggleClinicStatus(@PathVariable Long id) {
        adminService.toggleClinicStatus(id);
        return ApiResponse.success("Clinic status toggled successfully", null);
    }

    // ========================
    // USER MANAGEMENT
    // ========================

    @GetMapping("/users/stats")
    @Operation(summary = "Get user statistics", description = "Returns role-based user counts")
    public ApiResponse<AdminUserStatsResponse> getUserStats() {
        return ApiResponse.success("User stats fetched successfully", adminService.getUserStats());
    }

    @GetMapping("/users")
    @Operation(summary = "Get paginated users list", description = "Returns filtered and paginated list of system users")
    public ApiResponse<Page<AdminUserResponse>> getUsers(
            @Parameter(description = "Filter by role: ADMIN, DOCTOR, CLINIC_MANAGER, PATIENT") @RequestParam(required = false) String role,
            @Parameter(description = "Filter by status: ACTIVE, INACTIVE") @RequestParam(required = false) String status,
            @Parameter(description = "Filter by clinic ID") @RequestParam(required = false) Long clinicId,
            @Parameter(description = "Search by name or email") @RequestParam(required = false) String keyword,
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ApiResponse.success("Users fetched successfully", adminService.getUsers(role, status, clinicId, keyword, pageable));
    }

    @GetMapping("/users/{id}")
    @Operation(summary = "Get user by ID")
    public ApiResponse<AdminUserResponse> getUserById(@PathVariable Long id) {
        return ApiResponse.success("User fetched successfully", adminService.getUserById(id));
    }

    @PostMapping("/users")
    @Operation(summary = "Create a new user")
    public ApiResponse<AdminUserResponse> createUser(@Valid @RequestBody CreateUserRequest request) {
        return ApiResponse.success("User created successfully", adminService.createUser(request));
    }

    @PutMapping("/users/{id}")
    @Operation(summary = "Update an existing user")
    public ApiResponse<AdminUserResponse> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRequest request
    ) {
        return ApiResponse.success("User updated successfully", adminService.updateUser(id, request));
    }

    @PatchMapping("/users/{id}/toggle-status")
    @Operation(summary = "Toggle user active/inactive status")
    public ApiResponse<Void> toggleUserStatus(@PathVariable Long id) {
        adminService.toggleUserStatus(id);
        return ApiResponse.success("User status toggled successfully", null);
    }

    // ========================
    // REPORTS
    // ========================

    @GetMapping("/reports")
    @Operation(summary = "Get admin reports data", description = "Returns system performance, breakdown, and patient growth data")
    public ApiResponse<AdminReportsResponse> getReports(
            @Parameter(description = "Report duration type (Day, Month, Quarter)") @RequestParam(defaultValue = "Month") String reportType,
            @Parameter(description = "Clinic performance filter") @RequestParam(defaultValue = "Tất cả kết quả") String performanceFilter
    ) {
        return ApiResponse.success("Reports data fetched successfully", adminService.getReportsData(reportType, performanceFilter));
    }
}
