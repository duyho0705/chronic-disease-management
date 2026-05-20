package com.project.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ServiceSubscriptionResponse {
    private Long id;
    private Long serviceId;
    private String serviceName;
    private String category;
    private BigDecimal price;
    private String duration;
    private String status;
    private LocalDateTime subscribedAt;
    private LocalDateTime expiresAt;
}
