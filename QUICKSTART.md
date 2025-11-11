# ⚡ Inicio Rápido - Despliegue en Vercel

Esta guía te permite tener la plataforma funcionando en **menos de 10 minutos**.

## 🎯 Lo que necesitas

- ✅ Cuenta de GitHub (gratuita)
- ✅ Cuenta de Vercel (gratuita)
- ✅ Cuenta de Supabase (gratuita)
- ⏱️ Tiempo: 10 minutos

---

## 📝 Paso 1: Configurar Supabase (3 minutos)

### 1.1 Crear Proyecto

1. Ve a [supabase.com](https://supabase.com)
2. Click en **Start your project**
3. Sign in con GitHub
4. Click en **New Project**
5. Completa:
   - Name: `cyber-valtorix-soc`
   - Database Password: (genera una segura)
   - Region: (el más cercano)
6. Click **Create new project**
7. ⏳ Espera 2 minutos mientras se crea

### 1.2 Ejecutar Schema SQL

1. En tu proyecto de Supabase, ve al menú lateral → **SQL Editor**
2. Click en **New query**
3. Copia y pega el SQL completo de `src/lib/supabase.ts` (líneas 11-120)
4. Click **Run** (botón verde abajo a la derecha)
5. ✅ Deberías ver "Success. No rows returned"

### 1.3 Configurar Autenticación

1. Ve al menú lateral → **Authentication** → **Providers**
2. Busca **Email** y asegúrate que esté **Enabled**
3. Ve a **Authentication** → **URL Configuration**
4. Por ahora, déjalo en default (lo actualizaremos después)

### 1.4 Obtener Credenciales

1. Ve a **Settings** (ícono de engranaje abajo) → **API**
2. Copia y guarda en un lugar seguro:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

---

## 🚀 Paso 2: Desplegar en Vercel (5 minutos)

### 2.1 Subir código a GitHub

```bash
# En tu terminal, dentro del proyecto
git init
git add .
git commit -m "Initial commit - SOC Training Platform"

# Crear repo en GitHub y subir
gh repo create soc-training-platform --public
git push -u origin main
```

**O manualmente:**
1. Ve a [github.com/new](https://github.com/new)
2. Crea un repo llamado `soc-training-platform`
3. Sigue las instrucciones para push de código existente

### 2.2 Conectar con Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Sign in con tu cuenta de GitHub
3. Click **Add New** → **Project**
4. Busca `soc-training-platform`
5. Click **Import**

### 2.3 Configurar Variables de Entorno

En la pantalla de configuración de Vercel:

1. Expande **Environment Variables**
2. Agrega estas 3 variables:

```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: [tu URL de Supabase que copiaste]

Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: [tu anon key de Supabase que copiaste]

Name: NEXT_PUBLIC_APP_URL
Value: https://soc-training-platform.vercel.app
(o tu dominio personalizado si tienes uno)
```

3. Click **Deploy**
4. ⏳ Espera 2-3 minutos

### 2.4 ✅ Verificar Despliegue

Cuando termine el build:
1. Click en **Visit** o en el dominio que aparece
2. Deberías ver la pantalla de login/registro
3. 🎉 **¡Tu plataforma está en vivo!**

---

## 🔐 Paso 3: Configurar URLs en Supabase (1 minuto)

1. Copia tu URL de Vercel (ej. `https://soc-training-platform.vercel.app`)
2. Ve a tu proyecto de Supabase
3. **Authentication** → **URL Configuration**
4. Actualiza:
   - **Site URL**: `https://tu-app.vercel.app`
   - **Redirect URLs**: `https://tu-app.vercel.app/**`
5. Click **Save**

---

## 👤 Paso 4: Crear Usuario Administrador (1 minuto)

### 4.1 Registrar Usuario

1. Ve a tu app en Vercel
2. Click en **Registrarse** o **Sign Up**
3. Ingresa:
   - Email: tu email
   - Nombre: tu nombre
4. Click **Registrarse**
5. Revisa tu email para confirmar (puede tardar 1-2 min)
6. Click en el link de confirmación

### 4.2 Hacer Administrador

1. Ve a tu proyecto de Supabase
2. **Table Editor** → **profiles**
3. Encuentra tu usuario
4. Click en el campo `role`
5. Cambia de `student` a `admin`
6. ✅ Guarda

### 4.3 Recargar App

1. Vuelve a tu app en Vercel
2. Refresca la página (F5)
3. Ahora deberías ver la pestaña **Admin** 🎉

---

## ✅ ¡Listo! - Próximos Pasos

Tu plataforma está funcionando. Ahora puedes:

### 1. Agregar Escenarios

**Opción A**: Subir PDF
1. Ve a **Admin** → **Escenarios**
2. Arrastra un PDF con contenido de escenario
3. Revisa y guarda

**Opción B**: Crear manualmente
1. Usa el SQL de ejemplo en `MIGRATION.md`
2. Ejecútalo en Supabase SQL Editor

### 2. Configurar Comandos

1. Ve a **Admin** → **Comandos**
2. Click **Nuevo Comando**
3. Agrega comandos como `ping`, `nmap`, `dig`, etc.

### 3. Invitar Estudiantes

1. Comparte la URL de tu app
2. Los usuarios se registran como "Student" por defecto
3. Pueden empezar a usar la plataforma inmediatamente

---

## 🔧 Troubleshooting Rápido

### ❌ Error "Invalid JWT" o "Not authenticated"

**Solución**: Verifica que las URLs de redirect en Supabase incluyan tu dominio de Vercel.

### ❌ "Module not found: xterm"

**Solución**:
```bash
npm install xterm xterm-addon-fit xterm-addon-web-links
git add .
git commit -m "Add xterm dependencies"
git push
```
Vercel hará redeploy automático.

### ❌ No aparece la pestaña Admin

**Solución**: Verifica que tu rol en Supabase esté en `'admin'` y refresca la página.

### ❌ Terminal no se muestra

**Solución**: Verifica la consola del navegador (F12) para errores. Puede ser un problema de CSP o CORS.

---

## 📞 Soporte

¿Problemas? Contacta:
- Email: support@cybervaltorix.com
- Documentación completa: Ver `README.md`
- Arquitectura: Ver `ARCHITECTURE.md`

---

## 🎉 ¡Felicidades!

Tu Plataforma SOC Training está operativa en:
- ✅ **Frontend**: Vercel
- ✅ **Backend**: Supabase
- ✅ **Costo**: $0/mes
- ✅ **Escalable**: Hasta 100 estudiantes sin costo

**Siguiente paso recomendado**: Revisa `EXECUTIVE_SUMMARY.md` para entender el roadmap y las capacidades completas.

---

**Tiempo total invertido**: ~10 minutos ⚡  
**Status**: 🟢 LIVE
