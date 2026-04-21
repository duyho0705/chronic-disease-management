package com.project.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.math.BigDecimal;

@Entity
@Table(name = "patients", indexes = {
    @Index(name = "idx_patient_clinic_id", columnList = "clinic_id"),
    @Index(name = "idx_patient_doctor_id", columnList = "doctor_id"),
    @Index(name = "idx_patient_risk_level", columnList = "risk_level"),
    @Index(name = "idx_patient_created_at", columnList = "created_at"),
    @Index(name = "idx_patient_is_deleted", columnList = "is_deleted"),
    @Index(name = "idx_patient_chronic_condition", columnList = "chronic_condition"),
    @Index(name = "idx_patient_clinic_created_deleted", columnList = "clinic_id, created_at, is_deleted")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Patient extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "clinic_id")
    private Long clinicId;

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(nullable = false, length = 20)
    private String phone;

    @Column(length = 100)
    private String email;

    @Column(nullable = false, length = 10)
    private String gender;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(name = "avatar_url", columnDefinition = "TEXT")
    private String avatarUrl;

    @Column(name = "patient_code", unique = true, length = 50)
    private String patientCode;

    @Column(name = "doctor_id")
    private Long doctorId;

    @Column(name = "joined_date")
    private LocalDate joinedDate;

    @Column(name = "identity_card", length = 20)
    private String identityCard;

    @Column(length = 100)
    private String occupation;

    @Column(length = 50)
    private String ethnicity;

    @Column(name = "health_insurance_number", length = 50)
    private String healthInsuranceNumber;

    // === Clinical Tracking Fields ===
    @Column(name = "chronic_condition", length = 100)
    private String chronicCondition;

    @Column(name = "medical_history", columnDefinition = "TEXT")
    private String medicalHistory;

    @Column(columnDefinition = "TEXT")
    private String allergies;

    @Column(name = "risk_level", length = 50)
    private String riskLevel;

    @Column(name = "treatment_status", length = 50)
    private String treatmentStatus;

    @Column(name = "profile_status", length = 50)
    private String profileStatus;

    @Column(name = "room_location", length = 100)
    private String roomLocation;

    @Column(columnDefinition = "TEXT")
    private String clinicalNotes;

    // === Bio Metrics ===
    @Column(name = "blood_type", length = 10)
    private String bloodType;

    @Column(name = "height_cm", precision = 5, scale = 2)
    private BigDecimal heightCm;

    @Column(name = "weight_kg", precision = 5, scale = 2)
    private BigDecimal weightKg;

    // === Relationships ===
    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL)
    @Builder.Default
    private List<EmergencyContact> emergencyContacts = new ArrayList<>();

    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL)
    @Builder.Default
    private List<HealthMetric> healthMetrics = new ArrayList<>();

    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL)
    @Builder.Default
    private List<MedicationSchedule> medicationSchedules = new ArrayList<>();
}
