# Plan de Proyecto - Research Hub

Herramienta para investigadores científicos con web app y desktop app

## 📋 Tabla de Contenidos

- [Descripción](#descripción-del-proyecto)
- [Alcance MVP](#alcance---mvp)
- [Stack Tecnológico](#stack-tecnológico)
- [Arquitectura](#arquitectura-general)
- [Estructura](#estructura-de-carpetas)
- [Fases](#fases-de-desarrollo)
- [Despliegue](#despliegue)

## Descripción del Proyecto

Desarrollo de una aplicación web y de escritorio diseñada para facilitar la gestión de investigaciones científicas. La plataforma permitirá a los investigadores organizar proyectos, datos, colaboraciones y publicaciones en un solo lugar.

### Características Principales
- Gestión integral de proyectos de investigación
- Almacenamiento y organización de datos científicos
- Colaboración entre investigadores
- Sincronización web-desktop en tiempo real
- Acceso desde cualquier lugar

## Alcance - MVP

### Primera Versión incluye:
- ✅ Gestión de proyectos de investigación
- ✅ Almacenamiento y organización de datos
- ✅ Sistema de autenticación de usuarios
- ✅ Visualización de información en la web
- ✅ App de escritorio con datos sincronizados
- ✅ Real-time updates (PocketBase en dev, Supabase en prod)

### No incluye (Fase 2+):
- ❌ Colaboración avanzada (solo lectura inicialmente)
- ❌ Análisis estadísticos
- ❌ Integración con herramientas externas
- ❌ Notificaciones avanzadas

## Stack Tecnológico

### Frontend Web
| Tecnología | Versión | Propósito |
|-----------|---------|----------|
| Next.js | 14+ | Framework React con SSR y API routes |
| React | 18+ | UI library |
| TypeScript | 5.3+ | Tipado estático |
| Tailwind CSS | 3.3+ | Estilos utility-first |
| Zod | 3.22+ | Validación de esquemas |

### Backend & Datos - Desarrollo
| Tecnología | Propósito |
|-----------|----------|
| PocketBase | Backend auto-hospedable (local) |
| SQLite | Base de datos local |
| PocketBase Auth | Autenticación local |
| PocketBase Storage | Almacenamiento local |
| Docker | Contenedor para standarizar ambiente |

### Backend & Datos - Producción
| Tecnología | Propósito |
|-----------|----------|
| Supabase | Backend as a Service completo |
| PostgreSQL | Base de datos relacional |
| Supabase Auth | Autenticación |
| Supabase Storage | Almacenamiento de archivos |
| Realtime Subscriptions | Actualizaciones en tiempo real |

### Desktop
| Tecnología | Propósito |
|-----------|----------|
| Electron | 24+ | Framework para apps de escritorio |
| Electron Forge | Herramienta de build y packaging |
| electron-builder | Empaquetado multiplataforma |

### DevOps & Despliegue
| Herramienta | Propósito |
|-----------|----------|
| Vercel | Hosting web automático |
| GitHub | Control de versiones |
| GitHub Actions | CI/CD pipeline |
| ESLint | Linting de código |
| Prettier | Formateo de código |

## Arquitectura General

### Desarrollo Local

```
┌─────────────────────────────────────────────┐
│         Research Hub - Desarrollo           │
├─────────────────────────────────────────────┤
│                                             │
│  ┌──────────────────┐   ┌──────────────┐   │
│  │   Web App        │   │  Desktop App │   │
│  │  (Next.js 14+)   │   │ (Electron)   │   │
│  │  + React 18      │   │              │   │
│  │  + Tailwind      │   │Reutiliza     │   │
│  │  localhost:3000  │   │componentes   │   │
│  └────────┬─────────┘   └────┬─────────┘   │
│           │                  │             │
│           └────────┬─────────┘             │
│                    │                       │
│         ┌──────────▼──────────┐            │
│         │  API Client (SDK)   │            │
│         │  (Adaptable)        │            │
│         └──────────┬──────────┘            │
│                    │                       │
│         ┌──────────▼──────────┐            │
│         │   PocketBase (Dev)  │            │
│         │   localhost:8090    │            │
│         │   (Docker)          │            │
│         └──────────┬──────────┘            │
│                    │                       │
│        ┌───────────┼───────────┐           │
│        │           │           │           │
│   ┌────▼───┐  ┌───▼────┐ ┌───▼────┐      │
│   │ Auth   │  │SQLite  │ │Storage │      │
│   │(JWT)   │  │(Local) │ │(Local) │      │
│   └────────┘  └────────┘ └────────┘      │
└─────────────────────────────────────────────┘
```

### Producción

```
┌─────────────────────────────────────────────┐
│      Research Hub - Producción              │
├─────────────────────────────────────────────┤
│                                             │
│  ┌──────────────────┐   ┌──────────────┐   │
│  │   Web App        │   │  Desktop App │   │
│  │ (Vercel)         │   │ (GitHub Rel.)   │
│  │ (Next.js Edge)   │   │              │   │
│  │ research-hub...  │   │Reutiliza     │   │
│  │ .vercel.app      │   │componentes   │   │
│  └────────┬─────────┘   └────┬─────────┘   │
│           │                  │             │
│           └────────┬─────────┘             │
│                    │                       │
│         ┌──────────▼──────────┐            │
│         │  API Client (SDK)   │            │
│         │  (Mismo)            │            │
│         └──────────┬──────────┘            │
│                    │                       │
│         ┌──────────▼──────────┐            │
│         │   Supabase (Prod)   │            │
│         │   (API Remota)      │            │
│         └──────────┬──────────┘            │
│                    │                       │
│        ┌───────────┼───────────┐           │
│        │           │           │           │
│   ┌────▼───┐  ┌───▼────┐ ┌───▼────┐      │
│   │ Auth   │  │PostgreSQL │Storage │      │
│   │(JWT)   │  │(PostgreSQL)│(S3)   │      │
│   └────────┘  └────────┘ └────────┘      │
└─────────────────────────────────────────────┘
```

### Flujo de Datos

**Desarrollo**:
1. Web & Desktop → API Client (SDK) → PocketBase (localhost:8090) → SQLite
2. Real Time Subscriptions vía PocketBase WebSocket

**Producción**:
1. Web → Vercel → Supabase API → PostgreSQL
2. Desktop → Supabase API → PostgreSQL
3. Real Time Subscriptions vía Supabase WebSocket

**Migración**: Datos migran automáticamente de PocketBase a Supabase en el primer deploy

## Estructura de Carpetas

```
research-hub/
├── apps/
│   ├── web/                 # Next.js application
│   │   ├── src/
│   │   │   ├── app/         # App router (Next.js 14)
│   │   │   ├── components/  # React components
│   │   │   ├── lib/         # Utilities
│   │   │   ├── hooks/       # Custom hooks
│   │   │   └── styles/      # Tailwind config
│   │   ├── public/
│   │   └── package.json
│   │
│   └── desktop/             # Electron application
│       ├── src/
│       │   ├── main/        # Main process
│       │   ├── preload/     # Preload scripts
│       │   └── renderer/    # Renderer (Next.js)
│       └── package.json
│
├── packages/
│   ├── ui-components/       # Shared React components
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── types/
│   │   └── package.json
│   │
│   ├── api-client/          # Supabase client
│   │   ├── src/
│   │   │   ├── client.ts
│   │   │   ├── queries/
│   │   │   ├── mutations/
│   │   │   └── types/
│   │   └── package.json
│   │
│   └── utils/               # Shared utilities
│       ├── src/
│       │   ├── constants/
│       │   ├── helpers/
│       │   └── types/
│       └── package.json
│
├── docs/                    # Project documentation
│   ├── PLAN.md             # This file
│   ├── DATABASE_SCHEMA.md  # DB structure
│   ├── SETUP_SUPABASE.md   # Supabase setup
│   ├── SETUP_VERCEL.md     # Vercel deployment
│   └── SETUP_NEXTJS.md     # Next.js setup
│
├── .github/
│   └── workflows/
│       ├── test.yml
│       ├── lint.yml
│       └── deploy.yml
│
├── CLAUDE.md               # Preferencias y flujos
├── .env.example
├── .gitignore
├── tsconfig.json           # TypeScript config
├── eslint.config.js        # ESLint config
├── prettier.config.js      # Prettier config
└── package.json            # Monorepo workspaces
```

## Fases de Desarrollo

### Fase 1: Configuración Inicial (Semana 1)
- [ ] Crear repositorio y estructura monorepo
- [ ] Configurar Next.js 14 con TypeScript y Tailwind
- [ ] Configurar Supabase SDK
- [ ] Crear schema básico de BD
- [ ] Setup GitHub y Vercel

**Entregables**: Proyecto funcionando en local

### Fase 2: Autenticación (Semana 2)
- [ ] Implementar Supabase Auth
- [ ] Crear páginas de login/signup
- [ ] Proteger rutas privadas
- [ ] Configurar JWT y sesiones

**Entregables**: Sistema de autenticación funcionando

### Fase 3: Gestión de Proyectos (Semana 3-4)
- [ ] Tabla de proyectos en Supabase
- [ ] CRUD de proyectos
- [ ] UI para crear/editar/eliminar proyectos
- [ ] Vista de lista de proyectos
- [ ] Detalles de proyecto

**Entregables**: Users pueden crear y gestionar proyectos

### Fase 4: Almacenamiento de Datos (Semana 5-6)
- [ ] Tabla de datasets
- [ ] Carga de archivos
- [ ] Visualización de datos
- [ ] Gestión de archivos
- [ ] Preview de datos

**Entregables**: Sistema completo de almacenamiento

### Fase 5: Aplicación Desktop (Semana 7-8)
- [ ] Setup Electron + Electron Forge
- [ ] Reutilizar componentes React
- [ ] Sincronización con Supabase
- [ ] Packaging para múltiples OS
- [ ] Auto-updates

**Entregables**: App de escritorio multiplataforma

### Fase 6: Despliegue y Polish (Semana 9-10)
- [ ] Vercel deployment
- [ ] GitHub Actions pipeline
- [ ] Testing y QA
- [ ] Documentación
- [ ] Performance optimization

**Entregables**: MVP en producción

## Despliegue

### Vercel (Web)

**Ventajas**:
- Despliegue automático desde GitHub
- Preview deployments para cada PR
- serverless functions incluidas
- Edge functions para cache global
- Environment variables seguras
- Monitoring integrado

**Configuración**:
- Conectar repositorio GitHub
- Variables de entorno en Vercel dashboard
- Auto-deploy en push a main
- Preview deploys en PRs

Ver: `docs/SETUP_VERCEL.md`

### GitHub Actions (CI/CD)

```yaml
# Test en cada PR
- Lint (ESLint)
- Format check (Prettier)
- Build Next.js
- Run tests

# Deploy en main
- Build all packages
- Deploy web a Vercel
- Create release notes
```

### Desktop (GitHub Releases)

- Build con Electron Forge
- Crear releases en GitHub
- Auto-update integrado
- Soportar Windows, macOS, Linux

## Consideraciones Importantes

### Seguridad
- ✅ JWT con Supabase
- ✅ Row Level Security (RLS) en BD
- ✅ HTTPS en Vercel
- ✅ Environment variables separadas
- ✅ Validación de inputs con Zod

### Rendimiento
- ✅ Image optimization en Next.js
- ✅ Code splitting automático
- ✅ Caching con Supabase Real Time
- ✅ Edge caching en Vercel
- ✅ Lazy loading de componentes

### Escalabilidad
- ✅ Supabase escala automáticamente
- ✅ Vercel auto-scaling
- ✅ CDN global en Vercel
- ✅ Monorepo facilita crecimiento

### Sincronización Web-Desktop
- ✅ Supabase Real Time para actualizaciones
- ✅ Ambas apps usan mismo API
- ✅ Caché local en Electron si es necesario
- ✅ Conflicto resolution automático

## Próximos Pasos

1. ✅ Crear cuenta en Supabase
2. ✅ Conectar GitHub a Vercel
3. [ ] Setup Next.js local
4. [ ] Crear schema en Supabase
5. [ ] Primera versión de UI
6. [ ] Fase 1 completa

---

**Versión**: 0.1.0
**Última actualización**: 2026-03-18
**Autor**: Antonio (all825@inlumine.ual.es)
