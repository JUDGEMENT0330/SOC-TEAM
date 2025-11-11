# 📦 Guía de Migración - HTML a React Platform

## 🎯 Objetivo

Esta guía detalla cómo migrar el contenido del archivo HTML original a la nueva plataforma React.

## 📋 Contenido a Migrar

### 1. Glosario de Términos ✅

**Estado**: Ya migrado

El glosario está implementado en `src/components/glossary/Glossary.tsx` con todos los términos originales.

**No requiere acción adicional**.

---

### 2. Escenarios de Capacitación

**Origen**: HTML original - Escenarios 1-6  
**Destino**: Base de datos Supabase - tabla `scenarios`

#### Método A: Crear manualmente en el Admin Panel

1. Inicia sesión como administrador
2. Ve a **Admin → Escenarios**
3. Para cada escenario, haz clic en **Nuevo Escenario**
4. Completa los campos:
   - Título
   - Descripción
   - Dificultad
   - Tiempo estimado
   - Contenido (situación, objetivos, entregables)

#### Método B: Script de migración SQL

Crea y ejecuta este SQL en Supabase:

```sql
-- Escenario 1: El Diagnóstico (OSI/TCP-IP)
INSERT INTO scenarios (title, description, difficulty, estimated_time, category, content, commands)
VALUES (
  'Escenario 1: El Diagnóstico (OSI/TCP-IP)',
  'Diagnóstico de problemas de red usando los modelos OSI y TCP/IP',
  'beginner',
  20,
  'Networking',
  '{
    "situation": "Reciben dos tickets de soporte simultáneamente: Ticket A sobre un sitio lento, Ticket B sobre un servidor inaccesible.",
    "objectives": [
      "Diagnosticar problemas de conectividad de red",
      "Identificar la capa del modelo OSI/TCP-IP afectada",
      "Usar herramientas de diagnóstico (ping, traceroute)"
    ],
    "deliverables": [
      "Proceso de diagnóstico con comandos usados",
      "Identificación de la capa del problema",
      "Herramientas de troubleshooting utilizadas"
    ]
  }',
  '[
    {
      "command": "ping 10.10.30.5",
      "description": "Verificar conectividad básica",
      "expectedOutput": "Alta latencia y pérdida de paquetes",
      "category": "network"
    },
    {
      "command": "traceroute 10.10.40.10",
      "description": "Rastrear ruta de red",
      "expectedOutput": "Host unreachable",
      "category": "network"
    }
  ]'
);

-- Escenario 2: El Vector de Ataque (DNS)
INSERT INTO scenarios (title, description, difficulty, estimated_time, category, content, commands)
VALUES (
  'Escenario 2: El Vector de Ataque (DNS)',
  'Análisis de tráfico DNS anómalo y amenazas de seguridad',
  'intermediate',
  20,
  'Security',
  '{
    "situation": "Detectado tráfico DNS anómalo desde una laptop interna hacia resolvers no autorizados, incluyendo un servidor en Rusia.",
    "objectives": [
      "Analizar el tráfico DNS sospechoso",
      "Identificar el tipo de amenaza",
      "Proponer políticas de contención en firewall"
    ],
    "deliverables": [
      "Análisis de la amenaza DNS",
      "Política de firewall de egreso",
      "Comandos de simulación (opcional)"
    ]
  }',
  '[
    {
      "command": "dig @8.8.8.8 example.com",
      "description": "Consulta DNS a resolver público",
      "expectedOutput": "Respuesta DNS normal",
      "category": "dns"
    }
  ]'
);

-- Continuar con Escenarios 3, 4, 5, 6...
-- (Similar estructura para cada escenario)
```

---

### 3. Recursos Educativos ✅

**Estado**: Ya migrado

Los recursos están implementados en `src/components/resources/ResourceLibrary.tsx`.

**No requiere acción adicional**.

---

### 4. Comandos de Terminal

**Origen**: JavaScript en el HTML  
**Destino**: Tabla `command_templates`

#### Migrar comandos manualmente

1. Admin Panel → **Comandos**
2. Agregar cada comando con su:
   - Nombre
   - Sintaxis
   - Descripción
   - Categoría
   - Ejemplos

#### Ejemplo de comandos a migrar:

