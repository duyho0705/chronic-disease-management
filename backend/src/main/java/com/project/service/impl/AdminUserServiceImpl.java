package com.project.service.impl;

import com.project.dto.request.CreateUserRequest;
import com.project.dto.request.UpdateUserRequest;
import com.project.dto.response.AdminUserResponse;
import com.project.dto.response.AdminUserStatsResponse;
import com.project.entity.User;
import com.project.entity.UserRole;
import com.project.exception.ResourceNotFoundException;
import com.project.mapper.UserMapper;
import com.project.repository.PatientRepository;
import com.project.repository.UserRepository;
import com.project.repository.SystemConfigRepository;
import com.project.service.AdminUserService;
import com.project.service.AuditService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
@SuppressWarnings("null")
public class AdminUserServiceImpl implements AdminUserService {

    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    private final AuditService auditService;
    private final SystemConfigRepository systemConfigRepository;

    @Override
    @Transactional(readOnly = true)
    public AdminUserStatsResponse getUserStats() {
        return AdminUserStatsResponse.builder()
                .totalUsers(userRepository.countByIsDeletedFalse())
                .adminCount(userRepository.countByRoleAndIsDeletedFalse(UserRole.ADMIN))
                .doctorCount(userRepository.countByRoleAndIsDeletedFalse(UserRole.DOCTOR))
                .clinicManagerCount(userRepository.countByRoleAndIsDeletedFalse(UserRole.CLINIC_MANAGER))
                .patientCount(userRepository.countByRoleAndIsDeletedFalse(UserRole.PATIENT))
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AdminUserResponse> getUsers(UserRole role, String status, Long clinicId, String keyword, Pageable pageable) {
        String search = (keyword != null && !keyword.isBlank()) ? "%" + keyword.toLowerCase().trim() + "%" : null;
        return userRepository.findByFilters(role, status, clinicId, null, null, null, search, pageable).map(userMapper::toAdminUserResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public AdminUserResponse getUserById(Long id) {
        return userRepository.findById(id).map(userMapper::toAdminUserResponse).orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Override
    @Transactional
    public AdminUserResponse createUser(CreateUserRequest request) {
        // Check duplicate email
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email " + request.getEmail() + " đã tồn tại trong hệ thống");
        }
        validatePasswordPolicy(request.getPassword());

        UserRole role = UserRole.valueOf(request.getRole().toUpperCase());
        if (UserRole.DOCTOR.equals(role)) {
            if (request.getLicenseNumber() == null || request.getLicenseNumber().isBlank()) {
                throw new IllegalArgumentException("Vui lòng nhập số CCHN cho bác sĩ");
            }
            if (request.getLicenseImageUrl() == null || request.getLicenseImageUrl().isBlank()) {
                throw new IllegalArgumentException("Vui lòng tải ảnh bằng chứng CCHN cho bác sĩ");
            }
        }

        User user = User.builder()
                .fullName(request.getFullName()).email(request.getEmail())
                .phone(request.getPhone())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .clinicId(request.getClinicId()).status("ACTIVE")
                .avatarUrl(request.getAvatarUrl())
                .licenseNumber(request.getLicenseNumber())
                .degree(request.getDegree())
                .bio(request.getBio())
                .licenseImageUrl(request.getLicenseImageUrl())
                .specialization(request.getSpecialization())
                .experience(request.getExperience())
                .build();
        User saved = userRepository.save(user);

        if (UserRole.PATIENT.equals(saved.getRole())) {
            patientRepository.save(com.project.entity.Patient.builder()
                    .userId(saved.getId()).clinicId(saved.getClinicId()).fullName(saved.getFullName())
                    .patientCode("PT-" + (1000 + (int) (Math.random() * 9000)))
                    .joinedDate(java.time.LocalDate.now()).riskLevel("Chưa xác định").build());
        }

        String displayName = (saved.getFullName() != null && !saved.getFullName().isBlank()) ? saved.getFullName() : saved.getEmail();
        auditService.recordActivity("Tạo mới tài khoản", "Quản lý người dùng", "Đã tạo tài khoản " + displayName, "success");
        return userMapper.toAdminUserResponse(saved);
    }

    @Override
    @Transactional
    public AdminUserResponse updateUser(Long id, UpdateUserRequest request) {
        User user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Người dùng không tồn tại"));

        if (request.getEmail() != null && !request.getEmail().isBlank() && !request.getEmail().equalsIgnoreCase(user.getEmail())) {
            if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                throw new IllegalArgumentException("Email " + request.getEmail() + " đã tồn tại trong hệ thống");
            }
            user.setEmail(request.getEmail());
        }

        if (request.getFullName() != null) user.setFullName(request.getFullName());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getRole() != null) user.setRole(UserRole.valueOf(request.getRole().toUpperCase()));
        if (request.getStatus() != null) user.setStatus(request.getStatus());
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            validatePasswordPolicy(request.getPassword());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        user.setClinicId(request.getClinicId());
        
        // Map Doctor specialization fields
        if (request.getAvatarUrl() != null) user.setAvatarUrl(request.getAvatarUrl());
        if (request.getLicenseNumber() != null) user.setLicenseNumber(request.getLicenseNumber());
        if (request.getDegree() != null) user.setDegree(request.getDegree());
        if (request.getBio() != null) user.setBio(request.getBio());
        if (request.getLicenseImageUrl() != null) user.setLicenseImageUrl(request.getLicenseImageUrl());
        if (request.getSpecialization() != null) user.setSpecialization(request.getSpecialization());
        if (request.getExperience() != null) user.setExperience(request.getExperience());

        if (UserRole.DOCTOR.equals(user.getRole())) {
            if (user.getLicenseNumber() == null || user.getLicenseNumber().isBlank()) {
                throw new IllegalArgumentException("Vui lòng nhập số CCHN cho bác sĩ");
            }
            if (user.getLicenseImageUrl() == null || user.getLicenseImageUrl().isBlank()) {
                throw new IllegalArgumentException("Vui lòng tải ảnh bằng chứng CCHN cho bác sĩ");
            }
        }
        
        User saved = userRepository.save(user);
        String displayName = (saved.getFullName() != null && !saved.getFullName().isBlank()) ? saved.getFullName() : saved.getEmail();
        auditService.recordActivity("Cập nhật tài khoản", "Quản lý người dùng", "Đã cập nhật thông tin tài khoản " + displayName, "success");
        return userMapper.toAdminUserResponse(saved);
    }

    @Override
    @Transactional
    public void toggleUserStatus(Long id) {
        User user = userRepository.findById(id).orElseThrow();
        String nextStatus = "ACTIVE".equals(user.getStatus()) ? "INACTIVE" : "ACTIVE";
        user.setStatus(nextStatus);
        userRepository.save(user);
        String displayName = (user.getFullName() != null && !user.getFullName().isBlank()) ? user.getFullName() : user.getEmail();
        auditService.recordActivity("Chuyển trạng thái tài khoản", "Quản lý người dùng", "Đã đổi trạng thái " + displayName + " sang " + ("ACTIVE".equals(nextStatus) ? "Hoạt động" : "Ngưng hoạt động"), "warning");
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id).orElseThrow();
        user.setDeleted(true);
        userRepository.save(user);
        
        if (UserRole.PATIENT.equals(user.getRole())) {
            patientRepository.findByUserIdAndIsDeletedFalse(user.getId()).ifPresent(p -> {
                p.setDeleted(true);
                patientRepository.save(p);
            });
        }
        
        String displayName = (user.getFullName() != null && !user.getFullName().isBlank()) ? user.getFullName() : user.getEmail();
        auditService.recordActivity("Xóa tài khoản", "Quản lý người dùng", "Đã xóa tài khoản " + displayName, "danger");
    }

