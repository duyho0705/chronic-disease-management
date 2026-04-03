package com.project.service.impl;

import com.project.dto.request.PrescriptionRequest;
import com.project.dto.response.PrescriptionResponse;
import com.project.dto.response.PrescriptionStatsResponse;
import com.project.entity.Patient;
import com.project.entity.Prescription;
import com.project.entity.PrescriptionItem;
import com.project.entity.PrescriptionStatus;
import com.project.exception.ResourceNotFoundException;
import com.project.mapper.PrescriptionMapper;
import com.project.repository.PatientRepository;
import com.project.repository.PrescriptionRepository;
import com.project.service.PrescriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@SuppressWarnings("null")
@Service
@RequiredArgsConstructor
public class PrescriptionServiceImpl implements PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final PatientRepository patientRepository;
    private final PrescriptionMapper prescriptionMapper;

    @Override
    @Transactional(readOnly = true)
    public Page<PrescriptionResponse> getDoctorPrescriptions(Long doctorId, String search, String status, Pageable pageable) {
        Page<Prescription> prescriptions;
        
        if (search != null && !search.isEmpty()) {
            prescriptions = prescriptionRepository.findByDoctorIdAndSearchTerm(doctorId, search, pageable);
        } else if (status != null && !status.isEmpty() && !status.equals("ALL")) {
            prescriptions = prescriptionRepository.findByDoctorIdAndStatus(doctorId, PrescriptionStatus.valueOf(status), pageable);
        } else {
            prescriptions = prescriptionRepository.findByDoctorId(doctorId, pageable);
        }
        
        return prescriptions.map(prescriptionMapper::toResponseDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public PrescriptionStatsResponse getPrescriptionStats(Long doctorId) {
        long total = prescriptionRepository.countByDoctorId(doctorId);
        long active = prescriptionRepository.countByDoctorIdAndStatus(doctorId, PrescriptionStatus.ACTIVE);
        long pending = prescriptionRepository.countByDoctorIdAndStatus(doctorId, PrescriptionStatus.PENDING_RENEWAL);
        long completed = prescriptionRepository.countByDoctorIdAndStatus(doctorId, PrescriptionStatus.COMPLETED);
        
        double recoveryRate = total > 0 ? ((double) completed / total) * 100 : 0.0;

        return PrescriptionStatsResponse.builder()
                .totalPrescriptions(total)
                .activePrescriptions(active)
                .pendingRenewals(pending)
                .completedPrescriptions(completed)
                .recoveryRate(Math.round(recoveryRate * 10.0) / 10.0)
                .build();
    }

    @Override
    @Transactional
    public PrescriptionResponse createPrescription(Long doctorId, PrescriptionRequest request) {
        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

        Prescription prescription = Prescription.builder()
                .doctorId(doctorId)
                .patient(patient)
                .diagnosis(request.getDiagnosis())
                .status(PrescriptionStatus.ACTIVE)
                .notes(request.getNotes())
                .prescriptionCode("#RX-" + (int)(Math.random() * 10000))
                .build();
                
        request.getItems().forEach(itemDto -> {
            prescription.addItem(PrescriptionItem.builder()
                    .medicationName(itemDto.getMedicationName())
                    .dosage(itemDto.getDosage())
                    .usageInstructions(itemDto.getUsageInstructions())
                    .build());
        });
        
        Prescription saved = prescriptionRepository.save(prescription);
        return prescriptionMapper.toResponseDTO(saved);
    }

    @Override
    @Transactional
    public void cancelPrescription(Long id, Long doctorId) {
        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription not found"));
        
        if (!prescription.getDoctorId().equals(doctorId)) {
             throw new RuntimeException("Unauthorized");
        }
        
        prescription.setStatus(PrescriptionStatus.CANCELLED);
        prescriptionRepository.save(prescription);
    }
}
