package com.project.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "audit_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    private String userName;

    private String userAvatar;

    @Column(nullable = false)
    private String action;

    @Column(nullable = false)
    private String module;

    @Column(columnDefinition = "TEXT")
    private String details;

    private String ipAddress;

    private String status; // success, warning, danger
}
