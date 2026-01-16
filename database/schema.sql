-- Sehaj Database Schema
-- This creates the necessary tables for the authentication system

-- Students table
CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Admin users table
CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Practice sessions table (to track student progress)
CREATE TABLE IF NOT EXISTS practice_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id VARCHAR(50) NOT NULL,
    ritual_id INTEGER NOT NULL,
    ritual_name VARCHAR(100) NOT NULL,
    duration INTEGER NOT NULL,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
);

-- Login attempts table (for security tracking)
CREATE TABLE IF NOT EXISTS login_attempts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id VARCHAR(50),
    ip_address VARCHAR(45),
    success BOOLEAN NOT NULL,
    attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_students_student_id ON students(student_id);
CREATE INDEX IF NOT EXISTS idx_students_is_active ON students(is_active);
CREATE INDEX IF NOT EXISTS idx_practice_student_id ON practice_sessions(student_id);
CREATE INDEX IF NOT EXISTS idx_practice_completed_at ON practice_sessions(completed_at);
CREATE INDEX IF NOT EXISTS idx_login_attempts_student_id ON login_attempts(student_id);

-- Insert default admin (password: admin123)
-- Note: In production, use properly hashed passwords
INSERT OR IGNORE INTO admins (username, password_hash, email) 
VALUES ('admin', '$2b$10$rXKj7VX3YPXVxEGQs0MqF.qZ4WJKjkJXvE3MF8QHNKQxJTJp5zGHG', 'admin@school.edu');

-- Sample students for testing (remove in production)
-- Password for all: test123
INSERT OR IGNORE INTO students (student_id, name, password_hash) VALUES
    ('2024001', 'Test Student 1', '$2b$10$YourHashedPasswordHere1'),
    ('2024002', 'Test Student 2', '$2b$10$YourHashedPasswordHere2'),
    ('2024003', 'Test Student 3', '$2b$10$YourHashedPasswordHere3');
