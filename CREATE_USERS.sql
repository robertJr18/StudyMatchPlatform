-- ============================================
-- SCRIPT PARA CREAR USUARIOS DE STUDYMATCH
-- ============================================
-- INSTRUCCIONES:
-- 1. Primero, crea los usuarios en Supabase Auth Panel
-- 2. Copia el UUID de cada usuario
-- 3. Reemplaza 'UUID_AQUI' con el UUID real
-- 4. Ejecuta este script en SQL Editor
-- ============================================

-- USUARIO 1: Robert (Estudiante)
-- UUID de Auth: [COPIAR AQUÍ]
INSERT INTO users (id, email, full_name, role, career)
VALUES 
  ('UUID_AQUI', 'robert.gonzalez@universidad.edu.co', 'Robert Eloy González Cabarcas', 'student', 'Ingeniería de Sistemas');

-- USUARIO 2: Jussi (Monitor)
-- UUID de Auth: [COPIAR AQUÍ]
INSERT INTO users (id, email, full_name, role)
VALUES 
  ('UUID_AQUI', 'jussi.torres@universidad.edu.co', 'Jussi Torres González', 'monitor');

-- USUARIO 3: Admin
-- UUID de Auth: [COPIAR AQUÍ]
INSERT INTO users (id, email, full_name, role)
VALUES 
  ('UUID_AQUI', 'admin@universidad.edu.co', 'Administrador del Sistema', 'admin');

-- ============================================
-- CREAR INSCRIPCIONES PARA ROBERT
-- ============================================
-- Inscribir a Robert en 5 materias
INSERT INTO enrollments (student_id, subject_id)
SELECT 
  (SELECT id FROM users WHERE email = 'robert.gonzalez@universidad.edu.co'),
  id
FROM subjects
LIMIT 5
ON CONFLICT DO NOTHING;

-- ============================================
-- ASIGNAR A JUSSI COMO MONITOR
-- ============================================
-- Asignar a Jussi como monitor de Gestión de Proyectos
INSERT INTO monitors (user_id, subject_id)
SELECT 
  (SELECT id FROM users WHERE email = 'jussi.torres@universidad.edu.co'),
  id
FROM subjects
WHERE code = 'PROY101'
ON CONFLICT DO NOTHING;

-- ============================================
-- CREAR VOTO DE PRUEBA PARA ROBERT
-- ============================================
DO $$
DECLARE
  robert_id uuid;
  gestion_subject_id uuid;
  miercoles_slot_id uuid;
BEGIN
  -- Obtener IDs
  SELECT id INTO robert_id FROM users WHERE email = 'robert.gonzalez@universidad.edu.co';
  SELECT id INTO gestion_subject_id FROM subjects WHERE code = 'PROY101';
  SELECT id INTO miercoles_slot_id FROM time_slots 
  WHERE subject_id = gestion_subject_id 
  AND day_of_week = 'Miércoles'
  LIMIT 1;
  
  -- Crear voto si existen los registros
  IF robert_id IS NOT NULL AND gestion_subject_id IS NOT NULL AND miercoles_slot_id IS NOT NULL THEN
    INSERT INTO votes (student_id, subject_id, time_slot_id)
    VALUES (robert_id, gestion_subject_id, miercoles_slot_id)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- ============================================
-- VERIFICACIÓN
-- ============================================
-- Verifica que todo se creó correctamente:
SELECT 
  'Usuarios creados:' as check_type,
  COUNT(*) as count
FROM users
WHERE email IN (
  'robert.gonzalez@universidad.edu.co',
  'jussi.torres@universidad.edu.co',
  'admin@universidad.edu.co'
)

UNION ALL

SELECT 
  'Inscripciones de Robert:' as check_type,
  COUNT(*) as count
FROM enrollments e
JOIN users u ON e.student_id = u.id
WHERE u.email = 'robert.gonzalez@universidad.edu.co'

UNION ALL

SELECT 
  'Monitores asignados:' as check_type,
  COUNT(*) as count
FROM monitors m
JOIN users u ON m.user_id = u.id
WHERE u.email = 'jussi.torres@universidad.edu.co'

UNION ALL

SELECT 
  'Votos de Robert:' as check_type,
  COUNT(*) as count
FROM votes v
JOIN users u ON v.student_id = u.id
WHERE u.email = 'robert.gonzalez@universidad.edu.co';
