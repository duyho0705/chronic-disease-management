package com.project.service.impl;

import com.project.service.ZaloService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import jakarta.annotation.PostConstruct;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
public class ZaloServiceImpl implements ZaloService {

    @Value("${zalo.oa.app-id:}")
    private String appId;

    @Value("${zalo.oa.app-secret:}")
    private String appSecret;

    @Value("${zalo.oa.access-token:}")
    private String accessToken;

    @Value("${zalo.oa.refresh-token:}")
    private String refreshToken;

    private final WebClient oaClient;
    private final WebClient znsClient;
    private final WebClient oauthClient;

    // Runtime token storage (refreshed automatically)
    private String currentAccessToken;

    // Zalo API Base URLs
    private static final String OA_API_BASE = "https://openapi.zalo.me";
    private static final String ZNS_API_BASE = "https://business.openapi.zalo.me";
    private static final String OAUTH_BASE = "https://oauth.zaloapp.com";

    public ZaloServiceImpl() {
        this.oaClient = WebClient.builder().baseUrl(OA_API_BASE).build();
        this.znsClient = WebClient.builder().baseUrl(ZNS_API_BASE).build();
        this.oauthClient = WebClient.builder().baseUrl(OAUTH_BASE).build();
    }

    @PostConstruct
    private void init() {
        this.currentAccessToken = this.accessToken;
        if (isConfigured()) {
            log.info("✅ Zalo OA Service initialized with App ID: {}", appId);
        } else {
            log.warn("⚠️ Zalo OA Service is NOT configured. Zalo messages will be logged only (mock mode).");
        }
    }

    private boolean isConfigured() {
        return appId != null && !appId.isBlank()
                && !appId.equals("your_app_id")
                && currentAccessToken != null && !currentAccessToken.isBlank()
                && !currentAccessToken.equals("your_access_token");
    }

