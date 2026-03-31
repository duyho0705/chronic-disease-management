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
        // Validate clinic code uniqueness
        if (clinicRepository.findByClinicCode(request.getClinicCode()).isPresent()) {
            throw new RuntimeException("Mã phòng khám [" + request.getClinicCode() + "] đã tồn tại trên hệ thống.");
        }

        // Validate manager email uniqueness
        if (userRepository.findByEmail(request.getAdminEmail()).isPresent()) {
            throw new RuntimeException("Email [" + request.getAdminEmail() + "] đã được đăng ký bởi một người dùng khác.");
        }

        // 1. Create Clinic Entity (temporarily without managerId)
        Clinic clinic = Clinic.builder()
                .clinicCode(request.getClinicCode())
                .name(request.getName())
                .address(request.getAddress())
                .phone(request.getPhone())
                .imageUrl(request.getImageUrl())
                .status("ACTIVE")
                .doctorCount(0)
                .patientCount(0)
                .highRiskPatientCount(0)
                .build();

        Clinic savedClinic = clinicRepository.save(clinic);

        // 2. Create Manager User Entity
        User manager = User.builder()
                .fullName(request.getAdminFullName())
                .email(request.getAdminEmail())
                .password(passwordEncoder.encode(request.getAdminPassword()))
                .role("CLINIC_MANAGER")
                .clinicId(savedClinic.getId())
                .status("ACTIVE")
                .build();

        User savedManager = userRepository.save(manager);

        // 3. Link Manager ID back to Clinic
        savedClinic.setManagerId(savedManager.getId());
        clinicRepository.save(savedClinic);

        log.info("Successfully created clinic: {} ({}) and assigned manager: {}", 
                savedClinic.getName(), savedClinic.getClinicCode(), savedManager.getEmail());

        return mapClinicToResponse(savedClinic);
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
        
        // Update Manager User if admin info provided
        if (clinic.getManagerId() != null && (request.getAdminFullName() != null || request.getAdminEmail() != null)) {
            userRepository.findById(clinic.getManagerId()).ifPresent(manager -> {
                if (request.getAdminFullName() != null) manager.setFullName(request.getAdminFullName());
                if (request.getAdminEmail() != null) manager.setEmail(request.getAdminEmail());
                userRepository.save(manager);
                log.info("Updated manager details for managerId: {}", manager.getId());
            });
        }

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
    // REPORTS
    // ========================

    @Override
    @Transactional(readOnly = true)
    public AdminReportsResponse getReportsData(String reportType, String performanceFilter) {
        // Mock data to match the UI precisely
        AdminReportsResponse.ReportSummary summary = AdminReportsResponse.ReportSummary.builder()
                .nps("78.5")
                .avgTime("24")
                .returnRate("92")
                .retentionRate("84")
                .build();

        List<AdminReportsResponse.ChartPoint> growthTrend = List.of(
                AdminReportsResponse.ChartPoint.builder().label("Tháng 5").value(165).build(),
                AdminReportsResponse.ChartPoint.builder().label("Tháng 6").value(195).build(),
                AdminReportsResponse.ChartPoint.builder().label("Tháng 7").value(150).build(),
                AdminReportsResponse.ChartPoint.builder().label("Tháng 8").value(165).build(),
                AdminReportsResponse.ChartPoint.builder().label("Tháng 9").value(120).build(),
                AdminReportsResponse.ChartPoint.builder().label("Tháng 10").value(135).build()
        );

        AdminReportsResponse.AnalyticsSummary analytics = AdminReportsResponse.AnalyticsSummary.builder()
                .growthRate("+12.4%")
                .peakMonth("Tháng 10")
                .returnRate("84.2%")
                .forecast("+5.8%")
                .build();

        List<AdminReportsResponse.ClinicBreakdown> breakdowns = List.of(
                AdminReportsResponse.ClinicBreakdown.builder().name("Vitality Quận 1").value("1,240 Bệnh nhân").percentage("45%").icon("home_health").build(),
                AdminReportsResponse.ClinicBreakdown.builder().name("Vitality Thảo Điền").value("860 Bệnh nhân").percentage("30%").icon("home_health").build(),
                AdminReportsResponse.ClinicBreakdown.builder().name("Phú Mỹ Hưng").value("720 Bệnh nhân").percentage("20%").icon("home_health").build(),
                AdminReportsResponse.ClinicBreakdown.builder().name("Cầu Giấy (Mới)").value("310 Bệnh nhân").percentage("5%").icon("add_business").build()
        );

        List<AdminReportsResponse.ClinicPerformance> performances = List.of(
                AdminReportsResponse.ClinicPerformance.builder().name("Vitality Quận 1").cases("1,240").appointments("842").adherence("95%").status("Tốt").color("emerald").build(),
                AdminReportsResponse.ClinicPerformance.builder().name("Vitality Thảo Điền").cases("860").appointments("624").adherence("91%").status("Tốt").color("emerald").build(),
                AdminReportsResponse.ClinicPerformance.builder().name("Vitality Phú Mỹ Hưng").cases("720").appointments("415").adherence("84%").status("Ổn định").color("primary").build(),
                AdminReportsResponse.ClinicPerformance.builder().name("Vitality Cầu Giấy (Mới)").cases("310").appointments("186").adherence("68%").status("Cần lưu ý").color("amber").build()
        );

        // Applying the simple frontend filter logically
        if (performanceFilter != null && !performanceFilter.equals("Tất cả kết quả")) {
            performances = performances.stream()
                    .filter(p -> p.getStatus().equals(performanceFilter))
                    .toList();
        }

        return AdminReportsResponse.builder()
                .summary(summary)
                .growthTrend(growthTrend)
                .analytics(analytics)
                .clinicBreakdown(breakdowns)
                .clinicPerformances(performances)
                .build();
    }

    // ========================
    // PRIVATE MAPPERS
    // ========================

    private AdminClinicResponse mapClinicToResponse(Clinic clinic) {
        String managerName = null;
        String managerEmail = null;
        if (clinic.getManagerId() != null) {
            User manager = userRepository.findById(clinic.getManagerId()).orElse(null);
            if (manager != null) {
                managerName = manager.getFullName();
                managerEmail = manager.getEmail();
            }
        }

        return AdminClinicResponse.builder()
                .id(clinic.getId())
                .clinicCode(clinic.getClinicCode())
                .name(clinic.getName())
                .address(clinic.getAddress())
                .phone(clinic.getPhone())
                .imageUrl(clinic.getImageUrl())
                .managerName(managerName)
                .managerEmail(managerEmail)
                .doctorCount(clinic.getDoctorCount())
                .patientCount(clinic.getPatientCount())
                .highRiskPatientCount(clinic.getHighRiskPatientCount())
                .status(clinic.getStatus())
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
}
