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
                log.info("Executing database schema migration: Altering image_url to TEXT...");
                jdbcTemplate.execute("ALTER TABLE clinics ALTER COLUMN image_url TYPE TEXT");
                log.info("Migration successful: clinics.image_url is now TEXT.");
            } catch (Exception e) {
                log.warn("Migration skipped or failed: {}. (Wait, maybe it's already TEXT?)", e.getMessage());
            }
        };
    }
}
