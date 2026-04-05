package com.project.service.impl;

import com.project.dto.response.DoctorAppointmentResponse;
import com.project.entity.Appointment;
import com.project.entity.Patient;
import com.project.exception.ResourceNotFoundException;
import com.project.repository.AppointmentRepository;
import com.project.service.DoctorAppointmentService;
import com.project.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class DoctorAppointmentServiceImpl implements DoctorAppointmentService {

    private final AppointmentRepository appointmentRepository;

    @Override
    public List<DoctorAppointmentResponse> getUpcomingAppointments() {
        Long doctorId = SecurityUtils.getCurrentUserId().orElseThrow();
        // Since AppointmentRepository only has finds for patientId, we need to create one or use findAll
        // Actually, let's use findAll and filter since there might be no custom method for doctorId
        return appointmentRepository.findAll().stream()
                .filter(a -> a.getDoctorId().equals(doctorId))
                .filter(a -> "SCHEDULED".equals(a.getStatus()) || "PENDING".equals(a.getStatus()))
                .filter(a -> a.getAppointmentTime().isAfter(LocalDateTime.now().minusDays(1)))
                .sorted((a, b) -> a.getAppointmentTime().compareTo(b.getAppointmentTime()))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<DoctorAppointmentResponse> getAllAppointments() {
        Long doctorId = SecurityUtils.getCurrentUserId().orElseThrow();
        return appointmentRepository.findAll().stream()
                .filter(a -> a.getDoctorId().equals(doctorId))
                .sorted((a, b) -> a.getAppointmentTime().compareTo(b.getAppointmentTime()))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public DoctorAppointmentResponse updateStatus(Long appointmentId, String status) {
        Long doctorId = SecurityUtils.getCurrentUserId().orElseThrow();
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Lịch hẹn không tồn tại!"));

        if (!appointment.getDoctorId().equals(doctorId)) {
            throw new RuntimeException("Unauthorized to modify this appointment");
        }

        appointment.setStatus(status);
        Appointment saved = appointmentRepository.save(appointment);
        return mapToResponse(saved);
    }

    private DoctorAppointmentResponse mapToResponse(Appointment a) {
        Patient p = a.getPatient();
        return DoctorAppointmentResponse.builder()
                .id(a.getId())
                .patientId(p.getId())
                .patientName(p.getFullName())
                .patientAvatarUrl(p.getAvatarUrl())
                .appointmentTime(a.getAppointmentTime())
                .endTime(a.getEndTime())
                .appointmentType(a.getType())
                .status(a.getStatus())
                .location(a.getLocation())
                .meetingLink(a.getMeetingLink())
                .reason(a.getReason())
                .build();
    }
}
