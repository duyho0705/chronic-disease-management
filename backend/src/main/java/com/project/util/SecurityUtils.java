package com.project.util;

import com.project.security.CustomUserDetails;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class SecurityUtils {

    /**
     * Get the ID of the currently logged-in user.
     */
    public static Optional<Long> getCurrentUserId() {
        return getCurrentUserDetails().map(CustomUserDetails::getId);
    }

    /**
     * Get the email of the currently logged-in user.
     */
    public static Optional<String> getCurrentUserEmail() {
        return getCurrentUserDetails().map(CustomUserDetails::getEmail);
    }

    /**
     * Get the full CustomUserDetails object from the security context.
     */
    public static Optional<CustomUserDetails> getCurrentUserDetails() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails) {
            return Optional.of((CustomUserDetails) authentication.getPrincipal());
        }
        return Optional.empty();
    }
}
