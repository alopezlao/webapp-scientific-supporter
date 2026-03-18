# Roadmap del Proyecto - Research Hub

Visión general, timeline y próximos pasos.

## 🎯 Visión

Crear una plataforma moderna para investigadores científicos que sea:
- Fácil de usar
- Escalable desde MVP a producción
- Segura y confiable
- Rápida de desarrollar (iteración ágil)

## 📊 Estrategia Dev → Prod

```
LOCAL DEVELOPMENT
└─ PocketBase (local)
   └─ SQLite
   └─ Docker
   └─ Real Time WebSocket
      │
      └─────────────────────────────┐
                                    │
                        PRODUCTION  │
                        ┌───────────┘
                        │
                        ▼
                    Supabase
                    ├─ PostgreSQL
                    ├─ Auth
                    ├─ Storage
                    └─ Real Time
                        │
              ┌─────────┼─────────┐
              │         │         │
          VERCEL    ELECTRON   MOBILE
         (Web)     (Desktop)   (Future)
```

## 🚀 Fases del Desarrollo

### Fase 1: Setup Inicial (Semana 1-2)
- [ ] Monorepo estructurado con npm workspaces
- [ ] Next.js 14 + TypeScript + Tailwind
- [ ] PocketBase local con Docker
- [ ] Package compartidos (ui-components, api-client)
- [ ] GitHub Actions CI/CD básico

**Entregable**: Ambiente de desarrollo 100% funcional

### Fase 2: Autenticación (Semana 3-4)
- [ ] Auth con PocketBase (local)
- [ ] Páginas login/signup
- [ ] Protected routes en Next.js
- [ ] JWT + refresh tokens
- [ ] Sessions persistentes

**Entregable**: Sistema de login funcional

### Fase 3: MVP Core (Semana 5-10)
- [ ] Gestión de proyectos (CRUD)
- [ ] Almacenamiento de datos
- [ ] Notas y anotaciones
- [ ] File uploads
- [ ] Real Time updates (WebSocket)
- [ ] Búsqueda básica

**Entregable**: MVP web completo

### Fase 4: Desktop App (Semana 11-12)
- [ ] Electron setup
- [ ] Reutilizar componentes React
- [ ] Sync con PocketBase
- [ ] Packaging multiplataforma
- [ ] Auto-updates

**Entregable**: Desktop app para Windows/Mac/Linux

### Fase 5: Testing & Polish (Semana 13-14)
- [ ] Testing (Vitest + RTL)
- [ ] Performance optimization
- [ ] Documentación completa
- [ ] Bug fixes
- [ ] UI/UX improvements

**Entregable**: MVP completamente testado

### Fase 6: Migración a Producción (Semana 15-16)
- [ ] Setup Supabase
- [ ] Migración de datos (PocketBase → Supabase)
- [ ] Actualizar código (cliente Supabase)
- [ ] Staging en Vercel
- [ ] Testing en producción
- [ ] Go live

**Entregable**: MVP en producción

## 📁 Stack por Fase

### Fase 1-2
```
Frontend:  Next.js 14 + React 18 + TypeScript + Tailwind
Backend:   PocketBase (local)
Database:  SQLite (local)
Desktop:   -
Deploy:    -
```

### Fase 3-5
```
Frontend:  Next.js 14 + React 18 + TypeScript + Tailwind
Backend:   PocketBase (local)
Database:  SQLite (local)
Desktop:   Electron 24+
Deploy:    GitHub Actions + Docker
```

### Fase 6+
```
Frontend:  Next.js 14 en Vercel
Backend:   Supabase (PostgreSQL)
Database:  PostgreSQL (Supabase)
Desktop:   Electron con Supabase remoto
Deploy:    Vercel + GitHub Releases
```

## 🔄 Actualización de Credenciales

### De Desarrollo a Producción

Cambios necesarios en deploy a producción:

**.env.local** (desarrollo):
```env
NEXT_PUBLIC_POCKETBASE_URL=http://localhost:8090
```

