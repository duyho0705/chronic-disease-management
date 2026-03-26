package com.project.service.impl;

import com.project.dto.request.LogMedicationRequest;
import com.project.dto.response.MedicationScheduleResponse;
import com.project.dto.response.PatientPrescriptionResponse;
import com.project.entity.*;
import com.project.exception.ResourceNotFoundException;
import com.project.repository.*;
import com.project.service.PatientPrescriptionService;
import com.project.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PatientPrescriptionServiceImpl implements PatientPrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final MedicationScheduleRepository medicationScheduleRepository;
    private final MedicationLogRepository medicationLogRepository;
    private final PatientRepository patientRepository;

    @Override
    public List<PatientPrescriptionResponse> getActivePrescriptions() {
        Patient patient = getCurrentPatient();
        return prescriptionRepository.findByPatientIdAndStatus(patient.getId(), PrescriptionStatus.ACTIVE)
                .stream()
                .map(this::mapToPrescriptionResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<PatientPrescriptionResponse> getPrescriptionHistory() {
        Patient patient = getCurrentPatient();
        return prescriptionRepository.findByPatientIdAndStatusNot(patient.getId(), PrescriptionStatus.ACTIVE)
                .stream()
                .map(this::mapToPrescriptionResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<MedicationScheduleResponse> getTodaySchedule() {
        Patient patient = getCurrentPatient();
        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.plusDays(1).atStartOfDay();

        List<MedicationSchedule> schedules = medicationScheduleRepository
                .findByPatientIdAndIsActiveTrueOrderByScheduledTimeAsc(patient.getId());

        // Get today's logs to determine status
        List<MedicationLog> todayLogs = medicationLogRepository
                .findByPatientIdAndCreatedAtBetween(patient.getId(), startOfDay, endOfDay);

        return schedules.stream().map(schedule -> {
            // Check if taken today
            MedicationLog log = todayLogs.stream()
                    .filter(l -> l.getSchedule().getId().equals(schedule.getId()))
                    .findFirst()
                    .orElse(null);

            String status = "UPCOMING";
            String takenAt = null;
            if (log != null && "TAKEN".equals(log.getStatus())) {
                status = "TAKEN";
                takenAt = log.getTakenAt().toLocalTime().toString();
            } else if (schedule.getScheduledTime().isBefore(java.time.LocalTime.now())) {
                status = "PENDING";
            }

            int remainingDays = 0;
            if (schedule.getEndDate() != null) {
                remainingDays = (int) ChronoUnit.DAYS.between(LocalDate.now(), schedule.getEndDate());
                if (remainingDays < 0) remainingDays = 0;
            }

            return MedicationScheduleResponse.builder()
                    .id(schedule.getId())
                    .medicationName(schedule.getMedicationName())
                    .dosage(schedule.getDosage())
                    .scheduledTime(schedule.getScheduledTime())
                    .frequency(schedule.getFrequency())
                    .instructions(schedule.getInstructions())
                    .remainingDays(remainingDays)
                    .todayStatus(status)
                    .takenAt(takenAt)
                    .build();
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void logMedication(LogMedicationRequest request) {
        Patient patient = getCurrentPatient();
        MedicationSchedule schedule = medicationScheduleRepository.findById(request.getScheduleId())
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found: " + request.getScheduleId()));

        MedicationLog medicationLog = MedicationLog.builder()
                .schedule(schedule)
                .patient(patient)
                .takenAt(LocalDateTime.now())
                .status(request.getStatus())
                .notes(request.getNotes())
                .build();

        medicationLogRepository.save(medicationLog);
        log.info("Medication logged: scheduleId={}, status={}", request.getScheduleId(), request.getStatus());
    }

    @Override
    @Transactional
    public void requestRefill(Long prescriptionId) {
        Prescription prescription = prescriptionRepository.findById(prescriptionId)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription not found: " + prescriptionId));
        prescription.setStatus(PrescriptionStatus.PENDING_RENEWAL);
        prescriptionRepository.save(prescription);
        log.info("Prescription refill requested: id={}", prescriptionId);
    }

    // === Private Helpers ===

    private Patient getCurrentPatient() {
        Long userId = SecurityUtils.getCurrentUserId()
                .orElseThrow(() -> new ResourceNotFoundException("User not authenticated"));
        return patientRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient profile not found"));
    }

    private PatientPrescriptionResponse mapToPrescriptionResponse(Prescription p) {
        List<PatientPrescriptionResponse.PrescriptionItemDetail> items = p.getItems().stream()
                .map(item -> PatientPrescriptionResponse.PrescriptionItemDetail.builder()
                        .id(item.getId())
                        .medicationName(item.getMedicationName())
                        .dosage(item.getDosage())
                        .usageInstructions(item.getUsageInstructions())
                        .build())
                .collect(Collectors.toList());

        return PatientPrescriptionResponse.builder()
                .id(p.getId())
                .prescriptionCode(p.getPrescriptionCode())
                .diagnosis(p.getDiagnosis())
                .status(p.getStatus().name())
                .createdDate(p.getCreatedAt() != null ? p.getCreatedAt().toLocalDate() : null)
                .items(items)
                .build();
    }
}
