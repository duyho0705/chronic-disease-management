package com.project.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "system_configs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SystemConfig extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // General Settings
    private String language;
    private String timezone;
    private boolean maintenanceMode;

    // Security Settings
    private boolean specialCharRequired;
    private boolean upperNumberRequired;

    // Medical Thresholds (stored as strings to match frontend state, or use integers)
    private String bpSysThreshold;
    private String bpDiaThreshold;
    private String hrThreshold;
    private String spo2Threshold;

    // Notifications
    private boolean notifyVitalSigns;
    private boolean notifySupportRequests;
    private boolean notifyRevenueReports;
    
    private String apiKey; // For display/regeneration in UI
}
