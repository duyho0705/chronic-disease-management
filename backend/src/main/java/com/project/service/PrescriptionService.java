package com.project.service;

import com.project.dto.request.PrescriptionRequest;
import com.project.dto.response.PrescriptionResponse;
import com.project.dto.response.PrescriptionStatsResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PrescriptionService {
    Page<PrescriptionResponse> getDoctorPrescriptions(Long doctorId, String search, String status, Pageable pageable);
    PrescriptionStatsResponse getPrescriptionStats(Long doctorId);
    PrescriptionResponse createPrescription(Long doctorId, PrescriptionRequest request);
    void cancelPrescription(Long id, Long doctorId);
}
