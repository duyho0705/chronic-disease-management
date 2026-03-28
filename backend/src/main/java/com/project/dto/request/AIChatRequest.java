package com.project.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AIChatRequest {
    @NotBlank(message = "Message content cannot be empty")
    private String message;
}
