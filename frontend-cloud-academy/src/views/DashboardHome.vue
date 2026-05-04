<template>
  <v-container fluid class="pa-0 bg-slate-50 min-h-screen">
    <!-- Welcome Header with Professional Gradient (Landing Match) -->
    <v-row no-gutters>
      <v-col cols="12">
        <v-card
          class="welcome-card mb-8 overflow-hidden rounded-0"
          elevation="0"
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
    <v-row class="px-4 px-md-8">
      <StatCardsGrid :stats="currentStats" />
    </v-row>

    <!-- Main Content Area -->
    <v-row class="mt-8 px-4 px-md-8 pb-8">
      <!-- Recent Activity / News -->
      <v-col v-if="authStore.user?.role === 'Root'" cols="12" md="8">
        <SystemActivityList title="Actividad del Sistema" :activities="activities" />
      </v-col>

      <!-- Quick Actions / Context Menu -->
      <v-col cols="12" :md="authStore.user?.role === 'Root' ? 4 : 12">
        <QuickActionsMenu 
          title="Acciones Rápidas" 
          :actions="quickActions" 
          :loadingAction="isSyncing ? 'Sincronizar Drive' : undefined"
        />
      </v-col>
    </v-row>

    <!-- Premium Sync Dialog -->
    <v-dialog v-model="syncDialog" max-width="450" transition="dialog-bottom-transition">
      <v-card rounded="xl" elevation="24" class="overflow-hidden border-0">
        <v-card-text class="pa-0">
          <div class="bg-slate-900 pa-8 text-center relative overflow-hidden">
            <div class="abs-deco-sync"></div>
            <v-avatar color="white" size="80" class="elevation-12 mb-4 relative z-10">
              <v-icon icon="mdi-check-decagram" color="primary" size="48"></v-icon>
            </v-avatar>
            <h2 class="text-h4 font-weight-black text-white mb-2 relative z-10">¡Sincronización Exitosa!</h2>
            <p class="text-blue-lighten-4 opacity-70 relative z-10">El puente de datos con Google Drive se ha actualizado correctamente.</p>
          </div>
          
          <div class="pa-8 bg-white">
            <v-row>
              <v-col cols="6">
                <div class="pa-4 bg-slate-50 rounded-xl border text-center">
                  <div class="text-h3 font-weight-black text-primary">{{ syncResult.creados }}</div>
                  <div class="text-overline font-weight-bold text-slate-500">Nuevos</div>
                </div>
              </v-col>
              <v-col cols="6">
                <div class="pa-4 bg-slate-50 rounded-xl border text-center">
                  <div class="text-h3 font-weight-black text-info">{{ syncResult.actualizados }}</div>
                  <div class="text-overline font-weight-bold text-slate-500">Actualizados</div>
                </div>
              </v-col>
            </v-row>
            
            <v-btn
              block
              color="slate-900"
              size="x-large"
              rounded="xl"
              class="mt-8 text-none font-weight-bold elevation-4"
              @click="syncDialog = false"
            >
              Entendido
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Error Dialog -->
    <v-dialog v-model="errorDialog" max-width="400">
      <v-card rounded="xl" class="pa-6">
        <div class="text-center">
          <v-avatar color="error-lighten-5" size="72" class="mb-4">
            <v-icon icon="mdi-cloud-off-outline" color="error" size="36"></v-icon>
          </v-avatar>
          <h3 class="text-h5 font-weight-black text-slate-900 mb-2">Error de Conexión</h3>
          <p class="text-slate-600 mb-6">No pudimos establecer comunicación con la API de Google Drive. Por favor, intenta de nuevo más tarde.</p>
          <v-btn block color="error" variant="tonal" rounded="xl" @click="errorDialog = false" class="font-weight-bold">Cerrar</v-btn>
        </div>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useAuthStore } from '../store/auth';
import { useDataStore } from '../store/data';

import StatCardsGrid from '../components/dashboard/StatCardsGrid.vue';
import SystemActivityList from '../components/dashboard/SystemActivityList.vue';
import QuickActionsMenu from '../components/dashboard/QuickActionsMenu.vue';

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
const syncDialog = ref(false);
const errorDialog = ref(false);
const syncResult = ref({ creados: 0, actualizados: 0 });

const handleSync = async () => {
  isSyncing.value = true;
  try {
    const result = await dataStore.syncDriveResources();
    if (result.creados !== undefined) {
      syncResult.value = result;
      syncDialog.value = true;
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
    errorDialog.value = true;
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

.abs-deco-sync {
  position: absolute;
  top: -50%;
  right: -20%;
  width: 100%;
  height: 200%;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0) 70%);
  transform: rotate(15deg);
  pointer-events: none;
}
</style>
