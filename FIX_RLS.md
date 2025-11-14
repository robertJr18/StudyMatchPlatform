# 🔧 Fix para que aparezcan las materias de Robert

## Problema Identificado

El problema es que las políticas RLS (Row Level Security) de Supabase están bloqueando las consultas porque:
- La app usa autenticación simple con localStorage (NO Supabase Auth)
- Las políticas RLS usan `auth.uid()` que siempre es NULL en este caso
- Por eso las consultas de enrollments, votes, attendance, etc. retornan vacío

## Solución Rápida (Opción 1 - Recomendada para Demo)

### Ir a Supabase Dashboard → SQL Editor y ejecutar este script:

```sql
-- Deshabilitar RLS para tablas del demo
ALTER TABLE enrollments DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE votes DISABLE ROW LEVEL SECURITY;
ALTER TABLE attendance DISABLE ROW LEVEL SECURITY;
ALTER TABLE materials DISABLE ROW LEVEL SECURITY;
ALTER TABLE monitors DISABLE ROW LEVEL SECURITY;
ALTER TABLE subjects DISABLE ROW LEVEL SECURITY;
ALTER TABLE sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE time_slots DISABLE ROW LEVEL SECURITY;
```

**Después de ejecutar esto, las materias de Robert aparecerán automáticamente.**

## Solución Alternativa (Opción 2)

Si prefieres mantener RLS habilitado pero con acceso público para el demo, ejecuta el archivo:
`supabase/migrations/20251114210800_fix_rls_policies_for_demo.sql`

Este archivo cambia las políticas para permitir acceso público en lugar de usar `auth.uid()`.

## Verificar que funcionó

1. Cierra sesión en la app
2. Borra localStorage: `localStorage.clear()`
3. Inicia sesión con `robert.gonzalez@universidad.edu.co` / `123`
4. Deberías ver las 6 materias en el dashboard
5. Inicia sesión con `jussi.torres@universidad.edu.co` / `123`
6. El dashboard de monitor de Jussi debería mostrar "Gestión de Proyectos" con estadísticas

## ¿Por qué pasó esto?

Las migraciones anteriores configuraron RLS con políticas que asumen Supabase Auth:
```sql
-- Esta política requiere que auth.uid() tenga valor:
CREATE POLICY "Students can read their own enrollments"
  ON enrollments FOR SELECT
  USING (auth.uid() = student_id);
```

Pero la app usa un sistema de auth diferente, entonces `auth.uid()` siempre es NULL y la política falla.
