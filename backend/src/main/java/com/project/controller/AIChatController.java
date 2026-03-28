package com.project.controller;

import com.project.dto.request.AIChatRequest;
import com.project.dto.response.AIChatResponse;
import com.project.dto.response.ApiResponse;
import com.project.dto.response.PatientAppointmentResponse;
import com.project.dto.response.PatientPrescriptionResponse;
import com.project.service.PatientAppointmentService;
import com.project.service.PatientPrescriptionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import io.agentscope.core.ReActAgent;
import io.agentscope.core.message.Msg;
import io.agentscope.core.message.MsgRole;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
@Tag(name = "AI Chat", description = "AI Assistant with Database Context")
public class AIChatController {

    private final PatientAppointmentService appointmentService;
    private final PatientPrescriptionService prescriptionService;
    
    // Sử dụng ReActAgent đã khai báo Bean ở cấu hình
    private final ReActAgent chronicAssistant;

    @PostMapping("/chat")
    @PreAuthorize("hasRole('PATIENT')")
    @Operation(summary = "Chat with AI Assistant using patient context")
    public ResponseEntity<ApiResponse<AIChatResponse>> chat(@RequestBody AIChatRequest request) {
        
        // 1. Lấy dữ liệu ngữ cảnh từ Database
        List<PatientAppointmentResponse> appointments = appointmentService.getUpcoming();
        List<PatientPrescriptionResponse> prescriptions = prescriptionService.getActivePrescriptions();

        // 2. Xây dựng Prompt chứa ngữ cảnh (Context Injection)
        StringBuilder context = new StringBuilder();
        context.append("Dưới đây là thông tin y tế hiện tại của tôi:\n");
        
        context.append("- Lịch hẹn sắp tới: ");
        if (appointments.isEmpty()) {
            context.append("Không có lịch hẹn nào.\n");
        } else {
            String apptStr = appointments.stream()
                .map(a -> String.format("%s lúc %s với bác sĩ %s", a.getAppointmentType(), a.getAppointmentTime(), a.getDoctorName()))
                .collect(Collectors.joining(", "));
            context.append(apptStr).append("\n");
        }

        context.append("- Đơn thuốc đang uống: ");
        if (prescriptions.isEmpty()) {
            context.append("Không có đơn thuốc nào.\n");
        } else {
            String presStr = prescriptions.stream()
                .map(p -> String.format("%s (Chẩn đoán: %s)", p.getPrescriptionCode(), p.getDiagnosis()))
                .collect(Collectors.joining(", "));
            context.append(presStr).append("\n");
        }

        String fullPrompt = context.toString() + "\nCâu hỏi của tôi: " + request.getMessage();

        // 3. Gọi AgentScope ReActAgent
        String aiReply = callAgentScope(fullPrompt);

        return ResponseEntity.ok(ApiResponse.success(
            "AI response retrieved",
            AIChatResponse.builder()
                .reply(aiReply)
                .agentName("ChronicAssistant")
                .build()
        ));
    }

    private String callAgentScope(String prompt) {
        // Tạo tin nhắn và gọi Agent (ReActAgent sử dụng Project Reactor nên cần .block())
        Msg userMsg = Msg.builder()
            .name("User")
            .role(MsgRole.USER)
            .textContent(prompt)
            .build();
            
        Msg response = chronicAssistant.call(userMsg).block();
        return response != null ? response.getTextContent() : "Không có phản hồi từ AI";
    }
}
