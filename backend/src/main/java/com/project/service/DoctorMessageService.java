package com.project.service;

import com.project.dto.request.SendMessageRequest;
import com.project.dto.response.ConversationResponse;
import com.project.dto.response.MessageResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface DoctorMessageService {

    List<ConversationResponse> getConversations();

    Page<MessageResponse> getMessages(Long conversationId, Pageable pageable);

    MessageResponse sendMessage(SendMessageRequest request);

    void markAsRead(Long conversationId);
}
