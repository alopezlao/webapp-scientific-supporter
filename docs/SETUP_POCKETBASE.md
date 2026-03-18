# Guía de Setup - PocketBase (Desarrollo)

Configuración de PocketBase para desarrollo local con Docker.

## Tabla de Contenidos

- [Qué es PocketBase](#qué-es-pocketbase)
- [Pre-requisitos](#pre-requisitos)
- [Opción 1: Docker (Recomendado)](#opción-1-docker-recomendado)
- [Opción 2: Binario Local](#opción-2-binario-local)
- [Configuración Inicial](#configuración-inicial)
- [Crear Schema](#crear-schema)
- [Usar en Desarrollo](#usar-en-desarrollo)
- [Datos de Prueba](#datos-de-prueba)
- [Troubleshooting](#troubleshooting)

## Qué es PocketBase

PocketBase es un backend open-source auto-hospedable que incluye:

- ✅ Base de datos SQLite integrada
- ✅ API REST automática
- ✅ WebSocket para Real Time
- ✅ Sistema de autenticación
- ✅ File storage integrado
- ✅ Admin UI web

**Ventajas para desarrollo**:
- Sin dependencias externas
- Corre localmente
- Fácil de resetear/limpiar
- Migración a Supabase bien documentada

## Pre-requisitos

### Opción Docker (Recomendado)
- Docker Desktop instalado
- 2GB de RAM disponibles
- Puerto 8090 disponible

### Opción Binario
- Go 1.19+ (o descargar binario precompilado)
- Puerto 8090 disponible

## Opción 1: Docker (Recomendado)

### 1. Crear Dockerfile

Crear archivo `docker/Dockerfile.pocketbase`:

```dockerfile
FROM alpine:latest

RUN apk add --no-cache curl

WORKDIR /pb

RUN curl -fsSL https://github.com/pocketbase/pocketbase/releases/download/v0.20.0/pocketbase_0.20.0_linux_amd64.zip -o pb.zip && \
    unzip pb.zip && \
    rm pb.zip

EXPOSE 8090

CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8090"]
```

### 2. Crear docker-compose.yml

En la raíz del proyecto:

```yaml
version: '3.8'

services:
  pocketbase:
    build:
      context: .
      dockerfile: docker/Dockerfile.pocketbase
    container_name: research-hub-pocketbase
    ports:
      - "8090:8090"
    volumes:
      - pb_data:/pb/pb_data
    environment:
      - POCKETBASE_ENCRYPTION_KEY=${POCKETBASE_ENCRYPTION_KEY:-}
    networks:
      - research-hub

volumes:
  pb_data:

networks:
  research-hub:
    driver: bridge
```

### 3. Crear archivo .env

```env
# PocketBase
POCKETBASE_ENCRYPTION_KEY=your-32-char-encryption-key-here
```

Generar key de 32 caracteres:
```bash
openssl rand -base64 32
```

### 4. Levantar PocketBase

```bash
# Build y run
docker-compose up -d pocketbase

# Ver logs
docker-compose logs -f pocketbase

# Parar
docker-compose down

# Limpiar datos y reiniciar
docker-compose down -v
docker-compose up -d pocketbase
```

### 5. Acceder a Admin UI

- URL: http://localhost:8090/_/
- Primera vez: crear usuario admin

## Opción 2: Binario Local

### 1. Descargar PocketBase

```bash
# Linux/macOS
curl -fsSL https://github.com/pocketbase/pocketbase/releases/download/v0.20.0/pocketbase_0.20.0_darwin_amd64.zip -o pb.zip

# Windows - Descargar manualmente desde:
# https://github.com/pocketbase/pocketbase/releases

unzip pb.zip
```

### 2. Ejecutar

```bash
./pocketbase serve --http=127.0.0.1:8090
```

Acceder a http://localhost:8090/_/

## Configuración Inicial

### 1. Crear Usuario Admin

1. Ir a http://localhost:8090/_/
2. Crear email y contraseña
3. Este será el usuario principal

### 2. Crear Colecciones (Tablas)

PocketBase usa "collections" en lugar de tablas.

**Opción A: Desde UI Admin**

1. Admin UI → Collections
2. "New collection"
3. Configurar campos

**Opción B: Importar JSON**

Ver sección "Crear Schema" abajo

## Crear Schema

### 1. Estructura de Colecciones

Crear archivo `pb_schema.json`:

```json
{
  "collections": [
    {
      "id": "users",
      "name": "users",
      "type": "auth",
      "system": false,
      "authRule": "@request.auth.id = id",
      "listRule": "",
      "viewRule": "@request.auth.id = id",
      "createRule": "",
      "updateRule": "@request.auth.id = id",
      "deleteRule": "@request.auth.id = id",
      "fields": [
        {
          "id": "username",
          "name": "username",
          "type": "text",
          "required": true,
          "unique": true
        },
        {
          "id": "email",
          "name": "email",
          "type": "email",
          "required": true,
          "unique": true
        },
        {
          "id": "emailVisibility",
          "name": "emailVisibility",
          "type": "bool",
          "default": false
        },
        {
          "id": "password",
          "name": "password",
          "type": "password",
          "required": true
        },
        {
          "id": "tokenKey",
          "name": "tokenKey",
          "type": "text"
        },
        {
          "id": "full_name",
          "name": "full_name",
          "type": "text"
        },
        {
          "id": "avatar",
          "name": "avatar",
          "type": "file"
        }
      ]
    },
    {
      "id": "projects",
      "name": "projects",
      "type": "base",
      "listRule": "owner_id = @request.auth.id",
      "viewRule": "owner_id = @request.auth.id",
      "createRule": "@request.auth.id != ''",
      "updateRule": "owner_id = @request.auth.id",
      "deleteRule": "owner_id = @request.auth.id",
      "fields": [
        {
          "id": "title",
          "name": "title",
          "type": "text",
          "required": true
        },
        {
          "id": "description",
          "name": "description",
          "type": "text"
        },
        {
          "id": "owner_id",
          "name": "owner_id",
          "type": "relation",
          "collectionId": "users",
          "required": true
        },
        {
          "id": "status",
          "name": "status",
          "type": "select",
          "values": ["active", "completed", "archived"],
          "default": "active"
        }
      ]
    }
  ]
}
```

### 2. Importar Schema

**Opción A: Desde CLI**

```bash
# PocketBase CLI (si está disponible)
pb collections import pb_schema.json
```

**Opción B: Desde Admin UI**

1. Admin UI → Settings → Export
2. Copiar JSON del schema
3. Reemplazar en Admin UI → Settings → Import

**Opción C: Crear manualmente**

1. Admin UI → Collections
2. "New collection" para cada tabla
3. Configurar campos según schema

## Usar en Desarrollo

### 1. Conectar desde Next.js

Instalar cliente:

```bash
npm install pocketbase
```

Crear cliente en `packages/api-client/src/pocketbase.ts`:

```typescript
import PocketBase from 'pocketbase'

const pb = new PocketBase(
  process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://localhost:8090'
)

export default pb
```

### 2. Variables de Entorno

`.env.local`:

```env
NEXT_PUBLIC_POCKETBASE_URL=http://localhost:8090
```

### 3. Usar en Componentes

```typescript
import { useEffect, useState } from 'react'
import pb from '@/lib/pocketbase'

export default function ProjectsList() {
  const [projects, setProjects] = useState([])

  useEffect(() => {
    const fetchProjects = async () => {
      const records = await pb.collection('projects').getList(1, 50)
      setProjects(records.items)
    }

    fetchProjects()

    // Real Time subscriptions
    pb.collection('projects').subscribe('*', (e) => {
      console.log('Change:', e)
    })

    return () => {
      pb.collection('projects').unsubscribe('*')
    }
  }, [])

  return (
    <ul>
      {projects.map((project) => (
        <li key={project.id}>{project.title}</li>
      ))}
    </ul>
  )
}
```

### 4. Autenticación

```typescript
// Login
const authData = await pb
  .collection('users')
  .authWithPassword(email, password)

// Signup
const record = await pb.collection('users').create({
  email,
  password,
  passwordConfirm: password,
  full_name: name,
})

await pb.collection('users').authWithPassword(email, password)

// Logout
pb.authStore.clear()

// Check auth
console.log(pb.authStore.isValid)
```

## Datos de Prueba

### Script para Crear Datos

Crear `scripts/seed-pocketbase.mjs`:

```javascript
import PocketBase from 'pocketbase'

const pb = new PocketBase('http://localhost:8090')

async function seed() {
  // Login como admin
  await pb.admins.authWithPassword('admin@test.com', 'password123')

  // Crear usuario de prueba
  const user = await pb.collection('users').create({
    email: 'test@example.com',
    password: 'password123',
    passwordConfirm: 'password123',
    full_name: 'Test User',
  })

  // Crear proyecto
  await pb.collection('projects').create({
    title: 'Test Project',
    description: 'A test project',
    owner_id: user.id,
    status: 'active',
  })

  console.log('✅ Datos de prueba creados')
}

seed().catch(console.error)
```

Ejecutar:

```bash
node scripts/seed-pocketbase.mjs
```

## Real Time Subscriptions

PocketBase soporta WebSocket en tiempo real:

```typescript
// Escuchar cambios en una colección
pb.collection('projects').subscribe('*', (e) => {
  console.log('action:', e.action)
  console.log('record:', e.record)
})

// Escuchar cambios en un registro específico
pb.collection('projects').subscribe('record_id', (e) => {
  console.log('cambio en registro:', e.record)
})

// Unsubscribe
pb.collection('projects').unsubscribe()
```

## Troubleshooting

### Puerto 8090 en uso

```bash
# Cambiar puerto
./pocketbase serve --http=127.0.0.1:8091

# O matar proceso en puerto 8090
lsof -i :8090
kill -9 <PID>
```

### Admin UI no funciona

1. Verificar que PocketBase está corriendo
2. Limpiar cache del navegador
3. Ir a http://localhost:8090 (sin `_/`)

### Conexión rechazada desde Next.js

1. Verificar que `NEXT_PUBLIC_POCKETBASE_URL` es correcto
2. PocketBase debe estar corriendo
3. En Docker, verificar networking

### Permisos insuficientes

1. Verificar RLS policies (listRule, viewRule, etc.)
2. Usuario debe estar autenticado
3. En Admin UI, los permisos no aplican (ves todo)

## Siguiente Paso

Una vez que PocketBase esté funcionando:

1. ✅ Schema creado
2. ✅ Datos de prueba cargados
3. ✅ Cliente conectado desde Next.js
4. ➡️ Construir componentes con datos reales
5. ➡️ Cuando esté en producción, migrar a Supabase

Ver: `docs/MIGRATION_POCKETBASE_SUPABASE.md`

---

**Versión**: 0.1.0
**Última actualización**: 2026-03-18
