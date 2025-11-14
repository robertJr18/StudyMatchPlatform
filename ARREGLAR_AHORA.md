# 🔧 ARREGLO URGENTE - Lee esto primero

## El Problema

Robert no ve materias y el dashboard de Jussi está en blanco porque **Supabase RLS está bloqueando las consultas**.

## La Solución (2 minutos)

### Paso 1: Abre la página de diagnóstico

En tu navegador, ve a:
```
http://localhost:8080/diagnostico
```

Esta página te mostrará **exactamente** qué está fallando.

### Paso 2: Ejecuta el SQL Fix

1. **Haz click en este link** (se abre en nueva pestaña):
   👉 https://supabase.com/dashboard/project/hnomrfjpwcglqihvjuda/sql/new

2. **Copia este SQL** completo:

```sql
-- Deshabilitar RLS para permitir acceso en demo
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

3. **Pégalo** en el SQL Editor de Supabase

4. **Click en "Run"** (botón verde)

5. **Verás**: "Success. No rows returned"

### Paso 3: Verifica que funcionó

1. **Recarga** http://localhost:8080/diagnostico
2. Deberías ver todos los checks en ✅ verde
3. **Borra localStorage**: En la consola del navegador ejecuta `localStorage.clear()`
4. **Inicia sesión** con Robert → Verás las 6 materias
5. **Inicia sesión** con Jussi → Dashboard de monitor funcionando

## ¿Por qué pasó esto?

Tu app usa autenticación simple con `localStorage`, pero Supabase RLS espera `auth.uid()` de Supabase Auth. Como `auth.uid()` siempre es NULL, las políticas RLS bloquean todo.

Al deshabilitar RLS, permites acceso público (perfecto para un demo universitario).

## ¿Necesitas ayuda?

Si algo no funciona después de ejecutar el SQL:
1. Ve a http://localhost:8080/diagnostico
2. Toma screenshot de los errores
3. Me lo compartes

---

**IMPORTANTE**: Debes hacer esto AHORA para que la app funcione. Toma solo 2 minutos.
