-- SEED DATA for Patient Portal
-- 0. Ensure columns exist before data load (fixing cached plan mismatch)
ALTER TABLE patients ADD COLUMN IF NOT EXISTS medical_history TEXT;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS allergies TEXT;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS doctor_id INTEGER;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS treatment_status TEXT;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS risk_level TEXT;

-- users columns
ALTER TABLE users ADD COLUMN IF NOT EXISTS specialization TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS department TEXT;

-- 1. Create Sample Users (Admin, Manager, Doctors, Patients)
INSERT INTO users (email, password, full_name, phone, role, status, clinic_id, is_deleted, created_at)
VALUES 
('admin@care.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMne.9Lb8sY.', 'Hùng Admin', '0888999000', 'ADMIN', 'ACTIVE', NULL, FALSE, CURRENT_TIMESTAMP),
('manager@care.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMne.9Lb8sY.', 'Dr. Manager', '0999888777', 'CLINIC_MANAGER', 'ACTIVE', 1, FALSE, CURRENT_TIMESTAMP),
('mai.le@care.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMne.9Lb8sY.', 'Lê Thị Mai', '0911222333', 'DOCTOR', 'ACTIVE', 1, FALSE, CURRENT_TIMESTAMP),
('hung.nguyen@care.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMne.9Lb8sY.', 'Nguyễn Văn Hùng', '0922333444', 'DOCTOR', 'ACTIVE', 1, FALSE, CURRENT_TIMESTAMP),
('van.tran@care.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMne.9Lb8sY.', 'Trần Thanh Vân', '0933444555', 'DOCTOR', 'ACTIVE', 1, FALSE, CURRENT_TIMESTAMP),
('truongquocan@patient.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMne.9Lb8sY.', 'Trương Quốc An', '0359891652', 'PATIENT', 'ACTIVE', 1, FALSE, CURRENT_TIMESTAMP),
('truonghue@patient.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMne.9Lb8sY.', 'Trương Đình Huệ', '0359891653', 'PATIENT', 'ACTIVE', 1, FALSE, CURRENT_TIMESTAMP),
('tolam@gmail.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMne.9Lb8sY.', 'Tô Lâm', '0359891654', 'PATIENT', 'ACTIVE', 1, FALSE, CURRENT_TIMESTAMP)
ON CONFLICT (email) DO UPDATE SET 
    password = EXCLUDED.password,
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name;

-- 2. Create corresponding Patient records for Clinic 1
INSERT INTO patients (user_id, clinic_id, full_name, phone, email, gender, date_of_birth, address, patient_code, doctor_id, joined_date, chronic_condition, treatment_status, risk_level, is_deleted, created_at)
VALUES 
((SELECT id FROM users WHERE email = 'truongquocan@patient.com' LIMIT 1), 1, 'Trương Quốc An', '0359891652', 'truongquocan@patient.com', 'MALE', '1990-01-01', 'Hà Nội', 'BN-DUC-001', (SELECT id FROM users WHERE email = 'mai.le@care.com' LIMIT 1), CURRENT_DATE, 'Tiểu đường Type 2', 'Đang điều trị', 'Nguy cơ cao', FALSE, CURRENT_TIMESTAMP),
((SELECT id FROM users WHERE email = 'truonghue@patient.com' LIMIT 1), 1, 'Trương Đình Huệ', '0359891653', 'truonghue@patient.com', 'MALE', '1985-05-05', 'Đà Nẵng', 'BN-DUC-002', (SELECT id FROM users WHERE email = 'hung.nguyen@care.com' LIMIT 1), CURRENT_DATE, 'Cao huyết áp', 'Ổn định', 'Bình thường', FALSE, CURRENT_TIMESTAMP),
((SELECT id FROM users WHERE email = 'tolam@gmail.com' LIMIT 1), 1, 'Tô Lâm', '0359891654', 'tolam@gmail.com', 'MALE', '1970-10-10', 'TP. HCM', 'BN-DUC-003', (SELECT id FROM users WHERE email = 'van.tran@care.com' LIMIT 1), CURRENT_DATE, 'Bệnh tim mạch', 'Đang theo dõi', 'Đang theo dõi', FALSE, CURRENT_TIMESTAMP)
ON CONFLICT (patient_code) DO NOTHING;
