package com.project.service;

import com.project.dto.response.ClinicReportResponse;
import java.util.Map;

public interface ClinicReportService {
    ClinicReportResponse getClinicReport(Long clinicId, String period);
    
    // Drill-down data for a specific disease category
    Map<String, Object> getDiseaseDetailReport(Long clinicId, String condition);
}
