# Cloud Academy Frontend 🚀

Este es el cliente web para el sistema **Cloud Academy**, construido con **Vue 3**, **Vuetify 3** y **Vite**.

## 🛠️ Tecnologías

- **Framework**: [Vue.js 3](https://vuejs.org/) (Composition API)
- **UI Library**: [Vuetify 3](https://vuetifyjs.com/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **State Management**: [Pinia](https://pinia.vuejs.org/)
- **Routing**: [Vue Router 4](https://router.vuejs.org/)
- **Icons**: [Material Design Icons](https://materialdesignicons.com/)

## 📂 Estructura del Proyecto

El proyecto sigue una arquitectura **modular por dominios** para mantener el orden y la escalabilidad:

```
src/
├── modules/            # Módulos de la aplicación
│   ├── auth/           # Autenticación y Perfil
│   ├── classrooms/     # Gestión de Aulas
│   ├── assignments/    # Tareas y Materiales
│   ├── submissions/    # Entregas y Calificaciones
│   └── audit/          # Logs y Auditoría
├── plugins/            # Configuraciones de plugins (Vuetify, etc.)
├── router/             # Configuración de rutas
├── store/              # Stores globales de Pinia
└── assets/             # Recursos estáticos (imágenes, fuentes, css)
```

## 🚀 Instalación y Uso

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Configurar entorno**:
   Copia el archivo de ejemplo y configura tu API URL:
   ```bash
   cp .env.example .env
   ```

3. **Ejecutar en desarrollo**:
   ```bash
   npm run dev
   ```
   El proyecto estará disponible en `http://localhost:5173/`.

4. **Construir para producción**:
   ```bash
   npm run build
   ```

## 📝 Notas de Diseño

- Se utiliza **TypeScript** para mayor seguridad en el tipado.
- El diseño es responsivo gracias al sistema de grillas de Vuetify.
- Los módulos están desacoplados para facilitar el mantenimiento.
