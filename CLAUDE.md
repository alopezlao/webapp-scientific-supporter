# CLAUDE.md - Preferencias y Flujos de Trabajo

Archivo de configuración de preferencias para el asistente Claude en este proyecto.

## 🎯 Preferencias Generales

### Documentación
- ✅ **Usar Markdown (.md)** para toda la documentación
- ❌ **NO crear archivos .docx**
- Mantener documentos claros y concisos
- Usar tablas cuando sea apropiado

### Stack Principal
- Aplicación de Escritorio Multiplataforma
- Empaquetado: **Electron** + **Electron Builder**
- Frontend: **Next.js 14+** (React 18+, TypeScript, Tailwind CSS)
- Backend y BD: **Local embebido** (Electron + SQLite)
- Integración nativa entre el UI y Electron via contextBridge

### Monorepo
- **Package manager**: npm workspaces
- **TypeScript**: Obligatorio en todo el código
- **Linting**: ESLint + Prettier
- **Testing**: Vitest + React Testing Library

## 🔄 Flujos de Trabajo

### Crear Documentación
1. Usar formato Markdown (.md)
2. Mantener consistencia con la arquitectura Desktop

### Configuración de Proyecto
1. Actualizar `package.json` si hay cambios en dependencias
2. Mantener `.env.example` sincronizado

## 📋 Preferencias de Comunicación

- Respuestas concisas y al punto
- Mostrar ejemplos de código relevantes
- Usar Markdown para toda la documentación

## 🚀 Próximas Acciones

1. Desarrollar la integración IPC entre Electron y Next.js
2. Desarrollar modelo de datos local en SQLite
3. Implementar integración de Google OAuth + Google Drive (lectura/escritura)
