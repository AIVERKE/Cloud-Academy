<template>
  <v-container fluid class="pa-8 bg-slate-50 min-vh-100">
    <!-- Header Premium -->
    <v-row class="mb-8 align-center animate__animated animate__fadeIn">
      <v-col cols="12" md="8">
        <div class="d-flex align-center mb-2">
          <v-btn 
            icon="mdi-arrow-left" 
            variant="tonal" 
            color="slate-600" 
            class="mr-4"
            @click="goBack"
          ></v-btn>
          <div class="text-overline text-primary font-weight-bold">MESA DE CALIFICACIÓN</div>
        </div>
        <h1 class="text-h3 font-weight-bold slate-900 mb-1">Entregas Recibidas</h1>
        <div class="d-flex align-center">
          <v-icon icon="mdi-notebook-outline" color="primary" class="mr-2"></v-icon>
          <span class="text-h6 font-weight-medium slate-600">
            {{ assignment?.titulo || 'Cargando tarea...' }}
          </span>
        </div>
      </v-col>
      <v-col cols="12" md="4" class="text-md-right">
        <v-btn
          variant="outlined"
          color="primary"
          prepend-icon="mdi-export-variant"
          rounded="lg"
          class="mr-2 text-none"
        >
          Exportar Notas
        </v-btn>
        <v-btn
          color="primary"
          prepend-icon="mdi-sync"
          rounded="lg"
          class="text-none"
          elevation="2"
          @click="loadData"
        >
          Sincronizar
        </v-btn>
      </v-col>
    </v-row>

    <!-- Stats Bar -->
    <v-row class="mb-6">
      <v-col cols="12" sm="4" md="3">
        <v-card variant="flat" class="rounded-xl border-light pa-4 bg-white">
          <div class="text-caption text-medium-emphasis mb-1">TOTAL ENTREGAS</div>
          <div class="text-h4 font-weight-bold primary-text">{{ submissions.length }}</div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4" md="3">
        <v-card variant="flat" class="rounded-xl border-light pa-4 bg-white">
          <div class="text-caption text-medium-emphasis mb-1">CALIFICADAS</div>
          <div class="text-h4 font-weight-bold success-text">
            {{ submissions.filter(s => s.calificacion !== null).length }}
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4" md="3">
        <v-card variant="flat" class="rounded-xl border-light pa-4 bg-white">
          <div class="text-caption text-medium-emphasis mb-1">PENDIENTES</div>
          <div class="text-h4 font-weight-bold warning-text">
            {{ submissions.filter(s => s.calificacion === null).length }}
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Data Table Premium -->
    <v-card class="rounded-xl elevation-2 overflow-hidden border-light">
      <v-data-table
        :headers="headers"
        :items="submissions"
        :loading="loading"
        hover
        class="bg-white"
      >
        <template v-slot:loading>
          <v-skeleton-loader type="table-row@5" class="pa-4"></v-skeleton-loader>
        </template>

        <!-- Student Column -->
        <template v-slot:item.estudianteNombre="{ item }">
          <div class="d-flex align-center py-3">
            <v-avatar size="36" color="primary-lighten-4" class="mr-3">
              <span class="text-subtitle-2 font-weight-bold primary-darken-2">
                {{ item.estudiante?.nombre_completo?.charAt(0) || 'E' }}
              </span>
            </v-avatar>
            <div>
              <div class="font-weight-bold slate-800">{{ item.estudiante?.nombre_completo || 'Estudiante Anon' }}</div>
              <div class="text-caption text-medium-emphasis">{{ item.estudiante?.email }}</div>
            </div>
          </div>
        </template>

        <!-- Drive Link Column -->
        <template v-slot:item.google_drive_url="{ item }">
          <v-btn
            :href="item.google_drive_url"
            target="_blank"
            color="primary"
            variant="tonal"
            rounded="pill"
            size="small"
            prepend-icon="mdi-google-drive"
            class="text-none"
          >
            Abrir Documento
          </v-btn>
        </template>

        <!-- Date Column -->
        <template v-slot:item.fecha_entrega="{ item }">
          <div class="text-body-2 slate-600">
            {{ new Date(item.fecha_entrega).toLocaleDateString() }}
            <span class="text-caption text-medium-emphasis ml-1">
              {{ new Date(item.fecha_entrega).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
            </span>
          </div>
        </template>

        <!-- Sync Status Chip -->
        <template v-slot:item.sync_status="{ item }">
          <v-chip 
            :color="getSyncStatusColor(item.sync_status)" 
            size="x-small" 
            variant="flat"
            class="text-uppercase font-weight-bold px-2"
          >
            {{ item.sync_status.replace('_', ' ') }}
          </v-chip>
        </template>

        <!-- Grade Input Column -->
        <template v-slot:item.calificacion="{ item }">
          <div class="d-flex align-center justify-end" style="width: 180px;">
            <v-text-field
              v-model.number="item.calificacion"
              type="number"
              density="compact"
              hide-details
              variant="outlined"
              rounded="lg"
              class="mr-2 grade-input"
              suffix="/100"
              max="100"
              min="0"
            ></v-text-field>
            <v-btn
              icon="mdi-check-bold"
              size="small"
              color="success"
              variant="elevated"
              elevation="2"
              @click="saveGrade(item)"
              :loading="savingId === item.id"
            >
              <v-tooltip activator="parent" location="top">Guardar Nota</v-tooltip>
            </v-btn>
          </div>
        </template>

        <template v-slot:no-data>
          <div class="pa-12 text-center">
            <v-icon icon="mdi-account-clock-outline" size="64" color="slate-200" class="mb-4"></v-icon>
            <h3 class="text-h6 slate-400 font-weight-medium">Aún no hay entregas para esta tarea</h3>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" rounded="lg" elevation="12">
      <div class="d-flex align-center">
        <v-icon :icon="snackbar.color === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle'" class="mr-2"></v-icon>
        {{ snackbar.text }}
      </div>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useDataStore, type Submission, type Assignment } from '../../store/data';
import { useAuthStore } from '../../store/auth';
import { getSyncStatusColor } from '../../types/enums';

const route = useRoute();
const router = useRouter();
const dataStore = useDataStore();
const authStore = useAuthStore();

const aulaId = route.params.aulaId as string;
const tareaId = route.params.tareaId as string;

const assignment = ref<Assignment | null>(null);
const submissions = ref<any[]>([]);
const loading = ref(true);
const savingId = ref<string | null>(null);

const snackbar = ref({ show: false, text: '', color: 'success' });

const headers: any = [
  { title: 'Estudiante', key: 'estudianteNombre', align: 'start' },
  { title: 'Recurso', key: 'google_drive_url', sortable: false },
  { title: 'Entregado', key: 'fecha_entrega' },
  { title: 'Sync Sheets', key: 'sync_status' },
  { title: 'Nota Final', key: 'calificacion', sortable: true, align: 'end' },
];

onMounted(async () => {
  await loadData();
});

const loadData = async () => {
  loading.value = true;
  try {
    // Load assignment details
    const assignments = await dataStore.fetchAssignments(aulaId);
    assignment.value = assignments.find((a: any) => a.id === tareaId) || null;

    // Load submissions
    submissions.value = await dataStore.fetchSubmissions(tareaId);
  } catch (error) {
    showSnackbar('Error al cargar entregas', 'error');
  } finally {
    loading.value = false;
  }
};

const goBack = () => {
  router.push({ name: 'ClassroomDetail', params: { id: aulaId } });
};

const saveGrade = async (item: any) => {
  if (item.calificacion === null || item.calificacion === undefined) {
    showSnackbar('Por favor ingresa una nota válida', 'warning');
    return;
  }

  if (item.calificacion < 0 || item.calificacion > 100) {
    showSnackbar('La nota debe estar entre 0 y 100', 'warning');
    return;
  }

  if (!authStore.user?.id) return;

  savingId.value = item.id;
  try {
    await dataStore.updateSubmissionGrade(item.id, item.calificacion, authStore.user.id);
    showSnackbar('Nota guardada. Auditada y en cola de sincronización.', 'success');
    await loadData();
  } catch (error) {
    showSnackbar('Error al guardar calificación', 'error');
  } finally {
    savingId.value = null;
  }
};

const showSnackbar = (text: string, color: string) => {
  snackbar.value = { show: true, text, color };
};
</script>

<style scoped>
.slate-900 { color: #0f172a; }
.slate-800 { color: #1e293b; }
.slate-700 { color: #334155; }
.slate-600 { color: #475569; }
.slate-400 { color: #94a3b8; }
.slate-200 { color: #e2e8f0; }
.bg-slate-50 { background-color: #f8fafc; }
.primary-text { color: var(--v-primary-base); }
.success-text { color: #10b981; }
.warning-text { color: #f59e0b; }

.min-vh-100 { min-height: 100vh; }

.border-light {
  border: 1px solid rgba(0, 0, 0, 0.05) !important;
}

.grade-input :deep(input) {
  text-align: center;
  font-weight: 600;
  color: #1e293b;
}

.primary-lighten-4 { background-color: #bae6fd; }
.primary-darken-2 { color: #075985; }
</style>