```sql
-- Comando: ping
INSERT INTO command_templates (name, command, description, category, parameters, examples)
VALUES (
  'Ping Command',
  'ping [ip]',
  'Envía paquetes ICMP para verificar conectividad con un host',
  'network',
  '[
    {
      "name": "ip",
      "type": "ip",
      "required": true,
      "description": "Dirección IP o hostname del destino"
    }
  ]',
  ARRAY['ping 8.8.8.8', 'ping google.com', 'ping 192.168.1.1']
);

-- Comando: nmap
INSERT INTO command_templates (name, command, description, category, parameters, examples)
VALUES (
  'Nmap Port Scanner',
  'nmap [options] [target]',
  'Escaneo de puertos y detección de servicios',
  'security',
  '[
    {
      "name": "options",
      "type": "string",
      "required": false,
      "description": "Opciones de escaneo (-sT, -sS, -p, etc.)"
    },
    {
      "name": "target",
      "type": "ip",
      "required": true,
      "description": "IP o rango de IPs a escanear"
    }
  ]',
  ARRAY['nmap 192.168.1.1', 'nmap -sT -p 80,443 example.com', 'nmap -sS 10.0.0.0/24']
);

-- Agregar más comandos: dig, ssh, netstat, ss, traceroute, etc.
```

---

## 🎨 Migración de Estilos

### Colores ya migrados:
- `--cv-dark-green: #2d5016`
- `--cv-olive: #556b2f`
- `--cv-gold: #b8860b`

Estos están configurados en:
- `tailwind.config.js`
- `src/app/globals.css`

### Glassmorphism

El efecto de vidrio está implementado globalmente:

```css
.glass-morphism {
  background: rgba(45, 80, 22, 0.85);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(184, 134, 11, 0.3);
}
```

---

## 📄 Checklist de Migración

### Contenido
- [x] Glosario de términos
- [ ] Escenario 1: OSI/TCP-IP
- [ ] Escenario 2: DNS
- [ ] Escenario 3: Subnetting
- [ ] Escenario 4: Análisis combinado
- [ ] Escenario 5: Recuperación de control
- [ ] Escenario 6: Equipo Rojo
- [x] Recursos educativos
- [ ] Comandos de terminal (ping, nmap, dig, etc.)

### Funcionalidad
- [x] Sistema de pestañas
- [x] Terminal multi-sesión
- [x] Sistema de progreso
- [x] Autenticación
- [x] Panel de administración
- [x] Carga de PDFs
- [x] Editor de comandos

### Estilo
- [x] Tema Cyber Valtorix (colores)
- [x] Glassmorphism
- [x] Animaciones
- [x] Responsive design
- [x] Iconos (Lucide React)

---

## 🚀 Pasos Finales Post-Migración

### 1. Verificar Datos

```bash
# Conectar a Supabase y verificar
SELECT COUNT(*) FROM scenarios;        -- Debe ser 6
SELECT COUNT(*) FROM command_templates; -- Al menos 10
SELECT COUNT(*) FROM profiles;         -- Al menos 1 admin
```

### 2. Pruebas de Usuario

- [ ] Registrar usuario estudiante
- [ ] Iniciar un escenario
- [ ] Ejecutar comandos en terminal
- [ ] Verificar progreso guardado
- [ ] Completar escenario

### 3. Pruebas de Admin

- [ ] Subir PDF de escenario
- [ ] Crear comando nuevo
- [ ] Ver dashboard de estudiantes
- [ ] Verificar estadísticas

### 4. Optimización

```bash
# Construir para producción
npm run build

# Verificar que no haya errores
npm run lint
```

---

## 🔄 Actualizar Contenido Futuro

### Agregar Nuevo Escenario

**Opción 1**: Via UI (recomendado)
1. Admin Panel → Escenarios → Nuevo
2. Completar formulario
3. Guardar

**Opción 2**: Via SQL
```sql
INSERT INTO scenarios (...)
VALUES (...);
```

### Actualizar Escenario Existente

```sql
UPDATE scenarios
SET content = '{...}',
    updated_at = NOW()
WHERE id = 'uuid-del-escenario';
```

---

## 📞 Soporte de Migración

Si encuentras problemas durante la migración:

1. **Error de base de datos**: Verifica el schema en Supabase
2. **Error de autenticación**: Revisa las URLs de redirect
3. **Contenido no se muestra**: Verifica el formato JSON en la base de datos

Para asistencia técnica: support@cybervaltorix.com

---

**Última actualización**: Noviembre 2024  
**Tiempo estimado de migración completa**: 2-4 horas
