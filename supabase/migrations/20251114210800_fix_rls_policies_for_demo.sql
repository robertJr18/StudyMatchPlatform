-- Fix RLS policies for demo app (not using Supabase Auth)
-- Drop restrictive policies and create public read policies

-- Enrollments - allow public read for demo
DROP POLICY IF EXISTS "Students can read their own enrollments" ON enrollments;
CREATE POLICY "Public read for enrollments (demo)"
  ON enrollments FOR SELECT
  USING (true);

-- Allow public insert for enrollments (demo)
DROP POLICY IF EXISTS "Students can enroll themselves" ON enrollments;
CREATE POLICY "Public insert for enrollments (demo)"
  ON enrollments FOR INSERT
  WITH CHECK (true);

-- Allow public delete for enrollments (demo)
CREATE POLICY "Public delete for enrollments (demo)"
  ON enrollments FOR DELETE
  USING (true);

-- Users - allow public update for demo
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
CREATE POLICY "Public update for users (demo)"
  ON users FOR UPDATE
  USING (true);

-- Allow public insert for users (demo)
CREATE POLICY "Public insert for users (demo)"
  ON users FOR INSERT
  WITH CHECK (true);

-- Votes - allow public operations for demo
DROP POLICY IF EXISTS "Students can create their own votes" ON votes;
DROP POLICY IF EXISTS "Students can delete their own votes" ON votes;

CREATE POLICY "Public insert for votes (demo)"
  ON votes FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public delete for votes (demo)"
  ON votes FOR DELETE
  USING (true);

-- Attendance - allow public read for demo
DROP POLICY IF EXISTS "Students can read their own attendance" ON attendance;
CREATE POLICY "Public read for attendance (demo)"
  ON attendance FOR SELECT
  USING (true);

CREATE POLICY "Public insert for attendance (demo)"
  ON attendance FOR INSERT
  WITH CHECK (true);

-- Time slots - allow public insert/update for demo
CREATE POLICY "Public insert for time_slots (demo)"
  ON time_slots FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public update for time_slots (demo)"
  ON time_slots FOR UPDATE
  USING (true);

CREATE POLICY "Public delete for time_slots (demo)"
  ON time_slots FOR DELETE
  USING (true);

-- Materials - allow public insert for demo
DROP POLICY IF EXISTS "Monitors can create materials for their subjects" ON materials;
CREATE POLICY "Public insert for materials (demo)"
  ON materials FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public update for materials (demo)"
  ON materials FOR UPDATE
  USING (true);

CREATE POLICY "Public delete for materials (demo)"
  ON materials FOR DELETE
  USING (true);

-- Monitors - allow public insert/update/delete for demo
CREATE POLICY "Public insert for monitors (demo)"
  ON monitors FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public update for monitors (demo)"
  ON monitors FOR UPDATE
  USING (true);

CREATE POLICY "Public delete for monitors (demo)"
  ON monitors FOR DELETE
  USING (true);

-- Subjects - allow public insert/update/delete for demo
CREATE POLICY "Public insert for subjects (demo)"
  ON subjects FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public update for subjects (demo)"
  ON subjects FOR UPDATE
  USING (true);

CREATE POLICY "Public delete for subjects (demo)"
  ON subjects FOR DELETE
  USING (true);

-- Sessions - allow public insert/update/delete for demo
CREATE POLICY "Public insert for sessions (demo)"
  ON sessions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public update for sessions (demo)"
  ON sessions FOR UPDATE
  USING (true);

CREATE POLICY "Public delete for sessions (demo)"
  ON sessions FOR DELETE
  USING (true);
