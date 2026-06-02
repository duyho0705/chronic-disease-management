package com.project.consultation;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ConsultationService {
    private final ConsultationRequestRepository repository;

    public ConsultationRequest createRequest(ConsultationRequestDto dto) {
        ConsultationRequest request = new ConsultationRequest();
        request.setName(dto.getName());
        request.setPhone(dto.getPhone());
        request.setEmail(dto.getEmail());
        request.setClinicSize(dto.getDepartment());
        request.setDemoDate(dto.getDate());
        request.setMessage(dto.getMessage());
        
        return repository.save(request);
    }
}
