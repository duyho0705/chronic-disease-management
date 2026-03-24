package com.project.specification;

import com.project.entity.Patient;
import org.springframework.data.jpa.domain.Specification;

/**
 * Utility for building dynamic queries for Patients.
 * Useful for filtering by risk level, chronic disease type, age, etc.
 */
public class PatientSpecification {

    public static Specification<Patient> belongsToDoctor(Long doctorId) {
        return (root, query, criteriaBuilder) -> 
            criteriaBuilder.equal(root.get("doctorId"), doctorId);
    }

    public static Specification<Patient> hasNameLike(String name) {
        return (root, query, criteriaBuilder) -> {
            if (name == null || name.isEmpty()) return null;
            return criteriaBuilder.like(
                criteriaBuilder.lower(root.get("fullName")), 
                "%" + name.toLowerCase() + "%"
            );
        };
    }

    // Example: health risk filtering
    public static Specification<Patient> hasRiskLevel(String riskLevel) {
        return (root, query, criteriaBuilder) -> {
            if (riskLevel == null || riskLevel.isEmpty()) return null;
            // Assuming we will have a risk level column in the future
            return criteriaBuilder.equal(root.get("riskLevel"), riskLevel);
        };
    }

    private PatientSpecification() {}
}
