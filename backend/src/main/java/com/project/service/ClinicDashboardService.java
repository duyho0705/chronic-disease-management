package com.project.service;

import com.project.dto.request.CreatePatientRequest;
import com.project.dto.response.ClinicDashboardResponse;
import com.project.dto.response.ClinicPatientResponse;
import java.util.List;

public interface ClinicDashboardService {
    ClinicDashboardResponse getDashboardData(Long clinicId);
    List<ClinicPatientResponse> getPatientRecords(Long clinicId, String keyword);
    void createPatient(Long clinicId, CreatePatientRequest request);
}
