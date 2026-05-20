package com.project.service.impl;

import com.project.entity.*;
import com.project.repository.*;
import com.project.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@SuppressWarnings("null")
@Slf4j
@Service
@RequiredArgsConstructor
public class ScheduledTaskService {

    private final AppointmentRepository appointmentRepository;
    private final MedicationScheduleRepository medicationScheduleRepository;
    private final MedicationLogRepository medicationLogRepository;
    private final NotificationService notificationService;
    private final PatientAlertRepository patientAlertRepository;

    @Scheduled(cron = "0 0 7 * * *") // 7 AM every day
    @Transactional
    public void dailyMorningReminders() {
        log.info("Running daily morning reminders...");
        LocalDateTime startOfDay = LocalDateTime.now().with(LocalTime.MIN);
        LocalDateTime endOfDay = LocalDateTime.now().with(LocalTime.MAX);

        // 1. Remind appointments today
        List<Appointment> todayAppointments = appointmentRepository.findByStatusAndAppointmentTimeBetween(
                AppointmentStatus.SCHEDULED, startOfDay, endOfDay);
        
        for (Appointment appt : todayAppointments) {
            if (appt.isReminderEnabled()) {
                String timeStr = appt.getAppointmentTime().toLocalTime().toString();
                String msg = String.format("Bạn có lịch khám hôm nay vào lúc %s. Vui lòng đến đúng giờ.", timeStr);
                
                notificationService.sendNotification(
                        appt.getPatient().getUserId(),
                        "Nhắc lịch khám hôm nay",
                        msg,
                        "info",
                        "/patient/appointments"
                );
            }
        }

        // 2. Remind active medication schedules
        List<MedicationSchedule> activeSchedules = medicationScheduleRepository.findByIsActiveTrue();
        // Group by patient to send one notification per patient
        Map<Patient, List<MedicationSchedule>> patientSchedules = activeSchedules.stream()
                .collect(Collectors.groupingBy(MedicationSchedule::getPatient));

        for (Map.Entry<Patient, List<MedicationSchedule>> entry : patientSchedules.entrySet()) {
            Patient patient = entry.getKey();
            int count = entry.getValue().size();
            
            notificationService.sendNotification(
                    patient.getUserId(),
                    "Nhắc nhở uống thuốc",
                    String.format("Hôm nay bạn có %d đơn thuốc cần uống. Đừng quên ghi nhận sau khi uống nhé!", count),
                    "info",
                    "/patient/prescriptions"
            );
        }
        
        log.info("Finished daily morning reminders.");
    }

    @Scheduled(cron = "0 0 20 * * *") // 8 PM every day
    @Transactional
    public void dailyEveningCheck() {
        log.info("Running daily evening medication check...");
        LocalDateTime startOfDay = LocalDateTime.now().with(LocalTime.MIN);
        LocalDateTime endOfDay = LocalDateTime.now().with(LocalTime.MAX);

        List<MedicationSchedule> activeSchedules = medicationScheduleRepository.findByIsActiveTrue();
        
        for (MedicationSchedule schedule : activeSchedules) {
            // Check if there's any log for this schedule today
            List<MedicationLog> logsToday = medicationLogRepository.findByScheduleIdAndCreatedAtBetween(
                    schedule.getId(), startOfDay, endOfDay);
            
            if (logsToday.isEmpty()) {
                // No log today, send warning
                Patient patient = schedule.getPatient();
                String msg = String.format("Hệ thống ghi nhận bạn chưa uống thuốc '%s' hôm nay. Vui lòng uống thuốc và ghi nhận lại trên hệ thống.", 
                        schedule.getMedicationName());
                
                notificationService.sendNotification(
                        patient.getUserId(),
                        "Quên uống thuốc",
                        msg,
                        "warning",
                        "/patient/prescriptions"
                );
                
                // Also create an alert for the patient dashboard
                PatientAlert alert = PatientAlert.builder()
                        .patient(patient)
                        .alertType("MEDICATION_MISSED")
                        .severity("WARNING")
                        .title("Cảnh báo quên uống thuốc")
                        .message(msg)
                        .isRead(false)
                        .isDismissed(false)
                        .build();
                patientAlertRepository.save(alert);
            }
        }
        
        log.info("Finished daily evening medication check.");
    }
}
