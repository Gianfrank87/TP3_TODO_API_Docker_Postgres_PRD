# Informe de entrega - TP03 TODO API

**Alumno:** Gian Franco Josias Moreyra  
**Carrera:** Licenciatura en Sistemas de Información - UADER FCyT  
**Materia:** Programación Avanzada  

## Pruebas realizadas

Se verificó el funcionamiento de los contenedores y se probaron las operaciones CRUD de la API REST mediante Postman:

- `POST /tasks`: creación de una tarea.
- `GET /tasks`: listado de tareas.
- `GET /tasks/:id`: consulta por identificador.
- `PUT /tasks/:id`: actualización parcial de una tarea.
- `DELETE /tasks/:id`: eliminación de una tarea.
- Caso `404`: consulta de un recurso inexistente.

## Persistencia de datos

Para verificar la persistencia se creó una tarea y luego se reinició únicamente el servicio de la API con:

```bash
docker compose restart api
```

Después del reinicio, la tarea seguía disponible porque PostgreSQL almacena la información en el volumen nombrado `todo_pgdata`, cuyo ciclo de vida es independiente del contenedor de Node.js.

Posteriormente se ejecutó:

```bash
docker compose down -v
```

Al eliminar los contenedores junto con sus volúmenes y levantar nuevamente el entorno, los datos agregados durante las pruebas desaparecieron y la base volvió al estado inicial definido por `db/init.sql`.

Esto demuestra que los datos sobreviven al reinicio de la API y se eliminan únicamente cuando se borra explícitamente el volumen persistente.
