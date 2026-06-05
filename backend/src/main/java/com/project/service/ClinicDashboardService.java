package com.project.service;

import com.project.dto.response.ClinicDashboardResponse;
import com.project.dto.response.ClinicAppointmentResponse;
import com.project.dto.response.ClinicAppointmentGrowthStatsResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface ClinicDashboardService {
        ClinicDashboardResponse getDashboardData(Long clinicId, String period);

        List<String> getChronicConditions();

        Page<ClinicAppointmentResponse> getAppointmentRecords(Long clinicId, String startDate, String endDate, Pageable pageable);

        ClinicAppointmentGrowthStatsResponse getAppointmentGrowthStats(Long clinicId, int year, int month);

        com.project.dto.response.ClinicResponse getClinicDetails(Long clinicId);

        void updateClinicDetails(Long clinicId, com.project.dto.request.UpdateClinicRequest request);

        void updateAppointmentStatus(Long clinicId, Long appointmentId, String newStatus);

        void createAppointment(Long clinicId, com.project.dto.request.DoctorCreateAppointmentRequest request);

        void updateAppointment(Long clinicId, Long appointmentId, com.project.dto.request.DoctorCreateAppointmentRequest request);

        int batchReschedule(Long clinicId, java.time.LocalDate sourceDate, java.time.LocalDate targetDate);
}
