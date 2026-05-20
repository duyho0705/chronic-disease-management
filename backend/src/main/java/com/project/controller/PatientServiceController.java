package com.project.controller;

import com.project.dto.response.ApiResponse;
import com.project.dto.response.ServiceSubscriptionResponse;
import com.project.service.PatientServiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/patient/services")
@RequiredArgsConstructor
public class PatientServiceController {

    private final PatientServiceService patientServiceService;

    @PostMapping("/{serviceId}/subscribe")
    public ResponseEntity<ApiResponse<ServiceSubscriptionResponse>> subscribeToService(@PathVariable Long serviceId) {
        return ResponseEntity.ok(ApiResponse.success("Đăng ký gói dịch vụ thành công", patientServiceService.subscribeToService(serviceId)));
    }

    @DeleteMapping("/subscription")
    public ResponseEntity<ApiResponse<Void>> cancelSubscription() {
        patientServiceService.cancelSubscription();
        return ResponseEntity.ok(ApiResponse.success("Hủy gói dịch vụ thành công", null));
    }

    @GetMapping("/subscription")
    public ResponseEntity<ApiResponse<ServiceSubscriptionResponse>> getCurrentSubscription() {
        return ResponseEntity.ok(ApiResponse.success(patientServiceService.getCurrentSubscription()));
    }
}
