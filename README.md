# 📚 StudyMatch - Plataforma de Gestión de Monitorías Universitarias

<div align="center">

![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite)
![Supabase](https://img.shields.io/badge/Supabase-2.0-3ECF8E?style=for-the-badge&logo=supabase)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

Solución integral para la gestión, votación y seguimiento de monitorías académicas universitarias.

[Demo en Vivo](#-demo) •
[Características](#-características-principales) •
[Tecnologías](#-tecnologías) •
[Instalación](#-instalación-local) •
[Estructura](#-estructura-del-proyecto)

</div>

---

## 📋 Descripción

**StudyMatch** es una plataforma web moderna diseñada para optimizar la gestión de monitorías académicas en instituciones universitarias. El sistema permite a estudiantes votar por horarios de monitorías, a monitores gestionar sesiones y materiales, y a administradores supervisar todo el proceso con métricas en tiempo real.

### 🎯 Problema que Resuelve

Las monitorías universitarias tradicionalmente enfrentan desafíos como:
- Falta de coordinación en horarios entre monitores y estudiantes
- Ausencia de registro sistemático de asistencia
- Materiales dispersos en múltiples plataformas
- Dificultad para medir el impacto de las monitorías
- Comunicación ineficiente entre monitores, estudiantes y coordinadores

**StudyMatch** centraliza y digitaliza estos procesos, creando una experiencia fluida para todos los actores involucrados.

---

## ✨ Características Principales

### 🗳️ Sistema de Votación Democrática
- **Votación de horarios**: Estudiantes votan por los horarios que mejor les funcionan
- **Resultados en tiempo real**: Los monitores ven instantáneamente las preferencias
- **Múltiples materias**: Gestión simultánea de varias asignaturas

### 👥 Gestión por Roles

#### 🎓 Estudiantes
- Inscripción a materias con monitorías
- Votación de horarios preferidos
- Registro de asistencia con código QR/OTP
- Acceso a materiales compartidos por monitores
- Vista de próximas sesiones

#### 📖 Monitores
- Creación de propuestas de horarios
- Visualización de votaciones
- Subida y gestión de materiales académicos
- Registro de sesiones realizadas
- Control de asistencia de estudiantes

#### 👨‍💼 Administradores
- Vista general del sistema
- Gestión de usuarios (estudiantes, monitores, coordinadores)
- Gestión de materias
- Analytics y reportes institucionales
- Asignación de monitores a materias

#### 🎯 Coordinadores
- Supervisión de monitorías de su área
- Reportes de asistencia y participación
- Aprobación de materiales

### 📊 Analytics e Indicadores
- Tasa de asistencia por materia
- Horarios más votados
- Participación de estudiantes
- Efectividad de monitores
- Materiales más descargados

### 🔐 Seguridad
- Autenticación con Supabase Auth
- Row-Level Security (RLS) en base de datos
- Control de acceso basado en roles
- Sesiones seguras con JWT
- Políticas de privacidad configurables

---

## 🛠️ Tecnologías

### Frontend
- **React 18.3** - Librería UI
- **TypeScript 5.8** - Tipado estático
- **Vite 5.4** - Build tool y dev server
- **React Router 6** - Navegación SPA
- **TanStack Query** - Gestión de estado servidor
- **React Hook Form** - Manejo de formularios
- **Zod** - Validación de esquemas

### UI/UX
- **Tailwind CSS** - Estilos utility-first
- **shadcn/ui** - Componentes reutilizables
- **Radix UI** - Primitivas accesibles
- **Lucide React** - Iconos SVG
- **Recharts** - Gráficos y visualizaciones
- **Sonner** - Toast notifications

### Backend & Base de Datos
- **Supabase** - BaaS (Backend as a Service)
- **PostgreSQL** - Base de datos relacional
- **Row-Level Security** - Seguridad a nivel de fila
- **Realtime subscriptions** - Actualizaciones en tiempo real

### Deployment
- **Vercel** - Hosting y CD/CI
- **Git** - Control de versiones

---

## 🚀 Instalación Local

### Prerrequisitos

- **Node.js 18+** y npm/pnpm/bun
- **Cuenta de Supabase** ([supabase.com](https://supabase.com))
- **Git**

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone <tu-repo-url>
cd StudyMatchDemo
```

2. **Instalar dependencias**
```bash
npm install
# o
pnpm install
# o
bun install
```

3. **Configurar variables de entorno**

Crea un archivo `.env` basado en `.env.example`:

```env
VITE_SUPABASE_URL=tu_supabase_url
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

4. **Configurar Supabase**

Ejecuta las migraciones de base de datos desde el directorio `supabase/`:
- Crea las tablas principales
- Configura Row-Level Security
- Inserta datos de ejemplo

Consulta `SETUP.md` para instrucciones detalladas.

5. **Ejecutar en desarrollo**
```bash
npm run dev
# La aplicación estará disponible en http://localhost:5173

```
🌐 Versión en Producción

Además de la ejecución local, StudyMatch está desplegado y completamente funcional en Vercel:

👉 https://www.studymatch.rest

No requiere instalación: puedes probar todas las funcionalidades desde ahí.

## 📁 Estructura del Proyecto

```
StudyMatchDemo/
│
├── src/
│   ├── components/          # Componentes React reutilizables
│   │   ├── ui/             # Componentes shadcn/ui
│   │   ├── LoginModal.tsx
│   │   └── Logo.tsx
│   │
│   ├── pages/              # Páginas principales
│   │   ├── Landing.tsx     # Página de aterrizaje
│   │   ├── StudentDashboard.tsx
│   │   ├── MonitorDashboard.tsx
│   │   ├── AdminDashboard.tsx
│   │   └── SubjectDetail.tsx
│   │
│   ├── contexts/           # Contextos React
│   │   └── AuthContext.tsx
│   │
│   ├── hooks/              # Custom hooks
│   │   └── useSupabase.ts
│   │
│   ├── integrations/       # Integraciones externas
│   │   └── supabase/
│   │
│   ├── lib/                # Utilidades y configuración
│   │   └── supabase.ts
│   │
│   ├── types/              # Definiciones TypeScript
│   │   └── database.ts
│   │
│   └── utils/              # Funciones auxiliares
│
├── supabase/              # Migraciones y configuración DB
│   └── migrations/
│
├── public/                # Archivos estáticos
│
├── .env.example          # Template de variables de entorno
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.ts
```

---

## 🎨 Características de la UI

- **Diseño responsivo**: Funciona en desktop, tablet y móvil
- **Tema oscuro/claro**: Soporte completo con next-themes
- **Animaciones fluidas**: Transiciones suaves con Tailwind
- **Accesibilidad**: Componentes ARIA-compliant con Radix UI
- **Loading states**: Indicadores de carga apropiados
- **Error handling**: Mensajes de error claros y accionables

---

## 🔑 Usuarios de Prueba

Para probar la aplicación, usa estas credenciales de demo:

### Estudiante
- **Email:** robert.gonzalez@universidad.edu.co
- **Password:** 123

### Monitor
- **Email:** jussi.torres@universidad.edu.co
- **Password:** 123

### Administrador
- **Email:** admin@universidad.edu.co
- **Password:** 123

---

## 📊 Modelo de Datos

### Tablas Principales

- **users**: Perfiles de usuarios con roles (student, monitor, admin, coordinator)
- **subjects**: Materias universitarias disponibles
- **enrollments**: Inscripciones de estudiantes a materias
- **monitors**: Asignación de monitores a materias
- **time_slots**: Horarios propuestos por monitores
- **votes**: Votaciones de estudiantes por horarios
- **materials**: Materiales compartidos (PDFs, videos, etc.)
- **sessions**: Sesiones de monitoría realizadas
- **attendance**: Registro de asistencia a sesiones

---

## 🚀 Deployment

La aplicación está configurada para deployment automático en **Vercel**:

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno de Supabase
3. Deploy automático en cada push a `main`

```bash
# Build manual
npm run build

# Preview local del build
npm run preview
```

---

## 🤝 Contribuciones

Este proyecto fue desarrollado como demo/prototipo para el curso de **Gestión de Proyectos**.

### Equipo Fundador

- **Camilo Estrada Ortega** - Co-fundador
- **Robert González Cabarcas** - Desarrollador Web & Co-fundador
- **Jose Londoño Páez** - Co-fundador
- **Jussi Torres González** - Co-fundador
- **Daniel Otero Núñez** - Co-fundador

---

## 📜 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 🎓 Contexto Académico

**Proyecto Final** — *Gestión de Proyectos*
**Universidad del Magdalena** — Facultad de Ingeniería
**Semestre**: 2025-2

### Objetivos Cumplidos
- ✅ Implementación de aplicación web full-stack
- ✅ Integración con base de datos en la nube (Supabase)
- ✅ Sistema de autenticación y autorización
- ✅ UI/UX moderna y responsiva
- ✅ Deployment en producción (Vercel)
- ✅ Gestión de proyecto colaborativo

---

## 📧 Contacto

**Robert González Cabarcas** - Desarrollador Principal
[GitHub](https://github.com/robertJr18)

---

<div align="center">

**⭐ Si este proyecto te resultó útil, considera darle una estrella ⭐**

</div>
