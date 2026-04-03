package com.project.service.impl;

import com.project.dto.request.CreateAppointmentRequest;
import com.project.dto.response.PatientAppointmentResponse;
import com.project.entity.Appointment;
import com.project.entity.Patient;
import com.project.exception.ResourceNotFoundException;
import com.project.repository.AppointmentRepository;
import com.project.repository.PatientRepository;
import com.project.service.PatientAppointmentService;
import com.project.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@SuppressWarnings("null")
@Slf4j
@Service
@RequiredArgsConstructor
public class PatientAppointmentServiceImpl implements PatientAppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;

    @Override
    @Transactional
    public PatientAppointmentResponse create(CreateAppointmentRequest request) {
        Patient patient = getCurrentPatient();

        Appointment appointment = Appointment.builder()
                .patient(patient)
                .doctorId(request.getDoctorId())
                .appointmentTime(request.getAppointmentTime())
                .status("SCHEDULED")
                .type(request.getAppointmentType())
                .build();

        Appointment saved = appointmentRepository.save(appointment);
        log.info("Appointment created for patient: patientId={}, doctorId={}",
                patient.getId(), request.getDoctorId());
        return mapToResponse(saved);
    }

    @Override
    public List<PatientAppointmentResponse> getUpcoming() {
        Patient patient = getCurrentPatient();
        return appointmentRepository.findByPatientIdAndStatusAndAppointmentTimeAfterOrderByAppointmentTimeAsc(
                        patient.getId(), "SCHEDULED", LocalDateTime.now())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public Page<PatientAppointmentResponse> getHistory(Pageable pageable) {
        Patient patient = getCurrentPatient();
        return appointmentRepository.findByPatientIdAndStatusOrderByAppointmentTimeDesc(
                patient.getId(), "COMPLETED", pageable)
                .map(this::mapToResponse);
    }

    @Override
    @Transactional
    public void cancel(Long id) {
        Appointment appointment = appointmentRepository.findById(Objects.requireNonNull(id))
                .orElseThrow(() -> new ResourceNotFoundException("Lịch hẹn không tồn tại với ID: " + id));
        appointment.setStatus("CANCELLED");
        appointmentRepository.save(appointment);
        log.info("Appointment cancelled: id={}", id);
    }

    // === Private Helpers ===

    private Patient getCurrentPatient() {
        Long userId = SecurityUtils.getCurrentUserId()
                .orElseThrow(() -> new ResourceNotFoundException("User not authenticated"));
        return patientRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient profile not found"));
    }

    private PatientAppointmentResponse mapToResponse(Appointment a) {
        return PatientAppointmentResponse.builder()
                .id(a.getId())
                .doctorName(a.getDoctorName())
                .doctorSpecialty(a.getDoctorSpecialty())
                .doctorAvatarUrl(a.getDoctorAvatarUrl())
                .appointmentTime(a.getAppointmentTime())
                .endTime(a.getEndTime())
                .appointmentType(a.getType())
                .location(a.getLocation())
                .meetingLink(a.getMeetingLink())
                .status(a.getStatus())
                .diagnosisSummary(a.getDiagnosisSummary())
                .build();
    }
}
