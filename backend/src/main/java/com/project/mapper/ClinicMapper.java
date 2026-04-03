package com.project.mapper;

import com.project.dto.response.AdminClinicResponse;
import com.project.dto.response.ClinicDashboardResponse;
import com.project.entity.Clinic;
import com.project.entity.User;
import com.project.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ClinicMapper {

    private final UserRepository userRepository;

    public ClinicDashboardResponse.GrowthStatsDto toGrowthStats() {
        return ClinicDashboardResponse.GrowthStatsDto.builder()
                .growth("+12.5%")
                .average("180 ca/tháng")
                .peakMonth("Tháng 3 (224 ca)")
                .build();
    }

    public AdminClinicResponse toAdminClinicResponse(Clinic clinic) {
        String managerName = null;
        String managerEmail = null;
        if (clinic.getManagerId() != null) {
            long managerId = (long) clinic.getManagerId();
            User manager = userRepository.findById(managerId).orElse(null);
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
}
