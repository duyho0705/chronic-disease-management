package com.project.service;

import com.project.dto.request.LogMedicationRequest;
import com.project.dto.response.MedicationScheduleResponse;
import com.project.dto.response.PatientPrescriptionResponse;

import java.util.List;

public interface PatientPrescriptionService {

    List<PatientPrescriptionResponse> getActivePrescriptions();

    List<PatientPrescriptionResponse> getPrescriptionHistory();

    List<MedicationScheduleResponse> getTodaySchedule();

    void logMedication(LogMedicationRequest request);

    void requestRefill(Long prescriptionId);
}
