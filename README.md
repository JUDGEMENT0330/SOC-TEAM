# 🛡️ Cyber Valtorix - SOC Training Platform

Plataforma profesional de capacitación para Centros de Operaciones de Seguridad (SOC) construida con React, Next.js y Supabase.

## 🚀 Características

### Para Estudiantes
- ✅ **Escenarios Interactivos**: Ejercicios prácticos de seguridad con seguimiento de progreso
- 🖥️ **Terminal Multi-pestaña**: Emulador de terminal con soporte para múltiples sesiones simultáneas
- 📚 **Biblioteca de Recursos**: Documentación detallada de conceptos de networking y seguridad
- 📊 **Seguimiento de Progreso**: Sistema automático de seguimiento con puntuaciones y tiempo

### Para Administradores/Instructores
- 📄 **Carga de PDFs**: Sistema automático para convertir PDFs en escenarios estructurados
- ⚙️ **Editor de Comandos**: Gestión de comandos de terminal y sus comportamientos
- 👥 **Dashboard de Estudiantes**: Monitoreo en tiempo real del progreso de todos los estudiantes
- 📈 **Analíticas Avanzadas**: Estadísticas detalladas por escenario y estudiante

### Tecnologías
- **Frontend**: React 18, Next.js 14, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Terminal**: xterm.js con addons
- **Backend**: Supabase (PostgreSQL + Auth)
- **Deployment**: Vercel

## 📋 Requisitos Previos

- Node.js 18+ y npm
- Cuenta de Supabase (gratuita)
- Cuenta de Vercel (gratuita)

## 🔧 Instalación Local

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd soc-training-platform
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar Supabase

#### 3.1 Crear proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta
2. Crea un nuevo proyecto
3. Guarda la **URL del proyecto** y la **anon key**

#### 3.2 Configurar la base de datos

1. En el dashboard de Supabase, ve a **SQL Editor**
2. Copia y ejecuta el SQL del archivo `src/lib/supabase.ts` (sección `DATABASE_SCHEMA`)
3. Esto creará todas las tablas y políticas de seguridad

#### 3.3 Configurar autenticación

1. Ve a **Authentication > Providers**
2. Habilita **Email** provider
3. Configura las URLs:
   - Site URL: `http://localhost:3000` (desarrollo)
   - Redirect URLs: `http://localhost:3000/**`

### 4. Variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
cp .env.example .env.local
```

Edita `.env.local` con tus credenciales:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Ejecutar en desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### 6. Crear usuario administrador

1. Registra un nuevo usuario en `/auth/login`
2. En Supabase, ve a **Table Editor > profiles**
3. Cambia el campo `role` del usuario a `'admin'` o `'instructor'`

## 🚀 Despliegue en Vercel

### Opción 1: Despliegue con CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel

# Configurar variables de entorno en producción
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add NEXT_PUBLIC_APP_URL production

# Desplegar a producción
vercel --prod
```

### Opción 2: Despliegue desde GitHub

