package com.project.service.impl;

import com.project.dto.request.CreatePatientRequest;
import com.project.dto.request.CreateDoctorRequest;
import com.project.dto.response.ClinicDashboardResponse;
import com.project.dto.response.ClinicPatientResponse;
import com.project.dto.response.ClinicDoctorResponse;
import com.project.dto.response.DoctorSnippetDto;
import com.project.entity.Patient;
import com.project.entity.User;
import com.project.repository.AppointmentRepository;
import com.project.repository.PrescriptionRepository;
import com.project.repository.PatientRepository;
import com.project.repository.UserRepository;
import com.project.service.ClinicDashboardService;
import com.project.service.ClinicalAnalyticsService;
import com.project.mapper.PatientMapper;
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
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.Random;

@SuppressWarnings("null")
@Slf4j
@Service
@RequiredArgsConstructor
public class ClinicDashboardServiceImpl implements ClinicDashboardService {

    private final PatientRepository patientRepository;
    private final UserRepository userRepository;
    private final AppointmentRepository appointmentRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final PasswordEncoder passwordEncoder;
    private final PatientMapper patientMapper;
    private final ClinicalAnalyticsService clinicalAnalyticsService;

    @Override
    @Transactional(readOnly = true)
    public ClinicDashboardResponse getDashboardData(Long clinicId, String period) {
        long totalPatients = patientRepository.countByClinicIdAndIsDeletedFalse(clinicId);
        long highRiskCount = patientRepository.countByClinicIdAndRiskLevelAndIsDeletedFalse(clinicId, "Nguy cơ cao");
        long monitoringCount = patientRepository.countByClinicIdAndRiskLevelAndIsDeletedFalse(clinicId,
                "Đang theo dõi");

        // Disease Ratios from Database
        List<String> conditions = getChronicConditions();
        List<ClinicDashboardResponse.DiseaseRatioDto> diseaseRatios = conditions.stream().limit(3).map(c -> {
            long count = patientRepository.countByClinicIdAndChronicConditionAndIsDeletedFalse(clinicId, c);
            String percentage = totalPatients > 0 ? (count * 100 / totalPatients) + "%" : "0%";
            String color = c.equals("Tiểu đường Type 1") ? "bg-emerald-500"
                    : c.contains("Tiểu đường Type 2") ? "bg-blue-500"
                    : c.contains("huyết áp") ? "bg-amber-400" : "bg-indigo-400";
            return ClinicDashboardResponse.DiseaseRatioDto.builder()
                    .color(color).label(c).percentage(percentage).build();
        }).collect(Collectors.toList());

        // Dynamic Chart Data based on Period
        List<ClinicDashboardResponse.PatientGrowthChartDto> patientGrowthChart = new ArrayList<>();
        List<ClinicDashboardResponse.PatientGrowthChartDto> riskIndexChart = new ArrayList<>();
        List<ClinicDashboardResponse.PatientGrowthChartDto> doctorLoadChart = new ArrayList<>();

        List<User> doctorUsers = userRepository.findByFilters("DOCTOR", "ACTIVE", clinicId, null, PageRequest.of(0, 100))
                .getContent();
        List<Long> doctorIds = doctorUsers.stream().map(User::getId).collect(Collectors.toList());

        LocalDateTime now = LocalDateTime.now();
        int iterations = 6;
        String timeUnit = "MONTH";

        if ("7d".equals(period)) {
            iterations = 7;
            timeUnit = "DAY";
        } else if ("30d".equals(period)) {
            iterations = 30;
            timeUnit = "DAY";
        } else if ("1y".equals(period)) {
            iterations = 12;
            timeUnit = "MONTH";
        }

        for (int i = iterations - 1; i >= 0; i--) {
            LocalDateTime start, end;
            String label;

            if ("DAY".equals(timeUnit)) {
                LocalDateTime day = now.minusDays(i);
                start = day.withHour(0).withMinute(0).withSecond(0);
                end = day.withHour(23).withMinute(59).withSecond(59);
                label = (i == 0) ? "Hôm nay" : day.getDayOfMonth() + "/" + day.getMonthValue();
            } else {
                LocalDateTime monthDate = now.minusMonths(i);
                start = monthDate.withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
                end = monthDate.withDayOfMonth(monthDate.toLocalDate().lengthOfMonth()).withHour(23).withMinute(59).withSecond(59);
                label = "Tháng " + monthDate.getMonthValue();
            }

            long pCount = patientRepository.countByClinicIdAndCreatedAtBetweenAndIsDeletedFalse(clinicId, start, end);
            patientGrowthChart.add(ClinicDashboardResponse.PatientGrowthChartDto.builder()
                    .month(label).value((int) pCount).active(i == 0).build());

            long rCount = patientRepository.countByClinicIdAndRiskLevelAndCreatedAtBetweenAndIsDeletedFalse(clinicId, "Nguy cơ cao", start, end);
            riskIndexChart.add(ClinicDashboardResponse.PatientGrowthChartDto.builder()
                    .month(label).value((int) rCount).active(i == 0).build());

            long aCount = doctorIds.isEmpty() ? 0 : appointmentRepository.countByDoctorIdInAndCreatedAtBetweenAndIsDeletedFalse(doctorIds, start, end);
            int avgAppt = doctorIds.isEmpty() ? 0 : (int) (aCount / Math.max(1, doctorIds.size()));
            doctorLoadChart.add(ClinicDashboardResponse.PatientGrowthChartDto.builder()
                    .month(label).value(avgAppt).active(i == 0).build());
        }

        List<ClinicDashboardResponse.DoctorPerformanceDto> performances = doctorUsers.stream().limit(5).map(u -> {
            long apptCount = appointmentRepository.countByDoctorIdAndStatus(u.getId(), "COMPLETED");
            long prescCount = prescriptionRepository.countByDoctorId(u.getId());
            int totalLoad = (int) (apptCount + prescCount);

            String fullName = u.getFullName() != null ? u.getFullName() : "Bác sĩ";
            fullName = fullName.replaceAll("(?i)(BS\\.|Bác sĩ|Thạc sĩ|Tiến sĩ|TS\\.|ThS\\.)", "").trim();

            return ClinicDashboardResponse.DoctorPerformanceDto.builder()
                    .name(fullName)
                    .id("DR-" + (1000 + u.getId()))
                    .dept(u.getSpecialization() != null ? u.getSpecialization() : "Đa khoa")
                    .load(totalLoad)
                    .progress("w-" + Math.min(5, Math.max(1, totalLoad / 5)) + "/5")
                    .color(totalLoad > 50 ? "amber" : "emerald")
                    .rating("4." + (7 + (u.getId().intValue() % 3)))
                    .reviews((int) (10 + (u.getId().intValue() * 5)))
                    .status("Đang hoạt động")
                    .active(true)
                    .img(u.getAvatarUrl() != null ? u.getAvatarUrl()
                            : "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=150&h=150")
                    .build();
        }).collect(Collectors.toList());

        // Calculate actual growth stats using patient counts
        long totalForAverage = 0;
        int peakValue = 0;
        String peakMonthLabel = "--";
        for (ClinicDashboardResponse.PatientGrowthChartDto d : patientGrowthChart) {
            totalForAverage += d.getValue();
            if (d.getValue() > peakValue) {
                peakValue = d.getValue();
                peakMonthLabel = d.getMonth();
            }
        }
        int avg = (int) (totalForAverage / Math.max(1, patientGrowthChart.size()));

        // Calculate real growth trends
        LocalDateTime lastMonthStart = now.minusMonths(1).withDayOfMonth(1).atStartOfDay();
        LocalDateTime lastMonthEnd = lastMonthStart.plusMonths(1).minusSeconds(1);
        long currentMonthPatients = patientGrowthChart.get(patientGrowthChart.size() - 1).getValue();
        long lastMonthPatients = patientRepository.countByClinicIdAndCreatedAtBetweenAndIsDeletedFalse(clinicId, lastMonthStart, lastMonthEnd);
        
        long growthPct = lastMonthPatients > 0 ? ((currentMonthPatients - lastMonthPatients) * 100 / lastMonthPatients) : 0;
        String growthSign = growthPct >= 0 ? "+" : "";
        String growthString = growthSign + growthPct + "%";

        return ClinicDashboardResponse.builder()
                .totalPatients(totalPatients)
                .highRiskAlerts(highRiskCount)
                .pendingFollowUps(monitoringCount)
                .patientGrowth(growthString)
                .highRiskGrowth(highRiskCount > 0 ? "+" + highRiskCount + " ca" : "+0 ca")
                .diseaseRatios(diseaseRatios)
                .patientGrowthChart(patientGrowthChart)
                .riskIndexChart(riskIndexChart)
                .doctorLoadChart(doctorLoadChart)
                .growthStats(ClinicDashboardResponse.GrowthStatsDto.builder()
                        .growth(growthString)
                        .average(avg + " ca/tháng")
                        .peakMonth(peakMonthLabel + " (" + peakValue + ")")
                        .build())
                .doctorPerformances(performances)
                .insights(clinicalAnalyticsService.getClinicInsights(clinicId))
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ClinicPatientResponse> getPatientRecords(Long clinicId, String keyword, String condition,
            String riskLevel, String status, Pageable pageable) {
        Page<Patient> patientPage = patientRepository.findByClinicIdAndFilters(clinicId, keyword, condition, riskLevel,
                status, pageable);

        List<User> doctors = userRepository.findByFilters("DOCTOR", "ACTIVE", clinicId, null, PageRequest.of(0, 100))
                .getContent();
        Map<Long, String> doctorMap = doctors.stream()
                .collect(Collectors.toMap(User::getId, User::getFullName, (existing, replacement) -> existing));

        return patientPage.map(p -> patientMapper.toClinicPatientResponse(p, doctorMap));
    }

    @Override
    @Transactional
    public void createPatient(Long clinicId, CreatePatientRequest request) {
        String email = request.getEmail();

        // If no email provided, use phone-based auto-gen
        if (email == null || email.isBlank()) {
            email = request.getPhone() + "@care.com";
        }
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email này đã được sử dụng. Vui lòng sử dụng email khác!");
        }

        User user = User.builder()
                .email(email)
                .password(passwordEncoder.encode(request.getPassword() != null ? request.getPassword() : "password"))
                .role("PATIENT")
                .fullName(request.getName())
                .phone(request.getPhone())
                .clinicId(clinicId)
                .status("ACTIVE")
                .build();
        user = Objects.requireNonNull(userRepository.save(user));

        Long drId = null;
        if (request.getAssignedDoctor() != null && !request.getAssignedDoctor().isEmpty()) {
            String drStr = request.getAssignedDoctor();
            try {
                // Try to parse as Long ID first
                drId = Long.parseLong(drStr);
            } catch (NumberFormatException e) {
                // Not an ID, try searching by name
                String drName = drStr.replaceAll("^(BS\\.|Bác sĩ\\s*)", "").trim();
                List<User> foundDrs = userRepository
                        .findByFilters("DOCTOR", "ACTIVE", clinicId, drName, PageRequest.of(0, 1)).getContent();
                if (!foundDrs.isEmpty()) {
                    drId = foundDrs.get(0).getId();
                }
            }
        }

        int ageNum = 0;
        try {
            ageNum = Integer.parseInt(request.getAge());
        } catch (Exception ignored) {
        }

        Patient patient = Patient.builder()
                .userId(user.getId())
                .clinicId(clinicId)
                .fullName(request.getName())
                .phone(request.getPhone())
                .email(email)
                .gender(request.getGender())
                .address(request.getAddress())
                .dateOfBirth(request.getDateOfBirth() != null ? request.getDateOfBirth()
                        : LocalDate.now().minusYears(ageNum))
                .patientCode("BN-" + (1000 + new Random().nextInt(9000)))
                .doctorId(drId)
                .joinedDate(LocalDate.now())
                .chronicCondition(request.getCondition())
                .riskLevel(request.getRiskLevel())
                .treatmentStatus("Đang điều trị")
                .roomLocation("Ngoại trú")
                .clinicalNotes(request.getNotes())
                .identityCard(request.getIdentityCard())
                .occupation(request.getOccupation())
                .ethnicity(request.getEthnicity())
                .healthInsuranceNumber(request.getHealthInsuranceNumber())
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
        patient.setIdentityCard(request.getIdentityCard());
        patient.setOccupation(request.getOccupation());
        patient.setEthnicity(request.getEthnicity());
        patient.setHealthInsuranceNumber(request.getHealthInsuranceNumber());
        if (request.getDateOfBirth() != null) {
            patient.setDateOfBirth(request.getDateOfBirth());
        }

        // Update user email
        User user = userRepository.findById(patient.getUserId())
                .orElse(null);
        if (user != null && request.getEmail() != null && !request.getEmail().isBlank()) {
            user.setEmail(request.getEmail());
            userRepository.save(user);
            patient.setEmail(request.getEmail());
        }

        if (request.getAssignedDoctor() != null && !request.getAssignedDoctor().isEmpty()) {
            String drStr = request.getAssignedDoctor();
            try {
                patient.setDoctorId(Long.parseLong(drStr));
            } catch (NumberFormatException e) {
                String drName = drStr.replaceAll("^(BS\\.|Bác sĩ\\s*)", "").trim();
                List<User> foundDrs = userRepository
                        .findByFilters("DOCTOR", "ACTIVE", clinicId, drName, PageRequest.of(0, 1)).getContent();
                if (!foundDrs.isEmpty()) {
                    patient.setDoctorId(foundDrs.get(0).getId());
                }
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
                .img(u.getAvatarUrl() != null ? u.getAvatarUrl()
                        : "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=150&h=150")
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
        List<User> doctors = userRepository.findByFilters("DOCTOR", "ACTIVE", clinicId, null, PageRequest.of(0, 100))
                .getContent();

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
                "Khác");
    }
    @Override
    public List<DoctorSnippetDto> getAvailableDoctors(Long clinicId) {
        List<User> doctors = userRepository.findByFilters("DOCTOR", "ACTIVE", clinicId, null, PageRequest.of(0, 500))
                .getContent();
        return doctors.stream().map(d -> DoctorSnippetDto.builder()
                .id(d.getId())
                .name(d.getFullName())
                .specialty(d.getSpecialization())
                .avatarUrl(d.getAvatarUrl())
                .build()).collect(Collectors.toList());
    }
}
