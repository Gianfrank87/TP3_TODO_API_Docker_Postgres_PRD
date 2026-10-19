# TP03 - TODO API con Docker + Node.js + PostgreSQL

Trabajo práctico de **Programación Avanzada (UADER - FCyT)**. La aplicación implementa una API REST para gestionar tareas y reemplaza el almacenamiento en memoria por persistencia real en PostgreSQL. La API y la base de datos se ejecutan en contenedores independientes orquestados con Docker Compose.

## Requisitos

- Docker Desktop, o Docker Engine + Docker Compose.
- No es necesario instalar PostgreSQL ni Node.js localmente para ejecutar la solución con Docker.

## Cómo ejecutar

1. Clonar el repositorio.
2. Crear el archivo de variables de entorno a partir del ejemplo:

```bash
cp .env.example .env
```

3. Levantar la API y PostgreSQL:

```bash
docker compose up --build
```

4. La API queda disponible en:

```text
http://localhost:3001/tasks
```

Para detener los contenedores sin borrar los datos:

```bash
docker compose down
```

Para detenerlos y eliminar también el volumen persistente:

```bash
docker compose down -v
```

## Arquitectura

Docker Compose levanta dos servicios:

- `api`: Node.js + Express, puerto `3001`.
- `db`: PostgreSQL 16, puerto `5432`.

Dentro de la red de Docker Compose la API se conecta a PostgreSQL usando `DB_HOST=db`. Los datos se almacenan en el volumen nombrado `todo_pgdata`.

## Estructura del proyecto

```text
.
├── db/
│   └── init.sql
├── .dockerignore
├── .env.example
├── .gitignore
├── Dockerfile
├── README.md
├── db.js
├── docker-compose.yml
├── package.json
└── server.js
```

## Endpoints implementados

| Método | Ruta | Descripción | Respuestas principales |
|---|---|---|---|
| GET | `/tasks` | Lista todas las tareas. Acepta `?status=pending` | `200` |
| GET | `/tasks/:id` | Obtiene una tarea por ID | `200`, `404` |
| POST | `/tasks` | Crea una tarea | `201`, `400` |
| PUT | `/tasks/:id` | Actualiza solo los campos enviados | `200`, `404` |
| DELETE | `/tasks/:id` | Elimina una tarea | `204`, `404` |

Todas las consultas que reciben valores del usuario usan parámetros de PostgreSQL (`$1`, `$2`, etc.). El `PUT` usa `COALESCE` para conservar los campos no enviados y actualiza `updated_at` con `NOW()`.

## Pruebas rápidas con curl

```bash
curl http://localhost:3001/tasks
curl http://localhost:3001/tasks/1
curl "http://localhost:3001/tasks?status=pending"

curl -X POST http://localhost:3001/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Nueva tarea","description":"probando","status":"pending"}'

curl -X PUT http://localhost:3001/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"status":"completed"}'

curl -X DELETE http://localhost:3001/tasks/1
```

## Persistencia

Para verificar la persistencia:

1. Crear una tarea con `POST /tasks`.
2. Ejecutar `docker compose restart api`.
3. Consultar nuevamente las tareas: el registro continúa porque PostgreSQL guarda los datos en `todo_pgdata`.
4. Ejecutar `docker compose down -v` y luego `docker compose up --build`.
5. Al eliminar el volumen, la base vuelve a inicializarse con `db/init.sql` y se pierden los datos agregados manualmente.
