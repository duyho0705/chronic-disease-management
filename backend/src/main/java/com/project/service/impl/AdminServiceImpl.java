package com.project.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.dto.request.CreateClinicRequest;
import com.project.dto.request.CreateUserRequest;
import com.project.dto.request.UpdateClinicRequest;
import com.project.dto.request.UpdateSystemConfigRequest;
import com.project.dto.request.UpdateUserRequest;
import com.project.dto.response.AdminClinicResponse;
import com.project.dto.response.AdminClinicStatsResponse;
import com.project.dto.response.AdminDashboardResponse;
import com.project.dto.response.AdminReportsResponse;
import com.project.dto.response.AdminUserResponse;
import com.project.dto.response.AdminUserStatsResponse;
import com.project.dto.response.AuditLogResponse;
import com.project.dto.response.SystemConfigResponse;
import com.project.entity.Clinic;
import com.project.entity.SystemConfig;
import com.project.entity.User;
import com.project.exception.ResourceNotFoundException;
import com.project.repository.AppointmentRepository;
import com.project.repository.AuditLogRepository;
import com.project.repository.ClinicRepository;
import com.project.repository.SystemConfigRepository;
import com.project.repository.UserRepository;
import com.project.service.AdminService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminServiceImpl implements AdminService {

    private final ClinicRepository clinicRepository;
    private final UserRepository userRepository;
    private final AuditLogRepository auditLogRepository;
    private final SystemConfigRepository systemConfigRepository;
    private final AppointmentRepository appointmentRepository;
    private final PasswordEncoder passwordEncoder;

    // ========================
    // DASHBOARD
    // ========================

    @Override
    @Transactional(readOnly = true)
    public AdminDashboardResponse getDashboardData(String timeRange) {
        long totalPatients = userRepository.countByRole("PATIENT");
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

        // Clinic performance - Optimizing by pre-fetching counts in grouping map
        List<Clinic> topClinics = clinicRepository.findAll();
        Map<Long, Long> patientCounts = userRepository.countByRoleGroupedByClinic("PATIENT")
                .stream().collect(Collectors.toMap(obj -> (Long) obj[0], obj -> (Long) obj[1]));
        Map<Long, Long> doctorCounts = userRepository.countByRoleGroupedByClinic("DOCTOR")
                .stream().collect(Collectors.toMap(obj -> (Long) obj[0], obj -> (Long) obj[1]));

        List<AdminDashboardResponse.ClinicPerformanceDto> performances = topClinics.stream()
                .map(c -> AdminDashboardResponse.ClinicPerformanceDto.builder()
                        .id(c.getId())
                        .clinicCode(c.getClinicCode())
                        .name(c.getName())
                        .patientCount(patientCounts.getOrDefault(c.getId(), 0L))
                        .doctorCount(doctorCounts.getOrDefault(c.getId(), 0L))
                        .phone(c.getPhone())
                        .growth("+0%")
                        .status(c.getStatus())
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
                        .build());

        // Chart data logic
        List<AdminDashboardResponse.ChartDataDto> chartData = new ArrayList<>();
        LocalDate today = LocalDate.now();

        if ("YEAR".equalsIgnoreCase(timeRange)) {
            LocalDate startPoint = today.minusYears(4); // Last 5 years
            List<Object[]> results = userRepository.countNewPatientsByYearNative(startPoint.atStartOfDay());
            Map<String, Long> yearData = new HashMap<>();
            for (Object[] res : results) {
                LocalDateTime yDate = (res[0] instanceof LocalDateTime) ? (LocalDateTime) res[0]
                        : ((java.sql.Timestamp) res[0]).toLocalDateTime();
                yearData.put(String.valueOf(yDate.getYear()), ((Number) res[1]).longValue());
            }

            for (int i = 0; i < 5; i++) {
                String label = String.valueOf(startPoint.plusYears(i).getYear());
                chartData.add(AdminDashboardResponse.ChartDataDto.builder()
                        .label(label)
                        .value(yearData.getOrDefault(label, 0L))
                        .build());
            }
        } else if ("MONTH".equalsIgnoreCase(timeRange)) {
            LocalDate startPoint = today.withDayOfMonth(1).minusMonths(11);
            List<Object[]> results = userRepository.countNewPatientsByMonthNative(startPoint.atStartOfDay());
            Map<String, Long> monthData = new HashMap<>();
            for (Object[] res : results) {
                // Postgres DATE_TRUNC returns a Timestamp. Java's Timestamp or LocalDateTime.
                LocalDateTime mDate = (res[0] instanceof LocalDateTime) ? (LocalDateTime) res[0]
                        : ((java.sql.Timestamp) res[0]).toLocalDateTime();
                monthData.put("Th. " + mDate.getMonthValue(), ((Number) res[1]).longValue());
            }

            for (int i = 0; i < 12; i++) {
                String label = "Th. " + startPoint.plusMonths(i).getMonthValue();
                chartData.add(AdminDashboardResponse.ChartDataDto.builder()
                        .label(label)
                        .value(monthData.getOrDefault(label, 0L))
                        .build());
            }
        } else {
            LocalDate startPoint = today.minusDays(6);
            List<Object[]> results = userRepository.countNewPatientsByDayNative(startPoint.atStartOfDay());
            Map<String, Long> dayData = new HashMap<>();
            for (Object[] res : results) {
                if (res[0] == null)
                    continue;
                LocalDate dDate;
                if (res[0] instanceof java.sql.Date) {
                    dDate = ((java.sql.Date) res[0]).toLocalDate();
                } else if (res[0] instanceof java.time.LocalDate) {
                    dDate = (java.time.LocalDate) res[0];
                } else if (res[0] instanceof java.time.LocalDateTime) {
                    dDate = ((java.time.LocalDateTime) res[0]).toLocalDate();
                } else {
                    continue; // Skip unrecognized types
                }

                long count = ((Number) res[1]).longValue();
                int dowValue = dDate.getDayOfWeek().getValue();
                String label = (dowValue == 7) ? "Chủ Nhật" : "Thứ " + (dowValue + 1);
                dayData.put(label, count);
            }

            for (int i = 0; i < 7; i++) {
                LocalDate date = startPoint.plusDays(i);
                int dowValue = date.getDayOfWeek().getValue();
                String label = (dowValue == 7) ? "Chủ Nhật" : "Thứ " + (dowValue + 1);
                chartData.add(AdminDashboardResponse.ChartDataDto.builder()
                        .label(label)
                        .value(dayData.getOrDefault(label, 0L))
                        .build());
            }
        }

        return AdminDashboardResponse.builder()
                .stats(stats)
                .clinicPerformances(performances)
                .recentActivities(activities)
                .chartData(chartData)
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
            throw new RuntimeException(
                    "Email [" + request.getAdminEmail() + "] đã được đăng ký bởi một người dùng khác.");
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

        recordActivity("Tạo mới", "Quản lý phòng khám",
                "Đã khởi tạo phòng khám " + savedClinic.getName() + " cùng quản trị viên mới.", "success");

        return mapClinicToResponse(savedClinic);
    }

    @Override
    @Transactional
    public AdminClinicResponse updateClinic(Long id, UpdateClinicRequest request) {
        Clinic clinic = clinicRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Phòng khám không tồn tại với ID: " + id));

        if (request.getName() != null)
            clinic.setName(request.getName());
        if (request.getAddress() != null)
            clinic.setAddress(request.getAddress());
        if (request.getPhone() != null)
            clinic.setPhone(request.getPhone());
        if (request.getImageUrl() != null)
            clinic.setImageUrl(request.getImageUrl());
        if (request.getManagerId() != null)
            clinic.setManagerId(request.getManagerId());
        if (request.getStatus() != null)
            clinic.setStatus(request.getStatus());

        // Update Manager User if admin info provided
        if (clinic.getManagerId() != null && (request.getAdminFullName() != null || request.getAdminEmail() != null)) {
            userRepository.findById(clinic.getManagerId()).ifPresent(manager -> {
                if (request.getAdminFullName() != null)
                    manager.setFullName(request.getAdminFullName());
                if (request.getAdminEmail() != null)
                    manager.setEmail(request.getAdminEmail());
                userRepository.save(manager);
                log.info("Updated manager details for managerId: {}", manager.getId());
            });
        }

        Clinic saved = clinicRepository.save(clinic);
        log.info("Updated clinic: {} (ID: {})", saved.getName(), saved.getId());

        recordActivity("Chỉnh sửa", "Quản lý phòng khám", "Đã cập nhật thông tin phòng khám " + saved.getName(),
                "success");

        return mapClinicToResponse(saved);
    }

    @Override
    @Transactional
    public void toggleClinicStatus(Long id) {
        Clinic clinic = clinicRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Phòng khám không tồn tại với ID: " + id));

        String newStatus = "ACTIVE".equals(clinic.getStatus()) ? "INACTIVE" : "ACTIVE";
        clinic.setStatus(newStatus);
        clinicRepository.save(clinic);
        log.info("Toggled clinic status: {} -> {} (ID: {})", clinic.getName(), newStatus, id);

        String action = "ACTIVE".equals(newStatus) ? "Kích hoạt" : "Ngưng hoạt động";
        recordActivity(action, "Quản lý phòng khám", "Đã " + action.toLowerCase() + " phòng khám " + clinic.getName(),
                "ACTIVE".equals(newStatus) ? "success" : "warning");
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
    public Page<AdminUserResponse> getUsers(String role, String status, Long clinicId, String keyword,
            Pageable pageable) {
        String search = (keyword != null && !keyword.isBlank()) ? "%" + keyword.toLowerCase().trim() + "%" : null;
        Page<User> page = userRepository.findByFilters(role, status, clinicId, search, pageable);
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

        recordActivity("Tạo mới", "Quản lý người dùng",
                "Đã tạo tài khoản " + saved.getFullName() + " với vai trò " + mapRoleName(saved.getRole()), "success");

        return mapUserToResponse(saved);
    }

    @Override
    @Transactional
    public AdminUserResponse updateUser(Long id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng không tồn tại với ID: " + id));

        // Always update basic info if provided
        if (request.getFullName() != null)
            user.setFullName(request.getFullName());
        if (request.getEmail() != null)
            user.setEmail(request.getEmail());
        if (request.getPhone() != null)
            user.setPhone(request.getPhone());
        if (request.getRole() != null)
            user.setRole(request.getRole());
        if (request.getAvatarUrl() != null)
            user.setAvatarUrl(request.getAvatarUrl());
        if (request.getStatus() != null)
            user.setStatus(request.getStatus());

        // For clinicId, we need to allow setting it to null (Hệ thống chính)
        // Since this implementation uses if(null), we'll keep it for now but
        // in a real scenario we'd use Optional or similar.
        // For currently selected logic, if the user picks null in FE, it must be
        // updated.
        user.setClinicId(request.getClinicId());

        User saved = userRepository.save(user);
        log.info("Updated user: {} (ID: {})", saved.getFullName(), saved.getId());

        recordActivity("Chỉnh sửa", "Quản lý người dùng", "Đã cập nhật thông tin tài khoản " + saved.getFullName(),
                "success");

        return mapUserToResponse(saved);
    }

    @Override
    @Transactional
    public void toggleUserStatus(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng không tồn tại với ID: " + id));

        String newStatus = "ACTIVE".equals(user.getStatus()) ? "INACTIVE" : "ACTIVE";
        user.setStatus(newStatus);
        userRepository.save(user);
        log.info("Toggled user status: {} -> {} (ID: {})", user.getFullName(), newStatus, id);

        String action = "ACTIVE".equals(newStatus) ? "Kích hoạt" : "Ngưng hoạt động";
        recordActivity(action, "Quản lý người dùng", "Đã " + action.toLowerCase() + " tài khoản " + user.getFullName(),
                "ACTIVE".equals(newStatus) ? "success" : "warning");
    }

    // ========================
    // SYSTEM CONFIG
    // ========================

    @Override
    @Transactional
    public SystemConfigResponse getConfig() {
        SystemConfig config = systemConfigRepository.findFirstByOrderByIdAsc()
                .orElseGet(this::seedDefaultConfig);
        return mapToConfigResponse(config);
    }

    @Override
    @Transactional
    public SystemConfigResponse updateConfig(UpdateSystemConfigRequest request) {
        SystemConfig config = systemConfigRepository.findFirstByOrderByIdAsc()
                .orElseGet(this::seedDefaultConfig);

        config.setLanguage(request.getLanguage());
        config.setTimezone(request.getTimezone());
        config.setMaintenanceMode(request.isMaintenanceMode());

        if (request.getSecurity() != null) {
            config.setSpecialCharRequired(request.getSecurity().isSpecialChar());
            config.setUpperNumberRequired(request.getSecurity().isUpperNumber());
        }

        if (request.getThresholds() != null) {
            config.setBpSysThreshold(request.getThresholds().getBp_sys());
            config.setBpDiaThreshold(request.getThresholds().getBp_dia());
            config.setHrThreshold(request.getThresholds().getHr());
            config.setSpo2Threshold(request.getThresholds().getSpo2());
        }

        if (request.getNotifications() != null) {
            config.setNotifyVitalSigns(request.getNotifications().isVital());
            config.setNotifySupportRequests(request.getNotifications().isSupport());
            config.setNotifyRevenueReports(request.getNotifications().isRevenue());
        }

        SystemConfig saved = systemConfigRepository.save(config);
        recordActivity("Cập nhật", "Hệ thống", "Cập nhật tham số cấu hình hệ thống", "success");
        return mapToConfigResponse(saved);
    }

    @Override
    @Transactional
    public String regenerateApiKey() {
        SystemConfig config = systemConfigRepository.findFirstByOrderByIdAsc()
                .orElseGet(this::seedDefaultConfig);
        String newKey = "sk_live_" + java.util.UUID.randomUUID().toString().replace("-", "").substring(0, 24);
        config.setApiKey(newKey);
        systemConfigRepository.save(config);
        recordActivity("Làm mới", "Bảo mật", "Làm mới mã khóa API hệ thống", "warning");
        return newKey;
    }

    private SystemConfig seedDefaultConfig() {
        SystemConfig config = SystemConfig.builder()
                .language("Tiếng Việt")
                .timezone("(GMT+07) Hanoi")
                .maintenanceMode(false)
                .specialCharRequired(true)
                .upperNumberRequired(true)
                .bpSysThreshold("140")
                .bpDiaThreshold("90")
                .hrThreshold("100")
                .spo2Threshold("94")
                .notifyVitalSigns(true)
                .notifySupportRequests(true)
                .notifyRevenueReports(true)
                .apiKey("sk_live_51MvR8kL6vJtE2X9_damdiep_key")
                .build();
        return systemConfigRepository.save(config);
    }

    private SystemConfigResponse mapToConfigResponse(SystemConfig config) {
        return SystemConfigResponse.builder()
                .language(config.getLanguage())
                .timezone(config.getTimezone())
                .maintenanceMode(config.isMaintenanceMode())
                .security(SystemConfigResponse.SecuritySettingsDto.builder()
                        .specialChar(config.isSpecialCharRequired())
                        .upperNumber(config.isUpperNumberRequired())
                        .build())
                .thresholds(SystemConfigResponse.ThresholdsDto.builder()
                        .bp_sys(config.getBpSysThreshold())
                        .bp_dia(config.getBpDiaThreshold())
                        .hr(config.getHrThreshold())
                        .spo2(config.getSpo2Threshold())
                        .build())
                .notifications(SystemConfigResponse.NotificationsDto.builder()
                        .vital(config.isNotifyVitalSigns())
                        .support(config.isNotifySupportRequests())
                        .revenue(config.isNotifyRevenueReports())
                        .build())
                .apiKey(config.getApiKey())
                .build();
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
                AdminReportsResponse.ChartPoint.builder().label("Tháng 10").value(135).build());

        AdminReportsResponse.AnalyticsSummary analytics = AdminReportsResponse.AnalyticsSummary.builder()
                .growthRate("+12.4%")
                .peakMonth("Tháng 10")
                .returnRate("84.2%")
                .forecast("+5.8%")
                .build();

        // Fetching real database aggregates for clinic performances & breakdown
        List<Clinic> clinics = clinicRepository.findAll();
        
        // Count unique patients per clinic
        Map<Long, Long> patientCounts = userRepository.countByRoleGroupedByClinic("PATIENT")
                .stream().collect(Collectors.toMap(obj -> ((Number) obj[0]).longValue(), obj -> ((Number) obj[1]).longValue()));
        
        Map<Long, Long> totalAppts = appointmentRepository.countTotalAppointmentsByClinicNative()
                .stream()
                .collect(Collectors.toMap(obj -> ((Number) obj[0]).longValue(), obj -> ((Number) obj[1]).longValue()));
        Map<Long, Long> newBookingsResult = appointmentRepository
                .countNewBookingsByClinicNative(LocalDateTime.now().minusDays(30))
                .stream()
                .collect(Collectors.toMap(obj -> ((Number) obj[0]).longValue(), obj -> ((Number) obj[1]).longValue()));
        Map<Long, Double> complianceRates = appointmentRepository.calculateComplianceRateByClinicNative()
                .stream().collect(Collectors.toMap(obj -> ((Number) obj[0]).longValue(),
                        obj -> obj[1] != null ? ((Number) obj[1]).doubleValue() : 0.0));

        // Calculate true volume for clinic breakdown (based on patients)
        long totalHoneypot = patientCounts.values().stream().mapToLong(Long::longValue).sum();

        List<AdminReportsResponse.ClinicBreakdown> breakdowns = clinics.stream()
                .map(c -> {
                    long val = patientCounts.getOrDefault(c.getId(), 0L);
                    long ptg = totalHoneypot > 0 ? Math.round((val * 100.0) / totalHoneypot) : 0;
                    return AdminReportsResponse.ClinicBreakdown.builder()
                            .name(c.getName())
                            .value(String.format("%,d Bệnh nhân", val))
                            .percentage(ptg + "%")
                            .icon(c.getName().contains("Mới") ? "add_business" : "home_health")
                            .build();
                })
                .sorted((a, b) -> Integer.compare(
                        Integer.parseInt(b.getPercentage().replace("%", "")),
                        Integer.parseInt(a.getPercentage().replace("%", ""))
                ))
                .collect(Collectors.toList());


        List<AdminReportsResponse.ClinicPerformance> performances = clinics.stream()
                .map(c -> {
                    double adherence = complianceRates.getOrDefault(c.getId(), 0.0);
                    String status = "Tốt";
                    String color = "emerald";
                    if (adherence < 70) {
                        status = "Cần lưu ý";
                        color = "amber";
                    } else if (adherence < 85) {
                        status = "Ổn định";
                        color = "primary";
                    }

                    return AdminReportsResponse.ClinicPerformance.builder()
                            .name(c.getName())
                            .cases(String.format("%,d", totalAppts.getOrDefault(c.getId(), 0L)))
                            .appointments(String.format("%,d", newBookingsResult.getOrDefault(c.getId(), 0L)))
                            .adherence(Math.round(adherence) + "%")
                            .status(status)
                            .color(color)
                            .build();
                })
                .collect(Collectors.toList());

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

    @Override
    @Transactional(readOnly = true)
    public Page<AuditLogResponse> getAuditLogs(String userName, String module, String keyword, Pageable pageable) {
        String userFilter = (userName != null && !userName.equals("Tất cả người dùng"))
                ? "%" + userName.toLowerCase() + "%"
                : null;
        String moduleFilter = (module != null && !module.equals("Tất cả mô-đun")) ? module : null;
        String searchFilter = (keyword != null && !keyword.isBlank()) ? "%" + keyword.toLowerCase() + "%" : null;

        return auditLogRepository.findByFilters(userFilter, moduleFilter, searchFilter, pageable)
                .map(logEntry -> {
                    String timeStr = "--:--:--";
                    if (logEntry.getCreatedAt() != null) {
                        timeStr = logEntry.getCreatedAt()
                                .format(java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss"));
                    }

                    return AuditLogResponse.builder()
                            .id(logEntry.getId())
                            .time(timeStr)
                            .createdAt(logEntry.getCreatedAt())
                            .user(AuditLogResponse.UserDto.builder()
                                    .name(logEntry.getUserName())
                                    .avatar(logEntry.getUserAvatar())
                                    .build())
                            .action(logEntry.getAction())
                            .module(logEntry.getModule())
                            .details(logEntry.getDetails())
                            .ip(logEntry.getIpAddress())
                            .status(logEntry.getStatus())
                            .build();
                });
    }

    @Transactional(propagation = org.springframework.transaction.annotation.Propagation.REQUIRES_NEW)
    public void recordActivity(String action, String module, String details, String status) {
        try {
            // In real app, get current user and IP from SecurityContext
            com.project.entity.AuditLog logEntry = com.project.entity.AuditLog.builder()
                    .userId(1L)
                    .userName("Hệ thống (Test)")
                    .userAvatar("https://i.pravatar.cc/150?u=system")
                    .action(action)
                    .module(module)
                    .details(details)
                    .ipAddress("127.0.0.1")
                    .status(status != null ? status : "success")
                    .build();
            auditLogRepository.save(logEntry);
            log.info("Activity Recorded: {} -> {}", module, action);
        } catch (Exception e) {
            log.error("Failed to record activity log: {}", e.getMessage());
        }
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
                .doctorCount(clinic.getDoctorCount() != null ? clinic.getDoctorCount() : 0)
                .patientCount(clinic.getPatientCount() != null ? clinic.getPatientCount() : 0)
                .highRiskPatientCount(clinic.getHighRiskPatientCount() != null ? clinic.getHighRiskPatientCount() : 0)
                .status(clinic.getStatus())
                .createdAt(clinic.getCreatedAt())
                .build();
    }

    private AdminUserResponse mapUserToResponse(User user) {
        String clinicName = null;
        String clinicPhone = null;
        if (user.getClinicId() != null) {
            Clinic clinic = clinicRepository.findById(user.getClinicId()).orElse(null);
            if (clinic != null) {
                clinicName = clinic.getName();
                clinicPhone = clinic.getPhone();
            }
        }

        String status = user.getStatus();
        String displayStatus = "Hoạt động";
        if (status != null) {
            displayStatus = status.equals("ACTIVE") ? "Hoạt động" : "Ngưng hoạt động";
        }

        return AdminUserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .roleName(mapRoleName(user.getRole()))
                .clinicName(clinicName)
                .clinicPhone(clinicPhone)
                .avatarUrl(user.getAvatarUrl())
                .status(displayStatus)
                .createdAt(user.getCreatedAt())
                .build();
    }

    private String mapRoleName(String role) {
        if (role == null)
            return "Thành viên";
        return switch (role) {
            case "ADMIN" -> "Quản trị viên";
            case "DOCTOR" -> "Bác sĩ";
            case "CLINIC_MANAGER" -> "Quản lý phòng khám";
            case "PATIENT" -> "Bệnh nhân";
            default -> role;
        };
    }
}
