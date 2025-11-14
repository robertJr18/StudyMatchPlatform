# Setup de StudyMatch

## 1. Crear Usuarios en Supabase Auth

Para usar la aplicación, necesitas crear los siguientes usuarios en el panel de Supabase Auth:

### Accede a Supabase Auth:
1. Ve a [https://supabase.com/dashboard/project/hnomrfjpwcglqihvjuda/auth/users](https://supabase.com/dashboard/project/hnomrfjpwcglqihvjuda/auth/users)
2. Haz clic en "Invite" o "Add user"

### Crear los 3 usuarios:

#### Usuario 1 - Estudiante (Robert)
- **Email:** robert.gonzalez@universidad.edu.co
- **Password:** Robert123!
- **Confirmar email:** ✅ (marca esta opción para que no requiera verificación)

Después de crear el usuario en Auth, copia su UUID y ejecuta en SQL Editor:
```sql
INSERT INTO users (id, email, full_name, role, career)
VALUES ('UUID_DEL_USUARIO', 'robert.gonzalez@universidad.edu.co', 'Robert Eloy González Cabarcas', 'student', 'Ingeniería de Sistemas');
```

#### Usuario 2 - Monitor (Jussi)
- **Email:** jussi.torres@universidad.edu.co
- **Password:** Jussi123!
- **Confirmar email:** ✅

Después de crear el usuario en Auth:
```sql
INSERT INTO users (id, email, full_name, role, career)
VALUES ('UUID_DEL_USUARIO', 'jussi.torres@universidad.edu.co', 'Jussi Torres González', 'monitor', NULL);
```

#### Usuario 3 - Admin
- **Email:** admin@universidad.edu.co
- **Password:** Admin123!
- **Confirmar email:** ✅

Después de crear el usuario en Auth:
```sql
INSERT INTO users (id, email, full_name, role)
VALUES ('UUID_DEL_USUARIO', 'admin@universidad.edu.co', 'Administrador del Sistema', 'admin');
```

## 2. Desactivar Confirmación de Email (Opcional para desarrollo)

Para facilitar las pruebas, puedes desactivar la confirmación de email:

1. Ve a: [https://supabase.com/dashboard/project/hnomrfjpwcglqihvjuda/auth/providers](https://supabase.com/dashboard/project/hnomrfjpwcglqihvjuda/auth/providers)
2. Busca "Email" en la lista de providers
3. Desactiva "Confirm email"

## 3. Datos de Prueba

Los datos de prueba (horarios, materiales) ya fueron insertados automáticamente mediante migraciones.

Para agregar votos de prueba, ejecuta en SQL Editor:

```sql
-- Obtener IDs necesarios
DO $$
DECLARE
  robert_id uuid;
  gestion_subject_id uuid;
  miercoles_slot_id uuid;
BEGIN
  -- Obtener el ID de Robert
  SELECT id INTO robert_id FROM users WHERE email = 'robert.gonzalez@universidad.edu.co';
  
  -- Obtener el ID de Gestión de Proyectos
  SELECT id INTO gestion_subject_id FROM subjects WHERE code = 'PROY101';
  
  -- Obtener el ID del horario de Miércoles
  SELECT id INTO miercoles_slot_id FROM time_slots 
  WHERE subject_id = gestion_subject_id 
  AND day_of_week = 'Miércoles';
  
  IF robert_id IS NOT NULL AND gestion_subject_id IS NOT NULL AND miercoles_slot_id IS NOT NULL THEN
    -- Crear voto de Robert
    INSERT INTO votes (student_id, subject_id, time_slot_id)
    VALUES (robert_id, gestion_subject_id, miercoles_slot_id)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;
```

## 4. Verificar Instalación

1. Accede a la aplicación en `/login`
2. Prueba con cada usuario:
   - **robert.gonzalez@universidad.edu.co** / Robert123!
   - **jussi.torres@universidad.edu.co** / Jussi123!
   - **admin@universidad.edu.co** / Admin123!

## Estructura de la Base de Datos

- **users**: Perfiles de usuarios (student, monitor, admin, coordinator)
- **subjects**: Materias universitarias
- **enrollments**: Inscripciones de estudiantes a materias
- **monitors**: Asignación de monitores a materias
- **time_slots**: Horarios propuestos por monitores
- **votes**: Votaciones de estudiantes por horarios
- **materials**: Materiales compartidos por monitores
- **sessions**: Sesiones de monitoría realizadas
- **attendance**: Registro de asistencia a sesiones

## Seguridad

✅ Row Level Security (RLS) está habilitado en todas las tablas
✅ Las políticas de seguridad están configuradas según roles
✅ Los estudiantes solo pueden ver y modificar sus propios datos
✅ Los monitores pueden crear horarios y materiales solo para sus materias
✅ Los administradores tienen acceso completo

## Troubleshooting

### Error: "new row violates row-level security policy"
- Verifica que el usuario esté autenticado correctamente
- Asegúrate de que el ID del usuario en la tabla `users` coincida con el ID de Supabase Auth

### No puedo ver mis materias
- Verifica que existan registros en la tabla `enrollments` para tu usuario
- Ejecuta: `SELECT * FROM enrollments WHERE student_id = 'TU_UUID';`

### Los votos no se guardan
- Verifica que estés autenticado
- Asegúrate de que el `student_id` en la tabla `votes` sea tu UUID de Supabase Auth
