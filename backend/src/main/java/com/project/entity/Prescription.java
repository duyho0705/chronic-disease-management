package com.project.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "prescriptions", indexes = {
    @Index(name = "idx_prescription_doctor_id", columnList = "doctor_id"),
    @Index(name = "idx_prescription_patient_id", columnList = "patient_id"),
    @Index(name = "idx_prescription_created_at", columnList = "created_at"),
    @Index(name = "idx_prescription_is_deleted", columnList = "is_deleted"),
    @Index(name = "idx_prescription_doctor_created_deleted", columnList = "doctor_id, created_at, is_deleted")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SQLDelete(sql = "UPDATE prescriptions SET is_deleted = true WHERE id=?")
@SQLRestriction("is_deleted = false")
public class Prescription extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "prescription_code", nullable = false, unique = true, length = 20)
    private String prescriptionCode;

    @Column(name = "doctor_id", nullable = false)
    private Long doctorId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @Column(nullable = false, length = 255)
    private String diagnosis;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private PrescriptionStatus status;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @OneToMany(mappedBy = "prescription", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<PrescriptionItem> items = new ArrayList<>();

    // Helper method to add items
    public void addItem(PrescriptionItem item) {
        if (items == null) {
            items = new ArrayList<>();
        }
        items.add(item);
        item.setPrescription(this);
    }
}
