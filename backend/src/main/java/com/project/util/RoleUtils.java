package com.project.util;

import java.util.HashMap;
import java.util.Map;

/**
 * Utility class for User Roles management
 */
public class RoleUtils {
    
    // Role Constants
    public static final String ADMIN = "ADMIN";
    public static final String CLINIC_MANAGER = "CLINIC_MANAGER";
    public static final String DOCTOR = "DOCTOR";
    public static final String PATIENT = "PATIENT";
    
    // Mapping for display labels in Vietnamese
    private static final Map<String, String> ROLE_LABELS = new HashMap<>();
    
    static {
        ROLE_LABELS.put(ADMIN, "Quản trị viên hệ thống");
        ROLE_LABELS.put(CLINIC_MANAGER, "Quản lý phòng khám");
        ROLE_LABELS.put(DOCTOR, "Bác sĩ");
        ROLE_LABELS.put(PATIENT, "Bệnh nhân");
    }
    
    /**
     * Get Vietnamese label for a role key
     * @param role The role constant (e.g., "DOCTOR")
     * @return Vietnamese label (e.g., "Bác sĩ") or the role itself if not found
     */
    public static String getRoleLabel(String role) {
        if (role == null) return "N/A";
        return ROLE_LABELS.getOrDefault(role.toUpperCase(), role);
    }
    
    /**
     * Check if a string is a valid role
     */
    public static boolean isValidRole(String role) {
        if (role == null) return false;
        return ROLE_LABELS.containsKey(role.toUpperCase());
    }
    
    /**
     * Get all role keys
     */
    public static Map<String, String> getAllRoles() {
        return new HashMap<>(ROLE_LABELS);
    }
    
    private RoleUtils() {
        // Prevent instantiation
    }
}
