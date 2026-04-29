# backend-cloud-academy 🎓

Proyecto backend para el sistema **Cloud Academy**, desarrollado con [NestJS](https://nestjs.com/), [TypeORM](https://typeorm.io/) y [PostgreSQL](https://www.postgresql.org/).

## 🚀 Características
- **Arquitectura Modular**: Organizado por módulos funcionales.
- **Base de Datos**: PostgreSQL con gestión de migraciones vía TypeORM.
- **Documentación**: Swagger UI integrado para pruebas de API.
- **Seguridad**: Configuración de CORS habilitada.
- **Integración Híbrida**: Preparado para sincronización con Google Drive y Google Sheets.

## 🛠️ Tecnologías
- **Framework**: NestJS 11
- **ORM**: TypeORM
- **Base de Datos**: PostgreSQL
- **Documentación**: Swagger (@nestjs/swagger)
- **Validación**: class-validator & class-transformer

## ⚙️ Configuración del Proyecto

### 1. Requisitos Previos
- Node.js (v18+)
- PostgreSQL corriendo localmente o en la nube.

### 2. Instalación
```bash
$ npm install
```

### 3. Variables de Entorno
Copia el archivo `.env.example` a `.env` y configura tus credenciales:
```bash
$ cp .env.example .env
```

### 4. Base de Datos (Migraciones y Seeders)
Este proyecto utiliza migraciones para gestionar el esquema y seeders para datos de prueba.

- **Ejecutar migraciones**:
  ```bash
  $ npm run migration:run
  ```
- **Poblar Base de Datos (Seeders)**:
  Crea usuarios y roles de prueba iniciales.
  ```bash
  $ npm run seed:run
  ```
- **Reset Completo (Vaciar y Recargar)**:
  Limpia los datos de todas las tablas (truncate) y vuelve a ejecutar los seeders sin borrar el esquema.
  ```bash
  $ npm run db:reset
  ```
- **Generar una migración**:
  ```bash
  $ npm run migration:generate -- src/migrations/[NombreDeLaMigracion]
  ```
- **Revertir última migración**:
  ```bash
  $ npm run migration:revert
  ```

## 🏃 Ejecución

```bash
# Desarrollo (watch mode)
$ npm run start:dev

# Producción
$ npm run start:prod
```

Una vez en ejecución, podés acceder a la API y su documentación en:
👉 **[http://localhost:3000/api](http://localhost:3000/api)**

## 📂 Estructura de Módulos
- **AuthModule**: Gestión de usuarios y roles (Root, Docente, Estudiante).
- **ClassroomsModule**: Administración de aulas y matriculación.
- **AssignmentsModule**: Creación y gestión de tareas/asignaciones.
- **SubmissionsModule**: Control de entregas, calificaciones y sincronización.
- **AuditModule**: Logs de auditoría para cumplimiento normativo (ISO 27001).
- **GoogleCloudModule**: Buffer lógico para integración con el ecosistema de Google.

## 📄 Licencia
Este proyecto es propiedad de Cloud Academy.
