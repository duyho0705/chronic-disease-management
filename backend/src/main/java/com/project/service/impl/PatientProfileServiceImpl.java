package com.project.service.impl;

import com.project.dto.request.EmergencyContactRequest;
import com.project.dto.request.UpdatePatientProfileRequest;
import com.project.dto.response.EmergencyContactResponse;
import com.project.dto.response.PatientProfileResponse;
import com.project.entity.EmergencyContact;
import com.project.entity.Patient;
import com.project.exception.ResourceNotFoundException;
import com.project.repository.EmergencyContactRepository;
import com.project.repository.PatientRepository;
import com.project.service.PatientProfileService;
import com.project.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PatientProfileServiceImpl implements PatientProfileService {

    private final PatientRepository patientRepository;
    private final EmergencyContactRepository emergencyContactRepository;

    @Override
    public PatientProfileResponse getCurrentPatientProfile() {
        Patient patient = getCurrentPatient();
        return mapToProfileResponse(patient);
    }

    @Override
    @Transactional
    public PatientProfileResponse updateProfile(UpdatePatientProfileRequest request) {
        Patient patient = getCurrentPatient();

        patient.setFullName(request.getFullName());
        patient.setGender(request.getGender());
        patient.setPhone(request.getPhone());
        patient.setEmail(request.getEmail());
        patient.setAddress(request.getAddress());
        patient.setBloodType(request.getBloodType());
        patient.setHeightCm(request.getHeightCm());
        patient.setWeightKg(request.getWeightKg());

        Patient saved = patientRepository.save(patient);
        log.info("Patient profile updated: id={}", saved.getId());
        return mapToProfileResponse(saved);
    }

    @Override
    public List<EmergencyContactResponse> getEmergencyContacts() {
        Patient patient = getCurrentPatient();
        return emergencyContactRepository.findByPatientId(patient.getId())
                .stream()
                .map(this::mapToEmergencyContactResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public EmergencyContactResponse addEmergencyContact(EmergencyContactRequest request) {
        Patient patient = getCurrentPatient();

        EmergencyContact contact = EmergencyContact.builder()
                .patient(patient)
                .contactName(request.getContactName())
                .relationship(request.getRelationship())
                .phone(request.getPhone())
                .isPrimary(request.isPrimary())
                .build();

        EmergencyContact saved = emergencyContactRepository.save(contact);
        log.info("Emergency contact added for patient: id={}", patient.getId());
        return mapToEmergencyContactResponse(saved);
    }

    @Override
    @Transactional
    public EmergencyContactResponse updateEmergencyContact(Long id, EmergencyContactRequest request) {
        EmergencyContact contact = emergencyContactRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Emergency contact not found: " + id));

        contact.setContactName(request.getContactName());
        contact.setRelationship(request.getRelationship());
        contact.setPhone(request.getPhone());
        contact.setPrimary(request.isPrimary());

        EmergencyContact saved = emergencyContactRepository.save(contact);
        log.info("Emergency contact updated: id={}", id);
        return mapToEmergencyContactResponse(saved);
    }

    // === Private Helpers ===

    private Patient getCurrentPatient() {
        Long userId = SecurityUtils.getCurrentUserId()
                .orElseThrow(() -> new ResourceNotFoundException("User not authenticated"));
        return patientRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient profile not found"));
    }

    private PatientProfileResponse mapToProfileResponse(Patient p) {
        int age = 0;
        if (p.getDateOfBirth() != null) {
            age = Period.between(p.getDateOfBirth(), LocalDate.now()).getYears();
        }

        // Get primary emergency contact
        EmergencyContactResponse emergencyContact = emergencyContactRepository
                .findByPatientId(p.getId())
                .stream()
                .filter(EmergencyContact::isPrimary)
                .findFirst()
                .map(this::mapToEmergencyContactResponse)
                .orElse(null);

        return PatientProfileResponse.builder()
                .id(p.getId())
                .patientCode(p.getPatientCode())
                .fullName(p.getFullName())
                .dateOfBirth(p.getDateOfBirth())
                .age(age)
                .gender(p.getGender())
                .phone(p.getPhone())
                .email(p.getEmail())
                .address(p.getAddress())
                .bloodType(p.getBloodType())
                .heightCm(p.getHeightCm())
                .weightKg(p.getWeightKg())
                .avatarUrl(p.getAvatarUrl())
                .joinedDate(p.getJoinedDate())
                .emergencyContact(emergencyContact)
                .build();
    }

    private EmergencyContactResponse mapToEmergencyContactResponse(EmergencyContact c) {
        return EmergencyContactResponse.builder()
                .id(c.getId())
                .contactName(c.getContactName())
                .relationship(c.getRelationship())
                .phone(c.getPhone())
                .isPrimary(c.isPrimary())
                .build();
    }
}
