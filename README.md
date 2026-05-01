# Cloud Academy ☁️🎓

Sistema integral de gestión académica diseñado para facilitar la interacción entre docentes y estudiantes, con integración profunda en Google Cloud (Drive y Sheets) y cumplimiento de estándares de seguridad ISO 27001.

---

## 🏗️ Estructura del Proyecto

El proyecto utiliza una arquitectura de monorepo dividida en dos grandes bloques:

```text
Cloud-Academy/
├── backend-cloud-academy/  # API RESTful (NestJS, TypeORM, PostgreSQL)
├── frontend-cloud-academy/ # Cliente Web (Vue 3, Vuetify 3, Vite)
├── .github/workflows/      # CI/CD (GitHub Actions)
└── README.md               # Guía de instalación (esta que estás leyendo)
```

---

## 🚀 Guía de Instalación Detallada

Seguí estos pasos en orden para tener el entorno de desarrollo funcionando.

### 0. Obtener el Código 📥

Primero, cloná el repositorio en tu computadora:
```bash
git clone https://github.com/AIVERKE/Cloud-Academy.git
cd Cloud-Academy
```

### 1. Requisitos Previos

Antes de empezar, asegurate de tener instalado:
- **Node.js**: v20.x (Recomendado usar [nvm](https://github.com/nvm-sh/nvm)).
- **npm**: v10.x o superior.
- **PostgreSQL**: v15 o superior corriendo localmente o en un contenedor.
- **Git**: Para clonar el repositorio.

---

### 2. Configuración del Backend 🛠️

1. **Entrar a la carpeta**:
   ```bash
   cd backend-cloud-academy
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Configurar el entorno**:
   Copiá el archivo de ejemplo y editá las variables:
   ```bash
   cp .env.example .env
   ```
   > [!IMPORTANT]
   > Asegurate de configurar correctamente `DB_PASSWORD` y `DB_NAME` en el `.env`. Si la base de datos no existe, creala manualmente en Postgres antes de continuar.

4. **Configuración de Google Cloud (Crítico)**:
   - Necesitás un archivo `google-credentials.json` en la raíz de `backend-cloud-academy/`.
   - Pedir al dueño del proyecto las llaves para la conexión con las apis de Google Cloud.

5. **Inicializar la Base de Datos**:
   Ejecutá las migraciones para crear las tablas y luego cargá los datos iniciales (seeds):
   ```bash
   # Crear tablas
   npm run migration:run
   
   # Cargar datos de prueba (Usuarios root, docentes, etc.)
   npm run seed:run
   ```

6. **Iniciar el servidor**:
   ```bash
   npm run start:dev
   ```
   La API estará disponible en `http://localhost:3000/api`. Podés ver la documentación Swagger en `http://localhost:3000/api/docs`.

---

### 3. Configuración del Frontend 💻

1. **Entrar a la carpeta**:
   ```bash
   cd ../frontend-cloud-academy
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Configurar el entorno**:
   ```bash
   cp .env.example .env
   ```
   Verificá que `VITE_API_URL` coincida con la URL de tu backend (por defecto `http://localhost:3000/api`).

4. **Iniciar la aplicación**:
   ```bash
   npm run dev
   ```
   Abrí `http://localhost:5173` en tu navegador.

---

## 🛠️ Comandos Útiles

| Proyecto | Comando | Descripción |
| :--- | :--- | :--- |
| **Backend** | `npm run lint` | Revisa errores de estilo en el código. |
| **Backend** | `npm run build` | Compila el proyecto para producción. |
| **Backend** | `npm run migration:generate -- name` | Genera una nueva migración basada en cambios en entidades. |
| **Frontend** | `npm run build` | Genera el bundle optimizado en `/dist`. |
| **Frontend** | `npm run preview` | Previsualiza el build de producción localmente. |

---

## 🤝 Contribución y Flujo de Trabajo

Para mantener el orden en el desarrollo (¡no hagamos desastres!), utilizamos **Git Flow** y gestionamos las tareas mediante un tablero centralizado.

### 1. Tablero de Tareas 📋
Antes de empezar a codear, revisá el tablero de tareas y asignate lo que vayas a trabajar:
👉 [GitHub Project - Cloud Academy](https://github.com/users/AIVERKE/projects/2)

### 2. Flujo de Git (Git Flow) 🌿
Trabajamos con ramas siguiendo este esquema:
- **`main`**: Código estable y productivo. Nadie pushea acá directamente.
- **`develop`**: Rama principal de integración. De acá salen las nuevas funcionalidades.
- **`feature/nombre-tarea`**: Para nuevas funcionalidades o mejoras.
- **`fix/nombre-error`**: Para corrección de errores.
- **`hotfix/urgente`**: Para arreglos críticos directos a producción.

**Pasos para colaborar:**
1. Posicionate en `develop`: `git checkout develop`.
2. Bajate lo último: `git pull origin develop`.
3. Creá tu rama: `git checkout -b feature/mi-nueva-tarea`.
4. Una vez terminada, abrí un **Pull Request** hacia `develop` para revisión de código.

---

## 🧪 Integración Continua (CI/CD)

El proyecto cuenta con **GitHub Actions** configurados en `.github/workflows/`.
- Cada vez que hagas un **Push** a `main` o abras un **Pull Request**, se ejecutarán tests de compilación, linter y verificación de sintaxis automáticamente para asegurar la estabilidad de la rama principal.

---

## 💡 Troubleshooting (Solución de problemas)

- **Error de conexión a BD**: Verificá que el servicio de Postgres esté corriendo y que las credenciales en `.env` sean correctas.
- **Error con Google Drive/Sheets**: Asegurate de que el archivo `google-credentials.json` tenga el formato correcto y que las APIs estén habilitadas en el panel de Google Cloud.
- **Puerto 3000 ocupado**: Podés cambiar el puerto en el `.env` del backend, pero recordá actualizar la URL en el frontend también.

---
**Desarrollado con ❤️ para la comunidad de Cloud Academy.**
