package com.project.util;

public class AppConstants {
    // Database defaults
    public static final String DEFAULT_PAGE_NUMBER = "0";
    public static final String DEFAULT_PAGE_SIZE = "10";
    public static final String DEFAULT_SORT_BY = "createdAt";
    public static final String DEFAULT_SORT_DIRECTION = "DESC";

    // Date/Time Formats
    public static final String DATE_FORMAT = "dd/MM/yyyy";
    public static final String DATE_TIME_FORMAT = "dd/MM/yyyy HH:mm:ss";
    
    // Roles
    public static final String ROLE_ADMIN = "ADMIN";
    public static final String ROLE_DOCTOR = "DOCTOR";
    public static final String ROLE_PATIENT = "PATIENT";
    public static final String ROLE_CLINIC_MANAGER = "CLINIC_MANAGER";
    
    // Auth
    public static final String TOKEN_TYPE = "Bearer ";
    public static final String AUTH_HEADER = "Authorization";

    private AppConstants() {
        // Private constructor to prevent instantiation
    }
}
