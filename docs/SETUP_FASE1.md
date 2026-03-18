# Setup Fase 1 - Configuración Inicial

Guía paso a paso para configurar el proyecto Research Hub localmente.

## Tabla de Contenidos

- [Pre-requisitos](#pre-requisitos)
- [Paso 1: Clonar Repositorio](#paso-1-clonar-repositorio)
- [Paso 2: Instalar Dependencias](#paso-2-instalar-dependencias)
- [Paso 3: Configurar PocketBase](#paso-3-configurar-pocketbase)
- [Paso 4: Setup Monorepo](#paso-4-setup-monorepo)
- [Paso 5: Variables de Entorno](#paso-5-variables-de-entorno)
- [Paso 6: Verificar Setup](#paso-6-verificar-setup)
- [Próximos Pasos](#próximos-pasos)

## Pre-requisitos

### Software Requerido

- **Node.js**: 18+ (recomendado 20 LTS)
  ```bash
  node --version  # Debe ser v18+
  ```

- **npm**: 9+
  ```bash
  npm --version  # Debe ser v9+
  ```

- **Git**: Cualquier versión reciente
  ```bash
  git --version
  ```

- **Docker Desktop**: Para PocketBase
  - [Descargar Docker Desktop](https://www.docker.com/products/docker-desktop)
  - Verificar: `docker --version`

### Hardware Recomendado

- RAM: 4GB mínimo, 8GB recomendado
- Disco: 2GB disponibles
- CPU: Procesador moderno

## Paso 1: Clonar Repositorio

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/research-hub.git
cd research-hub

# Verificar rama principal
git branch -a
```

## Paso 2: Instalar Dependencias

```bash
# Instalar dependencias del monorepo
npm install

# Esto instalará:
# - Dependencias raíz (ESLint, Prettier, TypeScript, etc.)
# - Dependencias de cada workspace (apps/web, apps/desktop, packages/*)

# Verificar instalación
npm list --depth=0
```

**Si hay errores**:
```bash
# Limpiar caché npm
npm cache clean --force

# Limpiar node_modules
rm -rf node_modules
rm package-lock.json

# Reintentar
npm install
```

## Paso 3: Configurar PocketBase

### 3.1 Levantar PocketBase con Docker

```bash
# Crear carpeta de datos (si no existe)
mkdir -p pb_data

# Levantar PocketBase
docker-compose up -d pocketbase

# Verificar que está corriendo
docker-compose ps

# Ver logs
docker-compose logs -f pocketbase

# Debería mostrar algo como:
# pocketbase | Server started at http://0.0.0.0:8090
```

### 3.2 Acceder a Admin UI

1. Abrir navegador: http://localhost:8090/_/
2. Crear usuario admin (primera vez)
   - Email: admin@test.com
   - Password: Test123!@#
3. Hacer clic en "Create admin"

### 3.3 Crear Schema

1. En Admin UI, ir a **Collections**
2. Crear colecciones según `docs/DATABASE_SCHEMA.md`

**Alternativa: Importar JSON**

Si tienes un archivo `pb_schema.json`:

```bash
# Desde CLI (si está disponible)
pb collections import pb_schema.json
```

### 3.4 Datos de Prueba

```bash
# Crear usuario y proyecto de prueba
node scripts/seed-pocketbase.mjs

# Verificar en Admin UI: Collections → users, projects
```

**Si el script no existe aún, lo crearemos en Fase 2**

## Paso 4: Setup Monorepo

### 4.1 Verificar Estructura

```bash
# Verificar que las carpetas existen
ls -la apps/web
ls -la apps/desktop
ls -la packages/

# Estructura esperada:
# apps/
# ├── web/
# │   ├── package.json
# │   ├── src/
# │   └── ...
# └── desktop/
#     ├── package.json
#     └── ...
# packages/
# ├── ui-components/package.json
# ├── api-client/package.json
# └── utils/package.json
```

### 4.2 Instalar Dependencias de Workspaces

```bash
# Esto ya se hizo con 'npm install', pero si necesitas reinstalar uno:
npm install -w apps/web
npm install -w packages/api-client

# Ver todos los workspaces
npm ls -w
```

### 4.3 Verificar Links de Workspaces

```bash
# Los workspaces están linkeados localmente
# Ver: package.json en la raíz

cat package.json | grep workspaces
```

## Paso 5: Variables de Entorno

### 5.1 Crear .env.local

```bash
# Copiar template
cp .env.example .env.local

# Editar con variables correctas
nano .env.local  # o tu editor favorito
```

### 5.2 Variables Necesarias

**`.env.local`**:
```env
# PocketBase (desarrollo)
NEXT_PUBLIC_POCKETBASE_URL=http://localhost:8090

# App
NEXT_PUBLIC_APP_ENV=development
NODE_ENV=development
```

**Notas**:
- Variables que empiezan con `NEXT_PUBLIC_` se envían al cliente
- Las otras son solo servidor

### 5.3 Verificar Variables

```bash
# Ver variables cargadas (no mostrar valores)
env | grep POCKETBASE
env | grep NODE_ENV
```

## Paso 6: Verificar Setup

### 6.1 Verificar PocketBase

```bash
# Verificar que está corriendo
curl http://localhost:8090/api/health

# Debería retornar: {"code":200,"message":"OK"}
```

### 6.2 Verificar Node Setup

```bash
# Instalar dependencias web
npm install -w apps/web

# Build de verificación
npm run build -w apps/web

# Si no hay errores, está bien configurado
```

### 6.3 Checkl ist Inicial

- ✅ Node.js 18+ instalado
- ✅ npm 9+ instalado
- ✅ Docker Desktop corriendo
- ✅ PocketBase corriendo (`docker-compose ps`)
- ✅ Admin UI accesible (http://localhost:8090/_/)
- ✅ npm install completado
- ✅ .env.local creado
- ✅ TypeScript compila sin errores

Si todo está ✅, **¡Setup completado!**

## Próximos Pasos

### Fase 1.B: Primera App

```bash
# Ir a la carpeta web
cd apps/web

# Iniciar servidor dev
npm run dev

# Abrir navegador
# http://localhost:3000
```

### Fase 2: Autenticación

- Conectar con PocketBase Auth
- Login/Signup pages
- Protected routes

### Recursos Útiles

- [Docker Compose Docs](https://docs.docker.com/compose/)
- [PocketBase API](https://pocketbase.io/docs/api/records/)
- [Next.js Getting Started](https://nextjs.org/docs/getting-started)
- [npm Workspaces](https://docs.npmjs.com/cli/v10/using-npm/workspaces)

## Troubleshooting

### "docker: command not found"

```bash
# Docker no instalado o no en PATH
# Instalar Docker Desktop:
# https://www.docker.com/products/docker-desktop
```

### "Port 8090 already in use"

```bash
# Parar contenedor actual
docker-compose down

# O cambiar puerto en docker-compose.yml
# ports: - "8091:8090"
```

### "npm ERR! code EWORKSPACES"

```bash
# Error en workspaces
npm ls -w  # Ver cuál

# Reinstalar ese workspace
rm -rf apps/web/node_modules
npm install -w apps/web
```

### "NEXT_PUBLIC variables not loading"

```bash
# Next.js requiere restart para variables
npm run dev -w apps/web
# Presionar q para salir, luego volver a ejecutar
```

### "PocketBase Admin UI vacío/errores"

```bash
# Limpiar datos y reiniciar
docker-compose down -v
docker-compose up -d pocketbase

# Esperar 10 segundos, abrir Admin UI nuevamente
```

## Verificación Final

Ejecutar todo junto:

```bash
# 1. PocketBase corriendo
docker-compose ps | grep pocketbase

# 2. Compilar todos los packages
npm run build

# 3. Verificar sin errores
npm run lint

# 4. Iniciar dev mode
npm run dev -w apps/web &

# 5. Health check
curl http://localhost:3000  # Debe retornar HTML
curl http://localhost:8090/api/health  # Debe retornar {"code":200,"message":"OK"}

# ✅ TODO OK!
```

---

**Versión**: 0.1.0
**Última actualización**: 2026-03-18

**¡Fase 1 completada! Pasa a Fase 2: Autenticación**
