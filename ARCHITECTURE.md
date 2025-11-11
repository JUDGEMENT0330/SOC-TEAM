# 🏗️ Arquitectura y Guía de Despliegue - Plataforma SOC Cyber Valtorix

## 📊 Resumen Ejecutivo para CISO

Esta plataforma transforma el taller HTML estático en una aplicación empresarial escalable con:

- **Autenticación y autorización** basada en roles (Admin/Instructor/Student)
- **Base de datos relacional** con Supabase (PostgreSQL)
- **Terminal multi-sesión** con emulación real usando xterm.js
- **Sistema de carga de contenido** vía PDFs
- **Analíticas en tiempo real** del progreso de estudiantes
- **Despliegue serverless** en Vercel con alta disponibilidad

## 🎯 Mejoras Clave vs. HTML Original

### 1. Escalabilidad
- **Antes**: Archivo HTML estático, no escalable
- **Ahora**: Aplicación React con base de datos, soporta miles de usuarios simultáneos

### 2. Gestión de Contenido
- **Antes**: Modificar contenido requiere editar código HTML
- **Ahora**: Interface de administración para agregar escenarios vía PDF

### 3. Seguimiento de Estudiantes
- **Antes**: Sin seguimiento, sin persistencia
- **Ahora**: Progreso automático, puntuaciones, tiempo invertido, histórico completo

### 4. Terminal
- **Antes**: Simulación básica con JavaScript
- **Ahora**: Emulador real con xterm.js, múltiples pestañas, historial de comandos

### 5. Autenticación
- **Antes**: Sin autenticación, acceso público
- **Ahora**: Sistema completo con roles, permisos y seguridad a nivel de fila (RLS)

## 🔐 Arquitectura de Seguridad

### Row Level Security (RLS) en Supabase

Todas las tablas usan políticas de seguridad:

```sql
-- Ejemplo: Estudiantes solo ven su propio progreso
CREATE POLICY "Users can view own progress"
  ON student_progress FOR SELECT
  USING (auth.uid() = user_id);
```

### Roles y Permisos

| Rol | Crear Escenarios | Ver Todos los Estudiantes | Editar Comandos | Ver Progreso Propio |
|-----|------------------|---------------------------|-----------------|---------------------|
| **Admin** | ✅ | ✅ | ✅ | ✅ |
| **Instructor** | ✅ | ✅ | ✅ | ✅ |
| **Student** | ❌ | ❌ | ❌ | ✅ |

## 📐 Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENTE (Navegador)                      │
│                                                              │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │   React UI  │  │  xterm.js    │  │  Framer Motion   │  │
│  └─────────────┘  └──────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    VERCEL (Edge Network)                     │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │           Next.js 14 (App Router)                  │    │
│  │  - Server Components                               │    │
│  │  - API Routes                                      │    │
│  │  - Static Generation                               │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ REST API
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   SUPABASE (Backend)                         │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │ PostgreSQL   │  │   Auth       │  │   Storage       │  │
│  │  Database    │  │  (JWT)       │  │   (PDFs)        │  │
│  └──────────────┘  └──────────────┘  └─────────────────┘  │
│                                                              │
│  Row Level Security (RLS) activada en todas las tablas      │
└─────────────────────────────────────────────────────────────┘
```

## 🗄️ Schema de Base de Datos

### Tabla: `profiles`
- `id` (UUID, PK): ID del usuario
- `email` (TEXT): Email del usuario
- `role` (ENUM): 'admin' | 'instructor' | 'student'
- `name` (TEXT): Nombre completo

### Tabla: `scenarios`
- `id` (UUID, PK): ID del escenario
- `title` (TEXT): Título del escenario
- `description` (TEXT): Descripción
- `difficulty` (ENUM): 'beginner' | 'intermediate' | 'advanced'
- `estimated_time` (INT): Tiempo estimado en minutos
- `content` (JSONB): Contenido estructurado del escenario
- `commands` (JSONB): Comandos asociados

### Tabla: `student_progress`
- `id` (UUID, PK): ID del progreso
- `user_id` (UUID, FK): Referencia a `profiles`
- `scenario_id` (UUID, FK): Referencia a `scenarios`
- `status` (ENUM): 'not_started' | 'in_progress' | 'completed'
- `progress` (INT): Porcentaje de completitud (0-100)
- `score` (INT): Puntuación final (0-100)
- `time_spent` (INT): Tiempo invertido en minutos

### Tabla: `terminal_sessions`
- `id` (UUID, PK): ID de la sesión
- `user_id` (UUID, FK): Referencia a `profiles`
- `name` (TEXT): Nombre de la pestaña
- `working_directory` (TEXT): Directorio actual
- `history` (JSONB): Historial de comandos
- `environment` (JSONB): Variables de entorno simuladas

## 🚀 Procedimiento de Despliegue

### Pre-requisitos
1. Cuenta de Vercel (gratuita o Pro)
2. Cuenta de Supabase (gratuita o Pro)
3. Código en repositorio Git (GitHub, GitLab, Bitbucket)

### Paso 1: Configurar Supabase

```bash
# 1. Crear proyecto en https://supabase.com
# 2. Ejecutar SQL del schema (ver src/lib/supabase.ts)
# 3. Configurar Authentication -> Email Provider
# 4. Copiar URL y anon key
```

### Paso 2: Desplegar en Vercel

```bash
# Opción A: CLI
npm i -g vercel
vercel login
vercel

