package com.project.controller;

import com.project.dto.request.CreateAppointmentRequest;
import com.project.dto.response.ApiResponse;
import com.project.dto.response.PatientAppointmentResponse;
import com.project.service.PatientAppointmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/patient/appointments")
@RequiredArgsConstructor
@PreAuthorize("hasRole('PATIENT')")
@Tag(name = "Patient Appointments", description = "Patient appointment management APIs")
public class PatientAppointmentController {

    private final PatientAppointmentService service;

    @PostMapping
    @Operation(summary = "Book a new appointment")
    public ResponseEntity<ApiResponse<PatientAppointmentResponse>> create(
            @Valid @RequestBody CreateAppointmentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Appointment created successfully", service.create(request)));
    }

    @GetMapping("/upcoming")
    @Operation(summary = "Get upcoming appointments")
    public ResponseEntity<ApiResponse<List<PatientAppointmentResponse>>> getUpcoming() {
        return ResponseEntity.ok(ApiResponse.success(
                "Upcoming appointments retrieved", service.getUpcoming()));
    }

    @GetMapping("/history")
    @Operation(summary = "Get appointment history (paginated)")
    public ResponseEntity<ApiResponse<Page<PatientAppointmentResponse>>> getHistory(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(
                "Appointment history retrieved", service.getHistory(pageable)));
    }

    @PutMapping("/{id}/cancel")
    @Operation(summary = "Cancel an appointment")
    public ResponseEntity<ApiResponse<Void>> cancel(@PathVariable Long id) {
        service.cancel(id);
        return ResponseEntity.ok(ApiResponse.success("Appointment cancelled successfully", null));
    }
}
