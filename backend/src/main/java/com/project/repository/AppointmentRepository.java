package com.project.repository;

import com.project.entity.Appointment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

        // === Doctor-side queries ===
        long countByDoctorIdAndStatusAndAppointmentTimeAfter(Long doctorId, String status, LocalDateTime time);
        long countByDoctorIdAndStatusInAndAppointmentTimeAfter(Long doctorId, List<String> statuses, LocalDateTime time);
        long countByDoctorIdAndStatus(Long doctorId, String status);

        List<Appointment> findByDoctorIdAndStatusInAndAppointmentTimeAfterOrderByAppointmentTimeAsc(
                        Long doctorId, List<String> statuses, LocalDateTime time);

        List<Appointment> findByDoctorIdOrderByAppointmentTimeDesc(Long doctorId);

        @Query("SELECT a FROM Appointment a JOIN FETCH a.patient WHERE a.doctorId = :doctorId " +
                        "AND a.status = 'SCHEDULED' AND a.appointmentTime >= :startOfDay " +
                        "ORDER BY a.appointmentTime ASC")
        List<Appointment> findUpcomingAppointments(Long doctorId, LocalDateTime startOfDay, Pageable pageable);

        // === Patient-side queries ===
        List<Appointment> findByPatientIdAndStatusInAndAppointmentTimeAfterOrderByAppointmentTimeAsc(
                        Long patientId, List<String> statuses, LocalDateTime after);

        List<Appointment> findByPatientIdAndStatusAndAppointmentTimeAfterOrderByAppointmentTimeAsc(
                        Long patientId, String status, LocalDateTime after);

        Page<Appointment> findByPatientIdAndStatusOrderByAppointmentTimeDesc(
                        Long patientId, String status, Pageable pageable);

        List<Appointment> findByPatientIdOrderByAppointmentTimeDesc(Long patientId);

        @Query(value = "SELECT u.clinic_id, COUNT(a.id) FROM appointments a " +
                       "JOIN users u ON a.doctor_id = u.id " +
                       "WHERE a.is_deleted = false GROUP BY u.clinic_id", nativeQuery = true)
        List<Object[]> countTotalAppointmentsByClinicNative();

        @Query(value = "SELECT u.clinic_id, COUNT(a.id) FROM appointments a " +
                       "JOIN users u ON a.doctor_id = u.id " +
                       "WHERE a.is_deleted = false AND a.created_at >= :since GROUP BY u.clinic_id", nativeQuery = true)
        List<Object[]> countNewBookingsByClinicNative(@org.springframework.data.repository.query.Param("since") LocalDateTime since);

        @Query(value = "SELECT u.clinic_id, " +
                       "CAST(SUM(CASE WHEN a.status = 'COMPLETED' THEN 1 ELSE 0 END) AS DOUBLE PRECISION) * 100.0 / NULLIF(COUNT(a.id), 0) " +
                       "FROM appointments a JOIN users u ON a.doctor_id = u.id " +
                       "WHERE a.is_deleted = false AND a.status != 'CANCELLED' GROUP BY u.clinic_id", nativeQuery = true)
        List<Object[]> calculateComplianceRateByClinicNative();

        long countByDoctorIdInAndCreatedAtBetweenAndIsDeletedFalse(List<Long> doctorIds, LocalDateTime start, LocalDateTime end);
}
