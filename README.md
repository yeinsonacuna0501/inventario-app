# Sistema de Inventario — Prueba Técnica

Aplicación full stack de gestión de inventario desarrollada con arquitectura hexagonal en todos sus componentes.

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Backend comandos (escritura) | .NET 8, C#, Entity Framework Core, Oracle.EF Core |
| Backend consultas (lectura) | Python 3.11, FastAPI, oracledb |
| Frontend | Angular 21, Angular Material, PrimeNG |
| Base de datos | Oracle XE 21c |

---

## Arquitectura general

### Arquitectura Hexagonal (Ports & Adapters)

Los tres proyectos implementan la misma arquitectura hexagonal con las siguientes capas:

```
┌─────────────────────────────────────────────────────┐
│                  Adaptadores primarios               │
│            (Controllers / API Routers)               │
├─────────────────────────────────────────────────────┤
│                 Application Services                 │
│          (Orquestadores del flujo completo)          │
├──────────────────────┬──────────────────────────────┤
│    Domain Services   │      Ports (Interfaces)       │
│  (Reglas de negocio) │   IProductoRepository, etc.   │
├──────────────────────┴──────────────────────────────┤
│               Adaptadores secundarios                │
│         (Oracle / EF Core / oracledb)                │
└─────────────────────────────────────────────────────┘
```

- **Domain**: entidades ricas, value objects, domain services y puertos (interfaces)
- **Application**: application services como orquestadores — coordinan repositorios, domain services y mappers sin contener lógica de negocio
- **Infrastructure**: adaptadores secundarios — implementaciones concretas de Oracle con EF Core (.NET) y oracledb (Python)
- **API/Routers**: adaptadores primarios — controllers versionados (.NET) y routers (FastAPI)

### Patrón CQRS en el Frontend

El frontend implementa segregación de responsabilidades a nivel de servicios Angular:

| Servicio | Responsabilidad | Backend que consume |
|---|---|---|
| `ProductoCommandService` | Operaciones de escritura (crear, actualizar, descontar) | .NET API — `http://localhost:5008` |
| `ProductoQueryService` | Operaciones de lectura (buscar con filtros) | Python API — `http://localhost:8000` |

Esta separación refleja el principio CQRS en la capa de presentación, donde las operaciones que modifican estado y las que solo consultan están completamente desacopladas.

---

## Flujo completo de la aplicación

```
Angular 21 — localhost:4200
        │
        ├── ProductoCommandService
        │       │
        │       ├── POST   /api/v1/productos          ──→ .NET API :5008 ──→ Oracle XE :1521
        │       ├── PUT    /api/v1/productos/{id}      ──→ .NET API :5008 ──→ Oracle XE :1521
        │       └── PATCH  /api/v1/productos/{id}/stock/descontar ──→ .NET API :5008 ──→ Oracle XE :1521
        │
        └── ProductoQueryService
                │
                └── GET    /productos?nombre=&fecha_inicio=&fecha_fin= ──→ Python API :8000 ──→ Oracle XE :1521
```

---

## 1. Base de datos — Oracle XE 21c

### Prerrequisitos
- Oracle XE 21c instalado y corriendo en `localhost:1521`
- SQL Developer o cualquier cliente Oracle

### Configuración inicial

Conectar a SQL Developer con usuario `system` y ejecutar los scripts en orden:

```sql
-- Paso 1: crear tabla, secuencia e índices
@database/01_crear_esquema.sql

-- Paso 2: insertar datos de prueba
@database/02_insertar_datos.sql
```

### Esquema creado

```sql
CREATE SEQUENCE seq_productos START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;

CREATE TABLE productos (
    id             NUMBER          DEFAULT seq_productos.NEXTVAL PRIMARY KEY,
    nombre         VARCHAR2(150)   NOT NULL,
    descripcion    VARCHAR2(500),
    precio         NUMBER(12, 2)   NOT NULL,
    cantidad       NUMBER(10)      NOT NULL,
    fecha_registro DATE            DEFAULT SYSDATE NOT NULL,
    CONSTRAINT chk_precio_positivo   CHECK (precio > 0),
    CONSTRAINT chk_cantidad_positiva CHECK (cantidad >= 0)
);
```

---

