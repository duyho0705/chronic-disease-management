package com.project.service.impl;

import com.project.dto.request.CreatePatientRequest;
import com.project.dto.response.ClinicDashboardResponse;
import com.project.dto.response.ClinicPatientResponse;
import com.project.entity.Patient;
import com.project.entity.User;
import com.project.repository.PatientRepository;
import com.project.repository.UserRepository;
import com.project.service.ClinicDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClinicDashboardServiceImpl implements ClinicDashboardService {

    private final PatientRepository patientRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public ClinicDashboardResponse getDashboardData(Long clinicId) {
        List<ClinicDashboardResponse.DiseaseRatioDto> diseaseRatios = java.util.Arrays.asList(
                ClinicDashboardResponse.DiseaseRatioDto.builder().color("bg-emerald-500").label("Tiểu đường").percentage("40%").build(),
                ClinicDashboardResponse.DiseaseRatioDto.builder().color("bg-amber-400").label("Cao huyết áp").percentage("35%").build(),
                ClinicDashboardResponse.DiseaseRatioDto.builder().color("bg-sky-400").label("Bệnh tim mạch").percentage("25%").build()
        );

        List<ClinicDashboardResponse.PatientGrowthChartDto> patientGrowthChart = java.util.Arrays.asList(
                ClinicDashboardResponse.PatientGrowthChartDto.builder().month("T.1").height("35%").active(false).build(),
                ClinicDashboardResponse.PatientGrowthChartDto.builder().month("T.2").height("65%").active(false).build(),
                ClinicDashboardResponse.PatientGrowthChartDto.builder().month("T.3").height("90%").active(true).build(),
                ClinicDashboardResponse.PatientGrowthChartDto.builder().month("T.4").height("75%").active(false).build(),
                ClinicDashboardResponse.PatientGrowthChartDto.builder().month("T.5").height("55%").active(false).build(),
                ClinicDashboardResponse.PatientGrowthChartDto.builder().month("T.6").height("45%").active(false).build()
        );

        ClinicDashboardResponse.GrowthStatsDto growthStats = ClinicDashboardResponse.GrowthStatsDto.builder()
                .growth("+12.5%")
                .average("180 ca/tháng")
                .peakMonth("Tháng 3 (224 ca)")
                .build();

        List<ClinicDashboardResponse.DoctorPerformanceDto> performances = java.util.Arrays.asList(
                ClinicDashboardResponse.DoctorPerformanceDto.builder()
                        .name("BS. Lê Thị Mai").id("DR-1024").dept("Nội tiết").load(124).progress("w-4/5").color("emerald").rating("4.9").reviews(420).status("Đang trực").active(true)
                        .img("https://lh3.googleusercontent.com/aida-public/AB6AXuAhOoC9URZAHCP9v9d_l_e-tyh66ffAtXVouqi4DZSNPa_eq_JzHX993csJtIXauOlPnmXYsPpVSyauZnWxcYV0fodnKzn8Ihjmni-69lwmEZo5ugMwzJXx9nSknt0kftRkYZBXvjHcMHbqgeNSCgeYlaPo_sDnjYWhL--uhL42_WuhgMEh-Iqfvnzf5OGRgKBbIeVMbzn_qr-uoS-9lmem5CY9sVQPDjZIw4w-2r_lhCaOmqMuY1GKus8fSstMQoPp2EDUQSklumY")
                        .build(),
                ClinicDashboardResponse.DoctorPerformanceDto.builder()
                        .name("BS. Nguyễn Văn Hùng").id("DR-1025").dept("Tim mạch").load(98).progress("w-3/5").color("amber").rating("4.7").reviews(315).status("Nghỉ ca").active(false)
                        .img("https://lh3.googleusercontent.com/aida-public/AB6AXuDYDRWmp-LgjGpRKEb5U5aaxSuviEGGzdWXblGs06zhuwpWaZlFdSZwRT2bBxg6mk28k9IhyLFivR9v7kIzFi9BsQ5iyenuznuRy4WeKYvqDbbgdtig_kA2eVqY6q6ze5jElaX7E4cyXqg59-fMZc_Y_EJvSgAZw2Kz_Uc284VdQyqwMvZEUE6kdCYgSkePLdYKSeXpgGJ4gGuye7EP0h8WaOBKfRQsPZVZI-vVFKYCkcethQLzefVbnTo7d3bMBljYXQRbWQx7GIY")
                        .build(),
                ClinicDashboardResponse.DoctorPerformanceDto.builder()
                        .name("BS. Trần Thanh Vân").id("DR-1026").dept("Tổng quát").load(145).progress("w-full").color("red").rating("4.8").reviews(512).status("Đang trực").active(true)
                        .img("https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=150&h=150")
                        .build()
        );

        return ClinicDashboardResponse.builder()
                .totalPatients(1250)
                .highRiskAlerts(24)
                .pendingFollowUps(45)
                .patientGrowth("+12%")
                .highRiskGrowth("+4 ca so với hôm qua")
                .diseaseRatios(diseaseRatios)
                .patientGrowthChart(patientGrowthChart)
                .growthStats(growthStats)
                .doctorPerformances(performances)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClinicPatientResponse> getPatientRecords(Long clinicId, String keyword) {
        List<Patient> patients = patientRepository.findByClinicIdAndFilters(clinicId, keyword);
        
        // If results are empty and it was a clinic filter, try fetching all for demo
        if (patients.isEmpty() && (keyword == null || keyword.isBlank())) {
            patients = patientRepository.findAll();
        }

        List<User> doctors = userRepository.findByFilters("DOCTOR", "ACTIVE", null, null, null).getContent();
        Map<Long, String> doctorMap = doctors.stream()
                .collect(Collectors.toMap(User::getId, User::getFullName, (existing, replacement) -> existing));

        return patients.stream().map(p -> {
            int age = p.getDateOfBirth() != null ? Period.between(p.getDateOfBirth(), LocalDate.now()).getYears() : 0;
            return ClinicPatientResponse.builder()
                    .id(p.getPatientCode())
                    .name(p.getFullName())
                    .age(age)
                    .phone(p.getPhone())
                    .condition(p.getChronicCondition() != null ? p.getChronicCondition() : "N/A")
                    .riskLevel(p.getRiskLevel() != null ? p.getRiskLevel() : "Bình thường")
                    .doctor(p.getDoctorId() != null ? doctorMap.getOrDefault(p.getDoctorId(), "Chưa phân công") : "Chưa phân công")
                    .location(p.getRoomLocation() != null ? p.getRoomLocation() : "Ngoại trú")
                    .status(p.getTreatmentStatus() != null ? p.getTreatmentStatus() : "Đang theo dõi")
                    .img(p.getAvatarUrl() != null ? p.getAvatarUrl() : "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=150&h=150")
                    .build();
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void createPatient(Long clinicId, CreatePatientRequest request) {
        String email = request.getName().toLowerCase().replace(" ", "") + System.currentTimeMillis() % 1000 + "@patient.com";
        User user = User.builder()
                .email(email)
                .password("$2a$10$vO.mXyMCHmJ/l3X2uR8Nbeu0iZ5Yv/0/O7U9q7jX0m0j0u0u0u0u.")
                .role("PATIENT")
                .fullName(request.getName())
                .phone(request.getPhone())
                .clinicId(clinicId)
                .status("ACTIVE")
                .build();
        user = userRepository.save(user);

        Long drId = null;
        if (request.getAssignedDoctor() != null) {
            String drName = request.getAssignedDoctor().replace("BS. ", "");
            List<User> foundDrs = userRepository.findByFilters("DOCTOR", "ACTIVE", null, drName, null).getContent();
            if (!foundDrs.isEmpty()) {
                drId = foundDrs.get(0).getId();
            }
        }

        int age = 0;
        try { age = Integer.parseInt(request.getAge()); } catch (Exception ignored) {}

        Patient patient = Patient.builder()
                .userId(user.getId())
                .clinicId(clinicId)
                .fullName(request.getName())
                .phone(request.getPhone())
                .gender(request.getGender())
                .address(request.getAddress())
                .dateOfBirth(LocalDate.now().minusYears(age))
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
}
