package com.project.mapper;

import com.project.dto.response.ClinicPatientResponse;
import com.project.entity.Patient;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.Period;
import java.util.Map;

@Component
public class PatientMapper {

    public ClinicPatientResponse toClinicPatientResponse(Patient p, Map<Long, String> doctorMap) {
        int age = p.getDateOfBirth() != null ? Period.between(p.getDateOfBirth(), LocalDate.now()).getYears() : 0;
        return ClinicPatientResponse.builder()
                .dbId(p.getId())
                .id(p.getPatientCode())
                .name(p.getFullName())
                .age(age)
                .phone(p.getPhone())
                .email(p.getEmail())
                .condition(p.getChronicCondition() != null ? p.getChronicCondition() : "N/A")
                .riskLevel(p.getRiskLevel() != null ? p.getRiskLevel() : "Bình thường")
                .doctor(p.getDoctorId() != null ? doctorMap.getOrDefault(p.getDoctorId(), "Chưa phân công") : "Chưa phân công")
                .location(p.getRoomLocation() != null ? p.getRoomLocation() : "Ngoại trú")
                .status(p.getTreatmentStatus() != null ? p.getTreatmentStatus() : "Đang theo dõi")
                .img(p.getAvatarUrl() != null ? p.getAvatarUrl() : "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=150&h=150")
                .build();
    }
}
