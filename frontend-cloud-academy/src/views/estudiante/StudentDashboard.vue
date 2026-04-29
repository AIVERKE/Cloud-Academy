<template>
  <v-container>
    <v-row class="mb-4">
      <v-col class="d-flex justify-space-between align-center">
        <h1 class="text-h4">Mis Aulas</h1>
        <v-btn color="primary" prepend-icon="mdi-account-plus" @click="dialog = true">
          Unirse a Clase
        </v-btn>
      </v-col>
    </v-row>

    <!-- Loading State -->
    <v-row v-if="loading">
      <v-col cols="12" class="text-center">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </v-col>
    </v-row>

    <!-- Classrooms Grid -->
    <v-row v-else>
      <v-col v-for="classroom in classrooms" :key="classroom.id" cols="12" md="6" lg="4">
        <v-card class="h-100 d-flex flex-column" hover>
          <v-card-item>
            <v-card-title>{{ classroom.name }}</v-card-title>
            <v-card-subtitle>{{ classroom.description || 'Sin descripción' }}</v-card-subtitle>
          </v-card-item>

          <v-card-actions class="mt-auto">
            <v-btn color="primary" variant="text" :to="{ name: 'AssignmentList' }">
              Ver Tareas
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col v-if="classrooms.length === 0" cols="12">
        <v-alert type="info" variant="tonal">No estás inscrito en ninguna clase aún. Usa el botón "Unirse a Clase".</v-alert>
      </v-col>
    </v-row>

    <!-- Join Classroom Dialog -->
    <v-dialog v-model="dialog" max-width="400">
      <v-card>
        <v-card-title>Unirse a una Clase</v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid" @submit.prevent="joinClassroom">
            <v-text-field
              v-model="accessCode"
              label="Código de Acceso"
              :rules="[v => !!v || 'El código es requerido']"
              required
              placeholder="Ej. SOFT123"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" variant="text" @click="dialog = false">Cancelar</v-btn>
          <v-btn color="primary" :loading="joining" @click="joinClassroom">Unirse</v-btn>
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
import { useDataStore, type Classroom } from '../../store/data';

const dataStore = useDataStore();
const classrooms = ref<Classroom[]>([]);
const loading = ref(true);

const dialog = ref(false);
const valid = ref(false);
const form = ref<any>(null);
const joining = ref(false);
const accessCode = ref('');

const snackbar = ref({ show: false, text: '', color: 'success' });

onMounted(async () => {
  await loadClassrooms();
});

const loadClassrooms = async () => {
  loading.value = true;
  try {
    // In a real app, this would fetch ONLY classes the student joined
    classrooms.value = await dataStore.fetchClassrooms();
  } catch (error) {
    showSnackbar('Error al cargar aulas', 'error');
  } finally {
    loading.value = false;
  }
};

const joinClassroom = async () => {
  const { valid } = await form.value.validate();
  if (!valid) return;

  joining.value = true;
  try {
    // Simulate join logic delay
    await new Promise(r => setTimeout(r, 800));

    dialog.value = false;
    accessCode.value = '';
    showSnackbar('Te has unido a la clase exitosamente', 'success');
    await loadClassrooms();
  } catch (error) {
    showSnackbar('Error al unirse a la clase', 'error');
  } finally {
    joining.value = false;
  }
};

const showSnackbar = (text: string, color: string) => {
  snackbar.value = { show: true, text, color };
};
</script>