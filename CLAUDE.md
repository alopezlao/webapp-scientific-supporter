# CLAUDE.md - Preferencias y Flujos de Trabajo

Archivo de configuración de preferencias para el asistente Claude en este proyecto.

## 🎯 Preferencias Generales

### Documentación
- ✅ **Usar Markdown (.md)** para toda la documentación
- ❌ **NO crear archivos .docx**
- Mantener documentos claros y concisos
- Usar tablas cuando sea apropiado

### Despliegue & Backend

**Desarrollo Local**:
- Backend: **PocketBase** (auto-hospedable, corre localmente)
- Base de datos: SQLite (incluida en PocketBase)
- Docker para standarizar ambiente
- Migrations documentadas y automáticas

**Producción**:
- Backend: **Supabase** (PostgreSQL)
- Frontend: **Vercel**
- Migración de PocketBase a Supabase incluida

### Monorepo
- **Package manager**: npm workspaces
- **TypeScript**: Obligatorio en todo el código
- **Linting**: ESLint + Prettier
- **Testing**: Vitest + React Testing Library

## 🔄 Flujos de Trabajo

### Crear Documentación
1. Usar formato Markdown (.md)
2. Organizar en carpeta `/docs`
3. Actualizar tabla de contenidos si es necesario
4. Incluir ejemplos de código cuando sea relevante

### Actualizar Plan del Proyecto
1. Modificar el archivo `/docs/PLAN.md`
2. Mantener las fases de desarrollo
3. Actualizar stack tecnológico si hay cambios
4. Documentar nuevas decisiones arquitectónicas

### Agregar Nueva Documentación
1. Crear archivo .md en `/docs`
2. Nombre descriptivo (ej: `SETUP_VERCEL.md`)
3. Incluir tabla de contenidos para archivos largos
4. Mantener consistencia con documentación existente

### Configuración de Proyecto
1. Actualizar `package.json` si hay cambios en dependencias
2. Mantener `.env.example` sincronizado
3. Documentar variables de entorno en `/docs`

## 📋 Preferencias de Comunicación

- Respuestas concisas y al punto
- Listar opciones cuando haya decisiones
- Mostrar ejemplos de código relevantes
- Usar Markdown para toda la documentación

## 🛠️ Stack Confirmado

**Desarrollo**:
- **Frontend**: Next.js 14+, React 18+, TypeScript, Tailwind CSS
- **Backend**: PocketBase (local)
- **BD**: SQLite (local)
- **Desktop**: Electron 24+
- **Monorepo**: npm workspaces

**Producción**:
- **Frontend**: Next.js 14+ en Vercel
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Desktop**: Electron con Supabase remoto
- **Despliegue**: Vercel (web), GitHub Releases (desktop)

## 🚀 Próximas Acciones (según Antonio)

1. Agregar configuración de Vercel
2. Crear guía de despliegue en Vercel
3. Documentar flujos de CI/CD
4. Configurar archivos de monorepo iniciales

---

**Última actualización**: 2026-03-18
**Versión**: 0.1.0