1. Sube tu código a GitHub
2. Ve a [vercel.com](https://vercel.com)
3. Haz clic en **Add New Project**
4. Importa tu repositorio de GitHub
5. Configura las variables de entorno:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_APP_URL`
6. Haz clic en **Deploy**

### Actualizar URLs en Supabase

Después del despliegue, actualiza las URLs en Supabase:

1. Ve a **Authentication > URL Configuration**
2. Actualiza:
   - Site URL: `https://tu-app.vercel.app`
   - Redirect URLs: `https://tu-app.vercel.app/**`

## 📁 Estructura del Proyecto

```
soc-training-platform/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Layout principal
│   │   ├── page.tsx            # Página principal
│   │   └── globals.css         # Estilos globales
│   ├── components/
│   │   ├── admin/              # Componentes de administración
│   │   │   ├── AdminPanel.tsx
│   │   │   ├── ScenarioUploader.tsx
│   │   │   ├── CommandEditor.tsx
│   │   │   └── StudentDashboard.tsx
│   │   ├── terminal/           # Componentes de terminal
│   │   │   └── TerminalContainer.tsx
│   │   ├── scenarios/          # Componentes de escenarios
│   │   │   └── ScenarioList.tsx
│   │   ├── resources/          # Componentes de recursos
│   │   │   └── ResourceLibrary.tsx
│   │   └── glossary/           # Componentes de glosario
│   │       └── Glossary.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx     # Contexto de autenticación
│   ├── lib/
│   │   ├── supabase.ts         # Cliente y schema de Supabase
│   │   └── pdfParser.ts        # Parser de PDFs
│   └── types/
│       └── index.ts            # Definiciones de TypeScript
├── public/                     # Archivos estáticos
├── tailwind.config.js          # Configuración de Tailwind
├── next.config.js              # Configuración de Next.js
└── package.json                # Dependencias
```

## 🎨 Personalización del Tema

El tema de Cyber Valtorix está configurado en `tailwind.config.js`:

```javascript
colors: {
  'cv-dark-green': '#2d5016',
  'cv-olive': '#556b2f',
  'cv-gold': '#b8860b',
}
```

Para cambiar el tema, modifica estos valores y los estilos en `src/app/globals.css`.

## 🔐 Roles y Permisos

La plataforma tiene 3 roles:

1. **Student** (Estudiante)
   - Acceso a escenarios
   - Terminal interactiva
   - Ver progreso personal

2. **Instructor**
   - Todo lo de estudiante
   - Crear/editar escenarios
   - Ver progreso de estudiantes
   - Gestionar comandos

3. **Admin**
   - Todo lo de instructor
   - Gestión completa de usuarios
   - Configuración del sistema

## 📝 Uso de la Plataforma

### Crear Escenarios desde PDF

1. Ve al **Panel de Administración**
2. Selecciona la pestaña **Escenarios**
3. Arrastra y suelta un PDF o haz clic para seleccionar
4. El sistema extraerá automáticamente:
   - Título del escenario
   - Descripción
   - Objetivos
   - Dificultad estimada
5. Revisa y edita los campos extraídos
6. Guarda el escenario

### Agregar Comandos de Terminal

1. Ve al **Panel de Administración**
2. Selecciona la pestaña **Comandos**
3. Haz clic en **Nuevo Comando**
4. Configura:
   - Nombre del comando
   - Sintaxis (ej. `ping [ip]`)
   - Descripción
   - Categoría
   - Ejemplos de uso
5. Guarda el comando

### Monitorear Estudiantes

1. Ve al **Panel de Administración**
2. Selecciona la pestaña **Estudiantes**
3. Verás:
   - Lista de todos los estudiantes
   - Progreso individual
   - Puntuaciones promedio
   - Tiempo invertido
4. Haz clic en un estudiante para ver detalles

## 🐛 Resolución de Problemas

### Error: "Module not found: xterm"

```bash
npm install xterm xterm-addon-fit xterm-addon-web-links --save
```

### Error de autenticación en Supabase

1. Verifica que las URLs de redirect estén configuradas correctamente
2. Asegúrate de que las variables de entorno sean correctas
3. Revisa que el email provider esté habilitado

### La terminal no se muestra

1. Verifica que xterm.js esté instalado correctamente
2. Comprueba la consola del navegador para errores
3. Asegúrate de que el worker de PDF.js esté configurado correctamente

## 🤝 Contribuir

Este proyecto está diseñado para Cyber Valtorix. Para contribuir:

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Copyright © 2025 Cyber Valtorix S.A. DE C.V.
Todos los derechos reservados.

## 📞 Soporte

Para soporte técnico, contacta:
- Email: support@cybervaltorix.com
- Website: https://cybervaltorix.com

---

**Desarrollado con ❤️ para Cyber Valtorix**
