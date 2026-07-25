package com.project.controller;

import com.project.dto.response.ApiResponse;
import com.project.entity.MedicalService;
import com.project.service.MedicalServiceService;
import com.project.util.RoleUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/v1/medical-services")
@RequiredArgsConstructor
public class MedicalServiceController {

    private final MedicalServiceService medicalServiceService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<MedicalService>>> getAllServices(@RequestParam(required = false) Long clinicId) {
        return ResponseEntity.ok(ApiResponse.success(medicalServiceService.getAllServices(clinicId)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MedicalService>> getServiceById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(medicalServiceService.getServiceById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('" + RoleUtils.ADMIN + "', '" + RoleUtils.CLINIC_MANAGER + "', '" + RoleUtils.DOCTOR + "')")
    public ResponseEntity<ApiResponse<MedicalService>> createService(@RequestBody MedicalService service) {
        return ResponseEntity.ok(ApiResponse.success(medicalServiceService.createService(service)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('" + RoleUtils.ADMIN + "', '" + RoleUtils.CLINIC_MANAGER + "', '" + RoleUtils.DOCTOR + "')")
    public ResponseEntity<ApiResponse<MedicalService>> updateService(@PathVariable Long id, @RequestBody MedicalService service) {
        return ResponseEntity.ok(ApiResponse.success(medicalServiceService.updateService(id, service)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('" + RoleUtils.ADMIN + "', '" + RoleUtils.CLINIC_MANAGER + "', '" + RoleUtils.DOCTOR + "')")
    public ResponseEntity<ApiResponse<String>> deleteService(@PathVariable Long id) {
        medicalServiceService.deleteService(id);
        return ResponseEntity.ok(ApiResponse.success("Đã xóa dịch vụ thành công"));
    }

    @PostMapping("/batch-delete")
    @PreAuthorize("hasAnyRole('" + RoleUtils.ADMIN + "', '" + RoleUtils.CLINIC_MANAGER + "', '" + RoleUtils.DOCTOR + "')")
    public ResponseEntity<ApiResponse<String>> deleteServicesBatch(@Valid @RequestBody com.project.dto.request.BatchDeleteServiceRequest request) {
        medicalServiceService.deleteServicesBatch(request.getIds());
        return ResponseEntity.ok(ApiResponse.success("Đã xóa hàng loạt dịch vụ thành công"));
    }

    @PatchMapping("/{id}/toggle-status")
    @PreAuthorize("hasAnyRole('" + RoleUtils.ADMIN + "', '" + RoleUtils.CLINIC_MANAGER + "', '" + RoleUtils.DOCTOR + "')")
    public ResponseEntity<ApiResponse<MedicalService>> toggleStatus(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(medicalServiceService.toggleStatus(id)));
    }

    @GetMapping("/stats")
    @PreAuthorize("hasAnyRole('" + RoleUtils.ADMIN + "', '" + RoleUtils.CLINIC_MANAGER + "')")
    public ResponseEntity<ApiResponse<com.project.dto.response.AdminMedicalServiceStatsResponse>> getServiceStats() {
        return ResponseEntity.ok(ApiResponse.success(medicalServiceService.getServiceStats()));
    }
}

