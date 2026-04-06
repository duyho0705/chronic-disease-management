package com.project.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class DoctorDashboardResponse {
    private DashboardStatsDto stats;
    private List<AppointmentSnippetDto> upcomingAppointments;
    private List<DoctorPatientResponse> recentPatients;
    private List<DoctorDashboardResponse.DoctorPatientResponseSnippet> highRiskPatients;
    private List<String> insights;

    @Data
    @Builder
    public static class DoctorPatientResponseSnippet {
        private Long id;
        private String name;
        private String condition;
        private String riskLevel;
        private String lastUpdate;
        private String img;
    }
}
