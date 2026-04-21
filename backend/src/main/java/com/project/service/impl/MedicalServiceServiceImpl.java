package com.project.service.impl;

import com.project.entity.MedicalService;
import com.project.repository.MedicalServiceRepository;
import com.project.service.AuditService;
import com.project.service.MedicalServiceService;
import com.project.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Objects;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MedicalServiceServiceImpl implements MedicalServiceService {

    private final MedicalServiceRepository medicalServiceRepository;
    private final AuditService auditService;

    @Override
    public List<MedicalService> getAllServices() {
        return medicalServiceRepository.findAll();
    }

    @Override
    public MedicalService getServiceById(Long id) {
        return medicalServiceRepository.findById(Objects.requireNonNull(id))
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dịch vụ với id: " + id));
    }

    @Override
    @Transactional
    public MedicalService createService(MedicalService service) {
        MedicalService saved = medicalServiceRepository.save(Objects.requireNonNull(service));
        recordActivity("Thêm", "Dịch vụ", "Đã khởi tạo dịch vụ: " + saved.getName(), "success");
        return saved;
    }

    @Override
    @Transactional
    public MedicalService updateService(Long id, MedicalService service) {
        MedicalService existing = getServiceById(id);
        existing.setName(service.getName());
        existing.setCategory(service.getCategory());
        existing.setPrice(service.getPrice());
        existing.setDuration(service.getDuration());
        existing.setDescription(service.getDescription());
        existing.setStatus(service.getStatus());
        existing.setFeatures(service.getFeatures());
        
        MedicalService updated = medicalServiceRepository.save(existing);
        recordActivity("Cập nhật", "Dịch vụ", "Đã cập nhật dịch vụ: " + updated.getName(), "info");
        return updated;
    }

    @Override
    @Transactional
    public void deleteService(Long id) {
        MedicalService service = getServiceById(id);
        medicalServiceRepository.delete(Objects.requireNonNull(service));
        recordActivity("Xóa", "Dịch vụ", "Đã xóa dịch vụ: " + service.getName(), "danger");
    }

    @Override
    @Transactional
    public MedicalService toggleStatus(Long id) {
        MedicalService service = getServiceById(id);
        String newStatus = "Đang kinh doanh".equals(service.getStatus()) ? "Ngừng kinh doanh" : "Đang kinh doanh";
        service.setStatus(newStatus);
        MedicalService updated = medicalServiceRepository.save(service);
        recordActivity("Chuyển trạng thái", "Dịch vụ", "Đã chuyển dịch vụ " + updated.getName() + " sang " + newStatus, "warning");
        return updated;
    }

    private void recordActivity(String action, String module, String details, String status) {
        Long userId = 1L;
        String userName = "Hệ thống";
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.getPrincipal() instanceof CustomUserDetails) {
                CustomUserDetails user = (CustomUserDetails) auth.getPrincipal();
                userId = user.getId();
                userName = user.getFullName();
            }
        } catch (Exception ignored) {}
        auditService.recordActivity(userId, userName, action, module, details, status);
    }
}
