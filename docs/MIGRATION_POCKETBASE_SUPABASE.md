# Migración: PocketBase → Supabase

Guía para migrar datos y configuración de PocketBase a Supabase en producción.

## Tabla de Contenidos

- [Antes de Migrar](#antes-de-migrar)
- [Preparación](#preparación)
- [Exportar de PocketBase](#exportar-de-pocketbase)
- [Importar a Supabase](#importar-a-supabase)
- [Actualizar Código](#actualizar-código)
- [Testing](#testing)
- [Rollback](#rollback)

## Antes de Migrar

### Checklist

- ✅ Datos de prueba completamente validados en PocketBase
- ✅ Todas las RLS policies diseñadas para Supabase
- ✅ Backups de PocketBase realizados
- ✅ Equipo informado sobre el downtime
- ✅ Staging environment probado

### Timing

- Migrar cuando el MVP esté 100% funcional
- Preferiblemente en horario de baja actividad
- Tener soporte disponible

## Preparación

### 1. Backup de PocketBase

```bash
# Si usas Docker
docker exec research-hub-pocketbase tar -czf - /pb/pb_data > pb_backup.tar.gz

# Si usas binario local
cp -r pb_data pb_data.backup
```

### 2. Crear Proyecto Supabase

1. Ir a https://supabase.com
2. Crear nuevo proyecto
3. Esperar 5-10 minutos
4. Notar: Project URL y anon key

### 3. Diseñar Schema en Supabase

Ver `docs/DATABASE_SCHEMA.md` - copiar SQL y ejecutar en Supabase SQL Editor

## Exportar de PocketBase

### 1. Exportar Datos (JSON)

**Opción A: CLI PocketBase**

```bash
# En el contenedor Docker
docker exec research-hub-pocketbase ./pocketbase export

# Copia el archivo pb_data/export.zip
docker cp research-hub-pocketbase:/pb/pb_data/export.zip .
```

**Opción B: API Rest**

```bash
# Conectar como admin
curl -X POST http://localhost:8090/api/admins/auth-with-password \
  -H "Content-Type: application/json" \
  -d '{"identity":"admin@test.com","password":"your_password"}'

# Exportar todas las colecciones
curl http://localhost:8090/api/collections \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" > collections.json

# Para cada colección, exportar registros
curl "http://localhost:8090/api/records/projects" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" > projects.json
```

### 2. Transformar Datos

Crear script `scripts/transform-pb-data.mjs`:

```javascript
import fs from 'fs'

// Leer export de PocketBase
const pbExport = JSON.parse(fs.readFileSync('export.json', 'utf-8'))

// Mapear colecciones
const collections = {
  users: pbExport.users || [],
  projects: pbExport.projects || [],
  datasets: pbExport.datasets || [],
  notes: pbExport.notes || [],
  publications: pbExport.publications || [],
}

// Transformar campos si es necesario
// PocketBase → Supabase (mapeo)
const transformedUsers = collections.users.map((user) => ({
  id: user.id,
  email: user.email,
  full_name: user.full_name || '',
  avatar_url: user.avatar || null,
  institution: user.institution || '',
  bio: user.bio || '',
  created_at: user.created,
  updated_at: user.updated,
}))

// Guardar en formato SQL INSERT
const output = {
  users: transformedUsers,
  projects: collections.projects,
  datasets: collections.datasets,
  notes: collections.notes,
  publications: collections.publications,
}

fs.writeFileSync('transformed_data.json', JSON.stringify(output, null, 2))
console.log('✅ Datos transformados')
```

Ejecutar:

```bash
node scripts/transform-pb-data.mjs
```

### 3. Generar SQL INSERT

```javascript
// En el mismo script, generar INSERTs

const generateInserts = (data) => {
  let sql = ''

  // Users
  sql += 'BEGIN;\n'
  sql += 'TRUNCATE TABLE users CASCADE;\n'

  data.users.forEach((user) => {
    sql += `INSERT INTO users (id, email, full_name, institution, created_at, updated_at)
VALUES ('${user.id}', '${user.email}', '${user.full_name}', '${user.institution}', '${user.created_at}', '${user.updated_at}');\n`
  })

  sql += 'COMMIT;\n'
  return sql
}

fs.writeFileSync('migration.sql', generateInserts(output))
```

## Importar a Supabase

### 1. Crear Schema

1. Ir a Supabase SQL Editor
2. Ejecutar SQL de `docs/DATABASE_SCHEMA.md`

### 2. Importar Datos

**Opción A: SQL Script**

```bash
# Desde Supabase SQL Editor, copiar migration.sql y ejecutar
```

**Opción B: Desde API**

```bash
# Obtener service role key (en Settings → API)
SERVICE_ROLE_KEY="your-key"
SUPABASE_URL="https://your-project.supabase.co"

# Insertar datos
curl -X POST "$SUPABASE_URL/rest/v1/users" \
  -H "apikey: $SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d @users.json
```

### 3. Verificar Datos

En Supabase Dashboard → Table Editor:
- ✅ Usuarios importados
- ✅ Proyectos asociados
- ✅ Datasets presentes
- ✅ Sin errores de constraint

## Actualizar Código

### 1. Reemplazar Cliente

**Antes (PocketBase)**:
```typescript
import PocketBase from 'pocketbase'
const pb = new PocketBase('http://localhost:8090')
```

**Después (Supabase)**:
```typescript
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

### 2. Actualizar Queries

**PocketBase**:
```typescript
const records = await pb.collection('projects').getList(1, 50)
```

**Supabase**:
```typescript
const { data, error } = await supabase
  .from('projects')
  .select()
  .range(0, 49)
```

### 3. Actualizar Environment Variables

`.env.production`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Eliminar:
```env
# Ya no necesario
NEXT_PUBLIC_POCKETBASE_URL=http://localhost:8090
```

## Testing

### 1. Staging Environment

1. Deploy a staging en Vercel (rama dev o staging)
2. Apuntar a Supabase staging
3. Verificar todas las funciones

### 2. Checklist Funcional

- ✅ Login/Signup funciona
- ✅ CRUD de proyectos
- ✅ Upload de archivos
- ✅ Real Time updates
- ✅ Permisos/RLS funcionando
- ✅ Performance aceptable

### 3. Testing de Carga

```bash
# Con k6 o artillery
artillery quick -d 1000 -r 100 https://your-staging-url
```

### 4. Verificar Datos

```sql
-- En Supabase SQL Editor
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM projects;
SELECT COUNT(*) FROM datasets;
```

## Rollback

Si algo falla, tienes opciones:

### Plan B: Volver a PocketBase

```bash
# PocketBase sigue funcionando en dev
# Solo revertir variables de entorno
# Redeployar a Vercel
```

### Plan C: Datos Corruptos

```bash
# Restaurar backup de Supabase
# Supabase tiene backups automáticos en Settings

# O restoreador del export
docker cp pb_backup.tar.gz research-hub-pocketbase:/
docker exec research-hub-pocketbase tar -xzf pb_backup.tar.gz
```

## Post-Migración

### 1. Monitoreo

- Logs en Vercel
- Supabase Analytics
- Uptime monitoring
- Alertas configuradas

### 2. Cleanup

```bash
# Parar PocketBase en production (si tenías)
# Mantener local para desarrollo
# Borrar variables de PocketBase

# Actualizar docs
```

### 3. Documentación

Actualizar:
- README.md - quitar referencias a PocketBase local
- docs/PLAN.md - marcar migración como completada
- docs/DATABASE_SCHEMA.md - referencias a Supabase

## Estrategia de Datos en Desarrollo

Después de migrar, tienes dos opciones:

### Opción A: PocketBase Local (Recomendado)

- Dev: PocketBase local (como ahora)
- Staging: Supabase
- Prod: Supabase
- Desarrolladores tienen datos locales

### Opción B: Supabase en Todo Lado

- Dev: Supabase dev branch
- Staging: Supabase staging
- Prod: Supabase production
- Mais simple, pero requiere conexión

**Recomendación**: Opción A (PocketBase local)

## Timing de Migración

Migrar cuando:
1. MVP completamente funcional
2. Todos los tests pasando
3. Performance validada
4. RLS policies completamente diseñadas
5. Plan de rollback en lugar

Típicamente: **2-3 meses después de iniciar dev**

## Referencias

- [PocketBase Export Docs](https://pocketbase.io/docs/api-export/)
- [Supabase Import Docs](https://supabase.com/docs/guides/resources/supabase-cli)
- [Supabase Migrations](https://supabase.com/docs/guide/migrations)

---

**Versión**: 0.1.0
**Última actualización**: 2026-03-18
