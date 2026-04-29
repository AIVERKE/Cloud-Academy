<template>
  <v-container>
    <v-row class="mb-4 align-center">
      <v-col>
        <v-btn icon="mdi-arrow-left" variant="text" class="mr-2" @click="$router.back()"></v-btn>
        <h1 class="text-h4 d-inline-block">Entregar Tarea</h1>
      </v-col>
    </v-row>

    <!-- Loading State -->
    <v-row v-if="loading">
      <v-col cols="12" class="text-center">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </v-col>
    </v-row>

    <v-row v-else-if="assignment">
      <!-- Task Details -->
      <v-col cols="12" md="5">
        <v-card variant="tonal" color="primary" class="h-100">
          <v-card-title class="text-h5">{{ assignment.titulo }}</v-card-title>
          <v-card-subtitle>
            Vence: {{ new Date(assignment.fecha_limite).toLocaleString() }}
          </v-card-subtitle>
          <v-card-text class="mt-4 text-body-1">
            {{ assignment.descripcion }}
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Submission Form -->
      <v-col cols="12" md="7">
        <v-card class="elevation-2">
          <v-card-title>Tu Entrega</v-card-title>

          <v-card-text v-if="alreadySubmitted" class="text-center py-8">
            <v-icon icon="mdi-check-circle" color="success" size="64" class="mb-4"></v-icon>
            <h3 class="text-h6 text-success">¡Tarea Entregada!</h3>
            <p class="text-medium-emphasis">Tu archivo está siendo procesado o ya fue calificado.</p>
          </v-card-text>

          <v-card-text v-else>
            <v-alert type="info" variant="tonal" class="mb-4 text-caption">
              Nota técnica: Por ahora simula la subida ingresando un enlace válido de Google Drive.
            </v-alert>

            <v-form ref="form" v-model="valid" @submit.prevent="submitWork">
              <v-text-field
                v-model="driveLink"
                label="Enlace de Google Drive"
                placeholder="https://drive.google.com/file/d/..."
                prepend-icon="mdi-google-drive"
                :rules="linkRules"
                required
                variant="outlined"
              ></v-text-field>
            </v-form>
          </v-card-text>

          <v-card-actions v-if="!alreadySubmitted">
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              size="large"
              :loading="submitting"
              @click="submitWork"
            >
              Entregar Tarea
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color">
      {{ snackbar.text }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useDataStore, type Assignment } from '../../store/data';
import { useAuthStore } from '../../store/auth';

const route = useRoute();

const dataStore = useDataStore();
const authStore = useAuthStore();

const tareaId = route.params.tareaId as string;
const assignment = ref<Assignment | null>(null);
const loading = ref(true);
const alreadySubmitted = ref(false);

const valid = ref(false);
const form = ref<any>(null);
const submitting = ref(false);
const driveLink = ref('');

const snackbar = ref({ show: false, text: '', color: 'success' });

const linkRules = [
  (v: string) => !!v || 'El enlace es requerido',
  (v: string) => /^(https?:\/\/)?(drive\.google\.com|docs\.google\.com)\/.+$/.test(v) || 'Debe ser un enlace válido de Google Drive (https://drive.google...)'
];

onMounted(async () => {
  await loadData();
});

const loadData = async () => {
  loading.value = true;
  try {
    const allAssignments = await dataStore.fetchAssignments();
    assignment.value = allAssignments.find(a => a.id === tareaId) || null;

    // Check if student already submitted (Mock logic)
    const submissions = await dataStore.fetchSubmissions(tareaId);
    if (submissions.find(s => s.estudianteNombre === authStore.user?.name)) {
      alreadySubmitted.value = true;
    }
  } catch (error) {
    showSnackbar('Error al cargar datos', 'error');
  } finally {
    loading.value = false;
  }
};

const submitWork = async () => {
  const { valid } = await form.value.validate();
  if (!valid) return;

  submitting.value = true;
  try {
    const studentName = authStore.user?.name || 'Estudiante Desconocido';
    await dataStore.submitAssignment(tareaId, driveLink.value, studentName);

    showSnackbar('Tarea entregada exitosamente', 'success');
    alreadySubmitted.value = true;
  } catch (error) {
    showSnackbar('Error al entregar tarea', 'error');
  } finally {
    submitting.value = false;
  }
};

const showSnackbar = (text: string, color: string) => {
  snackbar.value = { show: true, text, color };
};
</script>