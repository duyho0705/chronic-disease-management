package com.project.service;

import com.project.dto.response.RiskAlertResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface RiskAlertService {
    RiskAlertResponse getRiskAlertDashboard(Long clinicId);
    Page<RiskAlertResponse.RiskPatientItem> getHighRiskPatients(Long clinicId, Pageable pageable);
    void dismissAlert(Long alertId);
    void markAlertAsRead(Long alertId);
}
