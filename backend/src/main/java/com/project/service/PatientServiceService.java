package com.project.service;

import com.project.dto.response.ServiceSubscriptionResponse;

public interface PatientServiceService {
    ServiceSubscriptionResponse subscribeToService(Long serviceId);
    void cancelSubscription();
    ServiceSubscriptionResponse getCurrentSubscription();
}
