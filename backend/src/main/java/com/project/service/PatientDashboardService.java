package com.project.service;

import com.project.dto.response.PatientAlertResponse;
import com.project.dto.response.PatientDashboardResponse;

import java.util.List;

public interface PatientDashboardService {

    PatientDashboardResponse getDashboard();

    List<PatientAlertResponse> getAlerts();

    void dismissAlert(Long alertId);
}
