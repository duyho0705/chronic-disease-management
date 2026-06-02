package com.project.consultation;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/v1/consultations")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ConsultationController {
    private final ConsultationService service;

    @PostMapping
    public ResponseEntity<?> submitRequest(@Valid @RequestBody ConsultationRequestDto dto) {
        service.createRequest(dto);
        return ResponseEntity.ok(Map.of("message", "Đăng ký thành công!"));
    }
}
