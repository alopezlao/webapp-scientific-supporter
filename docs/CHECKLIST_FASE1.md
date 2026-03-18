# Checklist - Fase 1: Setup Inicial

Verificación paso a paso para completar la Fase 1.

## Pre-Requisitos

- [ ] Node.js 18+ instalado
- [ ] npm 9+ instalado
- [ ] Docker Desktop instalado
- [ ] Git configurado
- [ ] Editor de código (VSCode, etc.)

## Instalación Local

- [ ] Repositorio clonado
- [ ] `npm install` completado sin errores
- [ ] `.env.local` creado con variables correctas
- [ ] Carpetas `pb_data` creada (para PocketBase)

## Docker & PocketBase

- [ ] Docker Desktop corriendo
- [ ] `docker-compose up -d pocketbase` ejecutado
- [ ] `docker-compose ps` muestra `research-hub-pocketbase` corriendo
- [ ] http://localhost:8090 accesible
- [ ] Admin UI en http://localhost:8090/_/ abierta
- [ ] Usuario admin creado

## Base de Datos

- [ ] Schema de PocketBase creado (colecciones básicas)
- [ ] Al menos estas colecciones existen:
  - [ ] users (con autenticación)
  - [ ] projects
- [ ] Health check: `curl http://localhost:8090/api/health` retorna OK

## Configuración de Herramientas

- [ ] `tsconfig.json` en raíz ✅
- [ ] `eslint.config.js` configurado ✅
- [ ] `prettier.config.js` configurado ✅
- [ ] `.gitignore` configurado ✅
- [ ] Scripts de npm funcionando:
  - [ ] `npm run lint` sin errores
  - [ ] `npm run format` sin errores
  - [ ] `npm run type-check` sin errores

## Monorepo Setup

- [ ] Workspaces vinculados:
  - [ ] `@research-hub/web`
  - [ ] `@research-hub/desktop`
  - [ ] `@research-hub/ui-components`
  - [ ] `@research-hub/api-client`
  - [ ] `@research-hub/utils`
- [ ] `npm ls -w` muestra todos los workspaces
- [ ] Builds sin errores:
  - [ ] `npm run build` completado
  - [ ] `npm run build:web` completado

## API Client

- [ ] `@research-hub/api-client` exporta funciones:
  - [ ] `createClient()`
  - [ ] `getClient()`
  - [ ] `PocketBaseClient` clase
- [ ] Cliente se conecta a PocketBase exitosamente

## GitHub Actions

- [ ] `.github/workflows/ci.yml` creado ✅
- [ ] CI pipeline valida:
  - [ ] Linting
  - [ ] Type checking
  - [ ] Building

## Documentación

- [ ] `docs/SETUP_FASE1.md` creado y completo ✅
- [ ] `docs/ROADMAP.md` actualizado
- [ ] `README.md` actualizado
- [ ] `CLAUDE.md` actualizado

## Verificación Final

Ejecutar estos comandos en orden:

```bash
# 1. Health checks
docker-compose ps
curl http://localhost:8090/api/health

# 2. Dependencies
npm ls -w

# 3. Linting & Format
npm run lint
npm run format:check

# 4. Type checking
npm run type-check

# 5. Building
npm run build

# 6. Try dev mode
npm run dev -w apps/web
# Verificar: http://localhost:3000
```

- [ ] Todos los comandos sin errores
- [ ] Web app carga en http://localhost:3000
- [ ] No hay warnings en console
- [ ] PocketBase sigue corriendo (http://localhost:8090)

## Documentación Completada

- [ ] `docs/SETUP_FASE1.md` - Guía de setup
- [ ] `docs/CHECKLIST_FASE1.md` - Este archivo
- [ ] Todos los package.json creados
- [ ] Configuraciones base completadas

## Siguiente Fase

**Fase 2: Autenticación**

Próximos pasos:
1. Crear páginas de login/signup
2. Implementar autenticación con PocketBase
3. Protected routes
4. JWT + refresh tokens

Ver: `docs/SETUP_FASE2.md` (será creado)

---

## Status

- **Iniciado**: [Fecha]
- **Completado**: [Completar cuando todo esté listo]
- **Notas**:
  - [ ] Agregar notas de bloqueos si hay

## Contacto

Si hay problemas:
1. Verificar logs: `docker-compose logs pocketbase`
2. Ver troubleshooting en `docs/SETUP_FASE1.md`
3. Revisar `docs/TROUBLESHOOTING.md` (si existe)

---

**Fase 1 completada cuando:**
✅ Todos los checkboxes marcados
✅ npm run dev funciona sin errores
✅ http://localhost:3000 y http://localhost:8090 accesibles
