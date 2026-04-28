<template>
  <v-container fluid>
    <!-- Header -->
    <v-row class="mb-4 align-center">
      <v-col>
        <v-btn icon="mdi-arrow-left" variant="text" class="mr-2" @click="goBack"></v-btn>
        <h1 class="text-h4 d-inline-block">Mesa de Calificación</h1>
        <div class="text-subtitle-1 text-medium-emphasis ml-12">
          Tarea: {{ assignment?.titulo || 'Cargando...' }}
        </div>
      </v-col>
    </v-row>

    <!-- Data Table -->
    <v-card>
      <v-data-table
        :headers="headers"
        :items="submissions"
        :loading="loading"
        class="elevation-1"
        hover
      >
        <template v-slot:loading>
          <v-skeleton-loader type="table-row@5"></v-skeleton-loader>
        </template>

        <!-- Drive Link Column -->
        <template v-slot:item.google_drive_url="{ item }">
          <v-btn
            :href="item.google_drive_url"
            target="_blank"
            color="info"
            variant="text"
            prepend-icon="mdi-google-drive"
            size="small"
          >
            Ver Archivo
          </v-btn>
        </template>

        <!-- Date Column -->
        <template v-slot:item.fecha_entrega="{ item }">
          {{ new Date(item.fecha_entrega).toLocaleString() }}
        </template>

        <!-- Sync Status Chip -->
        <template v-slot:item.sync_status="{ item }">
          <v-chip :color="getSyncStatusColor(item.sync_status)" size="small">
            {{ item.sync_status.replace('_', ' ') }}
          </v-chip>
        </template>

        <!-- Grade Input Column -->
        <template v-slot:item.calificacion="{ item }">
          <div class="d-flex align-center" style="max-width: 150px;">
            <v-text-field
              v-model.number="item.calificacion"
              type="number"
              density="compact"
              hide-details
              variant="outlined"
              class="mr-2"
              placeholder="--"
            ></v-text-field>
            <v-btn
              icon="mdi-content-save"
              size="small"
              color="primary"
              variant="tonal"
              @click="saveGrade(item)"
              :loading="savingId === item.id"
            ></v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color">
      {{ snackbar.text }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useDataStore, type Submission, type Assignment } from '../../store/data';
import { getSyncStatusColor } from '../../types/enums';

const route = useRoute();
const router = useRouter();
const dataStore = useDataStore();

const aulaId = route.params.aulaId as string;
const tareaId = route.params.tareaId as string;

const assignment = ref<Assignment | null>(null);
const submissions = ref<Submission[]>([]);
const loading = ref(true);
const savingId = ref<string | null>(null);

const snackbar = ref({ show: false, text: '', color: 'success' });

const headers: any = [
  { title: 'Estudiante', key: 'estudianteNombre', align: 'start' },
  { title: 'Archivo', key: 'google_drive_url', sortable: false },
  { title: 'Fecha de Entrega', key: 'fecha_entrega' },
  { title: 'Estado Sync', key: 'sync_status' },
  { title: 'Calificación', key: 'calificacion', sortable: false, align: 'end' },
];

onMounted(async () => {
  await loadData();
});

const loadData = async () => {
  loading.value = true;
  try {
    // Load assignment details
    const assignments = await dataStore.fetchAssignments(aulaId);
    assignment.value = assignments.find(a => a.id === tareaId) || null;

    // Load submissions
    // Deep copy to avoid directly mutating store state before save
    const data = await dataStore.fetchSubmissions(tareaId);
    submissions.value = JSON.parse(JSON.stringify(data));
  } catch (error) {
    showSnackbar('Error al cargar entregas', 'error');
  } finally {
    loading.value = false;
  }
};

const goBack = () => {
  router.push({ name: 'ClassroomDetail', params: { id: aulaId } });
};

const saveGrade = async (item: Submission) => {
  if (item.calificacion === null || item.calificacion === undefined) return;

  savingId.value = item.id;
  try {
    await dataStore.updateSubmissionGrade(item.id, item.calificacion);
    showSnackbar('Calificación guardada y sincronizando...', 'success');
    // Refresh to get updated sync status
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