    @Override
    @Transactional
    public void deleteUsersBatch(java.util.List<Long> ids) {
        if (ids == null || ids.isEmpty()) return;
        int count = 0;
        for (Long id : ids) {
            try {
                User user = userRepository.findById(id).orElse(null);
                if (user != null && !user.isDeleted()) {
                    user.setDeleted(true);
                    userRepository.save(user);
                    if (UserRole.PATIENT.equals(user.getRole())) {
                        patientRepository.findByUserIdAndIsDeletedFalse(user.getId()).ifPresent(p -> {
                            p.setDeleted(true);
                            patientRepository.save(p);
                        });
                    }
                    count++;
                }
            } catch (Exception e) {
                log.warn("Failed to delete user ID {}: {}", id, e.getMessage());
            }
        }
        if (count > 0) {
            auditService.recordActivity("Xóa tài khoản", "Quản lý người dùng", "Đã xóa hàng loạt " + count + " tài khoản", "danger");
        }
    }

    private void validatePasswordPolicy(String password) {
        if (password == null || password.length() < 6) {
            throw new IllegalArgumentException("Mật khẩu phải có ít nhất 6 ký tự");
        }

        com.project.entity.SystemConfig config = systemConfigRepository.findFirstByOrderByIdAsc().orElse(null);
        if (config == null) return;

        if (config.isSpecialCharRequired()) {
            if (!password.matches(".*[!@#$%^&*()_+\\-=\\[\\]{};':\",.<>/?].*")) {
                throw new IllegalArgumentException("Mật khẩu phải chứa ít nhất một ký tự đặc biệt");
            }
        }

        if (config.isUpperNumberRequired()) {
            if (!password.matches(".*[A-Z].*") || !password.matches(".*[0-9].*")) {
                throw new IllegalArgumentException("Mật khẩu phải chứa ít nhất một chữ hoa và một chữ số");
            }
        }
    }
}