## 2. Backend .NET 8 — API de comandos

Responsable de todas las operaciones de escritura: crear, actualizar y descontar stock.

### Estructura del proyecto

```
inventario-net/
├── src/
│   ├── Inventario.Domain/
│   │   ├── Entities/Producto.cs              # Entidad rica con lógica de negocio
│   │   ├── ValueObjects/Cantidad.cs          # Value Object con reglas de cantidad
│   │   ├── Services/ProductoDomainService.cs # Reglas de negocio puras
│   │   ├── Repositories/IProductoRepository.cs
│   │   └── Exceptions/
│   ├── Inventario.Application/
│   │   ├── Services/ProductoAppService.cs    # Orquestador del flujo
│   │   ├── Ports/IProductoAppService.cs      # Puerto primario
│   │   ├── DTOs/ProductoDtos.cs
│   │   └── Mappers/ProductoMapper.cs
│   ├── Inventario.Infrastructure/
│   │   ├── Persistence/AppDbContext.cs
│   │   ├── Persistence/Repositories/ProductoRepository.cs
│   │   ├── Persistence/Configurations/ProductoConfiguration.cs
│   │   └── DependencyInjection.cs
│   └── Inventario.Api/
│       ├── Controllers/v1/ProductosController.cs
│       ├── Middleware/GlobalExceptionMiddleware.cs
│       ├── Extensions/ApplicationServiceExtensions.cs
│       └── Program.cs
└── tests/
    └── Inventario.Domain.Tests/
        ├── ProductoEntityTests.cs
        └── ProductoAppServiceTests.cs
```

### Prerrequisitos
- .NET SDK 8.0 o superior

### Configuración

Editar `src/Inventario.Api/appsettings.json` con las credenciales de Oracle:

```json
{
  "ConnectionStrings": {
    "OracleDB": "Data Source=localhost:1521/xe;User Id=system;Password=TU_PASSWORD;"
  }
}
```

### Levantar el proyecto

```bash
cd inventario-net

dotnet restore

dotnet run --project src/Inventario.Api
```

- API disponible en: `http://localhost:5008`
- Swagger UI en: `http://localhost:5008`

### Ejecutar pruebas unitarias

```bash
dotnet test
```

### Endpoints

| Método | Ruta | Body | Descripción |
|---|---|---|---|
| POST | /api/v1/productos | `{ nombre, descripcion, precio, cantidad }` | Registrar producto |
| PUT | /api/v1/productos/{id} | `{ nombre, descripcion, precio, cantidad }` | Actualizar producto |
| PATCH | /api/v1/productos/{id}/stock/descontar | `{ unidades }` | Descontar unidades del stock |

### Códigos de respuesta

| Código | Situación |
|---|---|
| 201 Created | Producto creado exitosamente |
| 200 OK | Operación exitosa |
| 400 Bad Request | Datos de entrada inválidos |
| 404 Not Found | Producto no encontrado |
| 422 Unprocessable Entity | Violación de regla de negocio |
| 500 Internal Server Error | Error inesperado del servidor |

---

## 3. Backend Python — API de consultas

Responsable exclusivamente de las operaciones de lectura con filtros por nombre y fecha.

### Estructura del proyecto

```
inventario-python/
├── src/
│   ├── domain/
│   │   ├── entities/producto.py
│   │   ├── repositories/producto_repository.py       # Puerto (ABC)
│   │   └── services/producto_query_domain_service.py # Validaciones de consulta
│   ├── application/
│   │   └── services/producto_app_service.py          # Orquestador de lectura
│   ├── infrastructure/
│   │   ├── database/oracle_connection.py             # Pool de conexiones oracledb
│   │   └── repositories/oracle_producto_repository.py
│   └── api/
│       ├── routers/productos_router.py
│       ├── schemas/producto_schema.py
│       ├── dependencies.py                           # Inyección de dependencias
│       └── main.py
├── requirements.txt
└── .env
```

### Prerrequisitos
- Python 3.11 o superior

### Dependencias

```
fastapi==0.110.0
uvicorn[standard]==0.29.0
oracledb==2.1.1
pydantic==2.6.4
python-dotenv==1.0.1
```

### Configuración

Editar el archivo `.env`:

