package com.project.service.impl;

import com.project.dto.request.CreatePatientRequest;
import com.project.dto.request.CreateDoctorRequest;
import com.project.dto.response.ClinicDashboardResponse;
import com.project.dto.response.ClinicPatientResponse;
import com.project.dto.response.ClinicDoctorResponse;
import com.project.entity.Patient;
import com.project.entity.User;
import com.project.repository.PatientRepository;
import com.project.repository.UserRepository;
import com.project.service.ClinicDashboardService;
import com.project.mapper.PatientMapper;
import com.project.mapper.ClinicMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Random;
import java.util.stream.Collectors;

@SuppressWarnings("null")
@Slf4j
@Service
@RequiredArgsConstructor
public class ClinicDashboardServiceImpl implements ClinicDashboardService {

    private final PatientRepository patientRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final PatientMapper patientMapper;
    private final ClinicMapper clinicMapper;

    @Override
    @Transactional(readOnly = true)
    public ClinicDashboardResponse getDashboardData(Long clinicId) {
        long totalPatients = patientRepository.countByClinicIdAndIsDeletedFalse(clinicId);
        long highRiskCount = patientRepository.countByClinicIdAndRiskLevelAndIsDeletedFalse(clinicId, "Nguy cơ cao");
        long monitoringCount = patientRepository.countByClinicIdAndRiskLevelAndIsDeletedFalse(clinicId, "Đang theo dõi");

        // Disease Ratios from Database
        List<String> conditions = getChronicConditions();
        List<ClinicDashboardResponse.DiseaseRatioDto> diseaseRatios = conditions.stream().limit(3).map(c -> {
            long count = patientRepository.countByClinicIdAndChronicConditionAndIsDeletedFalse(clinicId, c);
            String percentage = totalPatients > 0 ? (count * 100 / totalPatients) + "%" : "0%";
            String color = c.contains("Tiểu đường") ? "bg-emerald-500" : c.contains("huyết áp") ? "bg-amber-400" : "bg-sky-400";
            return ClinicDashboardResponse.DiseaseRatioDto.builder()
                    .color(color).label(c).percentage(percentage).build();
        }).collect(Collectors.toList());

        // Patient Growth Chart (Last 6 months)
        List<ClinicDashboardResponse.PatientGrowthChartDto> patientGrowthChart = new java.util.ArrayList<>();
        LocalDate now = LocalDate.now();
        for (int i = 5; i >= 0; i--) {
            LocalDate monthDate = now.minusMonths(i);
            long count = patientRepository.countByClinicIdAndCreatedAtBetweenAndIsDeletedFalse(
                    clinicId, 
                    monthDate.withDayOfMonth(1).atStartOfDay(), 
                    monthDate.withDayOfMonth(monthDate.lengthOfMonth()).atTime(23, 59, 59)
            );
            String height = totalPatients > 0 ? Math.min(100, (count * 100 / (totalPatients / 2 + 1))) + "%" : "10%";
            patientGrowthChart.add(ClinicDashboardResponse.PatientGrowthChartDto.builder()
                    .month("T." + monthDate.getMonthValue())
                    .height(height)
                    .active(i == 0)
                    .build());
        }

        List<User> doctorUsers = userRepository.findByFilters("DOCTOR", "ACTIVE", clinicId, null, PageRequest.of(0, 50)).getContent();
        List<ClinicDashboardResponse.DoctorPerformanceDto> performances = doctorUsers.stream().limit(3).map(u -> {
            long pCount = patientRepository.countByDoctorIdAndIsDeletedFalse(u.getId());
            return ClinicDashboardResponse.DoctorPerformanceDto.builder()
                        .name("BS. " + u.getFullName())
                        .id("DR-" + (1000 + u.getId()))
                        .dept(u.getSpecialization() != null ? u.getSpecialization() : "Đa khoa")
                        .load((int)pCount)
                        .progress("w-" + Math.min(5, Math.max(1, (int)pCount / 10)) + "/5")
                        .color(pCount > 20 ? "amber" : "emerald")
                        .rating("4." + (7 + (u.getId().intValue() % 3)))
                        .reviews(10 + (u.getId().intValue() * 5))
                        .status("Đang trực")
                        .active(true)
                        .img(u.getAvatarUrl() != null ? u.getAvatarUrl() : "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=150&h=150")
                        .build();
        }).collect(Collectors.toList());

        return ClinicDashboardResponse.builder()
                .totalPatients((int)totalPatients)
                .highRiskAlerts((int)highRiskCount)
                .pendingFollowUps((int)monitoringCount)
                .patientGrowth(totalPatients > 5 ? "+5%" : "+0%")
                .highRiskGrowth(highRiskCount > 0 ? "+" + highRiskCount + " ca" : "+0 ca")
                .diseaseRatios(diseaseRatios)
                .patientGrowthChart(patientGrowthChart)
                .growthStats(clinicMapper.toGrowthStats())
                .doctorPerformances(performances)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ClinicPatientResponse> getPatientRecords(Long clinicId, String keyword, String condition, String riskLevel, String status, Pageable pageable) {
        Page<Patient> patientPage = patientRepository.findByClinicIdAndFilters(clinicId, keyword, condition, riskLevel, status, pageable);
        
        List<User> doctors = userRepository.findByFilters("DOCTOR", "ACTIVE", clinicId, null, PageRequest.of(0, 100)).getContent();
        Map<Long, String> doctorMap = doctors.stream()
                .collect(Collectors.toMap(User::getId, User::getFullName, (existing, replacement) -> existing));

        return patientPage.map(p -> patientMapper.toClinicPatientResponse(p, doctorMap));
    }

    @Override
    @Transactional
    public void createPatient(Long clinicId, CreatePatientRequest request) {
        String email = request.getPhone() + "@care.com"; 
        User user = User.builder()
                .email(email)
                .password(passwordEncoder.encode(request.getPassword()))
                .role("PATIENT")
                .fullName(request.getName())
                .phone(request.getPhone())
                .clinicId(clinicId)
                .status("ACTIVE")
                .build();
        user = Objects.requireNonNull(userRepository.save(user));

        Long drId = null;
        if (request.getAssignedDoctor() != null) {
            String drName = request.getAssignedDoctor().replace("BS. ", "");
            List<User> foundDrs = userRepository.findByFilters("DOCTOR", "ACTIVE", clinicId, drName, null).getContent();
            if (!foundDrs.isEmpty()) {
                drId = foundDrs.get(0).getId();
            }
        }

        int ageNum = 0;
        try { ageNum = Integer.parseInt(request.getAge()); } catch (Exception ignored) {}

        Patient patient = Patient.builder()
                .userId(user.getId())
                .clinicId(clinicId)
                .fullName(request.getName())
                .phone(request.getPhone())
                .gender(request.getGender())
                .address(request.getAddress())
                .dateOfBirth(LocalDate.now().minusYears(ageNum))
                .patientCode("BN-" + (1000 + new Random().nextInt(9000)))
                .doctorId(drId)
                .joinedDate(LocalDate.now())
                .chronicCondition(request.getCondition())
                .riskLevel(request.getRiskLevel())
                .treatmentStatus("Đang điều trị")
                .roomLocation("Ngoại trú")
                .clinicalNotes(request.getNotes())
                .build();
        patientRepository.save(patient);
    }

    @Override
    @Transactional
    public void updatePatient(Long clinicId, Long patientId, CreatePatientRequest request) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        
        if (!patient.getClinicId().equals(clinicId)) {
            throw new AccessDeniedException("Access denied to this patient record");
        }

        patient.setFullName(request.getName());
        patient.setPhone(request.getPhone());
        patient.setGender(request.getGender());
        patient.setAddress(request.getAddress());
        patient.setChronicCondition(request.getCondition());
        patient.setRiskLevel(request.getRiskLevel());
        patient.setClinicalNotes(request.getNotes());
        
        if (request.getAssignedDoctor() != null) {
            String drName = request.getAssignedDoctor().replace("BS. ", "");
            List<User> foundDrs = userRepository.findByFilters("DOCTOR", "ACTIVE", clinicId, drName, null).getContent();
            if (!foundDrs.isEmpty()) {
                patient.setDoctorId(foundDrs.get(0).getId());
            }
        }
        
        patientRepository.save(patient);
    }

