package com.project.entity;

public enum MetricType {
    BLOOD_SUGAR,
    BLOOD_PRESSURE,
    HEART_RATE,
    HBA1C,
    SPO2;

    public String getDisplayName() {
        return switch (this) {
            case BLOOD_SUGAR -> "Đường huyết";
            case BLOOD_PRESSURE -> "Huyết áp";
            case HEART_RATE -> "Nhịp tim";
            case HBA1C -> "HbA1c";
            case SPO2 -> "SpO2";
        };
    }
}
