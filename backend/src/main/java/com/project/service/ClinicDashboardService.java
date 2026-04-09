package com.project.service;

import com.project.dto.request.CreatePatientRequest;
import com.project.dto.request.CreateDoctorRequest;
import com.project.dto.response.ClinicDashboardResponse;
import com.project.dto.response.ClinicPatientResponse;
import com.project.dto.response.ClinicDoctorResponse;
import com.project.dto.response.DoctorSnippetDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface ClinicDashboardService {
        ClinicDashboardResponse getDashboardData(Long clinicId, String period);

        Page<ClinicPatientResponse> getPatientRecords(Long clinicId, String keyword, String condition, String riskLevel,
                        String status, String doctor, Pageable pageable);

        void createPatient(Long clinicId, CreatePatientRequest request);

        void updatePatient(Long clinicId, Long patientId, CreatePatientRequest request);

        void deletePatient(Long clinicId, Long patientId);

        org.springframework.data.domain.Page<ClinicDoctorResponse> getDoctorRecords(Long clinicId, String keyword, String status, String specialty, String degree, String experience,
                        org.springframework.data.domain.Pageable pageable);

        void createDoctor(Long clinicId, CreateDoctorRequest request);

        void updateDoctor(Long clinicId, Long doctorId, CreateDoctorRequest request);

        void deleteDoctor(Long clinicId, Long doctorId);

        List<String> getDoctorNames(Long clinicId);

        List<String> getChronicConditions();

        List<DoctorSnippetDto> getAvailableDoctors(Long clinicId);

        org.springframework.data.domain.Page<com.project.dto.response.ClinicAppointmentResponse> getAppointmentRecords(
                        Long clinicId, org.springframework.data.domain.Pageable pageable);

        void sendNotificationToPatient(Long clinicId, Long patientId, String message);

        com.project.dto.response.ClinicResponse getClinicDetails(Long clinicId);

        void updateClinicDetails(Long clinicId, com.project.dto.request.UpdateClinicRequest request);

        void updateAppointmentStatus(Long clinicId, Long appointmentId, String status);
}
