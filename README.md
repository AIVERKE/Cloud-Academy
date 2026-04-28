# Cloud Academy ☁️🎓

Sistema integral de gestión académica diseñado para facilitar la interacción entre docentes y estudiantes, con integración profunda en Google Cloud (Drive y Sheets) y cumplimiento de estándares de seguridad ISO 27001.

## 🏗️ Arquitectura del Proyecto

El proyecto está dividido en dos grandes bloques (Frontend y Backend) para mantener una separación clara de responsabilidades y permitir la escalabilidad independiente.

```
Cloud-Academy/
├── backend-cloud-academy/  # API RESTful (NestJS, TypeORM, PostgreSQL)
├── frontend-cloud-academy/ # Cliente Web (Vue 3, Vuetify 3, Vite)
└── README.md               # Documentación general del sistema
```

### 🔹 Backend
- **Framework**: NestJS.
- **Persistencia**: PostgreSQL con TypeORM.
- **Documentación**: Swagger UI disponible en `/api`.
- **Características**: Sistema de auditoría JSONB, gestión de roles (Root, Docente, Estudiante), integración con Google Cloud.

### 🔹 Frontend
- **Framework**: Vue 3 (Composition API).
- **UI**: Vuetify 3.
- **Estado**: Pinia.
- **Arquitectura**: Modular por dominios para vistas y componentes.

---

## 🚀 Instalación y Configuración

### 1. Requisitos Previos
- **Node.js**: v18 o superior.
- **npm**: v9 o superior.
- **PostgreSQL**: Instancia activa para el backend.

### 2. Configuración del Backend
1. Entrar a la carpeta: `cd backend-cloud-academy`.
2. Instalar dependencias: `npm install`.
3. Configurar variables de entorno:
   ```bash
   cp .env.example .env
   # Editar .env con tus credenciales de base de datos
   ```
4. Correr migraciones para crear las tablas:
   ```bash
   npm run migration:run
   ```
5. Iniciar en desarrollo: `npm run start:dev`.

### 3. Configuración del Frontend
1. Entrar a la carpeta: `cd frontend-cloud-academy`.
2. Instalar dependencias: `npm install`.
3. Configurar variables de entorno:
   ```bash
   cp .env.example .env
   # Asegurar que VITE_API_URL apunte al backend (http://localhost:3000/api)
   ```
4. Iniciar en desarrollo: `npm run dev`.

---

## 🤝 Reglas de Contribución

Para mantener la calidad y consistencia del código (¡ponete las pilas!), seguimos estas reglas:

### 1. Estilo de Código
- **Semicolons**: Obligatorios en ambos proyectos (`;`).
- **Quotes**: Usar comillas simples (`'`) para strings en TypeScript/JavaScript.
- **Modularización**: No pongas lógica de negocio pesada en controladores o vistas. Usá servicios y mantené la estructura modular.

### 2. Commits
- Usar **Conventional Commits** (ej: `feat: add google sheets sync`, `fix: auth middleware timeout`).
- Nunca incluyas archivos `.env` o carpetas `node_modules` en los commits.

### 3. Documentación
- Cada nueva funcionalidad debe ser documentada en el README del módulo correspondiente si es necesario.
- Mantener el Swagger actualizado mediante decoradores de TypeORM/NestJS.

---

## 🔒 Seguridad
Este proyecto sigue lineamientos de la norma **ISO 27001**, incluyendo:
- Logs de auditoría detallados para cada acción del usuario.
- Gestión de permisos estricta basada en roles.
- Validación de datos tanto en cliente como en servidor.

---
**Desarrollado con ❤️ para Cloud Academy.**
