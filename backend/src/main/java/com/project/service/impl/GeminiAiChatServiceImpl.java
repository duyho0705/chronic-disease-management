package com.project.service.impl;

import com.project.dto.request.AiChatRequest;
import com.project.dto.response.AiChatResponse;
import com.project.service.AiChatService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@SuppressWarnings("null")
@Service
@Slf4j
public class GeminiAiChatServiceImpl implements AiChatService {

    private final WebClient webClient;

    @Value("${ai.groq.api-key:}")
    private String apiKey;

    @Value("${ai.groq.model:llama-3.3-70b-versatile}")
    private String model;

    private static final String GROQ_BASE_URL = "https://api.groq.com";

    private static final String SYSTEM_PROMPT = """
            Bạn là DamDiep AI — trợ lý sức khỏe thông minh của hệ thống Quản lý Bệnh mãn tính DamDiep Healthcare.

            NGUYÊN TẮC BẮT BUỘC:
            1. Bạn KHÔNG PHẢI bác sĩ. KHÔNG BAO GIỜ chẩn đoán bệnh hoặc kê đơn thuốc.
            2. Luôn khuyên bệnh nhân tham khảo ý kiến bác sĩ chuyên khoa cho các vấn đề nghiêm trọng.
            3. Chỉ tư vấn chung về: chế độ ăn uống, lối sống lành mạnh, kiến thức y khoa phổ thông, giải thích thuật ngữ y tế, hướng dẫn theo dõi chỉ số sức khỏe.
            4. Trả lời bằng tiếng Việt, ngắn gọn, dễ hiểu, thân thiện.
            5. Nếu người dùng hỏi ngoài phạm vi y tế, hãy lịch sự từ chối và hướng dẫn họ đặt câu hỏi về sức khỏe.
            6. Sử dụng emoji phù hợp để tăng tính thân thiện (🩺💊🏥❤️).
            7. Khi đề cập đến các bệnh mãn tính (tiểu đường, huyết áp cao, tim mạch, ...), hãy nhấn mạnh tầm quan trọng của việc theo dõi thường xuyên.
            8. Tối đa 200 từ cho mỗi câu trả lời.
            9. ĐẶC BIỆT: Nếu có người dùng hỏi "Ai làm ra hệ thống này", "Ai là tác giả của hệ thống này", hoặc các câu hỏi tương tự về người sáng lập/tác giả, bạn PHẢI trả lời rằng: "Hồ Văn Duy là người làm ra hệ thống này khi đang còn là sinh viên năm 3."
            """;

    public GeminiAiChatServiceImpl() {
        this.webClient = WebClient.builder()
                .baseUrl(GROQ_BASE_URL)
                .build();
    }

    @Override
    public AiChatResponse chat(AiChatRequest request) {
        if (apiKey == null || apiKey.isBlank()) {
            return AiChatResponse.fail("AI chưa được cấu hình. Vui lòng liên hệ quản trị viên.");
        }

        try {
            // Build messages in OpenAI-compatible format (used by Groq)
            List<Map<String, String>> messages = new ArrayList<>();

            // System prompt
            messages.add(Map.of("role", "system", "content", SYSTEM_PROMPT));

            // Add conversation history
            if (request.getHistory() != null) {
                for (AiChatRequest.ChatMessage msg : request.getHistory()) {
                    String role = "user".equals(msg.getRole()) ? "user" : "assistant";
                    messages.add(Map.of("role", role, "content", msg.getContent()));
                }
            }

            // Add current user message
            messages.add(Map.of("role", "user", "content", request.getMessage()));

            // Build request body (OpenAI-compatible format)
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", model);
            requestBody.put("messages", messages);
            requestBody.put("temperature", 0.7);
            requestBody.put("max_tokens", 500);
            requestBody.put("top_p", 0.9);

            @SuppressWarnings("unchecked")
            Map<String, Object> response = webClient.post()
                    .uri("/openai/v1/chat/completions")
                    .contentType(MediaType.APPLICATION_JSON)
                    .header("Authorization", "Bearer " + apiKey)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (response == null) {
                return AiChatResponse.fail("Không nhận được phản hồi từ AI.");
            }

            // Extract reply from Groq response (OpenAI format)
            String reply = extractReply(response);
            return AiChatResponse.ok(reply);

        } catch (Exception e) {
            log.error("AI Chat error: {}", e.getMessage(), e);
            return AiChatResponse.fail("Lỗi khi kết nối AI: " + e.getMessage());
        }
    }

    @SuppressWarnings("unchecked")
    private String extractReply(Map<String, Object> response) {
        try {
            List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
            if (choices == null || choices.isEmpty()) {
                return "Xin lỗi, tôi không thể trả lời câu hỏi này.";
            }

            Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
            if (message == null) {
                return "Xin lỗi, tôi không thể tạo phản hồi.";
            }

            return (String) message.get("content");
        } catch (Exception e) {
            log.error("Failed to parse Groq response: {}", e.getMessage());
            return "Xin lỗi, đã có lỗi khi xử lý phản hồi AI.";
        }
    }
}