```env
ORACLE_USER=system
ORACLE_PASSWORD=TU_PASSWORD
ORACLE_HOST=localhost
ORACLE_PORT=1521
ORACLE_SID=xe
```

### Levantar el servicio

```bash
cd inventario-python

# crear y activar entorno virtual
python -m venv venv

# Windows
venv\Scripts\activate

# Linux / Mac
source venv/bin/activate

# instalar dependencias
pip install -r requirements.txt

# ejecutar el servicio
uvicorn main:app --reload --port 8000
```

- Servicio disponible en: `http://localhost:8000`
- Swagger UI en: `http://localhost:8000/docs`
- Health check en: `http://localhost:8000/health`

### Endpoint

| Método | Ruta | Parámetros query | Descripción |
|---|---|---|---|
| GET | /productos | `nombre` (opcional), `fecha_inicio` (opcional, YYYY-MM-DD), `fecha_fin` (opcional, YYYY-MM-DD) | Consultar productos con filtros combinables |

### Ejemplo de uso

```bash
# todos los productos
GET http://localhost:8000/productos

# filtrar por nombre
GET http://localhost:8000/productos?nombre=laptop

# filtrar por rango de fechas
GET http://localhost:8000/productos?fecha_inicio=2024-01-01&fecha_fin=2024-12-31

# filtros combinados
GET http://localhost:8000/productos?nombre=dell&fecha_inicio=2024-01-01
```

---

## 4. Frontend Angular 21

### Estructura del proyecto

```
inventario-angular/
└── src/app/
    ├── components/
    │   ├── producto-detalle-modal/     # Modal de visualización (lupa)
    │   ├── producto-form-modal/        # Modal de creación y edición
    │   ├── producto-tabla-material/    # Tabla con Angular Material
    │   └── producto-tabla/             # Tabla con PrimeNG
    ├── models/
    │   └── producto.ts                 # Interfaces y tipos del dominio
    ├── services/
    │   ├── producto-command.service.ts # Operaciones de escritura → .NET API
    │   └── producto-query.service.ts   # Operaciones de lectura → Python API
    └── environments/
        └── environment.ts
```

### Decisión de diseño — CQRS en servicios Angular

Se aplicó el principio de segregación de comandos y consultas a nivel de servicios:

- **`ProductoCommandService`** encapsula todas las operaciones que modifican estado y se comunica exclusivamente con la API .NET
- **`ProductoQueryService`** encapsula todas las operaciones de lectura con filtros y se comunica exclusivamente con la API Python

Esta separación permite que cada servicio evolucione independientemente y refleja en el frontend la misma separación que existe en el backend.

### Comparativa de librerías UI implementadas

Se implementaron dos versiones de la tabla de productos para comparar ambas librerías:

| Característica | Angular Material | PrimeNG |
|---|---|---|
| Componente usado | `mat-table` | `p-table` |
| Filtros | Implementación manual | Filtros nativos integrados |
| Paginación | `mat-paginator` | Nativa en `p-table` |
| Dialogs/Modales | `MatDialog` | `p-dialog` |
| 

### Prerrequisitos
- Node.js 20 o superior
- Angular CLI 21: `npm install -g @angular/cli`

### Levantar el proyecto

```bash
cd inventario-angular

npm install

ng serve
```

- Aplicación disponible en: `http://localhost:4200`


### Funcionalidades implementadas

| Funcionalidad | Descripción |
|---|---|
| Registrar producto | Formulario reactivo con validaciones |
| Editar producto | Modal precargado con datos actuales |
| Visualizar producto | Modal de solo lectura con todos los campos |
| Descontar stock | Dialog con validación de unidades disponibles |
| Filtrar por nombre | Búsqueda parcial insensible a mayúsculas |
| Filtrar por fecha | Rango de fechas con datepicker |
| Tabla actualizada en tiempo real | Después de cada operación se recarga la grilla |

---

## Orden de inicio recomendado

Para ejecutar el sistema completo seguir este orden:

```
1. Oracle XE         →  verificar que esté corriendo en localhost:1521
2. Backend .NET      →  dotnet run  (localhost:5008)
3. Backend Python    →  uvicorn src.main:app --port 8000  (localhost:8000)
4. Frontend Angular  →  ng serve  (localhost:4200)
```


