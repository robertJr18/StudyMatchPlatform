-- Insert sample time slots for Gestión de Proyectos (get the subject first)
DO $$
DECLARE
  gestion_subject_id uuid;
  jussi_monitor_id uuid;
BEGIN
  -- Get Gestión de Proyectos subject ID
  SELECT id INTO gestion_subject_id FROM subjects WHERE code = 'PROY101' LIMIT 1;
  
  -- Get Jussi's monitor ID
  SELECT id INTO jussi_monitor_id FROM monitors 
  WHERE subject_id = gestion_subject_id LIMIT 1;
  
  IF gestion_subject_id IS NOT NULL AND jussi_monitor_id IS NOT NULL THEN
    -- Insert time slots if they don't exist
    INSERT INTO time_slots (day_of_week, start_time, end_time, location, max_capacity, subject_id, monitor_id)
    VALUES 
      ('Lunes', '14:00:00', '16:00:00', 'Edificio A - Salón 301', 30, gestion_subject_id, jussi_monitor_id),
      ('Miércoles', '16:00:00', '18:00:00', 'Edificio B - Salón 205', 30, gestion_subject_id, jussi_monitor_id),
      ('Viernes', '10:00:00', '12:00:00', 'Edificio A - Salón 301', 30, gestion_subject_id, jussi_monitor_id)
    ON CONFLICT DO NOTHING;
    
    -- Insert sample materials
    INSERT INTO materials (title, description, subject_id, monitor_id)
    VALUES 
      ('Guía de Scrum y Agile', 'Fundamentos de metodologías ágiles', gestion_subject_id, jussi_monitor_id),
      ('Plantilla Project Charter', 'Documento base para proyectos', gestion_subject_id, jussi_monitor_id)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;