**.env.production** (Vercel):
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=anon-key-here
```

### Cliente API (Adaptable)

Crear cliente que se adapte al ambiente:

```typescript
// lib/api-client.ts
export const getClient = () => {
  if (process.env.NODE_ENV === 'production') {
    return initSupabase()
  } else {
    return initPocketBase()
  }
}
```

## 📚 Documentación Disponible

| Documento | Sección | Fase |
|-----------|---------|------|
| `PLAN.md` | Plan completo + arquitectura | Todas |
| `SETUP_POCKETBASE.md` | PocketBase + Docker | 1-5 |
| `DATABASE_SCHEMA.md` | Schema SQL | 1-2 |
| `MIGRATION_POCKETBASE_SUPABASE.md` | Migración | 6 |
| `SETUP_VERCEL.md` | Despliegue web | 6 |
| `SETUP_SUPABASE.md` | Setup Supabase | 6 |
| `CLAUDE.md` | Preferencias del proyecto | Todas |

## 🎯 Decisiones Principales

### 1. PocketBase para Desarrollo

**Por qué**:
- ✅ Zero setup - funciona sin dependencias
- ✅ Corre localmente - sin conexión internet
- ✅ Fácil de resetear/limpiar
- ✅ Migración clara a Supabase

**Alternativas consideradas**:
- ❌ Supabase local - más complejo (Docker pesado)
- ❌ Backend custom - más desarrollo inicial
- ❌ Firebase - menos control

### 2. Supabase para Producción

**Por qué**:
- ✅ PostgreSQL robusta - escalable
- ✅ Auth + Storage incluidos
- ✅ Real Time subscriptions
- ✅ Bien documentado

**Alternativas consideradas**:
- ❌ Firebase - más caro a escala
- ❌ Backend custom - mantenimiento
- ❌ PocketBase en servidor - menos confiable

### 3. Vercel para Web

**Por qué**:
- ✅ Despliegue automático desde GitHub
- ✅ Edge functions + optimizaciones
- ✅ Preview deployments
- ✅ Gratis para pequeños proyectos

**Alternativas consideradas**:
- ❌ Heroku - menos performance
- ❌ DigitalOcean - más mantenimiento
- ❌ AWS - más complejo

### 4. Electron para Desktop

**Por qué**:
- ✅ Reutilizar código React
- ✅ Multiplataforma (Windows/Mac/Linux)
- ✅ Acceso a APIs del SO
- ✅ Maduro y bien soportado

**Alternativas consideradas**:
- ❌ Tauri - experimental aún
- ❌ Blazor - no es JavaScript
- ❌ Standalone ejecutable - más complejo

## ⏱️ Timeline Estimado

```
Mes 1 (4 semanas)
├─ Semana 1-2: Setup inicial + Auth
└─ Semana 3-4: MVP core web

Mes 2 (4 semanas)
├─ Semana 1-2: Continuar MVP
└─ Semana 3-4: Desktop + Testing

Mes 3 (4 semanas)
├─ Semana 1: Migración a Supabase
├─ Semana 2: Testing producción
├─ Semana 3: Go live
└─ Semana 4: Feedback + improvements
```

## 🚦 Estado Actual

- ✅ Arquitectura definida
- ✅ Stack confirmado
- ✅ Documentación completa
- ⏳ **Siguiente**: Setup inicial (Fase 1)

## 🎓 Learnings & Mitigación de Riesgos

### Riesgos Identificados

| Riesgo | Probabilidad | Mitigación |
|--------|-------------|-----------|
| Migración PocketBase → Supabase falla | Media | Documentación + testing exhaustivo |
| Performance insuficiente en producción | Media | Testing de carga + monitoring |
| Pérdida de datos | Baja | Backups + versionado |
| Scope creep | Alta | MVP claramente definido |
| Desarrollo lento | Media | Arquitectura modular + reutilización |

### Mitigación

1. **MVP claro**: Solo features esenciales
2. **Testing temprano**: Tests desde Fase 1
3. **Documentación**: Decisiones documentadas
4. **Backups**: Backups frecuentes de datos
5. **Monitoreo**: Alertas en producción

## 🔗 Links Útiles

- [PocketBase](https://pocketbase.io)
- [Supabase](https://supabase.com)
- [Vercel](https://vercel.com)
- [Next.js 14](https://nextjs.org)
- [Electron](https://www.electronjs.org)

## 📋 Próximos Pasos

1. **HOY**: Revisar este roadmap
2. **Mañana**: Setup Fase 1 (Monorepo + PocketBase)
3. **Esta semana**: Autenticación funcional
4. **Próximas semanas**: MVP core

---

**Versión**: 0.1.0
**Creado**: 2026-03-18
**Actualizado por**: Antonio (all825@inlumine.ual.es)

**¡Listos para empezar! 🚀**
