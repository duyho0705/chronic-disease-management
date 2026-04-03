package com.project.mapper;

import com.project.dto.response.AdminUserResponse;
import com.project.entity.Clinic;
import com.project.entity.User;
import com.project.repository.ClinicRepository;
import org.springframework.stereotype.Component;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class UserMapper {

    private final ClinicRepository clinicRepository;

    public AdminUserResponse toAdminUserResponse(User user) {
        String clinicName = null;
        String clinicPhone = null;
        if (user.getClinicId() != null) {
            long clinicId = (long) user.getClinicId();
            Clinic clinic = clinicRepository.findById(clinicId).orElse(null);
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

    public String mapRoleName(String role) {
        if (role == null) return "Thành viên";
        return switch (role) {
            case "ADMIN" -> "Quản trị viên";
            case "DOCTOR" -> "Bác sĩ";
            case "CLINIC_MANAGER" -> "Quản lý phòng khám";
            case "PATIENT" -> "Bệnh nhân";
            default -> role;
        };
    }
}
