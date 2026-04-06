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
            String status, Pageable pageable);

    void createPatient(Long clinicId, CreatePatientRequest request);

    void updatePatient(Long clinicId, Long patientId, CreatePatientRequest request);

    void deletePatient(Long clinicId, Long patientId);

    org.springframework.data.domain.Page<ClinicDoctorResponse> getDoctorRecords(Long clinicId, String keyword,
            org.springframework.data.domain.Pageable pageable);

    void createDoctor(Long clinicId, CreateDoctorRequest request);

    void updateDoctor(Long clinicId, Long doctorId, CreateDoctorRequest request);

    void deleteDoctor(Long clinicId, Long doctorId);

    List<String> getDoctorNames(Long clinicId);

    List<String> getChronicConditions();
    
    List<DoctorSnippetDto> getAvailableDoctors(Long clinicId);
}
