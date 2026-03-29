package com.project.service;

import com.project.dto.response.ClinicDashboardResponse;

public interface ClinicDashboardService {
    ClinicDashboardResponse getDashboardData(Long clinicId);
}
