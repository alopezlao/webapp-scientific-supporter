# Guía de Setup - Supabase

Instrucciones paso a paso para configurar Supabase para Research Hub.

## 1. Crear Proyecto en Supabase

1. Ir a [supabase.com](https://supabase.com)
2. Crear cuenta o iniciar sesión
3. Hacer clic en "New Project"
4. Llenar formulario:
   - **Project name**: `research-hub` (o tu nombre preferido)
   - **Database password**: Crear contraseña segura
   - **Region**: Seleccionar región más cercana
5. Esperar a que se complete (2-3 minutos)

## 2. Obtener Credenciales

En el dashboard de Supabase:

1. Ir a **Settings** → **API**
2. Copiar:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. Crear archivo `.env.local` en la raíz del proyecto:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## 3. Crear Tablas de Base de Datos

### Opción A: SQL (Recomendado)

1. En el dashboard, ir a **SQL Editor**
2. Crear nueva query
3. Copiar y pegar el contenido de `docs/DATABASE_SCHEMA.md`
4. Ejecutar

### Opción B: GUI

1. Ir a **Database** → **Tables**
2. Crear tabla por tabla manualmente

## 4. Configurar Autenticación

1. Ir a **Authentication** → **Providers**
2. Verificar que "Email" está habilitado (por defecto)
3. (Opcional) Habilitar OAuth providers:
   - Google
   - GitHub
   - Microsoft

### Configurar Email

1. **Authentication** → **Email Templates**
2. Personalizar plantillas si es necesario
3. Por defecto, Supabase envía emails de prueba

## 5. Configurar Storage

1. Ir a **Storage** → **New bucket**
2. Crear los siguientes buckets:

- **datasets** (Public)
- **user-files** (Private)
- **publications** (Public)

3. Configurar políticas de acceso (RLS) según sea necesario

## 6. Habilitar Row Level Security (RLS)

1. Ir a **Database** → **Tables**
2. Para cada tabla:
   - Clic en tabla
   - Ir a **RLS**
   - Enable RLS
   - Crear políticas según schema

Ejemplo para tabla `projects`:

```sql
-- Política: Usuarios pueden ver proyectos que poseen o en los que colaboran
CREATE POLICY "Users can view their projects"
  ON projects FOR SELECT
  USING (owner_id = auth.uid() OR id IN (
    SELECT project_id FROM project_members WHERE user_id = auth.uid()
  ));

-- Política: Solo el dueño puede modificar
CREATE POLICY "Only owner can update"
  ON projects FOR UPDATE
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());
```

## 7. Testing

Para verificar que todo está configurado:

1. Ir a **SQL Editor** → **New query**
2. Ejecutar:
```sql
SELECT * FROM users LIMIT 1;
```

3. Debe mostrarse vacío (sin errores)

## 8. Conectar desde la Aplicación

En la aplicación Next.js:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default supabase
```

## Problemas Comunes

### Error: "Invalid API key"
- Verificar que la clave está correctamente copiada en `.env.local`
- Verificar que la URL está correcta (sin espacios)

### Error: "Auth session not found"
- Verificar que JWT está habilitado (por defecto lo está)
- Limpiar localStorage en el navegador

### Storage: "Permission denied"
- Verificar que el bucket existe
- Verificar políticas de RLS en la tabla storage.objects

## Recursos

- [Documentación oficial de Supabase](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Guía de Authentication](https://supabase.com/docs/guides/auth)
