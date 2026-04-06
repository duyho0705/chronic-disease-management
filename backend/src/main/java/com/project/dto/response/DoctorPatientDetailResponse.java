package com.project.dto.response;

import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DoctorPatientDetailResponse {
    private PatientProfileResponse profile;
    private List<HealthMetricResponse> recentMetrics;
    private List<PatientPrescriptionResponse> prescriptionHistory;
    private List<DoctorAppointmentResponse> appointmentHistory;
    private double adherenceRate;
}