# Opción B: GitHub Integration (recomendado)
# 1. Push código a GitHub
# 2. Importar en vercel.com
# 3. Configurar variables de entorno
# 4. Deploy automático
```

### Paso 3: Variables de Entorno en Producción

En Vercel Dashboard → Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_APP_URL=https://tu-app.vercel.app
```

### Paso 4: Actualizar URLs en Supabase

En Supabase Dashboard → Authentication → URL Configuration:

```
Site URL: https://tu-app.vercel.app
Redirect URLs: https://tu-app.vercel.app/**
```

### Paso 5: Crear Usuario Administrador

```bash
# 1. Registrar usuario en la aplicación
# 2. En Supabase SQL Editor:
UPDATE profiles
SET role = 'admin'
WHERE email = 'admin@cybervaltorix.com';
```

## 📈 Monitoreo y Analíticas

### Métricas Clave a Monitorear

1. **Rendimiento**
   - Vercel Analytics: Tiempo de carga, Core Web Vitals
   - Supabase: Consultas lentas, uso de conexiones

2. **Uso**
   - Usuarios activos (DAU/MAU)
   - Escenarios más completados
   - Tiempo promedio por escenario

3. **Errores**
   - Vercel Logs: Errores de servidor
   - Sentry (opcional): Errores de cliente
   - Supabase Logs: Errores de base de datos

### Dashboards Recomendados

- **Vercel Dashboard**: Despliegues, rendimiento, logs
- **Supabase Dashboard**: Base de datos, auth, uso de API
- **Admin Panel interno**: Estadísticas de estudiantes

## 💰 Costos Estimados

### Tier Gratuito (hasta 100 estudiantes)
- Vercel: Gratis (Hobby plan)
- Supabase: Gratis (hasta 500MB DB, 2GB bandwidth)
- **Total: $0/mes**

### Tier Profesional (hasta 1000 estudiantes)
- Vercel Pro: $20/mes
- Supabase Pro: $25/mes
- **Total: $45/mes**

### Tier Enterprise (ilimitado)
- Vercel Enterprise: Contacto para pricing
- Supabase Team: $599/mes
- **Total: ~$600+/mes**

## 🔧 Mantenimiento

### Actualizaciones de Dependencias

```bash
# Mensualmente
npm outdated
npm update

# Actualizaciones mayores (con precaución)
npm install next@latest react@latest
```

### Backups

Supabase realiza backups automáticos diarios. Para backups manuales:

```bash
# En Supabase Dashboard → Settings → Database
# Click en "Backup now"
```

### Logs y Debugging

```bash
# Logs de Vercel
vercel logs

# Logs de Supabase
# Dashboard → Logs → Database/Auth
```

## 🚨 Plan de Recuperación ante Desastres

1. **Base de datos**
   - Backups automáticos en Supabase (7 días retención en plan gratuito)
   - Exportar backup manual antes de cambios importantes

2. **Código**
   - Git como sistema de control de versiones
   - Rollback instantáneo en Vercel a cualquier despliegue previo

3. **Credenciales**
   - Almacenar credenciales en gestor de contraseñas (1Password, LastPass)
   - Rotar claves API cada 90 días

## 📞 Soporte y Escalamiento

### Contactos de Soporte
- **Vercel**: support@vercel.com (respuesta 24h)
- **Supabase**: support@supabase.com (respuesta 24-48h)

### Cuándo Escalar

Considera actualizar a planes pagos cuando:
- Más de 100 estudiantes activos simultáneamente
- Base de datos > 500MB
- Bandwidth > 2GB/mes
- Necesitas soporte prioritario

---

**Documento preparado para**: CISO, Cyber Valtorix S.A. DE C.V.  
**Versión**: 2.0  
**Fecha**: Noviembre 2024
