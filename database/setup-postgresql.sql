-- PostgreSQL Setup Script for Sehaj

-- Create database (run this separately as superuser)
-- CREATE DATABASE sehaj_db WITH ENCODING 'UTF8';
-- \c sehaj_db;

-- Students table
CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    student_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Admin users table
CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    role VARCHAR(20) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Practice sessions table
CREATE TABLE IF NOT EXISTS practice_sessions (
    id SERIAL PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL,
    ritual_id INTEGER NOT NULL,
    ritual_name VARCHAR(100) NOT NULL,
    duration INTEGER NOT NULL,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
);

-- Login attempts table
CREATE TABLE IF NOT EXISTS login_attempts (
    id SERIAL PRIMARY KEY,
    student_id VARCHAR(50),
    user_type VARCHAR(10) DEFAULT 'student',
    ip_address VARCHAR(45),
    user_agent TEXT,
    success BOOLEAN NOT NULL,
    attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    user_type VARCHAR(10) NOT NULL,
    token VARCHAR(500) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_students_student_id ON students(student_id);
CREATE INDEX IF NOT EXISTS idx_students_is_active ON students(is_active);
CREATE INDEX IF NOT EXISTS idx_admins_username ON admins(username);
CREATE INDEX IF NOT EXISTS idx_practice_student_id ON practice_sessions(student_id);
CREATE INDEX IF NOT EXISTS idx_practice_completed_at ON practice_sessions(completed_at);
CREATE INDEX IF NOT EXISTS idx_practice_ritual_id ON practice_sessions(ritual_id);
CREATE INDEX IF NOT EXISTS idx_login_attempts_student_id ON login_attempts(student_id);
CREATE INDEX IF NOT EXISTS idx_login_attempts_attempted_at ON login_attempts(attempted_at);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);

-- Insert default admin
-- Password: admin123 (hashed with bcrypt)
INSERT INTO admins (username, password_hash, email, role) 
VALUES ('admin', '$2b$10$rXKj7VX3YPXVxEGQs0MqF.qZ4WJKjkJXvE3MF8QHNKQxJTJp5zGHG', 'admin@school.edu', 'admin')
ON CONFLICT (username) DO NOTHING;

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

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for students table
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- List all tables
\dt
