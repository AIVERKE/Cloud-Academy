<template>
  <v-container fluid class="pa-8 bg-slate-50 min-h-screen">
    <!-- Welcome Header with Professional Gradient (Landing Match) -->
    <v-row>
      <v-col cols="12">
        <v-card
          class="welcome-card mb-8 overflow-hidden"
          elevation="0"
          rounded="xl"
        >
          <v-card-text class="pa-12 relative z-10">
            <v-row>
              <v-col cols="12" md="8">
                <div class="entrance-fade-up">
                  <v-chip color="white" variant="tonal" size="small" class="mb-4 text-uppercase font-weight-bold tracking-widest">
                    {{ authStore.user?.role }} Panel
                  </v-chip>
                  <h1 class="text-h2 font-weight-black mb-2 text-white tracking-tighter" style="white-space: normal; min-width: 300px;">
                    Hola, {{ authStore.user?.name || 'Invitado' }}
                  </h1>
                  <p class="text-h6 text-white opacity-70 font-weight-regular leading-relaxed mt-4" style="max-width: 600px;">
                    {{ welcomeMessage }}
                  </p>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
          
          <!-- Decorative Background Elements -->
          <div class="abs-deco-1"></div>
          <div class="abs-deco-2"></div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Role-Based Statistics Grid -->
    <v-row>
      <v-col v-for="(stat, index) in currentStats" :key="index" cols="12" sm="6" md="3">
        <v-card class="stat-card border" rounded="xl" elevation="0">
          <v-card-text class="d-flex align-center pa-6">
            <v-avatar :color="stat.color + '-lighten-5'" size="64" rounded="xl" class="mr-4">
              <v-icon :icon="stat.icon" :color="stat.color" size="32"></v-icon>
            </v-avatar>
            <div>
              <div class="text-overline mb-0 text-grey-darken-1 font-weight-bold">{{ stat.label }}</div>
              <div class="text-h4 font-weight-black text-slate-900">{{ stat.value }}</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Main Content Area -->
    <v-row class="mt-8">
      <!-- Recent Activity / News (Only for Root) -->
      <v-col v-if="authStore.user?.role === 'Root'" cols="12" md="8">
        <v-card rounded="xl" elevation="0" class="border">
          <v-card-title class="pa-6 d-flex align-center">
            <div class="d-flex align-center">
              <v-avatar color="primary-lighten-5" size="40" class="mr-3">
                <v-icon icon="mdi-pulse" color="primary"></v-icon>
              </v-avatar>
              <span class="text-h5 font-weight-bold text-slate-900">Actividad del Sistema</span>
            </div>
            <v-spacer></v-spacer>
            <v-btn variant="text" color="primary" class="font-weight-bold">Ver todo</v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-list class="pa-0">
            <v-list-item
              v-for="(item, i) in activities"
              :key="i"
              class="pa-6 border-b last:border-0"
              :class="{ 'bg-slate-50/50': i % 2 === 0 }"
            >
              <template v-slot:prepend>
                <v-avatar :color="item.color" size="44" class="mr-4 elevation-1">
                  <v-icon :icon="item.icon" color="white" size="22"></v-icon>
                </v-avatar>
              </template>
              <v-list-item-title class="font-weight-black text-slate-900">{{ item.title }}</v-list-item-title>
              <v-list-item-subtitle class="text-slate-600 mt-1">{{ item.time }} — {{ item.description }}</v-list-item-subtitle>
              <template v-slot:append>
                <v-chip 
                  size="small" 
                  variant="flat" 
                  color="grey-darken-4" 
                  class="font-weight-bold uppercase"
                >
                  {{ item.tag }}
                </v-chip>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <!-- Quick Actions / Context Menu -->
      <v-col cols="12" md="4">
        <v-card rounded="xl" elevation="0" class="border bg-white h-100">
          <v-card-title class="pa-6 text-h5 font-weight-bold text-slate-900">
            Acciones Rápidas
          </v-card-title>
          <v-card-text class="pa-6 pt-0">
            <v-btn
              v-for="action in quickActions"
              :key="action.title"
              block
              :color="action.color"
              variant="tonal"
              rounded="xl"
              size="large"
              class="mb-4 py-6 d-flex justify-start text-none"
              :to="action.to"
              :loading="isSyncing && action.title === 'Sincronizar Drive'"
              @click="action.handler ? action.handler() : null"
            >
              <template v-slot:prepend>
                <v-icon :icon="action.icon" class="mr-4"></v-icon>
              </template>
              <div class="text-left">
                <div class="font-weight-bold">{{ action.title }}</div>
                <div class="text-caption opacity-70">{{ action.desc }}</div>
              </div>
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useAuthStore } from '../store/auth';
import { useDataStore } from '../store/data';

const authStore = useAuthStore();
const dataStore = useDataStore();

const dashboardStats = ref({
  activeUsers: '...',
  driveFiles: '...',
  uptime: '...',
  pendingAlerts: '...'
});

const teacherStats = ref({
  activeClassrooms: '...',
  pendingSubmissions: '...',
  totalResources: '...',
  averageGrade: '...'
});

