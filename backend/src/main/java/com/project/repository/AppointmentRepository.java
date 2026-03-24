package com.project.repository;

import com.project.entity.Appointment;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    
    long countByDoctorIdAndStatusAndAppointmentTimeAfter(Long doctorId, String status, LocalDateTime time);

    @Query("SELECT a FROM Appointment a JOIN FETCH a.patient WHERE a.doctorId = :doctorId " +
           "AND a.status = 'SCHEDULED' AND a.appointmentTime >= :startOfDay " +
           "ORDER BY a.appointmentTime ASC")
    List<Appointment> findUpcomingAppointments(Long doctorId, LocalDateTime startOfDay, Pageable pageable);
}
