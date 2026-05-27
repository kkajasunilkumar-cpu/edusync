-- ═══════════════════════════════════════════════════════
--  EDUSYNC — SUPABASE SETUP
--  1. Go to supabase.com → Your Project → SQL Editor
--  2. Paste this entire file → Click Run
--  3. All tables, security policies & triggers created!
-- ═══════════════════════════════════════════════════════

-- SCHOOLS
CREATE TABLE IF NOT EXISTS schools (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT,
  plan TEXT DEFAULT 'basic' CHECK (plan IN ('basic','pro','premium','enterprise')),
  status TEXT DEFAULT 'trial' CHECK (status IN ('trial','active','expired','suspended')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- USERS (linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  role TEXT NOT NULL CHECK (role IN ('superadmin','admin','teacher','parent','student')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- STUDENTS
CREATE TABLE IF NOT EXISTS students (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  class TEXT, roll_no TEXT, dob DATE, gender TEXT,
  parent_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ATTENDANCE
CREATE TABLE IF NOT EXISTS attendance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) NOT NULL,
  student_id UUID REFERENCES students(id) NOT NULL,
  class_name TEXT, date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('present','absent','late')),
  marked_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (student_id, date)
);

-- HOMEWORK
CREATE TABLE IF NOT EXISTS homework (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) NOT NULL,
  title TEXT NOT NULL, description TEXT, subject TEXT,
  class_name TEXT, due_date DATE,
  teacher_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- MARKS
CREATE TABLE IF NOT EXISTS marks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) NOT NULL,
  student_id UUID REFERENCES students(id) NOT NULL,
  subject TEXT NOT NULL, exam_type TEXT DEFAULT 'unit_test',
  score NUMERIC, max_score NUMERIC DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (student_id, subject, exam_type)
);

-- ANNOUNCEMENTS
CREATE TABLE IF NOT EXISTS announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) NOT NULL,
  title TEXT NOT NULL, body TEXT,
  target_role TEXT DEFAULT 'all' CHECK (target_role IN ('all','students','parents','teachers')),
  is_important BOOLEAN DEFAULT false,
  author_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- PTM SLOTS
CREATE TABLE IF NOT EXISTS ptm_slots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) NOT NULL,
  teacher_id UUID REFERENCES users(id),
  parent_id UUID REFERENCES users(id),
  student_id UUID REFERENCES students(id),
  date DATE, time TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- HOLIDAYS
CREATE TABLE IF NOT EXISTS holidays (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) NOT NULL,
  name TEXT NOT NULL, date DATE NOT NULL,
  type TEXT DEFAULT 'national',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- COMPLAINTS
CREATE TABLE IF NOT EXISTS complaints (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) NOT NULL,
  raised_by UUID REFERENCES users(id),
  title TEXT NOT NULL, body TEXT,
  priority TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'open',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── ROW LEVEL SECURITY ────────────────────────────────────────
ALTER TABLE schools       ENABLE ROW LEVEL SECURITY;
ALTER TABLE users         ENABLE ROW LEVEL SECURITY;
ALTER TABLE students      ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance    ENABLE ROW LEVEL SECURITY;
ALTER TABLE homework      ENABLE ROW LEVEL SECURITY;
ALTER TABLE marks         ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE ptm_slots     ENABLE ROW LEVEL SECURITY;
ALTER TABLE holidays      ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints    ENABLE ROW LEVEL SECURITY;

-- Helper: get current user's school
CREATE OR REPLACE FUNCTION get_my_school_id()
RETURNS UUID AS $$
  SELECT school_id FROM users WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER;

-- Policies: each school only sees their own data
CREATE POLICY "own_school_students"      ON students      FOR ALL USING (school_id = get_my_school_id());
CREATE POLICY "own_school_attendance"    ON attendance    FOR ALL USING (school_id = get_my_school_id());
CREATE POLICY "own_school_homework"      ON homework      FOR ALL USING (school_id = get_my_school_id());
CREATE POLICY "own_school_marks"         ON marks         FOR ALL USING (school_id = get_my_school_id());
CREATE POLICY "own_school_announcements" ON announcements FOR ALL USING (school_id = get_my_school_id());
CREATE POLICY "own_school_ptm"           ON ptm_slots     FOR ALL USING (school_id = get_my_school_id());
CREATE POLICY "own_school_holidays"      ON holidays      FOR ALL USING (school_id = get_my_school_id());
CREATE POLICY "own_school_complaints"    ON complaints    FOR ALL USING (school_id = get_my_school_id());
CREATE POLICY "own_school"               ON schools       FOR SELECT USING (id = get_my_school_id());
CREATE POLICY "own_school_users"         ON users         FOR SELECT USING (school_id = get_my_school_id());

-- ── AUTO CREATE USER PROFILE ON SIGNUP ───────────────────────
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO users (id, email, name, role)
  VALUES (
    NEW.id, NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'New User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ── SAMPLE SCHOOL ─────────────────────────────────────────────
INSERT INTO schools (id, name, city, plan, status)
VALUES ('00000000-0000-0000-0000-000000000001', 'St. Mary''s School', 'Mumbai', 'basic', 'active')
ON CONFLICT DO NOTHING;