const activities = ref<any[]>([]);

onMounted(async () => {
  if (authStore.user?.role === 'Root') {
    const stats = await dataStore.fetchDashboardStats();
    dashboardStats.value = {
      activeUsers: stats.activeUsers,
      driveFiles: stats.driveFiles,
      uptime: stats.uptime,
      pendingAlerts: stats.pendingAlerts
    };
    activities.value = stats.activities || [];
  } else if (authStore.user?.role === 'Docente') {
    const stats = await dataStore.fetchTeacherStats(authStore.user.id);
    teacherStats.value = {
      activeClassrooms: stats.activeClassrooms,
      pendingSubmissions: stats.pendingSubmissions,
      totalResources: stats.totalResources,
      averageGrade: stats.averageGrade
    };
  }
});

const isSyncing = ref(false);

const handleSync = async () => {
  isSyncing.value = true;
  try {
    const result = await dataStore.syncDriveResources();
    if (result.creados !== undefined) {
      alert(`Sincronización completa: ${result.creados} creados, ${result.actualizados} actualizados.`);
      // Refresh stats
      const stats = await dataStore.fetchDashboardStats();
      dashboardStats.value = {
        activeUsers: stats.activeUsers,
        driveFiles: stats.driveFiles,
        uptime: stats.uptime,
        pendingAlerts: stats.pendingAlerts
      };
      activities.value = stats.activities || [];
    }
  } catch (error) {
    alert('Error al sincronizar con Google Drive');
  } finally {
    isSyncing.value = false;
  }
};

const welcomeMessage = computed(() => {
  if (authStore.user?.role === 'Root') return 'Monitorea la salud del sistema y gestiona los recursos de infraestructura en tiempo real.';
  if (authStore.user?.role === 'Docente') return 'Gestiona tus aulas, califica entregas y publica nuevos recursos educativos.';
  return 'Accede a tus cursos, revisa tus tareas pendientes y descarga material de estudio.';
});

const currentStats = computed(() => {
  if (authStore.user?.role === 'Root') {
    return [
      { label: 'Usuarios Activos', value: dashboardStats.value.activeUsers, icon: 'mdi-account-multiple', color: 'primary' },
      { label: 'Archivos en Drive', value: dashboardStats.value.driveFiles, icon: 'mdi-cloud-outline', color: 'info' },
      { label: 'Uptime Sistema', value: dashboardStats.value.uptime, icon: 'mdi-shield-check', color: 'success' },
      { label: 'Alertas Pendientes', value: dashboardStats.value.pendingAlerts, icon: 'mdi-alert-octagon', color: 'error' },
    ];
  }
  if (authStore.user?.role === 'Docente') {
    return [
      { label: 'Cursos Activos', value: teacherStats.value.activeClassrooms, icon: 'mdi-google-classroom', color: 'primary' },
      { label: 'Tareas Pendientes', value: teacherStats.value.pendingSubmissions, icon: 'mdi-alert-circle-outline', color: 'error' },
      { label: 'Recursos Drive', value: teacherStats.value.totalResources, icon: 'mdi-cloud-outline', color: 'info' },
      { label: 'Promedio', value: teacherStats.value.averageGrade, icon: 'mdi-trending-up', color: 'success' },
    ];
  }
  return [];
});

const quickActions = computed(() => {
  if (authStore.user?.role === 'Root') {
    return [
      { title: 'Sincronizar Drive', desc: 'Actualizar metadatos de recursos', icon: 'mdi-sync', color: 'primary', handler: handleSync },
      { title: 'Auditar Accesos', desc: 'Revisar logs de seguridad', icon: 'mdi-shield-search', color: 'secondary', to: '/dashboard/admin/auditoria' },
      { title: 'Gestionar Usuarios', desc: 'Roles y permisos', icon: 'mdi-account-cog', color: 'info', to: '/dashboard/admin/usuarios' },
    ];
  }
  return [
    { title: 'Ver mis Cursos', desc: 'Acceder a las aulas virtuales', icon: 'mdi-school', color: 'primary', to: '/dashboard/docente/aulas' },
    { title: 'Mi Perfil', desc: 'Ajustes de cuenta', icon: 'mdi-account-circle', color: 'secondary', to: '#' },
  ];
});
</script>

<style scoped>
.welcome-card {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.abs-deco-1 {
  position: absolute;
  top: -20%;
  right: -5%;
  width: 40%;
  height: 140%;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0) 70%);
  transform: rotate(-15deg);
  pointer-events: none;
}

.abs-deco-2 {
  position: absolute;
  bottom: -30%;
  left: 10%;
  width: 30%;
  height: 100%;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, rgba(99, 102, 241, 0) 70%);
  pointer-events: none;
}

.stat-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: white;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px -10px rgba(0,0,0,0.1) !important;
  border-color: rgba(var(--v-theme-primary), 0.3) !important;
}

.bg-slate-50 {
  background-color: #f8fafc;
}

.text-slate-900 {
  color: #0f172a;
}

.text-slate-600 {
  color: #475569;
}

.entrance-fade-up {
  animation: fadeUp 0.8s ease-out forwards;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
