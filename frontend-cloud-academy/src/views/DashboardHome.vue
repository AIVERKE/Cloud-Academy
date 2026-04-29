<template>
  <v-container fluid class="pa-8">
    <!-- Welcome Header with Gradient Background -->
    <v-row>
      <v-col cols="12">
        <v-card
          class="welcome-card mb-8 overflow-hidden"
          elevation="4"
          rounded="xl"
        >
          <v-card-text class="pa-10 d-flex align-center">
            <div>
              <h1 class="text-h2 font-weight-bold mb-2 text-white">
                Bienvenido, {{ authStore.user?.name || 'Invitado' }} 🚀
              </h1>
              <p class="text-h6 text-white opacity-80 font-weight-light">
                Tu centro de mando para el aprendizaje en la nube.
              </p>
            </div>
            <v-spacer></v-spacer>
            <v-avatar size="150" class="d-none d-md-flex elevation-10 glass-avatar">
              <v-img :src="authStore.user?.avatar" alt="Avatar"></v-img>
            </v-avatar>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Statistics Grid -->
    <v-row>
      <v-col v-for="(stat, index) in stats" :key="index" cols="12" sm="6" md="3">
        <v-card class="stat-card" rounded="xl" elevation="2">
          <v-card-text class="d-flex align-center pa-6">
            <v-avatar :color="stat.color" size="56" rounded="lg" class="mr-4">
              <v-icon :icon="stat.icon" color="white" size="32"></v-icon>
            </v-avatar>
            <div>
              <div class="text-overline mb-1">{{ stat.label }}</div>
              <div class="text-h4 font-weight-black">{{ stat.value }}</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Main Content Area -->
    <v-row class="mt-8">
      <!-- Recent Activity / News -->
      <v-col cols="12" md="8">
        <v-card rounded="xl" elevation="1">
          <v-card-title class="pa-6 d-flex align-center">
            <v-icon icon="mdi-timeline-clock" class="mr-3" color="primary"></v-icon>
            <span class="text-h5 font-weight-bold">Actividad Reciente</span>
            <v-spacer></v-spacer>
            <v-btn variant="text" color="primary">Ver todo</v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-list class="pa-0">
            <v-list-item
              v-for="(item, i) in activities"
              :key="i"
              class="pa-6"
              :class="{ 'bg-grey-lighten-5': i % 2 === 0 }"
            >
              <template v-slot:prepend>
                <v-avatar :color="item.color" size="40" class="mr-4">
                  <v-icon :icon="item.icon" color="white" size="20"></v-icon>
                </v-avatar>
              </template>
              <v-list-item-title class="font-weight-bold">{{ item.title }}</v-list-item-title>
              <v-list-item-subtitle>{{ item.time }} - {{ item.description }}</v-list-item-subtitle>
              <template v-slot:append>
                <v-chip size="small" variant="outlined" :color="item.color">{{ item.tag }}</v-chip>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <!-- Resources Preview -->
      <v-col cols="12" md="4">
        <v-card rounded="xl" elevation="1" class="h-100">
          <v-card-title class="pa-6">
            <v-icon icon="mdi-folder-google" class="mr-3" color="info"></v-icon>
            <span class="text-h5 font-weight-bold">Recursos</span>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pa-6">
            <v-alert
              v-for="(resource, i) in topResources"
              :key="i"
              class="mb-4"
              rounded="lg"
              variant="tonal"
              :color="resource.color"
              :icon="resource.icon"
            >
              <div class="text-subtitle-1 font-weight-bold">{{ resource.name }}</div>
              <div class="text-caption">Accedido hace {{ resource.time }}</div>
            </v-alert>
            <v-btn
              block
              color="info"
              variant="flat"
              rounded="lg"
              size="large"
              class="mt-4"
              to="/recursos"
            >
              Explorar Drive
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useAuthStore } from '../store/auth';

const authStore = useAuthStore();

const stats = [
  { label: 'Cursos Activos', value: '4', icon: 'mdi-google-classroom', color: 'primary' },
  { label: 'Tareas Pendientes', value: '12', icon: 'mdi-alert-circle-outline', color: 'error' },
  { label: 'Recursos en Drive', value: '28', icon: 'mdi-cloud-outline', color: 'info' },
  { label: 'Calificación Prom.', value: '94%', icon: 'mdi-star-face', color: 'warning' },
];

const activities = [
  { 
    title: 'Nueva Tarea Asignada', 
    description: 'Computación en la Nube: Lab 4', 
    time: 'Hace 2 horas', 
    icon: 'mdi-file-plus', 
    color: 'primary',
    tag: 'Tarea'
  },
  { 
    title: 'Calificación Publicada', 
    description: 'Base de Datos: Examen Final', 
    time: 'Hace 5 horas', 
    icon: 'mdi-check-decagram', 
    color: 'success',
    tag: 'Nota'
  },
  { 
    title: 'Nuevo Recurso en Drive', 
    description: 'Guía de Arquitectura Microservicios', 
    time: 'Ayer', 
    icon: 'mdi-folder-upload', 
    color: 'info',
    tag: 'Cloud'
  },
];

const topResources = [
  { name: 'Guía de Docker', icon: 'mdi-docker', color: 'blue', time: '10 min' },
  { name: 'Planilla de Notas', icon: 'mdi-file-excel', color: 'green', time: '1 hora' },
];
</script>

<style scoped>
.welcome-card {
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%);
  position: relative;
}

.welcome-card::before {
  content: "";
  position: absolute;
  top: -50%;
  left: -20%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%);
  transform: rotate(-15deg);
  pointer-events: none;
}

.glass-avatar {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
  border: 4px solid rgba(255, 255, 255, 0.3);
}

.stat-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 20px rgba(0,0,0,0.1) !important;
}

.opacity-80 {
  opacity: 0.8;
}
</style>
