# Research Hub

Herramienta para investigadores científicos - Web + Desktop App

**Dev Stack**: Next.js 14+ | React 18+ | TypeScript | PocketBase | Electron | Docker

**Prod Stack**: Vercel | Supabase | PostgreSQL | Electron Releases

## 🚀 Quick Start

```bash
# 1. Clonar y instalar
git clone <repo>
cd research-hub
npm install

# 2. Levantar PocketBase (desarrollo)
docker-compose up -d pocketbase

# 3. Configurar variables (.env.local)
cp .env.example .env.local

# 4. Desarrollo
npm run dev -w apps/web
# Acceso: http://localhost:3000
# PocketBase Admin: http://localhost:8090/_/

# 5. Build
npm run build
```

**Ver `docs/SETUP_POCKETBASE.md` para setup detallado**

## 📖 Documentación

**Empieza por aquí**:
- [`docs/ROADMAP.md`](./docs/ROADMAP.md) - Timeline y decisiones

**Desarrollo Local**:
- [`docs/SETUP_POCKETBASE.md`](./docs/SETUP_POCKETBASE.md) - PocketBase + Docker
- [`docs/DATABASE_SCHEMA.md`](./docs/DATABASE_SCHEMA.md) - Schema SQL

**Otros**:
- [`docs/PLAN.md`](./docs/PLAN.md) - Plan completo y arquitectura
- [`docs/MIGRATION_POCKETBASE_SUPABASE.md`](./docs/MIGRATION_POCKETBASE_SUPABASE.md) - Migración a producción
- [`docs/SETUP_SUPABASE.md`](./docs/SETUP_SUPABASE.md) - Setup Supabase (producción)
- [`docs/SETUP_VERCEL.md`](./docs/SETUP_VERCEL.md) - Deploy Vercel (producción)
- [`CLAUDE.md`](./CLAUDE.md) - Preferencias y flujos de trabajo

## 🏗️ Estructura

```
research-hub/
├── apps/
│   ├── web               # Next.js app (localhost:3000)
│   └── desktop           # Electron app
├── packages/
│   ├── ui-components/    # React compartidos
│   ├── api-client/       # Cliente (PocketBase local, Supabase prod)
│   └── utils/            # Utilidades compartidas
├── docker/               # Docker compose + Dockerfile
├── docs/                 # Documentación completa
├── docker-compose.yml    # PocketBase + servicios
├── CLAUDE.md             # Preferencias y flujos
└── README.md             # Este archivo
```

## 📋 Scripts

```bash
npm run dev              # Dev mode
npm run build            # Build all packages
npm run lint             # ESLint
npm run test             # Tests
npm run dev -w apps/web  # Solo web app
```

## 🔗 Documentación Rápida

**Primeros pasos**:
1. [ROADMAP.md](./docs/ROADMAP.md) - Lee esto primero
2. [SETUP_POCKETBASE.md](./docs/SETUP_POCKETBASE.md) - Setup local

**Referencia**:
- [Plan Completo](./docs/PLAN.md)
- [Database Schema](./docs/DATABASE_SCHEMA.md)
- [PocketBase Setup](./docs/SETUP_POCKETBASE.md)
- [Migración a Supabase](./docs/MIGRATION_POCKETBASE_SUPABASE.md)
- [Preferencias](./CLAUDE.md)

---

**¡Empieza por `docs/ROADMAP.md` y `docs/SETUP_POCKETBASE.md`!**