    /**
     * Gửi tin tư vấn (Consulting Message) qua Zalo OA API v3
     * Endpoint: POST https://openapi.zalo.me/v3.0/oa/message/cs
     * 
     * Lưu ý: Chỉ gửi được cho user đã follow OA
     * Nếu gửi bằng số điện thoại, cần chuyển sang user_id trước
     */
    @Override
    public void sendMessage(String phoneNumber, String message) {
        if (!isConfigured()) {
            logMockMessage(phoneNumber, message);
            return;
        }

        try {
            // Zalo OA API sử dụng user_id (không phải phone number trực tiếp)
            // Trong thực tế, cần mapping phone -> Zalo user_id qua OA follower list
            // Ở đây ta gửi trực tiếp nếu phoneNumber chính là user_id
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("recipient", Map.of("user_id", phoneNumber));
            requestBody.put("message", Map.of("text", message));

            @SuppressWarnings("unchecked")
            Map<String, Object> response = oaClient.post()
                    .uri("/v3.0/oa/message/cs")
                    .contentType(MediaType.APPLICATION_JSON)
                    .header("access_token", currentAccessToken)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (response != null) {
                int errorCode = getErrorCode(response);
                if (errorCode == 0) {
                    log.info("✅ Zalo message sent successfully to: {}", phoneNumber);
                } else if (errorCode == -216) {
                    // Token expired → refresh and retry
                    log.warn("⚠️ Zalo access token expired. Refreshing...");
                    refreshAccessToken();
                    retrySendMessage(phoneNumber, message);
                } else if (errorCode == -213) {
                    log.warn("⚠️ Zalo user {} has not followed the OA. Message not delivered.", phoneNumber);
                } else {
                    log.error("❌ Zalo API error {}: {}", errorCode, response.get("message"));
                }
            }

        } catch (WebClientResponseException e) {
            log.error("❌ Zalo API HTTP error: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
        } catch (Exception e) {
            log.error("❌ Failed to send Zalo message to {}: {}", phoneNumber, e.getMessage());
        }
    }

    /**
     * Gửi tin ZNS (Zalo Notification Service)
     * Endpoint: POST https://business.openapi.zalo.me/message/template
     * 
     * Dùng cho: nhắc lịch tái khám, nhắc uống thuốc, thông báo kết quả
     * Yêu cầu: Tài khoản ZCA có số dư + Template đã được Zalo phê duyệt
     */
    @Override
    @SuppressWarnings("unchecked")
    public void sendZNS(String phoneNumber, String templateId, Object templateData) {
        if (!isConfigured()) {
            logMockZNS(phoneNumber, templateId, templateData);
            return;
        }

        try {
            // Chuẩn hóa số điện thoại sang định dạng quốc tế (84...)
            String formattedPhone = formatPhoneNumber(phoneNumber);

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("phone", formattedPhone);
            requestBody.put("template_id", templateId);
            requestBody.put("template_data", templateData);

            Map<String, Object> response = znsClient.post()
                    .uri("/message/template")
                    .contentType(MediaType.APPLICATION_JSON)
                    .header("access_token", currentAccessToken)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (response != null) {
                int errorCode = getErrorCode(response);
                if (errorCode == 0) {
                    log.info("✅ ZNS sent successfully to: {} (template: {})", phoneNumber, templateId);
                } else if (errorCode == -216) {
                    log.warn("⚠️ Zalo access token expired. Refreshing...");
                    refreshAccessToken();
                    retrySendZNS(phoneNumber, templateId, templateData);
                } else if (errorCode == -321) {
                    log.error("❌ ZNS error: ZCA account has insufficient balance (hết số dư).");
                } else {
                    log.error("❌ ZNS error {}: {}", errorCode, response.get("message"));
                }
            }

        } catch (WebClientResponseException e) {
            log.error("❌ ZNS API HTTP error: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
        } catch (Exception e) {
            log.error("❌ Failed to send ZNS to {}: {}", phoneNumber, e.getMessage());
        }
    }

    /**
     * Làm mới Access Token khi hết hạn
     * Endpoint: POST https://oauth.zaloapp.com/v4/oa/access_token
     */
    @Override
    @SuppressWarnings("unchecked")
    public void refreshAccessToken() {
        if (refreshToken == null || refreshToken.isBlank() || refreshToken.equals("your_refresh_token")) {
            log.error("❌ Cannot refresh Zalo token: refresh_token is not configured.");
            return;
        }

        try {
            Map<String, Object> response = oauthClient.post()
                    .uri("/v4/oa/access_token")
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .header("secret_key", appSecret)
                    .bodyValue("refresh_token=" + refreshToken
                            + "&app_id=" + appId
                            + "&grant_type=refresh_token")
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (response != null && response.containsKey("access_token")) {
                this.currentAccessToken = (String) response.get("access_token");
                String newRefreshToken = (String) response.get("refresh_token");
                if (newRefreshToken != null) {
                    this.refreshToken = newRefreshToken;
                }
                log.info("✅ Zalo access token refreshed successfully.");
            } else {
                log.error("❌ Failed to refresh Zalo token. Response: {}", response);
            }

        } catch (Exception e) {
            log.error("❌ Error refreshing Zalo access token: {}", e.getMessage());
        }
    }

    // ==================== Helper Methods ====================

    private void retrySendMessage(String phoneNumber, String message) {
        try {
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("recipient", Map.of("user_id", phoneNumber));
            requestBody.put("message", Map.of("text", message));

            oaClient.post()
                    .uri("/v3.0/oa/message/cs")
                    .contentType(MediaType.APPLICATION_JSON)
                    .header("access_token", currentAccessToken)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();
            log.info("✅ Zalo message retry sent successfully to: {}", phoneNumber);
        } catch (Exception e) {
            log.error("❌ Zalo message retry failed for {}: {}", phoneNumber, e.getMessage());
        }
    }

    @SuppressWarnings("unchecked")
    private void retrySendZNS(String phoneNumber, String templateId, Object templateData) {
        try {
            String formattedPhone = formatPhoneNumber(phoneNumber);
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("phone", formattedPhone);
            requestBody.put("template_id", templateId);
            requestBody.put("template_data", templateData);

            znsClient.post()
                    .uri("/message/template")
                    .contentType(MediaType.APPLICATION_JSON)
                    .header("access_token", currentAccessToken)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();
            log.info("✅ ZNS retry sent successfully to: {} (template: {})", phoneNumber, templateId);
        } catch (Exception e) {
            log.error("❌ ZNS retry failed for {}: {}", phoneNumber, e.getMessage());
        }
    }

    /**
     * Chuyển đổi số điện thoại Việt Nam sang định dạng quốc tế
     * VD: 0987654321 → 84987654321
     */
    private String formatPhoneNumber(String phone) {
        if (phone == null) return "";
        phone = phone.replaceAll("[^0-9]", "");
        if (phone.startsWith("0")) {
            return "84" + phone.substring(1);
        }
        if (phone.startsWith("+84")) {
            return phone.substring(1);
        }
        return phone;
    }

    @SuppressWarnings("unchecked")
    private int getErrorCode(Map<String, Object> response) {
        Object error = response.get("error");
        if (error instanceof Number) {
            return ((Number) error).intValue();
        }
        return -1;
    }

    // ==================== Mock Fallback (khi chưa cấu hình) ====================

    private void logMockMessage(String phoneNumber, String message) {
        log.info("========== MOCK ZALO MESSAGE (chưa cấu hình Zalo OA) ==========");
        log.info("To: {}", phoneNumber);
        log.info("Message: {}", message);
        log.info("================================================================");
    }

    private void logMockZNS(String phoneNumber, String templateId, Object templateData) {
        log.info("========== MOCK ZALO ZNS (chưa cấu hình Zalo OA) ==========");
        log.info("To: {}", phoneNumber);
        log.info("Template ID: {}", templateId);
        log.info("Data: {}", templateData);
        log.info("=============================================================");
    }
}
