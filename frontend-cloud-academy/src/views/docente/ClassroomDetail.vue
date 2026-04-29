<template>
  <v-container>
    <!-- Header -->
    <v-row class="mb-4 align-center">
      <v-col>
        <v-btn icon="mdi-arrow-left" variant="text" class="mr-2" @click="$router.push({ name: 'TeacherDashboard' })"></v-btn>
        <h1 class="text-h4 d-inline-block">{{ classroom?.name || 'Cargando...' }}</h1>
      </v-col>
    </v-row>

    <!-- Tabs -->
    <v-tabs v-model="tab" color="primary" class="mb-4">
      <v-tab value="tareas">Tareas</v-tab>
      <v-tab value="estudiantes">Estudiantes Inscritos</v-tab>
    </v-tabs>

    <v-window v-model="tab">
      <!-- Tareas Tab -->
      <v-window-item value="tareas">
        <v-row>
          <v-col>
            <v-btn color="primary" prepend-icon="mdi-plus" @click="dialog = true">
              Nueva Tarea
            </v-btn>
          </v-col>
        </v-row>

        <v-row v-if="loadingAssignments" class="mt-4">
          <v-col cols="12" class="text-center">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </v-col>
        </v-row>

        <v-row v-else class="mt-4">
          <v-col v-for="assignment in assignments" :key="assignment.id" cols="12">
            <v-card variant="outlined">
              <v-card-title class="d-flex justify-space-between align-center">
                {{ assignment.titulo }}
                <v-btn
                  color="info"
                  variant="tonal"
                  prepend-icon="mdi-eye"
                  @click="goToSubmissions(assignment.id)"
                >
                  Ver Entregas
                </v-btn>
              </v-card-title>
              <v-card-text>
                <p>{{ assignment.descripcion }}</p>
                <div class="mt-2 text-caption text-medium-emphasis">
                  <v-icon icon="mdi-calendar-clock" size="small" class="mr-1"></v-icon>
                  Fecha límite: {{ new Date(assignment.fecha_limite).toLocaleString() }}
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col v-if="assignments.length === 0" cols="12">
             <v-alert type="info" variant="tonal">No hay tareas creadas en esta aula.</v-alert>
          </v-col>
        </v-row>
      </v-window-item>

      <!-- Estudiantes Tab -->
      <v-window-item value="estudiantes">
        <v-alert type="info" variant="tonal" class="mt-4">
          Lista de estudiantes (Mock - Próximamente)
        </v-alert>
      </v-window-item>
    </v-window>

    <!-- Create Assignment Dialog -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title>Crear Nueva Tarea</v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-text-field
              v-model="newAssignment.titulo"
              label="Título"
              :rules="[v => !!v || 'El título es requerido']"
              required
            ></v-text-field>
            <v-textarea
              v-model="newAssignment.descripcion"
              label="Descripción"
              rows="3"
            ></v-textarea>

            <!-- Date input fallback if v-date-picker isn't easily embeddable -->
            <v-text-field
              v-model="newAssignment.fecha_limite"
              label="Fecha Límite (YYYY-MM-DD)"
              type="date"
              :rules="dateRules"
              required
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" variant="text" @click="dialog = false">Cancelar</v-btn>
          <v-btn color="primary" :loading="creating" @click="createAssignment">Crear</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color">
      {{ snackbar.text }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useDataStore, type Classroom, type Assignment } from '../../store/data';

const route = useRoute();
const router = useRouter();
const dataStore = useDataStore();

const classroomId = route.params.id as string;
const classroom = ref<Classroom | null>(null);
const assignments = ref<Assignment[]>([]);
const tab = ref('tareas');

const loadingAssignments = ref(true);

const dialog = ref(false);
const valid = ref(false);
const form = ref<any>(null);
const creating = ref(false);
// Default to tomorrow
const defaultDate = new Date();
defaultDate.setDate(defaultDate.getDate() + 1);
const newAssignment = ref({
  titulo: '',
  descripcion: '',
  fecha_limite: defaultDate.toISOString().split('T')[0]
});

const snackbar = ref({ show: false, text: '', color: 'success' });

const dateRules = [
  (v: string) => !!v || 'La fecha es requerida',
  (v: string) => {
    const selectedDate = new Date(v);
    const today = new Date();
    today.setHours(0,0,0,0);
    return selectedDate >= today || 'La fecha límite no puede ser en el pasado';
  }
];

onMounted(async () => {
  // Load classroom details
  const classes = await dataStore.fetchClassrooms();
  classroom.value = classes.find(c => c.id === classroomId) || null;

  await loadAssignments();
});

const loadAssignments = async () => {
  loadingAssignments.value = true;
  try {
    assignments.value = await dataStore.fetchAssignments(classroomId);
  } catch (error) {
    showSnackbar('Error al cargar tareas', 'error');
  } finally {
    loadingAssignments.value = false;
  }
};

const createAssignment = async () => {
  const { valid } = await form.value.validate();
  if (!valid) return;

  creating.value = true;
  try {
    // Append time to date string for ISO format
    const isoDate = new Date(newAssignment.value.fecha_limite + 'T23:59:59').toISOString();

    await dataStore.createAssignment({
      aulaId: classroomId,
      titulo: newAssignment.value.titulo,
      descripcion: newAssignment.value.descripcion,
      fecha_limite: isoDate
    });

    dialog.value = false;
    newAssignment.value.titulo = '';
    newAssignment.value.descripcion = '';

    showSnackbar('Tarea creada exitosamente', 'success');
    await loadAssignments();
  } catch (error) {
    showSnackbar('Error al crear tarea', 'error');
  } finally {
    creating.value = false;
  }
};

const goToSubmissions = (tareaId: string) => {
  router.push({
    name: 'SubmissionsTable',
    params: { aulaId: classroomId, tareaId }
  });
};

const showSnackbar = (text: string, color: string) => {
  snackbar.value = { show: true, text, color };
};
</script>