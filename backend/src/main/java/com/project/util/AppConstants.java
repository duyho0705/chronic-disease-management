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

    // Risk Levels
    public static final String RISK_HIGH = "Nguy cơ cao";
    public static final String RISK_MEDIUM = "Nguy cơ trung bình";
    public static final String RISK_LOW = "Nguy cơ thấp";
    public static final String RISK_MONITORING = "Đang theo dõi";

    // Treatment Status
    public static final String STATUS_TREATING = "Đang điều trị";
    public static final String STATUS_STABLE = "Ổn định";
    public static final String STATUS_COMPLETED = "Kết thúc điều trị";
    public static final String STATUS_ALL = "Tất cả trạng thái";

    // Chronic Conditions
    public static final String CONDITION_HYPERTENSION = "Cao huyết áp";
    public static final String CONDITION_DIABETES = "Tiểu đường";
    public static final String CONDITION_ASTHMA = "Hen suyễn";
    public static final String CONDITION_HEART_DISEASE = "Tim mạch";
    public static final String CONDITION_KIDNEY_DISEASE = "Bệnh thận";
    public static final String CONDITION_ALL = "Tất cả bệnh lý";

    // Appointment Status
    public static final String APPT_STATUS_SCHEDULED = "SCHEDULED";
    public static final String APPT_STATUS_PENDING = "PENDING";
    public static final String APPT_STATUS_COMPLETED = "COMPLETED";
    public static final String APPT_STATUS_CANCELLED = "CANCELLED";

    // Medication Log Status
    public static final String MED_STATUS_TAKEN = "TAKEN";
    public static final String MED_STATUS_MISSED = "MISSED";
    public static final String MED_STATUS_SKIPPED = "SKIPPED";

    private AppConstants() {
        // Private constructor to prevent instantiation
    }
}
