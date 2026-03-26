package com.project.controller;

import com.project.dto.request.SendMessageRequest;
import com.project.dto.response.ApiResponse;
import com.project.dto.response.ConversationResponse;
import com.project.dto.response.MessageResponse;
import com.project.service.PatientMessageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/patient/messages")
@RequiredArgsConstructor
@PreAuthorize("hasRole('PATIENT')")
@Tag(name = "Patient Messages", description = "Patient-Doctor messaging APIs")
public class PatientMessageController {

    private final PatientMessageService service;

    @GetMapping("/conversations")
    @Operation(summary = "Get all conversations")
    public ResponseEntity<ApiResponse<List<ConversationResponse>>> getConversations() {
        return ResponseEntity.ok(ApiResponse.success(
                "Conversations retrieved successfully", service.getConversations()));
    }

    @GetMapping("/conversations/{id}/messages")
    @Operation(summary = "Get messages in a conversation")
    public ResponseEntity<ApiResponse<Page<MessageResponse>>> getMessages(
            @PathVariable Long id, Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(
                "Messages retrieved successfully", service.getMessages(id, pageable)));
    }

    @PostMapping("/send")
    @Operation(summary = "Send a message")
    public ResponseEntity<ApiResponse<MessageResponse>> send(
            @Valid @RequestBody SendMessageRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                "Message sent successfully", service.sendMessage(request)));
    }

    @PutMapping("/conversations/{id}/read")
    @Operation(summary = "Mark messages as read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(@PathVariable Long id) {
        service.markAsRead(id);
        return ResponseEntity.ok(ApiResponse.success("Messages marked as read", null));
    }
}
