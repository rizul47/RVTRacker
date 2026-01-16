-- Supabase Setup for Sehaj
-- Run this in the Supabase SQL Editor

-- Enable Row Level Security
ALTER TABLE IF EXISTS students ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS practice_sessions ENABLE ROW LEVEL SECURITY;

-- Students table
CREATE TABLE IF NOT EXISTS students (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT,
    password TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- Practice sessions table
CREATE TABLE IF NOT EXISTS practice_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id TEXT NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    ritual_id INTEGER NOT NULL,
    ritual_name TEXT NOT NULL,
    duration INTEGER NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Login attempts table (for security tracking)
CREATE TABLE IF NOT EXISTS login_attempts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id TEXT,
    user_type TEXT DEFAULT 'student',
    ip_address TEXT,
    success BOOLEAN NOT NULL,
    attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin roles table (stores which users are admins)
CREATE TABLE IF NOT EXISTS admin_roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_students_student_id ON students(student_id);
CREATE INDEX IF NOT EXISTS idx_students_is_active ON students(is_active);
CREATE INDEX IF NOT EXISTS idx_practice_student_id ON practice_sessions(student_id);
CREATE INDEX IF NOT EXISTS idx_practice_completed_at ON practice_sessions(completed_at);
CREATE INDEX IF NOT EXISTS idx_login_student_id ON login_attempts(student_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for students table
DROP TRIGGER IF EXISTS update_students_updated_at ON students;
CREATE TRIGGER update_students_updated_at
    BEFORE UPDATE ON students
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security Policies

-- Students table policies
CREATE POLICY "Students can view their own data"
    ON students FOR SELECT
    USING (student_id = current_setting('app.current_student_id', TRUE));

CREATE POLICY "Admins can view all students"
    ON students FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM admin_roles 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can insert students"
    ON students FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM admin_roles 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can update students"
    ON students FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM admin_roles 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can delete students"
    ON students FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM admin_roles 
            WHERE user_id = auth.uid()
        )
    );

-- Practice sessions policies
CREATE POLICY "Students can view their own sessions"
    ON practice_sessions FOR SELECT
    USING (student_id = current_setting('app.current_student_id', TRUE));

CREATE POLICY "Students can insert their own sessions"
    ON practice_sessions FOR INSERT
    WITH CHECK (student_id = current_setting('app.current_student_id', TRUE));

CREATE POLICY "Admins can view all sessions"
    ON practice_sessions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM admin_roles 
            WHERE user_id = auth.uid()
        )
    );

-- Login attempts policies
CREATE POLICY "Admins can view all login attempts"
    ON login_attempts FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM admin_roles 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Anyone can insert login attempts"
    ON login_attempts FOR INSERT
    WITH CHECK (TRUE);

-- Create view for student statistics
CREATE OR REPLACE VIEW student_stats AS
SELECT 
    s.student_id,
    s.name,
    s.email,
    COUNT(ps.id) as total_sessions,
    COALESCE(SUM(ps.duration), 0) as total_minutes,
    MAX(ps.completed_at) as last_practice,
    s.created_at,
    s.is_active
FROM students s
LEFT JOIN practice_sessions ps ON s.student_id = ps.student_id
GROUP BY s.student_id, s.name, s.email, s.created_at, s.is_active;

-- Grant access to authenticated users
GRANT SELECT ON student_stats TO authenticated;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM admin_roles 
        WHERE user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert sample students for testing (optional - remove in production)
-- Note: These will use Supabase Auth, so you need to create users in Auth first
-- INSERT INTO students (student_id, name, email, is_active) VALUES
--     ('2024001', 'Test Student 1', 'student1@school.edu', TRUE),
--     ('2024002', 'Test Student 2', 'student2@school.edu', TRUE);
