<template>
  <v-container>
    <v-row class="mb-4">
      <v-col>
        <h1 class="text-h4">Mis Aulas</h1>
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
        <v-card class="h-100 d-flex flex-column" hover :to="{ name: 'ClassroomDetail', params: { id: classroom.id } }">
          <v-card-item>
            <v-card-title>{{ classroom.name }}</v-card-title>
            <v-card-subtitle>{{ classroom.description || 'Sin descripción' }}</v-card-subtitle>
          </v-card-item>

          <v-card-text>
            <div class="d-flex align-center mt-2">
              <span class="text-caption mr-2">Código de acceso:</span>
              <v-chip size="small" color="primary" variant="tonal">
                {{ classroom.codigo_acceso }}
              </v-chip>
              <v-btn icon="mdi-content-copy" size="x-small" variant="text" class="ml-1" @click.prevent="copyCode(classroom.codigo_acceso)"></v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Create Classroom FAB -->
    <v-btn
      color="primary"
      icon="mdi-plus"
      size="x-large"
      class="position-fixed"
      style="bottom: 24px; right: 24px;"
      @click="dialog = true"
    ></v-btn>

    <!-- Create Classroom Dialog -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title>Crear Nueva Aula</v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-text-field
              v-model="newClassroom.name"
              label="Nombre del Aula"
              :rules="[v => !!v || 'El nombre es requerido']"
              required
            ></v-text-field>
            <v-text-field
              v-model="newClassroom.codigo_acceso"
              label="Código de Acceso"
              :rules="[v => !!v || 'El código es requerido']"
              required
            ></v-text-field>
            <v-textarea
              v-model="newClassroom.description"
              label="Descripción (Opcional)"
              rows="3"
            ></v-textarea>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" variant="text" @click="dialog = false">Cancelar</v-btn>
          <v-btn color="primary" :loading="creating" @click="createClassroom">Crear</v-btn>
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
const creating = ref(false);
const newClassroom = ref({ name: '', codigo_acceso: '', description: '' });

const snackbar = ref({ show: false, text: '', color: 'success' });

onMounted(async () => {
  await loadClassrooms();
});

const loadClassrooms = async () => {
  loading.value = true;
  try {
    classrooms.value = await dataStore.fetchClassrooms();
  } catch (error) {
    showSnackbar('Error al cargar aulas', 'error');
  } finally {
    loading.value = false;
  }
};

const copyCode = (code: string) => {
  navigator.clipboard.writeText(code);
  showSnackbar('Código copiado al portapapeles', 'success');
};

const createClassroom = async () => {
  const { valid } = await form.value.validate();
  if (!valid) return;

  creating.value = true;
  try {
    await dataStore.createClassroom(newClassroom.value);
    dialog.value = false;
    newClassroom.value = { name: '', codigo_acceso: '', description: '' };
    showSnackbar('Aula creada exitosamente', 'success');
    await loadClassrooms();
  } catch (error) {
    showSnackbar('Error al crear aula', 'error');
  } finally {
    creating.value = false;
  }
};

const showSnackbar = (text: string, color: string) => {
  snackbar.value = { show: true, text, color };
};
</script>