# 🚀 Deploy en Vercel - Guía Completa

## Archivos Creados para Vercel

He creado los siguientes archivos para que funcione correctamente en Vercel:

1. **`vercel.json`** - Configuración de Vercel
   - Redirige todas las rutas a `index.html` (necesario para React Router)
   - Configura headers de seguridad
   - Especifica el directorio de build (`dist`)

2. **`public/_redirects`** - Respaldo para redirecciones
   - Asegura que todas las rutas se manejen correctamente

## Pasos para Deploy

### 1. Commit y Push de los cambios

```bash
git add .
git commit -m "Add Vercel configuration for SPA routing"
git push
```

### 2. Configurar en Vercel Dashboard

1. Ve a tu proyecto en Vercel
2. Click en **Settings** → **Environment Variables**
3. Agrega estas variables (ya las tienes en `.env`):
   - `VITE_SUPABASE_URL` = `https://hnomrfjpwcglqihvjuda.supabase.co`
   - `VITE_SUPABASE_PUBLISHABLE_KEY` = (tu key anon)
   - `VITE_SUPABASE_PROJECT_ID` = `hnomrfjpwcglqihvjuda`

4. **IMPORTANTE**: En Settings → General
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### 3. Redeploy

1. En Vercel Dashboard, ve a **Deployments**
2. Click en los tres puntos del último deployment
3. Click **Redeploy**
4. Espera a que termine el build

### 4. Verificar que funcione

1. Abre tu URL de Vercel
2. Click en "Iniciar Sesión"
3. Login con `robert.gonzalez@universidad.edu.co` / `123`
4. Deberías ver el dashboard de Robert ✅

## Problemas Comunes y Soluciones

### ❌ "404 - Page Not Found" después del login

**Causa**: Vercel no está redirigiendo correctamente las rutas.

**Solución**:
1. Verifica que `vercel.json` esté en la raíz del proyecto
2. Verifica que la configuración en Vercel Settings sea correcta
3. Haz un nuevo deploy

### ❌ "Variables de entorno no definidas"

**Causa**: Las variables `VITE_SUPABASE_*` no están configuradas en Vercel.

**Solución**:
1. Ve a Settings → Environment Variables en Vercel
2. Agrega todas las variables con el prefijo `VITE_`
3. Redeploy

### ❌ "Network Error" al hacer login

**Causa**: Las credenciales de Supabase son incorrectas.

**Solución**:
1. Verifica que las variables de entorno sean correctas
2. Asegúrate de que RLS esté deshabilitado en Supabase (ver `ARREGLAR_AHORA.md`)

### ❌ Dashboard en blanco / Sin materias

**Causa**: RLS de Supabase sigue bloqueando las consultas.

**Solución**:
1. Ve a `ARREGLAR_AHORA.md`
2. Ejecuta el SQL para deshabilitar RLS
3. Ejecuta la herramienta de setup: `https://tu-app.vercel.app/force-setup`
4. Click en "Forzar Reinicialización"

## 🔍 Debug en Producción

Si algo falla en producción, puedes usar estas herramientas:

1. **Página de diagnóstico**: `https://tu-app.vercel.app/diagnostico`
   - Muestra qué tablas son accesibles
   - Identifica problemas de RLS

2. **Página de setup forzado**: `https://tu-app.vercel.app/force-setup`
   - Reinicializa todos los datos
   - Verifica que los datos se crearon correctamente

3. **Consola del navegador** (F12)
   - Busca errores en rojo
   - Verifica que las variables `VITE_*` estén definidas:
     ```javascript
     console.log(import.meta.env.VITE_SUPABASE_URL)
     ```

## ✅ Checklist Final

Antes de considerar el deploy exitoso, verifica:

- [ ] Login funciona (no sale 404)
- [ ] Robert ve sus 6 materias
- [ ] Jussi ve su dashboard de monitor
- [ ] Admin puede ver usuarios y materias
- [ ] No hay errores en la consola del navegador
- [ ] Las rutas funcionan al hacer refresh (F5)

---

**¿Problemas?** Usa `/diagnostico` y `/force-setup` para identificar y resolver.
