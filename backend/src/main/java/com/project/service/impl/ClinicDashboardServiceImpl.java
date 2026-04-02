package com.project.service.impl;

import com.project.dto.response.ClinicDashboardResponse;
import com.project.service.ClinicDashboardService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ClinicDashboardServiceImpl implements ClinicDashboardService {

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
}
