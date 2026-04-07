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
import com.project.repository.NotificationRepository;
import com.project.service.ClinicDashboardService;
import com.project.service.ClinicalAnalyticsService;
import com.project.mapper.PatientMapper;
import com.project.util.AppConstants;
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
import java.util.HashMap;
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
    private final NotificationRepository notificationRepository;

    @Override
    @Transactional(readOnly = true)
    public ClinicDashboardResponse getDashboardData(Long clinicId, String period) {
        long totalPatients = patientRepository.countByClinicIdAndIsDeletedFalse(clinicId);
        long highRiskCount = patientRepository.countByClinicIdAndRiskLevelAndIsDeletedFalse(clinicId, AppConstants.RISK_HIGH);
        long monitoringCount = patientRepository.countByClinicIdAndRiskLevelAndIsDeletedFalse(clinicId, AppConstants.RISK_MONITORING);

        // Optimized pathology composition using GROUP BY
        List<Object[]> pathologyResults = patientRepository.countPatientsByChronicCondition(clinicId);
        Map<String, Long> conditionCounts = new HashMap<>();
        for (Object[] result : pathologyResults) {
            String condition = (String) result[0];
            Long count = (Long) result[1];
            if (condition != null) {
                conditionCounts.put(condition, count);
            }
        }

        // Sort by patient count descending
        List<Map.Entry<String, Long>> sortedConditions = conditionCounts.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .collect(Collectors.toList());

        List<ClinicDashboardResponse.DiseaseRatioDto> diseaseRatios = new ArrayList<>();
        long topConditionsSum = 0;
        int displayLimit = 3;

        // Colors for top conditions
        String[] colors = {"bg-emerald-500", "bg-sky-400", "bg-amber-400", "bg-rose-400"};

        for (int i = 0; i < Math.min(displayLimit, sortedConditions.size()); i++) {
            Map.Entry<String, Long> entry = sortedConditions.get(i);
            long count = entry.getValue();
            topConditionsSum += count;
            
            String percentage = totalPatients > 0 ? (count * 100 / totalPatients) + "%" : "0%";
            
            diseaseRatios.add(ClinicDashboardResponse.DiseaseRatioDto.builder()
                    .label(entry.getKey())
                    .percentage(percentage)
                    .color(colors[i % colors.length])
                    .build());
        }

        // Group remaining patients into "Khác" (Others)
        long othersCount = totalPatients - topConditionsSum;
        if (othersCount > 0) {
            String othersPct = totalPatients > 0 ? (othersCount * 100 / totalPatients) + "%" : "0%";
            diseaseRatios.add(ClinicDashboardResponse.DiseaseRatioDto.builder()
                    .label("Khác")
                    .percentage(othersPct)
                    .color("bg-slate-400")
                    .build());
        }

        // Fallback for empty state
        if (diseaseRatios.isEmpty() && totalPatients > 0) {
             diseaseRatios.add(ClinicDashboardResponse.DiseaseRatioDto.builder()
                    .label("Chưa phân loại")
                    .percentage("100%")
                    .color("bg-slate-400")
                    .build());
        }

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

            // Search for HIGH RISK patients using a more flexible match
            long rCount = patientRepository.countByClinicIdAndRiskLevelAndCreatedAtBetweenAndIsDeletedFalse(clinicId, "Nguy cơ cao (HIGH RISK)", start, end);
            if (rCount == 0) {
                rCount = patientRepository.countByClinicIdAndRiskLevelAndCreatedAtBetweenAndIsDeletedFalse(clinicId, "Nguy cơ cao", start, end);
            }
            riskIndexChart.add(ClinicDashboardResponse.PatientGrowthChartDto.builder()
                    .month(label).value((int) rCount).active(i == 0).build());

            // Load logic: Count all appointments and prescriptions in that period for all clinic doctors
            long aCount = doctorIds.isEmpty() ? 0 : appointmentRepository.countByDoctorIdInAndCreatedAtBetweenAndIsDeletedFalse(doctorIds, start, end);
            long pCountTotal = doctorIds.isEmpty() ? 0 : prescriptionRepository.countByDoctorIdInAndCreatedAtBetweenAndIsDeletedFalse(doctorIds, start, end);
            
            // Workload is the sum of medical activities
            int workload = (int) (aCount + pCountTotal);
            doctorLoadChart.add(ClinicDashboardResponse.PatientGrowthChartDto.builder()
                    .month(label).value(workload).active(i == 0).build());
        }

        List<ClinicDashboardResponse.DoctorPerformanceDto> performances = doctorUsers.stream().limit(5).map(u -> {
            long patientCount = patientRepository.countByDoctorIdAndIsDeletedFalse(u.getId());
            long apptCount = appointmentRepository.countByDoctorIdAndIsDeletedFalse(u.getId());
            int totalLoad = (int) (patientCount + apptCount);

            String fullName = u.getFullName() != null ? u.getFullName() : "Bác sĩ";
            fullName = fullName.replaceAll("(?i)(BS\\.|Bác sĩ|Thạc sĩ|Tiến sĩ|TS\\.|ThS\\.)", "").trim();

            return ClinicDashboardResponse.DoctorPerformanceDto.builder()
                    .name("BS. " + fullName)
                    .id("DR-" + (1000 + u.getId()))
                    .dept(u.getSpecialization() != null ? u.getSpecialization() : "Đa khoa")
                    .load(totalLoad)
                    .progress("w-" + Math.min(5, Math.max(1, (int)(totalLoad/10) + 1)) + "/5")
                    .color(totalLoad > 50 ? "amber" : "emerald")
                    .rating("N/A")
                    .reviews(0)
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

        // Calculate real growth trends (compare current period with previous one)
        long currentMonthPatients = patientGrowthChart.get(patientGrowthChart.size() - 1).getValue();
        long previousMonthPatients = patientGrowthChart.size() > 1 
                ? patientGrowthChart.get(patientGrowthChart.size() - 2).getValue() : 0;
        
        long growthPct = previousMonthPatients > 0 ? ((currentMonthPatients - previousMonthPatients) * 100 / previousMonthPatients) : 0;
        String growthSign = growthPct >= 0 ? "+" : "";
        String growthString = growthSign + growthPct + "%";

        // Calculate real growth trends for High Risk
        long currentRiskPatients = riskIndexChart.get(riskIndexChart.size() - 1).getValue();
        long previousRiskPatients = riskIndexChart.size() > 1 
                ? riskIndexChart.get(riskIndexChart.size() - 2).getValue() : 0;
        long riskDiff = currentRiskPatients - previousRiskPatients;
        String riskGrowthString = (riskDiff >= 0 ? "+" : "") + riskDiff + " ca";

        return ClinicDashboardResponse.builder()
                .totalPatients(totalPatients)
                .highRiskAlerts(highRiskCount)
                .pendingFollowUps(monitoringCount)
                .patientGrowth(growthString)
                .highRiskGrowth(riskGrowthString)
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

        Long drId = request.getDoctorId();
        if (drId == null && request.getAssignedDoctor() != null && !request.getAssignedDoctor().isEmpty()) {
            String drStr = request.getAssignedDoctor();
            try {
                drId = Long.parseLong(drStr);
            } catch (NumberFormatException e) {
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

        String condition = request.getPrimaryCondition() != null ? request.getPrimaryCondition() : request.getCondition();
        String ins = request.getInsuranceNumber() != null ? request.getInsuranceNumber() : request.getHealthInsuranceNumber();

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
                .chronicCondition(condition)
                .riskLevel(request.getRiskLevel())
                .treatmentStatus("Đang điều trị")
                .roomLocation("Ngoại trú")
                .clinicalNotes(request.getNotes())
                .identityCard(request.getIdentityCard())
                .occupation(request.getOccupation())
                .ethnicity(request.getEthnicity())
                .healthInsuranceNumber(ins)
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
        
        String condition = request.getPrimaryCondition() != null ? request.getPrimaryCondition() : request.getCondition();
        patient.setChronicCondition(condition);
        
        patient.setRiskLevel(request.getRiskLevel());
        patient.setClinicalNotes(request.getNotes());
        patient.setIdentityCard(request.getIdentityCard());
        patient.setOccupation(request.getOccupation());
        patient.setEthnicity(request.getEthnicity());
        
        String ins = request.getInsuranceNumber() != null ? request.getInsuranceNumber() : request.getHealthInsuranceNumber();
        patient.setHealthInsuranceNumber(ins);

        // Update Date of Birth from Age if provided
        if (request.getAge() != null && !request.getAge().isBlank()) {
            try {
                int ageNum = Integer.parseInt(request.getAge());
                if (ageNum > 0) {
                    patient.setDateOfBirth(LocalDate.now().minusYears(ageNum));
                }
            } catch (NumberFormatException ignored) {}
        } else if (request.getDateOfBirth() != null) {
            patient.setDateOfBirth(request.getDateOfBirth());
        }

        // Update user email and password
        User user = userRepository.findById(patient.getUserId())
                .orElse(null);
        if (user != null) {
            if (request.getEmail() != null && !request.getEmail().isBlank()) {
                user.setEmail(request.getEmail());
                patient.setEmail(request.getEmail());
            }
            
            // Only update password if provided
            if (request.getPassword() != null && !request.getPassword().isBlank()) {
                user.setPassword(passwordEncoder.encode(request.getPassword()));
            }
            
            userRepository.save(user);
        }

        if (request.getDoctorId() != null) {
            patient.setDoctorId(request.getDoctorId());
        } else if (request.getAssignedDoctor() != null && !request.getAssignedDoctor().isEmpty()) {
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

        return doctors.map(u -> {
            long patientCount = patientRepository.countByDoctorIdAndIsDeletedFalse(u.getId());
            return ClinicDoctorResponse.builder()
                .dbId(u.getId())
                .id("D-" + (1000 + u.getId()))
                .name(u.getFullName())
                .specialty(u.getSpecialization() != null ? u.getSpecialization() : "Đa khoa")
                .email(u.getEmail())
                .phone(u.getPhone())
                .load((int) patientCount)
                .rating("N/A")
                .reviews(0)
                .status("Đang hoạt động")
                .statusColor("primary")
                .img(u.getAvatarUrl() != null ? u.getAvatarUrl()
                        : "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=150&h=150")
                .build();
        });
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

        // Only update password if provided
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

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
                AppConstants.CONDITION_DIABETES,
                AppConstants.CONDITION_HYPERTENSION,
                AppConstants.CONDITION_HEART_DISEASE,
                AppConstants.CONDITION_KIDNEY_DISEASE,
                AppConstants.CONDITION_ASTHMA,
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

    @Override
    @Transactional(readOnly = true)
    public Page<com.project.dto.response.ClinicAppointmentResponse> getAppointmentRecords(Long clinicId, Pageable pageable) {
        Page<com.project.entity.Appointment> appointments = appointmentRepository.findByClinicId(clinicId, pageable);
        
        return appointments.map(a -> com.project.dto.response.ClinicAppointmentResponse.builder()
                .id(a.getId())
                .patientName(a.getPatient().getFullName())
                .doctorName(a.getDoctorName())
                .appointmentTime(a.getAppointmentTime())
                .appointmentType(a.getType())
                .status(a.getStatus())
                .reason(a.getReason())
                .build());
    }

    @Override
    @Transactional
    public void sendNotificationToPatient(Long clinicId, Long patientId, String message) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        
        if (!patient.getClinicId().equals(clinicId)) {
            throw new AccessDeniedException("You can only message patients within your clinic");
        }
        
        com.project.entity.Notification notification = com.project.entity.Notification.builder()
                .userId(patient.getUserId())
                .message(message)
                .title("Thông báo từ Quản lý Phòng khám")
                .type("ANNOUNCEMENT")
                .read(false)
                .build();
        notificationRepository.save(notification);
    }
}
