# Guía de Despliegue - Vercel

Setup de la aplicación web Next.js en Vercel con CI/CD automático.

## 1. Pre-requisitos

- Repositorio GitHub con el código
- Cuenta en Vercel (gratis)
- Variables de entorno de Supabase

## 2. Crear Proyecto en Vercel

### Opción A: Desde Dashboard de Vercel (Recomendado)

1. Ir a [vercel.com](https://vercel.com)
2. Iniciar sesión o crear cuenta con GitHub
3. Hacer clic en "Add New..." → "Project"
4. Seleccionar repositorio `research-hub`
5. Vercel automáticamente detectará que es un monorepo

### Opción B: Desde CLI

```bash
npm i -g vercel
vercel login
vercel
```

## 3. Configuración del Proyecto

En Vercel dashboard:

### Paso 1: Seleccionar la App Web

1. En "Root Directory", seleccionar: `apps/web`
2. Vercel detectará automáticamente Next.js
3. Build command: `npm run build`
4. Output directory: `.next`

### Paso 2: Variables de Entorno

Añadir en Vercel dashboard → Settings → Environment Variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_APP_ENV=production
```

**IMPORTANTE**: Las variables que empiezan con `NEXT_PUBLIC_` son públicas (se envían al cliente).

### Paso 3: Dominios

1. Ir a Settings → Domains
2. Añadir dominio personalizado (opcional)
3. Vercel proporciona URL gratuita: `research-hub-xxx.vercel.app`

## 4. Despliegue Inicial

### Automático

Vercel automáticamente deploya cuando:
- Haces push a la rama `main`
- Subes un PR (crea preview deployment)

### Manual

```bash
# Deployar la rama actual
vercel

# Deployar a producción
vercel --prod

# Deployar sin caché
vercel --no-cache
```

## 5. Preview Deployments

Vercel crea automáticamente una URL de preview para cada PR:

- Permite revisar cambios antes de merge
- URL: `research-hub-xxx-git-branch-name.vercel.app`
- Comentario automático en PR
- Same environment variables como prod

### Deshabilitar Preview Deployments

Settings → Deployments → Uncheck "Preview Deployments"

## 6. Configuración Avanzada

### vercel.json

Crear archivo `apps/web/vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "devCommand": "npm run dev",
  "env": [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY"
  ],
  "functions": {
    "api/**/*.ts": {
      "memory": 512,
      "maxDuration": 10
    }
  }
}
```

### next.config.js (Optimizaciones)

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
  headers: async () => [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=60, s-maxage=120' },
      ],
    },
  ],
};

module.exports = nextConfig;
```

## 7. CI/CD con GitHub Actions

### Crear workflow

Crear archivo `.github/workflows/test-and-deploy.yml`:

```yaml
name: Test & Deploy

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Build
        run: npm run build

      - name: Run tests
        run: npm run test -- --run

  deploy:
    needs: test
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Vercel
        uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

### Obtener Tokens

1. En Vercel dashboard → Settings → Tokens
2. Crear "Scoped Token"
3. Copiar token
4. En GitHub repo → Settings → Secrets
5. Añadir secretos:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID` (en URL de Vercel)
   - `VERCEL_PROJECT_ID` (en vercel.json o dashboard)

## 8. Monitoreo

### Vercel Analytics

1. Ir a Settings → Analytics
2. Web Vitals automáticamente habilitado
3. Revisar Core Web Vitals en dashboard

### Logs

1. Deployments → Seleccionar deployment
2. Ver logs en tiempo real
3. Búsqueda de errores

### Rollback

1. Deployments → Seleccionar deployment anterior
2. Hacer clic en "Redeploy"

## 9. Troubleshooting

### Error: "Build failed"

```bash
# Check logs en Vercel dashboard
# Común: variable de entorno faltante
# Verificar NEXT_PUBLIC_* variables
```

### Preview deployment no muestra cambios

1. Esperar a que GitHub Actions termine
2. Limpiar caché: Ctrl+Shift+Delete
3. Recargar preview URL

### Errores de API

1. Verificar CORS en Supabase
2. Verificar que anon key es correcta
3. Revisar logs en Vercel

## 10. Optimizaciones

### Image Optimization

Next.js automáticamente optimiza imágenes. Usar `<Image>` component:

```tsx
import Image from 'next/image'

export default function Hero() {
  return (
    <Image
      src="/hero.jpg"
      alt="Hero"
      width={1200}
      height={600}
      priority
    />
  )
}
```

### Caching

```typescript
// Cache long-term
revalidate: 3600, // 1 hora

// ISR - Incremental Static Regeneration
export const revalidate = 86400; // 24 horas
```

### Edge Functions

Para APIs que necesitan baja latencia:

```typescript
// api/low-latency.ts
export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  return new Response('Fast!', { status: 200 });
}
```

## 11. Custom Domain

1. Settings → Domains
2. "Add Domain"
3. Ingresar dominio
4. Vercel proporciona nameservers
5. Actualizar DNS en proveedor

## 12. SSL/HTTPS

Vercel automáticamente genera certificado SSL con Let's Encrypt:
- ✅ HTTPS habilitado automáticamente
- ✅ Certificado renovado automáticamente
- ✅ Redirección de HTTP a HTTPS

## Comandos Útiles

```bash
# Deployar producción
vercel --prod

# Ver proyectos
vercel projects

# Listar deployments
vercel deployments

# Revisar logs
vercel logs

# Ver ambiente actual
vercel env pull

# Limpiar caché
vercel cache rm
```

## Referencias

- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel CLI](https://vercel.com/docs/cli)

---

**Versión**: 0.1.0
**Última actualización**: 2026-03-18
