<template>
  <v-container fluid class="pa-8 bg-slate-50 min-h-screen">
    <!-- Header -->
    <v-row class="mb-8" align="center">
      <v-col cols="12" md="8">
        <h1 class="text-h3 font-weight-black mb-2 gradient-text">Mis Aulas</h1>
        <p class="text-subtitle-1 text-on-surface-variant opacity-70">
          Gestioná tus espacios de aprendizaje y conectá con tus estudiantes.
        </p>
      </v-col>
      <v-col cols="12" md="4" class="text-md-right">
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          size="large"
          rounded="xl"
          elevation="4"
          class="text-none font-weight-bold px-8"
          @click="dialog = true"
        >
          Nueva Aula
        </v-btn>
      </v-col>
    </v-row>

    <!-- Loading State -->
    <v-row v-if="loading" class="fill-height align-center justify-center py-16">
      <v-col cols="12" class="text-center">
        <v-progress-circular indeterminate color="primary" size="64" width="6"></v-progress-circular>
        <div class="mt-4 text-h6 font-weight-bold opacity-60 text-slate-900">Abriendo las aulas...</div>
      </v-col>
    </v-row>

    <!-- Empty State -->
    <v-row v-else-if="classrooms.length === 0" class="py-16">
      <v-col cols="12" class="text-center">
        <v-avatar color="primary-lighten-5" size="120" class="mb-6">
          <v-icon icon="mdi-google-classroom" size="64" color="primary"></v-icon>
        </v-avatar>
        <h3 class="text-h4 font-weight-black text-slate-900 mb-2">Aún no tenés aulas</h3>
        <p class="text-h6 text-slate-600 mb-8 mx-auto" style="max-width: 500px;">
          Empezá creando tu primer aula virtual para compartir recursos y tareas con tus alumnos.
        </p>
        <v-btn
          color="primary"
          size="x-large"
          rounded="xl"
          variant="flat"
          @click="dialog = true"
        >
          Crear mi primera aula
        </v-btn>
      </v-col>
    </v-row>

    <!-- Classrooms Grid -->
    <v-row v-else>
      <v-col v-for="classroom in classrooms" :key="classroom.id" cols="12" sm="6" lg="4">
        <v-card 
          class="classroom-card h-100 d-flex flex-column border" 
          rounded="xl" 
          elevation="0"
          :to="{ name: 'ClassroomDetail', params: { id: classroom.id } }"
        >
          <div class="card-accent-bar bg-primary"></div>
          
          <v-card-item class="pa-6">
            <template v-slot:prepend>
              <v-avatar color="primary-lighten-5" rounded="lg" size="48" class="mr-4">
                <v-icon icon="mdi-school-outline" color="primary" size="28"></v-icon>
              </v-avatar>
            </template>
            <v-card-title class="text-h5 font-weight-black text-slate-900 mb-1">
              {{ classroom.name }}
            </v-card-title>
            <v-card-subtitle class="text-slate-600">
              {{ classroom.description || 'Aula virtual de aprendizaje' }}
            </v-card-subtitle>
          </v-card-item>

          <v-spacer></v-spacer>

          <v-card-text class="px-6 py-4 bg-slate-50/50 d-flex align-center justify-space-between">
            <div class="d-flex align-center">
              <span class="text-overline font-weight-bold text-grey-darken-1 mr-2">CÓDIGO:</span>
              <v-chip size="small" color="primary" variant="flat" class="font-weight-black px-4">
                {{ classroom.codigo_acceso }}
              </v-chip>
            </div>
            <v-tooltip text="Copiar código" location="top">
              <template v-slot:activator="{ props }">
                <v-btn 
                  v-bind="props"
                  icon="mdi-content-copy" 
                  size="small" 
                  variant="tonal" 
                  color="slate-600"
                  class="ml-2"
                  @click.prevent="copyCode(classroom.codigo_acceso)"
                ></v-btn>
              </template>
            </v-tooltip>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Create Classroom Dialog -->
    <v-dialog v-model="dialog" max-width="600" persistent transition="dialog-bottom-transition">
      <v-card rounded="xl" class="pa-4">
        <v-card-title class="d-flex align-center pa-4">
          <v-avatar color="primary" class="mr-4" size="40">
            <v-icon icon="mdi-plus" color="white"></v-icon>
          </v-avatar>
          <span class="text-h5 font-weight-black">Crear Nueva Aula</span>
          <v-spacer></v-spacer>
          <v-btn icon="mdi-close" variant="text" @click="dialog = false"></v-btn>
        </v-card-title>
        
        <v-divider></v-divider>

        <v-card-text class="pa-4">
          <v-form ref="form" v-model="valid">
            <v-text-field
              v-model="newClassroom.name"
              label="Nombre del Aula"
              placeholder="Ej: Programación III - Paralelo A"
              variant="outlined"
              rounded="lg"
              class="mb-4"
              :rules="[v => !!v || 'El nombre es requerido']"
              required
            ></v-text-field>
            
            <v-text-field
              v-model="newClassroom.codigo_acceso"
              label="Código de Acceso"
              placeholder="Ej: PROG3-2026"
              variant="outlined"
              rounded="lg"
              class="mb-4"
              :rules="[v => !!v || 'El código es requerido']"
              required
            >
              <template v-slot:append-inner>
                <v-btn icon="mdi-refresh" variant="text" size="small" @click="generateCode"></v-btn>
              </template>
            </v-text-field>

            <v-textarea
              v-model="newClassroom.description"
              label="Descripción"
              placeholder="Breve descripción del curso..."
              variant="outlined"
              rounded="lg"
              rows="3"
            ></v-textarea>
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-4 pt-0">
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" rounded="lg" class="px-6 text-none" @click="dialog = false">Cancelar</v-btn>
          <v-btn 
            color="primary" 
            variant="flat" 
            rounded="lg" 
            class="px-8 text-none font-weight-bold"
            elevation="2"
            :loading="creating" 
            @click="handleCreateClassroom"
          >
            Crear Aula
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" rounded="lg">
      {{ snackbar.text }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useDataStore, type Classroom } from '../../store/data';
import { useAuthStore } from '../../store/auth';

const dataStore = useDataStore();
const authStore = useAuthStore();

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
  if (!authStore.user?.id) return;
  loading.value = true;
  try {
    classrooms.value = await dataStore.fetchClassrooms(authStore.user.id);
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

const generateCode = () => {
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  newClassroom.value.codigo_acceso = random;
};

const handleCreateClassroom = async () => {
  if (!authStore.user?.id) return;
  const { valid: isFormValid } = await form.value.validate();
  if (!isFormValid) return;

  creating.value = true;
  try {
    await dataStore.createClassroom(newClassroom.value, authStore.user.id);
    dialog.value = false;
    newClassroom.value = { name: '', codigo_acceso: '', description: '' };
    showSnackbar('¡Aula creada exitosamente! 🎉', 'success');
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
