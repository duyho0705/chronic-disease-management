package com.project.service;

import com.project.dto.request.CreateClinicRequest;
import com.project.dto.request.CreateUserRequest;
import com.project.dto.request.UpdateClinicRequest;
import com.project.dto.request.UpdateUserRequest;
import com.project.dto.response.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdminService {

    // === Dashboard ===
    AdminDashboardResponse getDashboardData();

    // === Clinic Management ===
    AdminClinicStatsResponse getClinicStats();

    Page<AdminClinicResponse> getClinics(String status, String keyword, Pageable pageable);

    AdminClinicResponse getClinicById(Long id);

    AdminClinicResponse createClinic(CreateClinicRequest request);

    AdminClinicResponse updateClinic(Long id, UpdateClinicRequest request);

    void toggleClinicStatus(Long id);

    // === User Management ===
    AdminUserStatsResponse getUserStats();

    Page<AdminUserResponse> getUsers(String role, String status, Long clinicId, String keyword, Pageable pageable);

    AdminUserResponse getUserById(Long id);

    AdminUserResponse createUser(CreateUserRequest request);

    AdminUserResponse updateUser(Long id, UpdateUserRequest request);

    void toggleUserStatus(Long id);

    // === Reports ===
    AdminReportsResponse getReportsData(String reportType, String performanceFilter);
}
