package com.project.service;

import java.util.List;

public interface ClinicalAnalyticsService {
    List<String> getClinicInsights(Long clinicId);
    List<String> getDoctorInsights(Long doctorId);
}
