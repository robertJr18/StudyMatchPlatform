# 🎓 StudyMatch - Plataforma de Gestión de Monitorías Universitarias

Proyecto final de Gestión de Proyectos - Universidad
Desarrollado por Robert González

## 📋 Descripción

StudyMatch es una plataforma web para gestionar monitorías universitarias, permitiendo a estudiantes inscribirse en materias, votar por horarios de tutorías, y a monitores gestionar sesiones y materiales.

## 🚀 Deploy en Vercel/Producción

### 1. Configuración de Variables de Entorno

En Vercel Dashboard → Settings → Environment Variables:

```
VITE_SUPABASE_URL=https://hnomrfjpwcglqihvjuda.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=(tu clave pública de Supabase)
VITE_SUPABASE_PROJECT_ID=hnomrfjpwcglqihvjuda
```

### 2. Configuración de Build

- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3. **MUY IMPORTANTE** - Deshabilitar RLS en Supabase

⚠️ **DEBES hacer esto para que funcione en producción:**

1. Ve a [Supabase Dashboard → SQL Editor](https://supabase.com/dashboard/project/hnomrfjpwcglqihvjuda/sql/new)
2. Ejecuta este SQL:

```sql
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

### 4. Inicializar Datos en Producción

Después de desplegar, visita:

```
https://tu-app.vercel.app/force-setup
```

1. Click en **"Verificar Base de Datos"**
2. Si muestra 0 registros, click en **"Forzar Reinicialización"**
3. Espera el mensaje "✅ Setup completado exitosamente"

## 👥 Usuarios de Prueba

| Rol | Email | Password |
|-----|-------|----------|
| Estudiante | robert.gonzalez@universidad.edu.co | 123 |
| Monitor | jussi.torres@universidad.edu.co | 123 |
| Monitor | maria.rodriguez@universidad.edu.co | 123 |
| Monitor | carlos.martinez@universidad.edu.co | 123 |
| Admin | admin@universidad.edu.co | 123 |

## 🛠️ Desarrollo Local

```bash
# Clonar el repositorio
git clone https://github.com/robertJr18/StudyMatchPlatform.git
cd StudyMatchDemo

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Abrir en el navegador
# http://localhost:8080
```

## 🆘 Solución de Problemas

### ❌ No cargan las materias o el dashboard de monitor está en blanco

**Causa**: Los datos no se inicializaron o RLS está bloqueando.

**Solución**:
1. Ve a `/force-setup` en tu app
2. Click en "Verificar Base de Datos"
3. Si muestra 0 registros, click en "Forzar Reinicialización"
4. Verifica que RLS esté deshabilitado (paso 3 arriba)

### ❌ Error 404 después de hacer login

**Causa**: Configuración de routing faltante.

**Solución**: Verifica que `vercel.json` esté en el repositorio y que se deployó correctamente.

### ❌ "Network Error" al intentar login

**Causa**: Variables de entorno no configuradas.

**Solución**:
1. Ve a Vercel Dashboard → Settings → Environment Variables
2. Verifica que todas las variables `VITE_*` estén configuradas
3. Redeploy

## 📂 Estructura del Proyecto

```
src/
├── pages/              # Páginas principales
│   ├── Landing.tsx         # Página de inicio
│   ├── StudentDashboard.tsx
│   ├── MonitorDashboard.tsx
│   ├── AdminDashboard.tsx
│   ├── ForceSetupPage.tsx  # Herramienta de setup
│   └── DiagnosticPage.tsx  # Diagnóstico
├── components/         # Componentes reutilizables
│   ├── LoginModal.tsx
│   ├── AppSidebar.tsx
│   └── DashboardLayout.tsx
├── contexts/          # Contextos de React
│   └── AuthContext.tsx     # Auto-inicialización de datos
├── utils/             # Utilidades
│   └── setupTestData.ts    # Script de inicialización
├── integrations/      # Integraciones externas
│   └── supabase/          # Cliente Supabase
└── types/             # TypeScript types

public/
├── _redirects         # Configuración de routing SPA
└── favicon.ico

vercel.json            # Configuración de Vercel
```

## 🔧 Herramientas de Diagnóstico

### `/diagnostico`
Verifica acceso a tablas de Supabase y detecta problemas de RLS.

### `/force-setup`
Herramienta para inicializar/reinicializar datos:
- Verificar qué hay en la base de datos
- Forzar reinicialización completa
- Borrar todos los datos (con confirmación)

## 🌟 Funcionalidades

### Para Estudiantes
- ✅ Ver materias inscritas
- ✅ Ver monitores disponibles por materia
- ✅ Votar por horarios de monitoría
- ✅ Descargar materiales de estudio
- ✅ Ver asistencias

### Para Monitores
- ✅ Gestionar materias asignadas
- ✅ Ver estudiantes inscritos
- ✅ Proponer horarios de monitoría
- ✅ Ver votaciones en tiempo real
- ✅ Subir materiales de estudio

### Para Administradores
- ✅ Ver lista de usuarios
- ✅ Ver lista de materias
- ✅ Estadísticas generales

## 📱 Tecnologías

- **Frontend**: React 18 + TypeScript
- **Build**: Vite
- **UI**: Tailwind CSS + shadcn/ui
- **Routing**: React Router v6
- **Backend**: Supabase (PostgreSQL)
- **Deploy**: Vercel

## 📝 Notas Importantes

- La app usa autenticación simple con `localStorage` (no Supabase Auth)
- Los datos se auto-inicializan en la primera carga verificando si la BD está vacía
- **RLS debe estar deshabilitado** en Supabase para que funcione (es un demo)
- Todos los passwords son `123` para facilitar las pruebas

## 📄 Licencia

Proyecto académico - Universidad

---

**Desarrollado por**: Robert González
**Proyecto**: Gestión de Proyectos
**Año**: 2025
