package com.project.service;

import com.project.dto.response.DoctorDashboardResponse;

public interface DoctorDashboardService {
    DoctorDashboardResponse getDashboardData(Long doctorId);
}
