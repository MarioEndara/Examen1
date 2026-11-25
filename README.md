Gestión Electoral
ADR 1
Desarrollo de una aplicación móvil para la información del proceso electoral, con Ionic + Angular Standalone + Capacitor para Android.

REQUISITOS PREVIOS-HERRAMIENTAs A UTILIZAR

- Node.js V20 o superior (verificacion con `node -v`)
- Ionic Cli ( `npm install -g @ionic/cli`)
- Android Studio (Verificación de compilación)
- jdk 17 (requerimiento para el uso de capacitor)
- Git

Instalación - dependencias
git clone https://github.com/MarioEndara/Examen1.git
cd Examen1
npm install

ADR 2

## Stack

| Capa | Tecnología |
|---|---|
| App | Ionic 9 + Angular (standalone) |
| Backend | Supabase (Auth + PostgreSQL + Storage) |
| Seguridad | Row Level Security (RLS) + funciones `SECURITY DEFINER` |
## Roles

| Rol | Alcance |
|---|---|
| Coordinador provincial | Consulta los recintos y mesas de su provincia |
| Coordinador de recinto | Administra únicamente las mesas de su recinto |
| Veedor de mesa | Consulta y registra solo en las mesas que tiene asignadas |

## Modelo de datos

`perfiles` · `provincias` · `recintos` · `mesas` · `asignaciones_veedor`

- `perfiles.role` es un enum `app_role` (`coordinador_provincial`, `coordinador_recinto`, `veedor`).
- `perfiles.provincia_id` vincula al coordinador provincial con su provincia.
- `mesas` guarda `votos_acta` y `foto_acta_url` (ruta del archivo en Storage).

## Seguridad (decisión clave)

La autorización se aplica **en el servidor**, no en la app: aunque alguien llame a la API con otra solicitud o cambie un identificador, la base de datos devuelve 0 filas.

1. **RLS activado** en todas las tablas.
2. **Las políticas solo llaman a funciones `SECURITY DEFINER`** (`recintos_visibles`, `recintos_administrables`, `mesas_administrables`, `check_veedor_mesa`). Esto evita la *infinite recursion* que aparece cuando una política consulta otra tabla con RLS.
3. **Permisos por columna:** el veedor solo puede actualizar `votos_acta` y `foto_acta_url`.
4. **Fotos:** bucket privado `actas` (máx. 5 MB, solo JPG/PNG/WebP), ruta `<id_mesa>/acta.jpg`, permisos derivados de la mesa y consulta mediante URL firmada de 60 s.
5. **La app usa solo la clave `sb_publishable_...`.** Nunca debe incluirse una clave secreta o `service_role`.

## Ejecutar el proyecto

```bash
npm install
```

Configura `src/environments/environment.ts`:

```ts
export const environment = {
  production: false,
  supabaseUrl: 'https://<tu-proyecto>.supabase.co',
  supabaseKey: 'sb_publishable_...'
};
```

```bash
ionic serve
```

Usuarios de prueba: `provincial@test.com`, `recinto@test.com`, `veedor@test.com`.

## Pruebas realizadas

| Prueba | Resultado |
|---|---|
| Usuarios para los 3 roles e inicio de sesión | cumplido |
| Usuario no autenticado no ve información protegida | cumplido 0 mesas visibles |
| Provincial consulta su ámbito | cumplido 2 recintos, 3 mesas |
| Coordinador de recinto solo administra su recinto | cumplido 1 recinto, 2 mesas; crea mesas solo en el suyo |
| Veedor solo consulta y registra en sus mesas | cumplido 1 mesa, 1 asignación |
| Acceso a mesa ajena cambiando el identificador | cumplido lectura 0 filas, modificación 0 filas |
| Veedor no puede mover su mesa a otro recinto | cumplido bloqueado |
| Fotografías respetan permisos | cumplido el veedor no sube ni ve la foto de una mesa ajena |

**Criterio de aceptación:** un veedor no puede consultar ni modificar mesas que no tiene asignadas, aunque intente acceder con otro identificador. Cumplido.

## Estructura relevante

```
src/app/
├── core/services/supabase.service.ts   # cliente de Supabase
└── features/actas/                     # subida y consulta de actas
```
ADR 3
## Funcionalidades implementadas

- Inicio de sesión.
- Consulta de mesas.
- Flujo de subida y visualización de fotografías de actas.
- Control de acceso mediante políticas RLS.
- Componente compartido para mostrar mensajes.

## Tecnologías

- Ionic y Angular: interfaz y navegación.
- Supabase Auth: autenticación.
- PostgreSQL: almacenamiento de datos.
- Supabase Storage: almacenamiento de imágenes.
- RLS: autorización de operaciones.

## Arquitectura — ADR 3

Organización por funcionalidades con separación de responsabilidades:

| Responsabilidad | Ubicación |
|---|---|
| Presentación | Páginas de `features/` y `home/` |
| Coordinación de operaciones | `features/actas/actas.service.ts` |
| Acceso al backend | `core/data-access/` |
| Conexión con Supabase | `core/services/supabase.service.ts` |
| Modelo de mesa | `shared/models/mesa.model.ts` |
| Mensajes reutilizables | `shared/mensaje/mensaje.component.ts` |
| Navegación | `app.routes.ts` |

## Roles previstos

- Provincial: consulta de información de su ámbito.
- Recinto: administración de información de su recinto.
- Veedor: consulta y registro en sus mesas asignadas.

Los permisos efectivos dependen de las políticas configuradas en Supabase.

## Ejecución

Requiere Node.js, npm e Ionic CLI compatibles con el proyecto.

```bash
npm install
ionic serve
```

La conexión de Supabase debe estar configurada y disponer de las tablas, usuarios, bucket `actas` y políticas correspondientes.

## Rutas

- `/login`: inicio de sesión.
- `/home`: consulta inicial de mesas.
- `/actas-prueba`: prueba de fotografías de actas.

## Consideraciones

Las imágenes se guardan en `<mesaId>/acta.jpg`. La consulta genera una URL firmada válida durante 60 segundos.

La subida permite reemplazar la imagen existente si la cuenta tiene permiso. Utilizar datos de prueba.

Las carpetas preparadas para otras funcionalidades no representan módulos terminados.