    @Override
    @Transactional
    public void deletePatient(Long clinicId, Long patientId) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        
        if (!patient.getClinicId().equals(clinicId)) {
            throw new AccessDeniedException("Access denied");
        }

        patient.setDeleted(true);
        patientRepository.save(patient);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ClinicDoctorResponse> getDoctorRecords(Long clinicId, String keyword, Pageable pageable) {
        Page<User> doctors = userRepository.findByFilters("DOCTOR", "ACTIVE", clinicId, keyword, pageable);
        
        return doctors.map(u -> ClinicDoctorResponse.builder()
                .dbId(u.getId())
                .id("D-" + (1000 + u.getId()))
                .name(u.getFullName())
                .specialty(u.getSpecialization() != null ? u.getSpecialization() : "Đa khoa")
                .email(u.getEmail())
                .phone(u.getPhone())
                .load(new Random().nextInt(150)) // Mocked load
                .rating("4." + (7 + new Random().nextInt(3))) // Mocked rating 4.7-4.9
                .reviews(50 + new Random().nextInt(200)) // Mocked reviews
                .status("Đang hoạt động")
                .statusColor("primary")
                .img(u.getAvatarUrl() != null ? u.getAvatarUrl() : "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=150&h=150")
                .build());
    }

    @Override
    @Transactional
    public void createDoctor(Long clinicId, CreateDoctorRequest request) {
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword() != null ? request.getPassword() : "password"))
                .fullName(request.getName())
                .phone(request.getPhone())
                .role("DOCTOR")
                .clinicId(clinicId)
                .specialization(request.getSpecialty())
                .status("ACTIVE")
                .build();
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void updateDoctor(Long clinicId, Long doctorId, CreateDoctorRequest request) {
        User user = userRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        
        if (!user.getClinicId().equals(clinicId)) {
            throw new AccessDeniedException("Access denied");
        }

        user.setFullName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setSpecialization(request.getSpecialty());
        
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void deleteDoctor(Long clinicId, Long doctorId) {
        User user = userRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        
        if (!user.getClinicId().equals(clinicId)) {
            throw new AccessDeniedException("Access denied");
        }

        user.setDeleted(true);
        userRepository.save(user);
    }

    @Override
    @Transactional(readOnly = true)
    public List<String> getDoctorNames(Long clinicId) {
        List<User> doctors = userRepository.findByFilters("DOCTOR", "ACTIVE", clinicId, null, PageRequest.of(0, 100)).getContent();
        
        if (doctors.isEmpty()) {
            return java.util.Arrays.asList("BS. Lê Thị Mai", "BS. Nguyễn Văn Hùng", "BS. Trần Thanh Vân");
        }

        return doctors.stream()
                .map(u -> "BS. " + u.getFullName())
                .collect(Collectors.toList());
    }

    @Override
    public List<String> getChronicConditions() {
        return java.util.Arrays.asList(
            "Tiểu đường Type 1", 
            "Tiểu đường Type 2", 
            "Cao huyết áp", 
            "Bệnh tim mạch", 
            "Suy thận", 
            "Hen suyễn", 
            "Khác"
        );
    }
}
