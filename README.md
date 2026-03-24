# Research Hub Desktop

Cross-platform Desktop App for Scientific Researchers.

**Local Dev Stack**: Electron | Next.js 14+ | React 18+ | TypeScript | SQLite embebido
**Packaging**: Electron Builder

## 🚀 Quick Start

```bash
# 1. Clone & Install
git clone <repo>
cd webapp-scientific-supporter
npm install

# 2. Setup environment variables
cp .env.example .env.local

# 3. Configure Google OAuth (opcional, recomendado)
# - En Google Cloud Console crea credenciales OAuth Desktop/Web
# - Autoriza redirect URI: http://127.0.0.1:54329
# - Copia GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET en .env.local

# 4. Run Development Server (Next.js + Electron)
npm run desktop:dev

# 5. Build Desktop Application
npm run desktop:build
```

## 🏗️ Structure

```text
research-hub/
├── apps/
│   └── desktop/          # Next.js app serving as Electron UI
├── electron/             # Electron entry points (main.js, preload.js)
├── packages/
│   ├── ui-components/    # Shared React components
│   ├── api-client/       # Cliente de datos local via Electron IPC
│   └── utils/            # Shared utilities
└── README.md             # This file
```

## 📋 Scripts

```bash
npm run desktop:dev      # Dev mode (Electron + React)
npm run desktop:build    # Build electron app
npm run lint             # ESLint
npm run test             # Tests
```

## 🔐 Autenticacion y almacenamiento local

- Login por email/password en SQLite local embebido.
- Login con Google (OAuth 2.0) usando navegador del sistema.
- Sesion local de app gestionada via cookie `HttpOnly` firmada.
- Token de Google persistido en el directorio de usuario de Electron para poder usar Google Drive.

## ☁️ Google Drive (lectura y escritura)

La app solicita alcance completo de Drive:

- Scope: `https://www.googleapis.com/auth/drive`
- Soporte actual en backend local:
  - Listar archivos
  - Leer contenido de un archivo
  - Crear/actualizar archivos de texto

### Variables necesarias

| Variable | Descripcion |
|---|---|
| `GOOGLE_CLIENT_ID` | Client ID OAuth de Google Cloud |
| `GOOGLE_CLIENT_SECRET` | Client Secret OAuth |
| `GOOGLE_REDIRECT_PORT` | Puerto local para callback OAuth (`54329` por defecto) |
| `AUTH_SESSION_SECRET` | Secreto para firma de sesion local |
