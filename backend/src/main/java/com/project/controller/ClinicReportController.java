package com.project.controller;

import com.project.dto.response.ApiResponse;
import com.project.dto.response.ClinicReportResponse;
import com.project.service.ClinicReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/v1/clinics/{clinicId}/reports")
@RequiredArgsConstructor
public class ClinicReportController {

    private final ClinicReportService clinicReportService;

    @GetMapping
    public ResponseEntity<ApiResponse<ClinicReportResponse>> getClinicReport(
            @PathVariable Long clinicId,
            @RequestParam(defaultValue = "30d") String period) {
        
        ClinicReportResponse report = clinicReportService.getClinicReport(clinicId, period);
        return ResponseEntity.ok(ApiResponse.success(report));
    }

    @GetMapping("/disease-detail")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDiseaseDetail(
            @PathVariable Long clinicId,
            @RequestParam String condition) {
        
        Map<String, Object> detail = clinicReportService.getDiseaseDetailReport(clinicId, condition);
        return ResponseEntity.ok(ApiResponse.success(detail));
    }
}
