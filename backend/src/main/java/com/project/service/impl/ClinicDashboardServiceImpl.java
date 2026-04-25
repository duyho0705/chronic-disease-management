package com.project.service.impl;

import com.project.dto.request.CreatePatientRequest;
import com.project.dto.request.CreateDoctorRequest;
import com.project.dto.response.ClinicDashboardResponse;
import com.project.dto.response.ClinicPatientResponse;
import com.project.dto.response.ClinicDoctorResponse;
import com.project.dto.response.DoctorSnippetDto;
import com.project.entity.Patient;
import com.project.entity.User;
import com.project.entity.Appointment;
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
import java.time.LocalTime;
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
    private final com.project.repository.ClinicRepository clinicRepository;

    @Override
    @Transactional(readOnly = true)
    @org.springframework.cache.annotation.Cacheable(value = "clinic_dashboard", key = "#clinicId + '_' + #period")
    public ClinicDashboardResponse getDashboardData(Long clinicId, String period) {
        // Optimized: Start all primary data fetching in parallel
        java.util.concurrent.CompletableFuture<Long> totalPatientsFuture = java.util.concurrent.CompletableFuture.supplyAsync(() -> 
            patientRepository.countByClinicIdAndIsDeletedFalse(clinicId));
            
        java.util.concurrent.CompletableFuture<Long> highRiskCountFuture = java.util.concurrent.CompletableFuture.supplyAsync(() -> 
            patientRepository.countByClinicIdAndRiskLevelAndIsDeletedFalse(clinicId, AppConstants.RISK_HIGH));
            
        java.util.concurrent.CompletableFuture<Long> monitoringCountFuture = java.util.concurrent.CompletableFuture.supplyAsync(() -> 
            patientRepository.countByClinicIdAndRiskLevelAndIsDeletedFalse(clinicId, AppConstants.RISK_MONITORING));

        java.util.concurrent.CompletableFuture<List<Object[]>> pathologyFuture = java.util.concurrent.CompletableFuture.supplyAsync(() -> 
            patientRepository.countPatientsByChronicCondition(clinicId));

        java.util.concurrent.CompletableFuture<List<String>> insightsFuture = java.util.concurrent.CompletableFuture.supplyAsync(() -> 
            clinicalAnalyticsService.getClinicInsights(clinicId));

        // Period logic for charts
        LocalDateTime now = LocalDateTime.now();
        int iterations = 6;
        String timeUnit = "MONTH";
        LocalDateTime startDate;

        if ("7d".equals(period)) {
            iterations = 7;
            timeUnit = "DAY";
            startDate = now.minusDays(6).withHour(0).withMinute(0).withSecond(0);
        } else if ("30d".equals(period)) {
            iterations = 30;
            timeUnit = "DAY";
            startDate = now.minusDays(29).withHour(0).withMinute(0).withSecond(0);
        } else if ("1y".equals(period)) {
            iterations = 12;
            timeUnit = "MONTH";
            startDate = now.minusMonths(11).withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        } else {
            startDate = now.minusMonths(5).withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        }

        final String finalTimeUnit = timeUnit;
        final LocalDateTime finalStartDate = startDate;

        java.util.concurrent.CompletableFuture<List<Object[]>> patientStatsFuture = java.util.concurrent.CompletableFuture.supplyAsync(() -> 
            "DAY".equals(finalTimeUnit) ? patientRepository.countDailyPatients(clinicId, finalStartDate) : patientRepository.countMonthlyPatients(clinicId, finalStartDate)
        );

        java.util.concurrent.CompletableFuture<List<Object[]>> riskStatsFuture = java.util.concurrent.CompletableFuture.supplyAsync(() -> 
            "DAY".equals(finalTimeUnit) ? patientRepository.countDailyHighRiskPatients(clinicId, AppConstants.RISK_HIGH, finalStartDate) : patientRepository.countMonthlyHighRiskPatients(clinicId, AppConstants.RISK_HIGH, finalStartDate)
        );

        java.util.concurrent.CompletableFuture<List<User>> doctorUsersFuture = java.util.concurrent.CompletableFuture.supplyAsync(() -> 
            userRepository.findByFilters("DOCTOR", "ACTIVE", clinicId, null, null, null, null, PageRequest.of(0, 100)).getContent()
        );

        // Wait for primary blocks
        java.util.concurrent.CompletableFuture.allOf(
            totalPatientsFuture, highRiskCountFuture, monitoringCountFuture, 
            pathologyFuture, insightsFuture, patientStatsFuture, 
            riskStatsFuture, doctorUsersFuture
        ).join();

        long totalPatients = totalPatientsFuture.join();
        long highRiskCount = highRiskCountFuture.join();
        long monitoringCount = monitoringCountFuture.join();
        List<String> insights = insightsFuture.join();
        List<Object[]> pathologyResults = pathologyFuture.join();

        Map<String, Long> conditionCounts = new HashMap<>();
        for (Object[] result : pathologyResults) {
            String condition = (String) result[0];
            Long count = (Long) result[1];
            if (condition != null) {
                conditionCounts.put(condition, count);
            }
        }

        // Calculate Real Reporting Metrics
        LocalDateTime since = LocalDateTime.now().minusMonths(1);
        long totalAppts = appointmentRepository.countByClinicIdAndCreatedAtAfter(clinicId, since);
        long completedAppts = appointmentRepository.countByClinicIdAndStatusAndCreatedAtAfter(clinicId, "COMPLETED", since);
        double adherenceRate = totalAppts > 0 ? (double) completedAppts * 100 / totalAppts : 0.0;
        
        // Improvement Rate: % of patients with clinical metrics improving (Simplified for now)
        double improvementRate = 0.0; 
        double avgConsultationTime = 15.0; // Keep as baseline or calculate if appt duration exists

        // Build Disease Analytics Table Data from REAL condition counts
        List<ClinicDashboardResponse.DiseaseAnalysisDto> diseaseAnalytics = new ArrayList<>();
        
        // Use the real distribution data for diseaseRatios
        List<Object[]> riskDist = patientRepository.countRiskDistributionByCondition(clinicId);
        Map<String, Map<String, Long>> mappedDist = new HashMap<>();
        for (Object[] row : riskDist) {
            String condition = (String) row[0];
            String risk = (String) row[1];
            long count = (Long) row[2];
            mappedDist.computeIfAbsent(condition != null ? condition : "Khác", k -> new HashMap<>()).put(risk, count);
        }

        List<ClinicDashboardResponse.DiseaseRatioDto> allDiseaseRatios = new ArrayList<>();
        String[] colors = { "bg-emerald-500", "bg-sky-400", "bg-amber-400", "bg-rose-400", "bg-violet-400", "bg-pink-400" };

        for (Map.Entry<String, Map<String, Long>> entry : mappedDist.entrySet()) {
            String condition = entry.getKey();
            Map<String, Long> risks = entry.getValue();
            
            long stable = risks.getOrDefault("STABLE", risks.getOrDefault("Ổn định", 0L));
            long moderate = risks.getOrDefault("MODERATE", risks.getOrDefault("Trung bình", 0L));
            long high = risks.getOrDefault("HIGH", risks.getOrDefault("Nguy cơ cao", 0L));
            long totalForDisease = stable + moderate + high;

            String percentage = totalPatients > 0 ? (totalForDisease * 100 / totalPatients) + "%" : "0%";

            allDiseaseRatios.add(ClinicDashboardResponse.DiseaseRatioDto.builder()
                    .label(condition)
                    .percentage(percentage)
                    .color("")
                    .value(totalForDisease)
                    .stableRate((double) stable * 100 / Math.max(1, totalForDisease))
                    .midRate((double) moderate * 100 / Math.max(1, totalForDisease))
                    .riskRate((double) high * 100 / Math.max(1, totalForDisease))
                    .build());

            // Add to diseaseAnalytics table
            diseaseAnalytics.add(ClinicDashboardResponse.DiseaseAnalysisDto.builder()
                    .diseaseName(condition)
                    .totalCases((int) totalForDisease)
                    .averageIndex("Chưa cập nhật")
                    .riskVariation("0%")
                    .assessment(high > 0 ? "Theo dõi sát" : "Ổn định")
                    .statusColor(high > 0 ? "bg-rose-500" : "bg-emerald-500")
                    .build());
        }

        // Sort by patient count descending and keep top 3 + aggregate rest as "Khác"
        allDiseaseRatios.sort((a, b) -> Long.compare(b.getValue(), a.getValue()));

        List<ClinicDashboardResponse.DiseaseRatioDto> diseaseRatios = new ArrayList<>();
        int colorIdx = 0;

        for (int i = 0; i < Math.min(3, allDiseaseRatios.size()); i++) {
            ClinicDashboardResponse.DiseaseRatioDto dto = allDiseaseRatios.get(i);
            dto.setColor(colors[colorIdx++ % colors.length]);
            diseaseRatios.add(dto);
        }

        // Aggregate remaining entries into "Khác"
        if (allDiseaseRatios.size() > 3) {
            long otherTotal = 0;
            double otherStable = 0, otherMid = 0, otherRisk = 0;
            for (int i = 3; i < allDiseaseRatios.size(); i++) {
                ClinicDashboardResponse.DiseaseRatioDto dto = allDiseaseRatios.get(i);
                long v = dto.getValue();
                otherTotal += v;
                otherStable += dto.getStableRate() * v / 100.0;
                otherMid += dto.getMidRate() * v / 100.0;
                otherRisk += dto.getRiskRate() * v / 100.0;
            }
            String otherPercentage = totalPatients > 0 ? (otherTotal * 100 / totalPatients) + "%" : "0%";
            diseaseRatios.add(ClinicDashboardResponse.DiseaseRatioDto.builder()
                    .label("Khác")
                    .percentage(otherPercentage)
                    .color("bg-slate-400")
                    .value(otherTotal)
                    .stableRate(otherTotal > 0 ? otherStable * 100.0 / otherTotal : 0)
                    .midRate(otherTotal > 0 ? otherMid * 100.0 / otherTotal : 0)
                    .riskRate(otherTotal > 0 ? otherRisk * 100.0 / otherTotal : 0)
                    .build());
        }

        // Fallback for empty state
        if (diseaseRatios.isEmpty() && totalPatients > 0) {
            diseaseRatios.add(ClinicDashboardResponse.DiseaseRatioDto.builder()
                    .label("Chưa phân loại")
                    .percentage("100%")
                    .color("bg-slate-400")
                    .value(totalPatients)
                    .stableRate(100.0)
                    .build());
        }

        List<Object[]> patientStats = patientStatsFuture.join();
        List<Object[]> riskStats = riskStatsFuture.join();
        List<User> doctorUsers = doctorUsersFuture.join();
        List<Long> doctorIds = doctorUsers.stream().map(User::getId).collect(Collectors.toList());

        // Secondary parallel fetches that depend on doctorIds
        java.util.concurrent.CompletableFuture<List<Object[]>> apptStatsFuture = java.util.concurrent.CompletableFuture.supplyAsync(() -> 
            !doctorIds.isEmpty() ? ("DAY".equals(finalTimeUnit) ? appointmentRepository.countDailyAppointmentsByDoctorIds(doctorIds, finalStartDate) : appointmentRepository.countMonthlyAppointmentsByDoctorIds(doctorIds, finalStartDate)) : new ArrayList<>()
        );

        java.util.concurrent.CompletableFuture<List<Object[]>> prescStatsFuture = java.util.concurrent.CompletableFuture.supplyAsync(() -> 
            !doctorIds.isEmpty() ? ("DAY".equals(finalTimeUnit) ? prescriptionRepository.countDailyPrescriptionsByDoctorIds(doctorIds, finalStartDate) : prescriptionRepository.countMonthlyPrescriptionsByDoctorIds(doctorIds, finalStartDate)) : new ArrayList<>()
        );

        java.util.concurrent.CompletableFuture<List<Object[]>> drPatientMapFuture = java.util.concurrent.CompletableFuture.supplyAsync(() -> 
            patientRepository.countPatientsByDoctorIds(clinicId)
        );

        java.util.concurrent.CompletableFuture<List<Object[]>> drApptMapFuture = java.util.concurrent.CompletableFuture.supplyAsync(() -> 
            !doctorIds.isEmpty() ? appointmentRepository.countAppointmentsByDoctorIds(doctorIds) : new ArrayList<>()
        );

        // Wait for all secondary data
        java.util.concurrent.CompletableFuture.allOf(apptStatsFuture, prescStatsFuture, drPatientMapFuture, drApptMapFuture).join();

        List<Object[]> apptStats = apptStatsFuture.join();
        List<Object[]> prescStats = prescStatsFuture.join();

        // Helper Map to store results by key (date or month/year)
        Map<String, Long> pMap = new HashMap<>();
        Map<String, Long> rMap = new HashMap<>();
        Map<String, Long> loadMap = new HashMap<>();

        for (Object[] r : patientStats) pMap.put(generateKey(r, finalTimeUnit), ((Number) r["DAY".equals(finalTimeUnit) ? 1 : 2]).longValue());
        for (Object[] r : riskStats) rMap.put(generateKey(r, finalTimeUnit), ((Number) r["DAY".equals(finalTimeUnit) ? 1 : 2]).longValue());
        for (Object[] r : apptStats) {
            String k = generateKey(r, finalTimeUnit);
            loadMap.put(k, loadMap.getOrDefault(k, 0L) + ((Number) r["DAY".equals(finalTimeUnit) ? 1 : 2]).longValue());
        }
        for (Object[] r : prescStats) {
            String k = generateKey(r, finalTimeUnit);
            loadMap.put(k, loadMap.getOrDefault(k, 0L) + ((Number) r["DAY".equals(finalTimeUnit) ? 1 : 2]).longValue());
        }

        // Initialize chart data lists
        List<ClinicDashboardResponse.PatientGrowthChartDto> patientGrowthChart = new ArrayList<>();
        List<ClinicDashboardResponse.PatientGrowthChartDto> riskIndexChart = new ArrayList<>();
        List<ClinicDashboardResponse.PatientGrowthChartDto> doctorLoadChart = new ArrayList<>();

        // Build the charts from pre-fetched data
        for (int i = iterations - 1; i >= 0; i--) {
            LocalDateTime d = "DAY".equals(timeUnit) ? now.minusDays(i) : now.minusMonths(i);
            String k = "DAY".equals(timeUnit) ? d.toLocalDate().toString() : d.getYear() + "-" + d.getMonthValue();
            String label = "DAY".equals(timeUnit) ? ((i == 0) ? "Hôm nay" : d.getDayOfMonth() + "/" + d.getMonthValue()) : "Tháng " + d.getMonthValue();

            int totalVal = pMap.getOrDefault(k, 0L).intValue();
            int inpatientVal = (int) (totalVal * 0.35); // Estimated 35% are inpatient for reporting

            patientGrowthChart.add(ClinicDashboardResponse.PatientGrowthChartDto.builder().month(label).value(totalVal).secondaryValue(inpatientVal).active(i == 0).build());
            riskIndexChart.add(ClinicDashboardResponse.PatientGrowthChartDto.builder().month(label).value(rMap.getOrDefault(k, 0L).intValue()).active(i == 0).build());
            doctorLoadChart.add(ClinicDashboardResponse.PatientGrowthChartDto.builder().month(label).value(loadMap.getOrDefault(k, 0L).intValue()).active(i == 0).build());
        }

        // 2. Map doctor performance stats in bulk from pre-fetched data
        Map<Long, Long> drPatientMap = new HashMap<>();
        Map<Long, Long> drApptMap = new HashMap<>();
        for (Object[] r : drPatientMapFuture.join()) drPatientMap.put(((Number) r[0]).longValue(), ((Number) r[1]).longValue());
        for (Object[] r : drApptMapFuture.join()) drApptMap.put(((Number) r[0]).longValue(), ((Number) r[1]).longValue());

        List<ClinicDashboardResponse.DoctorPerformanceDto> performances = doctorUsers.stream().limit(5).map(u -> {
            long pCount = drPatientMap.getOrDefault(u.getId(), 0L);
            long aCount = drApptMap.getOrDefault(u.getId(), 0L);
            int totalLoad = (int) (pCount + aCount);

            String fullName = u.getFullName() != null ? u.getFullName() : "Bác sĩ";
            fullName = fullName.replaceAll("(?i)(BS\\.|Bác sĩ|Thạc sĩ|Tiến sĩ|TS\\.|ThS\\.)", "").trim();

            String encodedName = fullName;
            try {
                encodedName = java.net.URLEncoder.encode(fullName, "UTF-8");
            } catch (Exception e) {
                log.warn("Error encoding doctor name for avatar: {}", fullName);
            }

            return ClinicDashboardResponse.DoctorPerformanceDto.builder()
                    .dbId(u.getId()).id("D-" + (1000 + u.getId())).name(fullName)
                    .img(u.getAvatarUrl() != null ? u.getAvatarUrl() : "https://ui-avatars.com/api/?name=" + encodedName + "&background=random")
                    .specialty(u.getSpecialization() != null ? u.getSpecialization() : "Đa khoa")
                    .email(u.getEmail()).phone(u.getPhone()).licenseNumber(u.getLicenseNumber())
                    .degree(u.getDegree() != null ? u.getDegree() : "Bác sĩ").bio(u.getBio())
                    .licenseImageUrl(u.getLicenseImageUrl())
                    .load(totalLoad).progress("w-" + Math.min(5, Math.max(1, (int) (totalLoad / 10) + 1)) + "/5")
                    .color(totalLoad > 50 ? "amber" : "emerald").rating("N/A").reviews(0).status("Đang hoạt động").active(true).build();
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
                ? patientGrowthChart.get(patientGrowthChart.size() - 2).getValue()
                : 0;

        long growthPct = previousMonthPatients > 0
                ? ((currentMonthPatients - previousMonthPatients) * 100 / previousMonthPatients)
                : 0;
        String growthSign = (currentMonthPatients > previousMonthPatients) ? "+" : (currentMonthPatients < previousMonthPatients) ? "-" : "";
        String growthString = growthSign + Math.abs(growthPct) + "%";

        // Calculate real growth trends for High Risk
        long currentRiskPatients = riskIndexChart.get(riskIndexChart.size() - 1).getValue();
        long previousRiskPatients = riskIndexChart.size() > 1
                ? riskIndexChart.get(riskIndexChart.size() - 2).getValue()
                : 0;
        long riskDiff = currentRiskPatients - previousRiskPatients;
        String riskDiffSign = riskDiff > 0 ? "+" : riskDiff < 0 ? "-" : "";
        String riskGrowthString = riskDiffSign + Math.abs(riskDiff) + " ca";

        return ClinicDashboardResponse.builder()
                .totalPatients(totalPatients)
                .highRiskAlerts(highRiskCount)
                .pendingFollowUps(monitoringCount)
                .patientGrowth(growthString)
                .highRiskGrowth(riskGrowthString)
                .adherenceRate(adherenceRate)
                .improvementRate(improvementRate)
                .avgConsultationTime(avgConsultationTime)
                .diseaseRatios(diseaseRatios)
                .diseaseAnalytics(diseaseAnalytics)
                .patientGrowthChart(patientGrowthChart)
                .riskIndexChart(riskIndexChart)
                .doctorLoadChart(doctorLoadChart)
                .growthStats(ClinicDashboardResponse.GrowthStatsDto.builder()
                        .growth(growthString)
                        .average(avg + " ca/tháng")
                        .peakMonth(peakMonthLabel + " (" + peakValue + ")")
                        .build())
                .doctorPerformances(performances)
                .insights(insights)
                .averageDoctorLoad(doctorUsers.isEmpty() ? 0 : (double) totalPatients / doctorUsers.size())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ClinicPatientResponse> getPatientRecords(Long clinicId, String keyword, String condition,
            String riskLevel, String status, String doctor, Pageable pageable) {
        Page<Patient> patientPage = patientRepository.findByClinicIdAndFilters(clinicId, keyword, condition, riskLevel,
                status, doctor, pageable);

        List<User> doctors = userRepository.findByFilters("DOCTOR", "ACTIVE", clinicId, null, null, null, null, PageRequest.of(0, 100))
                .getContent();
        Map<Long, String> doctorMap = doctors.stream()
                .collect(Collectors.toMap(User::getId, User::getFullName, (existing, replacement) -> existing));

        return patientPage.map(p -> patientMapper.toClinicPatientResponse(p, doctorMap));
    }

    @Override
    @Transactional
    @org.springframework.cache.annotation.CacheEvict(value = "clinic_dashboard", allEntries = true)
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
                .avatarUrl(request.getAvatarUrl())
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
                        .findByFilters("DOCTOR", "ACTIVE", clinicId, null, null, null, drName, PageRequest.of(0, 1)).getContent();
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

        String condition = request.getPrimaryCondition() != null ? request.getPrimaryCondition()
                : request.getCondition();
        String ins = request.getInsuranceNumber() != null ? request.getInsuranceNumber()
                : request.getHealthInsuranceNumber();

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
                .treatmentStatus(request.getTreatmentStatus() != null ? request.getTreatmentStatus() : "Đang điều trị")
                .profileStatus(request.getStatus() != null ? request.getStatus() : "Hoạt động")
                .roomLocation("Ngoại trú")
                .clinicalNotes(request.getNotes())
                .identityCard(request.getIdentityCard())
                .occupation(request.getOccupation())
                .ethnicity(request.getEthnicity())
                .healthInsuranceNumber(ins)
                .avatarUrl(request.getAvatarUrl())
                .build();
        patientRepository.save(patient);
    }

    @Override
    @Transactional
    @org.springframework.cache.annotation.CacheEvict(value = "clinic_dashboard", allEntries = true)
    public void updatePatient(Long clinicId, Long patientId, CreatePatientRequest request) {
        log.info("Updating patient {} for clinic {}", patientId, clinicId);
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bệnh nhân với ID: " + patientId));

        if (!patient.getClinicId().equals(clinicId)) {
            throw new AccessDeniedException("Bạn không có quyền chỉnh sửa hồ sơ bệnh nhân này");
        }

        // Only update fields if they are provided in the request to prevent accidental NULL overwrites
        if (request.getName() != null && !request.getName().isBlank()) {
            patient.setFullName(request.getName());
        }
        if (request.getPhone() != null && !request.getPhone().isBlank()) {
            patient.setPhone(request.getPhone());
        }
        if (request.getGender() != null) {
            patient.setGender(request.getGender());
        }
        if (request.getAddress() != null) {
            patient.setAddress(request.getAddress());
        }

        String condition = request.getCondition() != null ? request.getCondition()
                : request.getPrimaryCondition();
        if (condition != null) {
            patient.setChronicCondition(condition);
        }

        if (request.getRiskLevel() != null) {
            patient.setRiskLevel(request.getRiskLevel());
        }
        if (request.getNotes() != null) {
            patient.setClinicalNotes(request.getNotes());
        }
        if (request.getTreatmentStatus() != null) {
            patient.setTreatmentStatus(request.getTreatmentStatus());
        }
        if (request.getStatus() != null) {
            patient.setProfileStatus(request.getStatus());
        }
        if (request.getIdentityCard() != null) {
            patient.setIdentityCard(request.getIdentityCard());
        }
        if (request.getOccupation() != null) {
            patient.setOccupation(request.getOccupation());
        }
        if (request.getEthnicity() != null) {
            patient.setEthnicity(request.getEthnicity());
        }

        String ins = request.getInsuranceNumber() != null ? request.getInsuranceNumber()
                : request.getHealthInsuranceNumber();
        if (ins != null && !ins.isBlank()) {
            patient.setHealthInsuranceNumber(ins);
        }

        // Update Date of Birth from Age if provided
        if (request.getAge() != null && !String.valueOf(request.getAge()).isBlank()) {
            try {
                int ageNum = Integer.parseInt(String.valueOf(request.getAge()));
                if (ageNum > 0) {
                    patient.setDateOfBirth(LocalDate.now().minusYears(ageNum));
                }
            } catch (Exception ignored) {
            }
        } else if (request.getDateOfBirth() != null) {
            patient.setDateOfBirth(request.getDateOfBirth());
        }

        // Update user email and password
        User user = userRepository.findById(patient.getUserId()).orElse(null);
        if (user != null) {
            if (request.getEmail() != null && !request.getEmail().isBlank()) {
                user.setEmail(request.getEmail());
                patient.setEmail(request.getEmail());
            }

            if (request.getPassword() != null && !request.getPassword().isBlank()) {
                user.setPassword(passwordEncoder.encode(request.getPassword()));
            }
            
            if (request.getAvatarUrl() != null) {
                user.setAvatarUrl(request.getAvatarUrl());
                patient.setAvatarUrl(request.getAvatarUrl());
            }
            
            // Sync user full name with patient full name
            user.setFullName(patient.getFullName());
            user.setPhone(patient.getPhone());
            userRepository.save(user);
        }

        // Doctor assignment logic
        if (request.getDoctorId() != null) {
            // Verify doctor exists and belongs to the same clinic
            userRepository.findById(request.getDoctorId()).ifPresent(dr -> {
                if (dr.getClinicId().equals(clinicId)) {
                    patient.setDoctorId(dr.getId());
                }
            });
        } else if (request.getAssignedDoctor() != null && !request.getAssignedDoctor().isEmpty()) {
            String drStr = request.getAssignedDoctor();
            try {
                patient.setDoctorId(Long.parseLong(drStr));
            } catch (NumberFormatException e) {
                String drName = drStr.replaceAll("(?i)^(BS\\.|Bác sĩ\\s*)", "").trim();
                List<User> foundDrs = userRepository
                        .findByFilters("DOCTOR", "ACTIVE", clinicId, null, null, null, drName, PageRequest.of(0, 1)).getContent();
                if (!foundDrs.isEmpty()) {
                    patient.setDoctorId(foundDrs.get(0).getId());
                }
            }
        }

        try {
            patientRepository.save(patient);
            log.info("Successfully updated patient {}", patientId);

            // Handle Appointment Creation if assignment info is provided
            if (request.getAssignmentDate() != null && request.getAssignmentTime() != null && !request.getAssignmentTime().isEmpty()) {
                try {
                    LocalTime time = LocalTime.parse(request.getAssignmentTime());
                    LocalDateTime apptDateTime = LocalDateTime.of(request.getAssignmentDate(), time);

                    // Fetch doctor info for the appointment cache
                    User doctor = userRepository.findById(patient.getDoctorId()).orElse(null);
                    
                    Appointment appointment = Appointment.builder()
                            .patient(patient)
                            .doctorId(patient.getDoctorId())
                            .appointmentTime(apptDateTime)
                            .status("SCHEDULED")
                            .type(request.getAppointmentType() != null ? request.getAppointmentType() : "IN_PERSON")
                            .meetingLink(request.getMeetingLink())
                            .reason("Gán chỉ định chương trình: " + patient.getChronicCondition())
                            .doctorName(doctor != null ? doctor.getFullName() : "Bác sĩ phụ trách")
                            .doctorSpecialty(doctor != null ? doctor.getSpecialization() : null)
                            .doctorAvatarUrl(doctor != null ? doctor.getAvatarUrl() : null)
                            .build();
                    
                    appointmentRepository.save(appointment);
                    log.info("Created scheduled appointment for patient {} at {}", patientId, apptDateTime);
                } catch (Exception e) {
                    log.error("Failed to create appointment during assignment: {}", e.getMessage());
                }
            }
        } catch (Exception e) {
            log.error("Error saving patient {}: {}", patientId, e.getMessage());
            throw new RuntimeException("LỗI hệ thống khi lưu hồ sơ bệnh nhân: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    @org.springframework.cache.annotation.CacheEvict(value = "clinic_dashboard", allEntries = true)
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
    public Page<ClinicDoctorResponse> getDoctorRecords(Long clinicId, String keyword, String status, String specialty, String degree, String experience, Pageable pageable) {
        String statusVal = null;
        if (status != null && !status.isBlank() && !status.equals("Tất cả bác sĩ")) {
            if (status.equals("Đang hoạt động")) statusVal = "ACTIVE";
            else if (status.equals("Ngưng hoạt động") || status.equals("Tạm dừng") || status.equals("Nghỉ phép")) statusVal = "INACTIVE";
            else statusVal = status;
        }
        
        Page<User> doctors = userRepository.findByFilters("DOCTOR", statusVal, clinicId, specialty, degree, experience, keyword, pageable);
        List<Long> doctorIds = doctors.getContent().stream().map(User::getId).collect(Collectors.toList());

        Map<Long, Long> drPatientMap = new HashMap<>();
        if (!doctorIds.isEmpty()) {
            for (Object[] r : patientRepository.countPatientsByDoctorIds(clinicId)) drPatientMap.put((Long) r[0], (Long) r[1]);
        }

        return doctors.map(u -> {
            long patientCount = drPatientMap.getOrDefault(u.getId(), 0L);
            String encodedName = u.getFullName() != null ? u.getFullName() : "Doctor";
            try {
                encodedName = java.net.URLEncoder.encode(encodedName, "UTF-8");
            } catch (Exception e) {
            }

            String statusLabel = "Đang hoạt động";
            String statusColor = "primary";
            if ("INACTIVE".equals(u.getStatus())) {
                statusLabel = "Ngưng hoạt động";
                statusColor = "rose";
            } else if ("BUSY".equals(u.getStatus())) {
                statusLabel = "Đã đủ lịch";
                statusColor = "amber";
            }

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
                    .status(statusLabel)
                    .statusColor(statusColor)
                    .img(u.getAvatarUrl() != null ? u.getAvatarUrl()
                            : "https://ui-avatars.com/api/?name=" + encodedName + "&background=random")
                    .licenseNumber(u.getLicenseNumber())
                    .degree(u.getDegree())
                    .experience(u.getExperience())
                    .bio(u.getBio())
                    .licenseImageUrl(u.getLicenseImageUrl())
                    .build();
        });
    }

    @Override
    @Transactional
    @org.springframework.cache.annotation.CacheEvict(value = "clinic_dashboard", allEntries = true)
    public void createDoctor(Long clinicId, CreateDoctorRequest request) {
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword() != null ? request.getPassword() : "password"))
                .fullName(request.getName())
                .phone(request.getPhone())
                .role("DOCTOR")
                .clinicId(clinicId)
                .specialization(request.getSpecialty())
                .licenseNumber(request.getLicenseNumber())
                .degree(request.getDegree())
                .experience(request.getExperience())
                .bio(request.getBio())
                .avatarUrl(request.getAvatarUrl())
                .licenseImageUrl(request.getLicenseImageUrl())
                .maxPatients(request.getMaxPatients() != null ? Integer.parseInt(request.getMaxPatients()) : 150)
                .status(request.getStatus() != null ? request.getStatus() : "ACTIVE")
                .build();
        userRepository.save(user);
    }

    @Override
    @Transactional
    @org.springframework.cache.annotation.CacheEvict(value = "clinic_dashboard", allEntries = true)
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
        user.setLicenseNumber(request.getLicenseNumber());
        user.setDegree(request.getDegree());
        user.setExperience(request.getExperience());
        user.setBio(request.getBio());
        user.setAvatarUrl(request.getAvatarUrl());
        user.setLicenseImageUrl(request.getLicenseImageUrl());
        if (request.getStatus() != null) user.setStatus(request.getStatus());
        if (request.getMaxPatients() != null) user.setMaxPatients(Integer.parseInt(request.getMaxPatients()));

        // Only update password if provided
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        userRepository.save(user);
    }

    @Override
    @Transactional
    @org.springframework.cache.annotation.CacheEvict(value = "clinic_dashboard", allEntries = true)
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
        List<User> doctors = userRepository.findByFilters("DOCTOR", "ACTIVE", clinicId, null, null, null, null, PageRequest.of(0, 100))
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
        List<User> doctors = userRepository.findByFilters("DOCTOR", "ACTIVE", clinicId, null, null, null, null, PageRequest.of(0, 500))
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
    public Page<com.project.dto.response.ClinicAppointmentResponse> getAppointmentRecords(Long clinicId,
            Pageable pageable) {
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

    @Override
    @Transactional(readOnly = true)
    public com.project.dto.response.ClinicResponse getClinicDetails(Long clinicId) {
        com.project.entity.Clinic clinic = clinicRepository.findById(clinicId)
                .orElseThrow(() -> new RuntimeException("Clinic not found"));
        return com.project.dto.response.ClinicResponse.builder()
                .id(clinic.getId())
                .clinicCode(clinic.getClinicCode())
                .name(clinic.getName())
                .address(clinic.getAddress())
                .phone(clinic.getPhone())
                .imageUrl(clinic.getImageUrl())
                .status(clinic.getStatus())
                .doctorCount(clinic.getDoctorCount())
                .patientCount(clinic.getPatientCount())
                .build();
    }

    @Override
    @Transactional
    public void updateClinicDetails(Long clinicId, com.project.dto.request.UpdateClinicRequest request) {
        com.project.entity.Clinic clinic = clinicRepository.findById(clinicId)
                .orElseThrow(() -> new RuntimeException("Clinic not found"));

        if (request.getName() != null)
            clinic.setName(request.getName());
        if (request.getAddress() != null)
            clinic.setAddress(request.getAddress());
        if (request.getPhone() != null)
            clinic.setPhone(request.getPhone());
        if (request.getImageUrl() != null)
            clinic.setImageUrl(request.getImageUrl());

        clinicRepository.save(clinic);
    }

    @Override
    @Transactional
    public void updateAppointmentStatus(Long clinicId, Long appointmentId, String status) {
        com.project.entity.Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        // Verification: ensure the doctor belongs to the clinic
        com.project.entity.User doctor = userRepository.findById(appointment.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        if (!doctor.getClinicId().equals(clinicId)) {
            throw new AccessDeniedException("You do not have permission to modify this appointment");
        }

        appointment.setStatus(status);
        appointmentRepository.save(appointment);

        // Notify patient
        com.project.entity.Notification notification = com.project.entity.Notification.builder()
                .userId(appointment.getPatient().getUserId())
                .title("Cập nhật trạng thái lịch hẹn")
                .message("Lịch hẹn của bạn với BS. " + appointment.getDoctorName() + " đã được chuyển sang trạng thái: "
                        + status)
                .type("APPOINTMENT")
                .read(false)
                .build();
        notificationRepository.save(notification);

        // Notify doctor
        com.project.entity.Notification docNotification = com.project.entity.Notification.builder()
                .userId(appointment.getDoctorId())
                .title("Thay đổi trạng thái lịch hẹn")
                .message("Quản lý phòng khám đã cập nhật trạng thái lịch hẹn của BN. "
                        + appointment.getPatient().getFullName() + " sang: " + status)
                .type("APPOINTMENT")
                .read(false)
                .build();
        notificationRepository.save(docNotification);
    }

    private String generateKey(Object[] row, String timeUnit) {
        if ("DAY".equals(timeUnit)) {
            Object date = row[0];
            return date.toString(); // Expected yyyy-MM-dd
        } else {
            // Month unit: row[0]=Year, row[1]=Month (might be Double from EXTRACT)
            int year = ((Number) row[0]).intValue();
            int month = ((Number) row[1]).intValue();
            return year + "-" + month;
        }
    }
}
