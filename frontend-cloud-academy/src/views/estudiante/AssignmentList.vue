<template>
  <v-container>
    <v-row class="mb-4">
      <v-col>
        <h1 class="text-h4">Tareas Pendientes (Global)</h1>
      </v-col>
    </v-row>

    <!-- Loading State -->
    <v-row v-if="loading">
      <v-col cols="12" class="text-center">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </v-col>
    </v-row>

    <!-- Assignments List -->
    <v-row v-else>
      <v-col v-for="assignment in sortedAssignments" :key="assignment.id" cols="12">
        <v-card
          variant="elevated"
          :class="{ 'border-left-red': assignment.estado === 'Atrasado' }"
          hover
          @click="goToSubmission(assignment.aulaId, assignment.id)"
        >
          <v-card-item>
            <div class="d-flex justify-space-between align-start">
              <div>
                <v-chip size="x-small" color="secondary" class="mb-2">
                  {{ getClassroomName(assignment.aulaId) }}
                </v-chip>
                <v-card-title class="pa-0">{{ assignment.titulo }}</v-card-title>
              </div>
              <v-chip :color="getEstadoEntregaColor(assignment.estado || '')" size="small">
                {{ assignment.estado }}
              </v-chip>
            </div>
          </v-card-item>

          <v-card-text>
            <div class="text-truncate">{{ assignment.descripcion }}</div>
            <div class="mt-3 text-caption text-medium-emphasis d-flex align-center">
              <v-icon icon="mdi-calendar-clock" size="small" class="mr-1" :color="assignment.estado === 'Atrasado' ? 'error' : ''"></v-icon>
              <span :class="{ 'text-error font-weight-bold': assignment.estado === 'Atrasado' }">
                Vence: {{ new Date(assignment.fecha_limite).toLocaleString() }}
              </span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col v-if="sortedAssignments.length === 0" cols="12">
        <v-alert type="success" variant="tonal" icon="mdi-party-popper">
          ¡Genial! No tienes tareas pendientes.
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useDataStore, type Assignment, type Classroom } from '../../store/data';
import { getEstadoEntregaColor } from '../../types/enums';

const router = useRouter();
const dataStore = useDataStore();

const assignments = ref<Assignment[]>([]);
const classrooms = ref<Classroom[]>([]);
const loading = ref(true);

onMounted(async () => {
  await loadData();
});

const loadData = async () => {
  loading.value = true;
  try {
    // Fetch all classes to get names
    classrooms.value = await dataStore.fetchClassrooms();
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

const goToSubmission = (aulaId: string, tareaId: string) => {
  router.push({
    name: 'SubmissionForm',
    params: { aulaId, tareaId }
  });
};
</script>

<style scoped>
.border-left-red {
  border-left: 4px solid #FF5252 !important;
}
</style>