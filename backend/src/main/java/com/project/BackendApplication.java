package com.project;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.core.JdbcTemplate;
import lombok.extern.slf4j.Slf4j;

@SpringBootApplication
@Slf4j
public class BackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

    @Bean
    public CommandLineRunner initSchema(JdbcTemplate jdbcTemplate) {
        return args -> {
            try {
                // Ensure there is at least one patient for development testing
                Integer patientCount = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM patients", Integer.class);
                if (patientCount == null || patientCount == 0) {
                    log.info("No patients found. Seeding a mock patient for development bypass...");
                    jdbcTemplate.execute("INSERT INTO users (email, password, role, full_name, status, created_at, is_deleted) VALUES ('mock@patient.com', 'password', 'PATIENT', 'Bệnh nhân Test', 'ACTIVE', NOW(), false)");
                    Long userId = jdbcTemplate.queryForObject("SELECT id FROM users WHERE email = 'mock@patient.com' LIMIT 1", Long.class);
                    jdbcTemplate.execute("INSERT INTO patients (user_id, full_name, phone, gender, created_at, is_deleted) VALUES (" + userId + ", 'Bệnh nhân Test', '0123456789', 'MALE', NOW(), false)");
                    log.info("Mock patient seeded successfully.");
                } else {
                    log.info("Database has {} patients. Skipping mock seed.", patientCount);
                }
            } catch (Exception e) {
                log.warn("Auto-seeder failed: {}", e.getMessage());
            }
        };
    }
}
