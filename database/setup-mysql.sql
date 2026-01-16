-- MySQL/MariaDB Setup Script for Sehaj

-- Create database
CREATE DATABASE IF NOT EXISTS sehaj_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sehaj_db;

-- Students table
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    INDEX idx_student_id (student_id),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Admin users table
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    role VARCHAR(20) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Practice sessions table
CREATE TABLE IF NOT EXISTS practice_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL,
    ritual_id INT NOT NULL,
    ritual_name VARCHAR(100) NOT NULL,
    duration INT NOT NULL,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    INDEX idx_student_id (student_id),
    INDEX idx_completed_at (completed_at),
    INDEX idx_ritual_id (ritual_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Login attempts table
CREATE TABLE IF NOT EXISTS login_attempts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(50),
    user_type ENUM('student', 'admin') DEFAULT 'student',
    ip_address VARCHAR(45),
    user_agent TEXT,
    success BOOLEAN NOT NULL,
    attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_student_id (student_id),
    INDEX idx_attempted_at (attempted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sessions table (for managing user sessions)
CREATE TABLE IF NOT EXISTS sessions (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    user_type ENUM('student', 'admin') NOT NULL,
    token VARCHAR(500) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default admin
-- Password: admin123 (hashed with bcrypt)
INSERT IGNORE INTO admins (username, password_hash, email, role) 
VALUES ('admin', '$2b$10$rXKj7VX3YPXVxEGQs0MqF.qZ4WJKjkJXvE3MF8QHNKQxJTJp5zGHG', 'admin@school.edu', 'admin');

-- Create a view for student statistics
CREATE OR REPLACE VIEW student_stats AS
SELECT 
    s.student_id,
    s.name,
    COUNT(ps.id) as total_sessions,
    SUM(ps.duration) as total_minutes,
    MAX(ps.completed_at) as last_practice,
    s.created_at,
    s.is_active
FROM students s
LEFT JOIN practice_sessions ps ON s.student_id = ps.student_id
GROUP BY s.student_id, s.name, s.created_at, s.is_active;

-- Show tables
SHOW TABLES;
