package com.project.service.impl;

import com.project.service.ZaloService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class ZaloServiceImpl implements ZaloService {

    // Note: Zalo OA integration requires an OA ID, Access Token, and approved templates (ZNS).
    // This is a mock implementation as requested.

    @Override
    public void sendMessage(String phoneNumber, String message) {
        log.info("========== MOCK ZALO MESSAGE ==========");
        log.info("To: {}", phoneNumber);
        log.info("Message: {}", message);
        log.info("=======================================");
    }

    @Override
    public void sendZNS(String phoneNumber, String templateId, Object templateData) {
        log.info("========== MOCK ZALO ZNS ==========");
        log.info("To: {}", phoneNumber);
        log.info("Template ID: {}", templateId);
        log.info("Data: {}", templateData);
        log.info("===================================");
    }
}
