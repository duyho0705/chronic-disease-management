package com.project.config;

import io.agentscope.core.ReActAgent;
import io.agentscope.core.model.Model;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AgentScopeConfig {

    @Bean
    public ReActAgent chronicAssistant(Model model) {
        // model được Spring Boot tự động inject dựa trên cấu hình model-configs trong application.yml
        return ReActAgent.builder()
            .name("ChronicAssistant")
            .model(model)
            .sysPrompt("Bạn là trợ lý y tế thông minh cho người bệnh mãn tính. Hãy trả lời dựa trên ngữ cảnh y tế (lịch hẹn, đơn thuốc) được cung cấp.")
            .build();
    }
}
