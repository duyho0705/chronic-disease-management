package com.project.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.math.BigDecimal;

@Entity
@Table(name = "patients")
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
