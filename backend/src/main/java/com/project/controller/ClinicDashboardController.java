package com.project.controller;

import com.project.dto.request.CreatePatientRequest;
import com.project.dto.request.CreateDoctorRequest;
import com.project.dto.response.ApiResponse;
import com.project.dto.response.ClinicDashboardResponse;
import com.project.dto.response.ClinicPatientResponse;
import com.project.dto.response.ClinicDoctorResponse;
import com.project.service.ClinicDashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import jakarta.validation.Valid;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import com.project.security.CustomUserDetails;
import org.springframework.security.access.AccessDeniedException;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import com.project.dto.response.DoctorSnippetDto;

@RestController
@RequestMapping("/api/v1/clinics/{clinicId}")
@RequiredArgsConstructor
@Tag(name = "Clinic Management", description = "APIs for clinic managers")
@PreAuthorize("hasAnyRole('CLINIC_MANAGER', 'ADMIN')")
public class ClinicDashboardController {

    private final ClinicDashboardService clinicDashboardService;

    private void validateClinicAccess(Long pathClinicId) {
        CustomUserDetails user = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        // System Admins (ADMIN) can access any clinic
        if ("ADMIN".equals(user.getRole())) {
            return;
        }
        if (!user.getClinicId().equals(pathClinicId)) {
            throw new AccessDeniedException("You do not have permission to access data from this clinic");
        }
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Get clinic dashboard", description = "Returns statistics for the specified clinic")
    public ApiResponse<ClinicDashboardResponse> getDashboard(@PathVariable Long clinicId) {
        validateClinicAccess(clinicId);
        return ApiResponse.success("Dashboard info fetched", clinicDashboardService.getDashboardData(clinicId));
    }

    @GetMapping("/patients")
    @Operation(summary = "Get patients", description = "Returns active patient records for the specified clinic")
    public ApiResponse<Page<ClinicPatientResponse>> getPatients(
            @PathVariable Long clinicId,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String condition,
            @RequestParam(required = false) String riskLevel,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        validateClinicAccess(clinicId);
        Pageable pageable = PageRequest.of(page, size);
        return ApiResponse.success("Patients fetched",
                clinicDashboardService.getPatientRecords(clinicId, keyword, condition, riskLevel, status, pageable));
    }

    @PostMapping("/patients")
    @Operation(summary = "Add patient", description = "Registers a new patient for the specified clinic")
    public ApiResponse<Void> createPatient(@PathVariable Long clinicId,
            @Valid @RequestBody CreatePatientRequest request) {
        validateClinicAccess(clinicId);
        clinicDashboardService.createPatient(clinicId, request);
        return ApiResponse.success("Patient registered successfully", null);
    }

    @PutMapping("/patients/{patientId}")
    @Operation(summary = "Update patient", description = "Updates patient record")
    public ApiResponse<Void> updatePatient(@PathVariable Long clinicId, @PathVariable Long patientId,
            @Valid @RequestBody CreatePatientRequest request) {
        validateClinicAccess(clinicId);
        clinicDashboardService.updatePatient(clinicId, patientId, request);
        return ApiResponse.success("Patient updated successfully", null);
    }

    @DeleteMapping("/patients/{patientId}")
    @Operation(summary = "Delete patient", description = "Deletes patient record")
    public ApiResponse<Void> deletePatient(@PathVariable Long clinicId, @PathVariable Long patientId) {
        validateClinicAccess(clinicId);
        clinicDashboardService.deletePatient(clinicId, patientId);
        return ApiResponse.success("Patient deleted successfully", null);
    }

    @GetMapping("/doctors")
    @Operation(summary = "Get doctors", description = "Returns active doctor records for the specified clinic")
    public ApiResponse<Page<ClinicDoctorResponse>> getDoctors(
            @PathVariable Long clinicId,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        validateClinicAccess(clinicId);
        Pageable pageable = PageRequest.of(page, size);
        return ApiResponse.success("Doctors fetched",
                clinicDashboardService.getDoctorRecords(clinicId, keyword, pageable));
    }

    @PostMapping("/doctors")
    @Operation(summary = "Add doctor", description = "Registers a new doctor for the specified clinic")
    public ApiResponse<Void> createDoctor(@PathVariable Long clinicId,
            @Valid @RequestBody CreateDoctorRequest request) {
        validateClinicAccess(clinicId);
        clinicDashboardService.createDoctor(clinicId, request);
        return ApiResponse.success("Doctor registered successfully", null);
    }

    @PutMapping("/doctors/{doctorId}")
    @Operation(summary = "Update doctor", description = "Updates doctor record")
    public ApiResponse<Void> updateDoctor(@PathVariable Long clinicId, @PathVariable Long doctorId,
            @Valid @RequestBody CreateDoctorRequest request) {
        validateClinicAccess(clinicId);
        clinicDashboardService.updateDoctor(clinicId, doctorId, request);
        return ApiResponse.success("Doctor updated successfully", null);
    }

    @DeleteMapping("/doctors/{doctorId}")
    @Operation(summary = "Delete doctor", description = "Deletes doctor record (Soft delete)")
    public ApiResponse<Void> deleteDoctor(@PathVariable Long clinicId, @PathVariable Long doctorId) {
        validateClinicAccess(clinicId);
        clinicDashboardService.deleteDoctor(clinicId, doctorId);
        return ApiResponse.success("Doctor deleted successfully", null);
    }

    @GetMapping("/doctors/available")
    public ApiResponse<List<DoctorSnippetDto>> getAvailableDoctors(@PathVariable Long clinicId) {
        validateClinicAccess(clinicId);
        return ApiResponse.success("Doctors fetched successfully",
                clinicDashboardService.getAvailableDoctors(clinicId));
    }

    @GetMapping("/conditions")
    public ApiResponse<List<String>> getConditions(@PathVariable Long clinicId) {
        validateClinicAccess(clinicId);
        return ApiResponse.success("Conditions fetched successfully", clinicDashboardService.getChronicConditions());
    }
}
