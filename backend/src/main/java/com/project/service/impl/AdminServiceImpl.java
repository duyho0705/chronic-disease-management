package com.project.service.impl;

import com.project.dto.request.CreateClinicRequest;
import com.project.dto.request.CreateUserRequest;
import com.project.dto.request.UpdateClinicRequest;
import com.project.dto.request.UpdateUserRequest;
import com.project.dto.response.*;
import com.project.entity.Clinic;
import com.project.entity.User;
import com.project.exception.ResourceNotFoundException;
import com.project.repository.ClinicRepository;
import com.project.repository.UserRepository;
import com.project.service.AdminService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminServiceImpl implements AdminService {

    private final ClinicRepository clinicRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // ========================
    // DASHBOARD
    // ========================

    @Override
    @Transactional(readOnly = true)
    public AdminDashboardResponse getDashboardData() {
        long totalPatients = clinicRepository.sumPatientCount();
        long activeClinics = clinicRepository.countByStatus("ACTIVE");
        long totalDoctors = userRepository.countByRole("DOCTOR");
        long highRiskAlerts = clinicRepository.sumHighRiskPatientCount();

        AdminDashboardResponse.AdminStatsDto stats = AdminDashboardResponse.AdminStatsDto.builder()
                .totalPatients(totalPatients)
                .activeClinics(activeClinics)
                .totalDoctors(totalDoctors)
                .highRiskAlerts(highRiskAlerts)
                .patientGrowth("+12.5%")
                .clinicTrend("Ổn định")
                .doctorTrend("+4 mới")
                .build();

        // Clinic performance for the table
        List<Clinic> topClinics = clinicRepository.findAll();
        List<AdminDashboardResponse.ClinicPerformanceDto> performances = topClinics.stream()
                .map(c -> AdminDashboardResponse.ClinicPerformanceDto.builder()
                        .id(c.getId())
                        .name(c.getName())
                        .patientCount(c.getPatientCount())
                        .growth("+0%")
                        .status(c.getStatus().equals("ACTIVE") ? "Hoạt động" : "Ngưng hoạt động")
                        .build())
                .toList();

        // Recent system activities (can be from an audit log in the future)
        List<AdminDashboardResponse.SystemActivityDto> activities = List.of(
                AdminDashboardResponse.SystemActivityDto.builder()
                        .title("Nâng cấp bảo mật")
                        .description("Cập nhật giao thức mã hóa cho hồ sơ bệnh án.")
                        .timeAgo("2 giờ trước")
                        .icon("security")
                        .color("blue")
                        .build(),
                AdminDashboardResponse.SystemActivityDto.builder()
                        .title("Phòng khám mới được thêm")
                        .description("Chi nhánh mới đã hoàn tất cấu hình.")
                        .timeAgo("5 giờ trước")
                        .icon("add_business")
                        .color("emerald")
                        .build()
        );

        return AdminDashboardResponse.builder()
                .stats(stats)
                .clinicPerformances(performances)
                .recentActivities(activities)
                .build();
    }

    // ========================
    // CLINIC MANAGEMENT
    // ========================

    @Override
    @Transactional(readOnly = true)
    public AdminClinicStatsResponse getClinicStats() {
        long total = clinicRepository.count();
        long active = clinicRepository.countByStatus("ACTIVE");
        long inactive = clinicRepository.countByStatus("INACTIVE");
        long totalDoctors = clinicRepository.sumDoctorCountByActiveStatus();

        return AdminClinicStatsResponse.builder()
                .totalClinics(total)
                .activeClinics(active)
                .inactiveClinics(inactive)
                .totalDoctors(totalDoctors)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AdminClinicResponse> getClinics(String status, String keyword, Pageable pageable) {
        Page<Clinic> page;
        String search = (keyword != null && !keyword.isBlank()) ? keyword : "";

        if (status != null && !status.isBlank()) {
            page = clinicRepository.findByStatusAndNameContainingIgnoreCase(status, search, pageable);
        } else {
            page = clinicRepository.findByNameContainingIgnoreCase(search, pageable);
        }

        return page.map(this::mapClinicToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public AdminClinicResponse getClinicById(Long id) {
        Clinic clinic = clinicRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Phòng khám không tồn tại với ID: " + id));
        return mapClinicToResponse(clinic);
    }

    @Override
    @Transactional
    public AdminClinicResponse createClinic(CreateClinicRequest request) {
        Clinic clinic = Clinic.builder()
                .clinicCode(generateClinicCode())
                .name(request.getName())
                .address(request.getAddress())
                .phone(request.getPhone())
                .imageUrl(request.getImageUrl())
                .managerId(request.getManagerId())
                .status("ACTIVE")
                .doctorCount(0)
                .patientCount(0)
                .highRiskPatientCount(0)
                .build();

        Clinic saved = clinicRepository.save(clinic);
        log.info("Created new clinic: {} ({})", saved.getName(), saved.getClinicCode());
        return mapClinicToResponse(saved);
    }

    @Override
    @Transactional
    public AdminClinicResponse updateClinic(Long id, UpdateClinicRequest request) {
        Clinic clinic = clinicRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Phòng khám không tồn tại với ID: " + id));

        if (request.getName() != null) clinic.setName(request.getName());
        if (request.getAddress() != null) clinic.setAddress(request.getAddress());
        if (request.getPhone() != null) clinic.setPhone(request.getPhone());
        if (request.getImageUrl() != null) clinic.setImageUrl(request.getImageUrl());
        if (request.getManagerId() != null) clinic.setManagerId(request.getManagerId());
        if (request.getStatus() != null) clinic.setStatus(request.getStatus());

        Clinic saved = clinicRepository.save(clinic);
        log.info("Updated clinic: {} (ID: {})", saved.getName(), saved.getId());
        return mapClinicToResponse(saved);
    }

    @Override
    @Transactional
    public void toggleClinicStatus(Long id) {
        Clinic clinic = clinicRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Phòng khám không tồn tại với ID: " + id));

        String newStatus = clinic.getStatus().equals("ACTIVE") ? "INACTIVE" : "ACTIVE";
        clinic.setStatus(newStatus);
        clinicRepository.save(clinic);
        log.info("Toggled clinic status: {} -> {} (ID: {})", clinic.getName(), newStatus, id);
    }

    // ========================
    // USER MANAGEMENT
    // ========================

    @Override
    @Transactional(readOnly = true)
    public AdminUserStatsResponse getUserStats() {
        long total = userRepository.count();
        long admins = userRepository.countByRole("ADMIN");
        long doctors = userRepository.countByRole("DOCTOR");
        long managers = userRepository.countByRole("CLINIC_MANAGER");
        long patients = userRepository.countByRole("PATIENT");

        return AdminUserStatsResponse.builder()
                .totalUsers(total)
                .adminCount(admins)
                .doctorCount(doctors)
                .clinicManagerCount(managers)
                .patientCount(patients)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AdminUserResponse> getUsers(String role, String status, Long clinicId, String keyword, Pageable pageable) {
        Page<User> page = userRepository.findByFilters(role, status, clinicId, keyword, pageable);
        return page.map(this::mapUserToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public AdminUserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng không tồn tại với ID: " + id));
        return mapUserToResponse(user);
    }

    @Override
    @Transactional
    public AdminUserResponse createUser(CreateUserRequest request) {
        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(request.getRole())
                .clinicId(request.getClinicId())
                .avatarUrl(request.getAvatarUrl())
                .status("ACTIVE")
                .build();

        User saved = userRepository.save(user);
        log.info("Created new user: {} ({}) with role {}", saved.getFullName(), saved.getEmail(), saved.getRole());
        return mapUserToResponse(saved);
    }

    @Override
    @Transactional
    public AdminUserResponse updateUser(Long id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng không tồn tại với ID: " + id));

        if (request.getFullName() != null) user.setFullName(request.getFullName());
        if (request.getEmail() != null) user.setEmail(request.getEmail());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getRole() != null) user.setRole(request.getRole());
        if (request.getClinicId() != null) user.setClinicId(request.getClinicId());
        if (request.getAvatarUrl() != null) user.setAvatarUrl(request.getAvatarUrl());
        if (request.getStatus() != null) user.setStatus(request.getStatus());

        User saved = userRepository.save(user);
        log.info("Updated user: {} (ID: {})", saved.getFullName(), saved.getId());
        return mapUserToResponse(saved);
    }

    @Override
    @Transactional
    public void toggleUserStatus(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng không tồn tại với ID: " + id));

        String newStatus = user.getStatus().equals("ACTIVE") ? "INACTIVE" : "ACTIVE";
        user.setStatus(newStatus);
        userRepository.save(user);
        log.info("Toggled user status: {} -> {} (ID: {})", user.getFullName(), newStatus, id);
    }

    // ========================
    // PRIVATE MAPPERS
    // ========================

    private AdminClinicResponse mapClinicToResponse(Clinic clinic) {
        String managerName = null;
        if (clinic.getManagerId() != null) {
            managerName = userRepository.findById(clinic.getManagerId())
                    .map(User::getFullName)
                    .orElse(null);
        }

        return AdminClinicResponse.builder()
                .id(clinic.getId())
                .clinicCode(clinic.getClinicCode())
                .name(clinic.getName())
                .address(clinic.getAddress())
                .phone(clinic.getPhone())
                .imageUrl(clinic.getImageUrl())
                .managerName(managerName)
                .doctorCount(clinic.getDoctorCount())
                .patientCount(clinic.getPatientCount())
                .highRiskPatientCount(clinic.getHighRiskPatientCount())
                .status(clinic.getStatus().equals("ACTIVE") ? "Hoạt động" : "Ngưng hoạt động")
                .createdAt(clinic.getCreatedAt())
                .build();
    }

    private AdminUserResponse mapUserToResponse(User user) {
        String clinicName = null;
        if (user.getClinicId() != null) {
            clinicName = clinicRepository.findById(user.getClinicId())
                    .map(Clinic::getName)
                    .orElse(null);
        }

        return AdminUserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .roleName(mapRoleName(user.getRole()))
                .clinicName(clinicName)
                .avatarUrl(user.getAvatarUrl())
                .status(user.getStatus().equals("ACTIVE") ? "Hoạt động" : "Ngưng hoạt động")
                .createdAt(user.getCreatedAt())
                .build();
    }

    private String mapRoleName(String role) {
        return switch (role) {
            case "ADMIN" -> "Quản trị viên";
            case "DOCTOR" -> "Bác sĩ";
            case "CLINIC_MANAGER" -> "Quản lý phòng khám";
            case "PATIENT" -> "Bệnh nhân";
            default -> role;
        };
    }

    private String generateClinicCode() {
        return "CL-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
    }
}
