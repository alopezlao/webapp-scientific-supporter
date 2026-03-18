# Esquema de Base de Datos - Research Hub

Este documento describe las tablas iniciales y relaciones en Supabase.

## Tablas Principales (MVP)

### 1. `users` (Manejado por Supabase Auth)

Supabase administra automáticamente la autenticación. Esta tabla contiene información adicional del usuario.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  institution TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. `projects`

Proyectos de investigación creados por los usuarios.

```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active', -- active, completed, archived
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  start_date DATE,
  end_date DATE,
  created_by_id UUID NOT NULL REFERENCES users(id),
  UNIQUE(owner_id, title)
);
```

### 3. `project_members`

Colaboradores en un proyecto.

```sql
CREATE TABLE project_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'viewer', -- owner, editor, viewer
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);
```

### 4. `datasets`

Datos científicos dentro de un proyecto.

```sql
CREATE TABLE datasets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  data_type TEXT, -- csv, json, raw_data, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by_id UUID NOT NULL REFERENCES users(id),
  file_url TEXT,
  file_size INTEGER,
  UNIQUE(project_id, name)
);
```

### 5. `notes`

Notas y observaciones asociadas a un proyecto.

```sql
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by_id UUID NOT NULL REFERENCES users(id),
  tags TEXT[] DEFAULT '{}'
);
```

### 6. `publications`

Artículos y publicaciones relacionadas.

```sql
CREATE TABLE publications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  authors TEXT[] NOT NULL,
  doi TEXT,
  journal TEXT,
  published_date DATE,
  url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by_id UUID NOT NULL REFERENCES users(id)
);
```

## Índices

Para optimizar consultas comunes:

```sql
CREATE INDEX idx_projects_owner_id ON projects(owner_id);
CREATE INDEX idx_project_members_user_id ON project_members(user_id);
CREATE INDEX idx_datasets_project_id ON datasets(project_id);
CREATE INDEX idx_notes_project_id ON notes(project_id);
CREATE INDEX idx_publications_project_id ON publications(project_id);
```

## Row Level Security (RLS)

Configurar políticas de seguridad básicas:

```sql
-- Habilitar RLS en tablas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios pueden ver/editar sus propios proyectos
CREATE POLICY "Users can view their own projects"
  ON projects FOR SELECT
  USING (owner_id = auth.uid() OR id IN (
    SELECT project_id FROM project_members WHERE user_id = auth.uid()
  ));
```

## Storage (Supabase)

Crear buckets para almacenar archivos:

```
/research-hub
├── /datasets
├── /publications
└── /user-files
```

## Notas de Implementación

1. **Timestamps**: Usar TIMESTAMP WITH TIME ZONE para todos los timestamps
2. **UUIDs**: Generar automáticamente con `gen_random_uuid()`
3. **Soft Delete**: Considerar usar una columna `deleted_at` en lugar de borrar registros
4. **Auditoría**: Implementar triggers para registrar cambios en tablas importantes
5. **Versionado**: Para datasets, considerar versioning en futuras fases

## Próximas Tablas (Fases Futuras)

- `experiments`: Experimentos dentro de un proyecto
- `results`: Resultados de experimentos
- `collaborations`: Solicitudes y colaboraciones entre usuarios
- `tags`: Etiquetas para organizar contenido
