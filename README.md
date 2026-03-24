# Research Hub Desktop

Cross-platform Desktop App for Scientific Researchers.

**Local Dev Stack**: Electron | Next.js 14+ | React 18+ | TypeScript | Supabase Local
**Packaging**: Electron Builder

## 🚀 Quick Start

```bash
# 1. Clone & Install
git clone <repo>
cd webapp-scientific-supporter
npm install

# 2. Setup Local Supabase
# Install Supabase CLI using your preferred method (https://supabase.com/docs/guides/cli)
supabase start

# 3. Setup environment variables
cp .env.example .env.local

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
│   ├── api-client/       # Supabase client wrapper
│   └── utils/            # Shared utilities
├── supabase/             # Supabase local configurations and migrations
└── README.md             # This file
```

## 📋 Scripts

```bash
npm run desktop:dev      # Dev mode (Electron + React)
npm run desktop:build    # Build electron app
npm run lint             # ESLint
npm run test             # Tests
```
