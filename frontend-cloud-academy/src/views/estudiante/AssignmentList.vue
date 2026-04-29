<template>
  <v-container fluid class="pa-8 bg-slate-50 min-vh-100">
    <!-- Header Section -->
    <v-row class="mb-8" align="center">
      <v-col cols="12" md="8">
        <div class="d-flex align-center mb-1">
          <v-icon icon="mdi-format-list-checks" color="primary" size="32" class="mr-3"></v-icon>
          <h1 class="text-h3 font-weight-black text-slate-900">Mis Tareas</h1>
        </div>
        <p class="text-subtitle-1 text-slate-500 ml-11">
          Seguí el progreso de tus actividades y entregá tus trabajos a tiempo.
        </p>
      </v-col>
    </v-row>

    <!-- Loading State -->
    <v-row v-if="loading">
      <v-col v-for="i in 4" :key="i" cols="12">
        <v-skeleton-loader type="list-item-avatar-three-line" class="rounded-xl mb-4"></v-skeleton-loader>
      </v-col>
    </v-row>

    <!-- Assignments List -->
    <v-row v-else>
      <v-col v-for="assignment in sortedAssignments" :key="assignment.id" cols="12">
        <v-card
          variant="flat"
          border
          class="assignment-card rounded-xl overflow-hidden mb-2"
          hover
          @click="goToSubmission(assignment.aulaId, assignment.id)"
        >
          <v-row no-gutters>
            <!-- Left accent color based on status -->
            <div 
              class="status-accent" 
              :class="assignment.estado === 'Atrasado' ? 'bg-error' : 'bg-primary'"
            ></div>
            
            <v-col class="pa-6">
              <div class="d-flex justify-space-between align-center mb-2">
                <div class="d-flex align-center">
                  <v-chip 
                    size="x-small" 
                    color="primary" 
                    variant="tonal" 
                    class="font-weight-black text-uppercase tracking-widest mr-2"
                  >
                    {{ getClassroomName(assignment.aulaId) }}
                  </v-chip>
                  <span class="text-caption text-slate-400">
                    ID: {{ assignment.id.split('-')[0] }}
                  </span>
                </div>
                
                <v-chip 
                  :color="getEstadoEntregaColor(assignment.estado || '')" 
                  size="small" 
                  variant="flat"
                  class="font-weight-bold"
                >
                  {{ assignment.estado || 'Pendiente' }}
                </v-chip>
              </div>

              <v-card-title class="pa-0 text-h5 font-weight-bold text-slate-800 mb-2">
                {{ assignment.titulo }}
              </v-card-title>

              <v-card-text class="pa-0 text-body-1 text-slate-500 mb-4 line-clamp-2">
                {{ assignment.descripcion }}
              </v-card-text>

              <v-divider class="mb-4 opacity-50"></v-divider>

              <div class="d-flex align-center justify-space-between">
                <div class="d-flex align-center">
                  <v-avatar size="24" color="slate-100" class="mr-2">
                    <v-icon 
                      icon="mdi-calendar-clock" 
                      size="14" 
                      :color="assignment.estado === 'Atrasado' ? 'error' : 'primary'"
                    ></v-icon>
                  </v-avatar>
                  <span 
                    class="text-caption font-weight-bold"
                    :class="assignment.estado === 'Atrasado' ? 'text-error' : 'text-slate-600'"
                  >
                    Vence: {{ formatDateTime(assignment.fecha_limite) }}
                  </span>
                </div>

                <v-btn 
                  variant="text" 
                  color="primary" 
                  class="text-none font-weight-bold"
                  append-icon="mdi-arrow-right"
                >
                  Ver Detalles
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <v-col v-if="sortedAssignments.length === 0" cols="12">
        <v-card variant="flat" border rounded="xl" class="pa-12 text-center bg-slate-50 border-dashed">
          <v-avatar size="100" color="success-lighten-5" class="mb-6">
            <v-icon icon="mdi-party-popper" size="48" color="success"></v-icon>
          </v-avatar>
          <h3 class="text-h5 font-weight-black text-slate-700 mb-2">¡Todo al día!</h3>
          <p class="text-body-1 text-slate-400">No tenés tareas pendientes en ninguna de tus clases.</p>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useDataStore, type Assignment, type Classroom } from '../../store/data';
import { useAuthStore } from '../../store/auth';
import { getEstadoEntregaColor } from '../../types/enums';

const router = useRouter();
const dataStore = useDataStore();
const authStore = useAuthStore();

const assignments = ref<Assignment[]>([]);
const classrooms = ref<Classroom[]>([]);
const loading = ref(true);

onMounted(async () => {
  await loadData();
});

const loadData = async () => {
  loading.value = true;
  try {
    const userId = authStore.user?.id || '';
    // Fetch all classes to get names
    classrooms.value = await dataStore.fetchClassrooms(userId);
    // Fetch ALL assignments for student
    assignments.value = await dataStore.fetchAssignments();
  } catch (error) {
    console.error('Error loading data', error);
  } finally {
    loading.value = false;
  }
};

const sortedAssignments = computed(() => {
  // Sort by dueDate ascending (closest first)
  return [...assignments.value].sort((a, b) => {
    return new Date(a.fecha_limite).getTime() - new Date(b.fecha_limite).getTime();
  });
});

const getClassroomName = (aulaId: string) => {
  const cls = classrooms.value.find(c => c.id === aulaId);
  return cls ? cls.name : 'Aula Desconocida';
};

const formatDateTime = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleString('es-AR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const goToSubmission = (aulaId: string, tareaId: string) => {
  router.push({
    name: 'SubmissionForm',
    params: { aulaId, tareaId }
  });
};
</script>

<style scoped>
.bg-slate-50 { background-color: #f8fafc; }
.text-slate-900 { color: #0f172a; }
.text-slate-800 { color: #1e293b; }
.text-slate-700 { color: #334155; }
.text-slate-600 { color: #475569; }
.text-slate-500 { color: #64748b; }
.text-slate-400 { color: #94a3b8; }

.min-vh-100 { min-height: 100vh; }

.assignment-card {
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0 !important;
  background-color: white !important;
}

.assignment-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 20px -8px rgba(0, 0, 0, 0.08) !important;
  border-color: rgba(var(--v-theme-primary), 0.3) !important;
}

.status-accent {
  width: 6px;
  height: auto;
}

.tracking-widest {
  letter-spacing: 1px !important;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.border-dashed {
  border-style: dashed !important;
  border-width: 2px !important;
}
</style>
