package com.project.service;

public interface ZaloService {
    void sendMessage(String phoneNumber, String message);
    void sendZNS(String phoneNumber, String templateId, Object templateData);
    void refreshAccessToken();
}
