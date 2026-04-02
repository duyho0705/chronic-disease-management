package com.project.controller;

import com.project.dto.request.CreateClinicRequest;
import com.project.dto.request.CreateUserRequest;
import com.project.dto.request.UpdateClinicRequest;
import com.project.dto.request.UpdateUserRequest;
import com.project.dto.request.UpdateSystemConfigRequest;
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
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@Tag(name = "Admin", description = "Admin management APIs")
public class AdminController {

    private final AdminService adminService;

    // === Dashboard ===

    @GetMapping("/dashboard")
    @Operation(summary = "Get admin dashboard data")
    public ApiResponse<AdminDashboardResponse> getDashboardData(
            @RequestParam(defaultValue = "DAY") String timeRange
    ) {
        return ApiResponse.success("Dashboard data fetched successfully", adminService.getDashboardData(timeRange));
    }

    // === Clinic Management ===

    @GetMapping("/clinics/stats")
    @Operation(summary = "Get clinic management statistics")
    public ApiResponse<AdminClinicStatsResponse> getClinicStats() {
        return ApiResponse.success("Clinic stats fetched successfully", adminService.getClinicStats());
    }

    @GetMapping("/clinics")
    @Operation(summary = "Get paginated list of clinics")
    public ApiResponse<Page<AdminClinicResponse>> getClinics(
            @Parameter(description = "Filter by status (ACTIVE, INACTIVE)") @RequestParam(required = false) String status,
            @Parameter(description = "Search by name or code") @RequestParam(required = false) String keyword,
            @Parameter(description = "Page number") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        return ApiResponse.success("Clinics fetched successfully", adminService.getClinics(status, keyword, pageable));
    }

    @GetMapping("/clinics/{id}")
    @Operation(summary = "Get clinic details by ID")
    public ApiResponse<AdminClinicResponse> getClinicById(@PathVariable Long id) {
        return ApiResponse.success("Clinic details fetched successfully", adminService.getClinicById(id));
    }

    @PostMapping("/clinics")
    @Operation(summary = "Create a new clinic")
    public ApiResponse<AdminClinicResponse> createClinic(@RequestBody @Valid CreateClinicRequest request) {
        return ApiResponse.success("Clinic created successfully", adminService.createClinic(request));
    }

    @PutMapping("/clinics/{id}")
    @Operation(summary = "Update clinic information")
    public ApiResponse<AdminClinicResponse> updateClinic(
            @PathVariable Long id,
            @RequestBody @Valid UpdateClinicRequest request
    ) {
        return ApiResponse.success("Clinic updated successfully", adminService.updateClinic(id, request));
    }

    @PatchMapping("/clinics/{id}/toggle-status")
    @Operation(summary = "Toggle clinic active/inactive status")
    public ApiResponse<Void> toggleClinicStatus(@PathVariable Long id) {
        adminService.toggleClinicStatus(id);
        return ApiResponse.success("Clinic status toggled successfully", null);
    }

    // === User Management ===

    @GetMapping("/users/stats")
    @Operation(summary = "Get user management statistics")
    public ApiResponse<AdminUserStatsResponse> getUserStats() {
        return ApiResponse.success("User stats fetched successfully", adminService.getUserStats());
    }

    @GetMapping("/users")
    @Operation(summary = "Get paginated list of users")
    public ApiResponse<Page<AdminUserResponse>> getUsers(
            @Parameter(description = "Filter by role") @RequestParam(required = false) String role,
            @Parameter(description = "Filter by status") @RequestParam(required = false) String status,
            @Parameter(description = "Filter by clinic") @RequestParam(required = false) Long clinicId,
            @Parameter(description = "Search by name, email or phone") @RequestParam(required = false) String keyword,
            @Parameter(description = "Page number") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        return ApiResponse.success("Users fetched successfully", adminService.getUsers(role, status, clinicId, keyword, pageable));
    }

    @GetMapping("/users/{id}")
    @Operation(summary = "Get user details by ID")
    public ApiResponse<AdminUserResponse> getUserById(@PathVariable Long id) {
        return ApiResponse.success("User details fetched successfully", adminService.getUserById(id));
    }

    @PostMapping("/users")
    @Operation(summary = "Create a new user (Doctor/Manager/Admin)")
    public ApiResponse<AdminUserResponse> createUser(@RequestBody @Valid CreateUserRequest request) {
        return ApiResponse.success("User created successfully", adminService.createUser(request));
    }

    @PutMapping("/users/{id}")
    @Operation(summary = "Update user information")
    public ApiResponse<AdminUserResponse> updateUser(
            @PathVariable Long id,
            @RequestBody @Valid UpdateUserRequest request
    ) {
        return ApiResponse.success("User updated successfully", adminService.updateUser(id, request));
    }

    @PatchMapping("/users/{id}/toggle-status")
    @Operation(summary = "Toggle user active/inactive status")
    public ApiResponse<Void> toggleUserStatus(@PathVariable Long id) {
        adminService.toggleUserStatus(id);
        return ApiResponse.success("User status toggled successfully", null);
    }

    // === Reports ===

    @GetMapping("/reports")
    @Operation(summary = "Get admin reports data")
    public ApiResponse<AdminReportsResponse> getReportsData(
            @RequestParam(defaultValue = "CLINIC") String reportType,
            @RequestParam(defaultValue = "ALL") String performanceFilter
    ) {
        return ApiResponse.success("Reports data fetched successfully", adminService.getReportsData(reportType, performanceFilter));
    }

    // === Audit Logs ===

    @GetMapping("/audit-logs")
    @Operation(summary = "Get system audit logs")
    public ApiResponse<Page<AuditLogResponse>> getAuditLogs(
            @RequestParam(required = false) String userName,
            @RequestParam(required = false) String module,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ApiResponse.success("Audit logs fetched successfully", adminService.getAuditLogs(userName, module, keyword, pageable));
    }

    // === System Config ===

    @GetMapping("/config")
    @Operation(summary = "Get system configuration")
    public ApiResponse<SystemConfigResponse> getConfig() {
        return ApiResponse.success("System config fetched successfully", adminService.getConfig());
    }

    @PutMapping("/config")
    @Operation(summary = "Update system configuration")
    public ApiResponse<SystemConfigResponse> updateConfig(@RequestBody @Valid UpdateSystemConfigRequest request) {
        return ApiResponse.success("System config updated successfully", adminService.updateConfig(request));
    }

    @PostMapping("/config/regenerate-key")
    @Operation(summary = "Regenerate system API key")
    public ApiResponse<String> regenerateApiKey() {
        return ApiResponse.success("API key regenerated successfully", adminService.regenerateApiKey());
    }
}
