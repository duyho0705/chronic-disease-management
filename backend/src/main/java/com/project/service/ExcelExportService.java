package com.project.service;

import com.project.entity.HealthMetric;
import com.project.entity.Patient;
import com.project.repository.HealthMetricRepository;
import com.project.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.List;

import com.project.entity.MetricType;

@Service
@RequiredArgsConstructor
public class ExcelExportService {

    private final PatientRepository patientRepository;
    private final HealthMetricRepository healthMetricRepository;

    public byte[] generatePatientReport(Long userId) throws IOException {
        Patient patient = patientRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        List<HealthMetric> metrics = healthMetricRepository.findByPatientIdAndIsDeletedFalseOrderByMeasuredAtDesc(patient.getId());

        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Health Metrics");

            // Header row
            Row headerRow = sheet.createRow(0);
            String[] columns = {"Ngày Đo", "Loại Chỉ Số", "Giá Trị", "Đơn Vị", "Trạng Thái", "Ghi Chú"};
            for (int i = 0; i < columns.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columns[i]);
                CellStyle style = workbook.createCellStyle();
                Font font = workbook.createFont();
                font.setBold(true);
                style.setFont(font);
                cell.setCellStyle(style);
            }

            // Data rows
            int rowNum = 1;
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
            for (HealthMetric metric : metrics) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(metric.getMeasuredAt().format(formatter));
                row.createCell(1).setCellValue(getMetricNameVn(metric.getMetricType()));
                
                String valueStr = metric.getValue().toString();
                if (metric.getValueSecondary() != null) {
                    valueStr += "/" + metric.getValueSecondary();
                }
                row.createCell(2).setCellValue(valueStr);
                row.createCell(3).setCellValue(metric.getUnit() != null ? metric.getUnit() : "");
                row.createCell(4).setCellValue(getStatusVn(metric.getStatus()));
                row.createCell(5).setCellValue(metric.getNotes() != null ? metric.getNotes() : "");
            }

            for (int i = 0; i < columns.length; i++) {
                sheet.autoSizeColumn(i);
            }

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            return outputStream.toByteArray();
        }
    }

    private String getMetricNameVn(MetricType type) {
        if (type == null) return "";
        switch (type.name()) {
            case "BLOOD_PRESSURE": return "Huyết áp";
            case "BLOOD_SUGAR": return "Đường huyết";
            case "HEART_RATE": return "Nhịp tim";
            case "HBA1C": return "HbA1c";
            case "SPO2": return "Nồng độ Oxy (SpO2)";
            default: return type.name();
        }
    }

    private String getStatusVn(String status) {
        if (status == null) return "";
        switch (status) {
            case "NORMAL": return "Bình thường";
            case "BORDERLINE_HIGH": return "Cận cao";
            case "HIGH": return "Cao";
            case "LOW": return "Thấp";
            default: return status;
        }
    }
}
