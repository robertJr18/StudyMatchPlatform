-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE monitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can read all profiles"
  ON users FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Subjects policies (public read)
CREATE POLICY "Everyone can read subjects"
  ON subjects FOR SELECT
  USING (true);

-- Enrollments policies
CREATE POLICY "Students can read their own enrollments"
  ON enrollments FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "Students can enroll themselves"
  ON enrollments FOR INSERT
  WITH CHECK (auth.uid() = student_id);

-- Monitors policies
CREATE POLICY "Everyone can read monitors"
  ON monitors FOR SELECT
  USING (true);

-- Time slots policies (public read)
CREATE POLICY "Everyone can read time slots"
  ON time_slots FOR SELECT
  USING (true);

CREATE POLICY "Monitors can create time slots for their subjects"
  ON time_slots FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM monitors
      WHERE monitors.user_id = auth.uid()
      AND monitors.subject_id = time_slots.subject_id
    )
  );

-- Votes policies
CREATE POLICY "Students can read all votes"
  ON votes FOR SELECT
  USING (true);

CREATE POLICY "Students can create their own votes"
  ON votes FOR INSERT
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can delete their own votes"
  ON votes FOR DELETE
  USING (auth.uid() = student_id);

-- Sessions policies
CREATE POLICY "Everyone can read sessions"
  ON sessions FOR SELECT
  USING (true);

-- Attendance policies
CREATE POLICY "Students can read their own attendance"
  ON attendance FOR SELECT
  USING (
    auth.uid() = student_id OR
    EXISTS (
      SELECT 1 FROM monitors m
      JOIN sessions s ON s.subject_id = m.subject_id
      WHERE m.user_id = auth.uid()
      AND s.id = attendance.session_id
    )
  );

-- Materials policies
CREATE POLICY "Everyone can read materials"
  ON materials FOR SELECT
  USING (true);

CREATE POLICY "Monitors can create materials for their subjects"
  ON materials FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM monitors
      WHERE monitors.user_id = auth.uid()
      AND monitors.id = materials.monitor_id
    )
  );