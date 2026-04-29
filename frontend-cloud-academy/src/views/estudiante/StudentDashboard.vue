<template>
  <v-container fluid class="pa-8 bg-slate-50 min-vh-100">
    <!-- Header Section -->
    <v-row class="mb-8" align="center">
      <v-col cols="12" md="8">
        <div class="d-flex align-center mb-1">
          <v-icon icon="mdi-account-school" color="primary" size="32" class="mr-3"></v-icon>
          <h1 class="text-h3 font-weight-black text-slate-900">Panel del Estudiante</h1>
        </div>
        <p class="text-subtitle-1 text-slate-500 ml-11">
          Gestioná tus clases, entregá tareas y explorá nuevas aulas institucionales.
        </p>
      </v-col>
      <v-col cols="12" md="4" class="text-md-right">
        <v-btn 
          color="primary" 
          size="large" 
          rounded="xl" 
          elevation="4" 
          prepend-icon="mdi-magnify"
          class="px-6 font-weight-bold"
          @click="showExplore = true"
        >
          Explorar Aulas
        </v-btn>
      </v-col>
    </v-row>

    <!-- Tabs for Organization -->
    <v-tabs v-model="activeTab" color="primary" class="mb-8 border-b" align-tabs="start">
      <v-tab value="mis-aulas" class="text-none font-weight-bold">
        <v-icon start icon="mdi-bookshelf"></v-icon>
        Mis Aulas
      </v-tab>
      <v-tab value="tareas-pendientes" class="text-none font-weight-bold">
        <v-icon start icon="mdi-clipboard-text-clock-outline"></v-icon>
        Pendientes
      </v-tab>
    </v-tabs>

    <v-window v-model="activeTab">
      <!-- Mis Aulas Window -->
      <v-window-item value="mis-aulas">
        <v-row v-if="loading">
          <v-col v-for="i in 3" :key="i" cols="12" md="4">
            <v-skeleton-loader type="card" class="rounded-xl"></v-skeleton-loader>
          </v-col>
        </v-row>

        <v-row v-else-if="classrooms.length > 0">
          <v-col v-for="classroom in classrooms" :key="classroom.id" cols="12" md="4">
            <v-card border flat rounded="xl" class="classroom-card h-100 d-flex flex-column overflow-hidden">
              <div class="card-gradient pa-6 bg-slate-900 d-flex align-center">
                <v-avatar color="white" variant="tonal" size="48" class="mr-4">
                  <v-icon icon="mdi-school" color="white"></v-icon>
                </v-avatar>
                <div>
                  <div class="text-h6 font-weight-black text-white line-clamp-1">{{ classroom.name }}</div>
                  <div class="text-caption text-blue-lighten-3 font-weight-bold uppercase tracking-widest">Inscrito</div>
                </div>
              </div>
              
              <v-card-text class="pa-6 flex-grow-1">
                <p class="text-body-2 text-slate-500 mb-6 line-clamp-3">
                  {{ classroom.description || 'Sin descripción detallada para esta aula virtual.' }}
                </p>
                <div class="d-flex align-center text-caption text-slate-400">
                  <v-icon icon="mdi-account-tie-outline" size="16" class="mr-2"></v-icon>
                  Docente: {{ classroom.docente?.name || 'Asignado' }}
                </div>
              </v-card-text>

              <v-divider></v-divider>
              
              <v-card-actions class="pa-4 bg-slate-50">
                <v-btn 
                  block 
                  color="primary" 
                  variant="flat" 
                  rounded="lg"
                  class="font-weight-bold text-none py-6"
                  :to="{ name: 'AssignmentList' }"
                >
                  Entrar al Aula
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <v-row v-else class="py-16">
          <v-col cols="12" class="text-center">
            <v-avatar size="160" color="slate-100" class="mb-6">
              <v-icon icon="mdi-school-outline" size="80" color="slate-300"></v-icon>
            </v-avatar>
            <h3 class="text-h5 font-weight-black text-slate-700">Aún no estás inscrito</h3>
            <p class="text-body-1 text-slate-400 mb-6">Explorá las aulas disponibles para empezar a cursar.</p>
            <v-btn color="primary" variant="tonal" rounded="xl" class="px-8" @click="showExplore = true">
              Ver Aulas Disponibles
            </v-btn>
          </v-col>
        </v-row>
      </v-window-item>

      <!-- Pendientes Window -->
      <v-window-item value="tareas-pendientes">
        <v-row v-if="loadingAssignments">
          <v-col v-for="i in 2" :key="i" cols="12">
            <v-skeleton-loader type="list-item-three-line" class="rounded-xl"></v-skeleton-loader>
          </v-col>
        </v-row>
        <v-row v-else-if="upcomingAssignments.length > 0">
          <v-col v-for="assignment in upcomingAssignments" :key="assignment.id" cols="12">
            <v-card border flat rounded="xl" class="pa-6 bg-white d-flex align-center">
              <v-avatar color="primary-lighten-5" class="mr-4">
                <v-icon icon="mdi-clock-outline" color="primary"></v-icon>
              </v-avatar>
              <div class="flex-grow-1">
                <div class="text-subtitle-1 font-weight-black text-slate-900">{{ assignment.titulo }}</div>
                <div class="text-caption text-slate-400">
                  {{ getClassroomName(assignment.aulaId) }} • Vence: {{ new Date(assignment.fecha_limite).toLocaleDateString() }}
                </div>
              </div>
              <v-btn 
                color="primary" 
                variant="tonal" 
                rounded="pill"
                class="text-none font-weight-bold"
                :to="{ name: 'SubmissionForm', params: { aulaId: assignment.aulaId, tareaId: assignment.id } }"
              >
                Entregar
              </v-btn>
            </v-card>
          </v-col>
        </v-row>
        <v-card v-else border flat rounded="xl" class="pa-12 text-center bg-slate-50">
          <v-icon icon="mdi-calendar-check" size="64" color="success" class="mb-4" opacity="0.5"></v-icon>
          <div class="text-h6 font-weight-bold text-slate-400">¡Todo listo! No tenés tareas pendientes.</div>
        </v-card>
      </v-window-item>
    </v-window>

    <!-- Explore Classrooms Bottom Sheet / Dialog -->
    <v-dialog v-model="showExplore" max-width="900" scrollable>
      <v-card rounded="xl" elevation="24">
        <v-card-title class="pa-8 bg-slate-900 text-white d-flex align-center">
          <v-icon icon="mdi-compass-outline" class="mr-4" size="32"></v-icon>
          <div>
            <div class="text-h5 font-weight-black">Explorar Aulas Disponibles</div>
            <div class="text-caption text-blue-lighten-3 opacity-70">Inscribite directamente en las clases de tu interés</div>
          </div>
          <v-spacer></v-spacer>
          <v-btn icon="mdi-close" variant="text" @click="showExplore = false"></v-btn>
        </v-card-title>

        <v-card-text class="pa-8 bg-slate-50">
          <v-row v-if="loadingExplore">
            <v-col v-for="i in 3" :key="i" cols="12" md="4">
              <v-skeleton-loader type="list-item-three-line" class="rounded-xl"></v-skeleton-loader>
            </v-col>
          </v-row>

          <v-row v-else-if="availableClassrooms.length > 0">
            <v-col v-for="aula in availableClassrooms" :key="aula.id" cols="12" md="6">
              <v-card border flat rounded="xl" class="pa-6 hover-card">
                <div class="d-flex align-center mb-4">
                  <v-avatar color="primary-lighten-5" size="48" class="mr-4">
                    <v-icon icon="mdi-bookmark-plus" color="primary"></v-icon>
                  </v-avatar>
                  <div>
                    <div class="text-subtitle-1 font-weight-black text-slate-900">{{ aula.name }}</div>
                    <div class="text-caption text-slate-400">Código: {{ aula.codigo_acceso }}</div>
                  </div>
                </div>
                <p class="text-body-2 text-slate-500 mb-6 line-clamp-2">{{ aula.description || 'Sin descripción disponible.' }}</p>
                <v-btn 
                  block 
                  color="primary" 
                  variant="elevated" 
                  rounded="lg" 
                  class="font-weight-bold"
                  :loading="enrollingId === aula.id"
                  @click="enroll(aula)"
                >
                  Inscribirse Ahora
                </v-btn>
              </v-card>
            </v-col>
          </v-row>

          <div v-else class="text-center py-12">
            <v-icon icon="mdi-check-all" size="48" color="success" class="mb-4"></v-icon>
            <div class="text-h6 font-weight-black text-slate-700">¡Estás al día!</div>
            <div class="text-body-2 text-slate-400">Ya estás inscrito en todas las aulas disponibles en este momento.</div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Notifications -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" rounded="pill" elevation="12">
      <div class="d-flex align-center font-weight-bold">
        <v-icon :icon="snackbar.color === 'success' ? 'mdi-check-circle' : 'mdi-alert'" class="mr-2"></v-icon>
        {{ snackbar.text }}
      </div>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { useDataStore, type Classroom } from '../../store/data';
import { useAuthStore } from '../../store/auth';

const dataStore = useDataStore();
const authStore = useAuthStore();
const classrooms = ref<Classroom[]>([]);
const availableClassrooms = ref<Classroom[]>([]);
const assignments = ref<any[]>([]);
const loading = ref(true);
const loadingExplore = ref(false);
const loadingAssignments = ref(false);
const showExplore = ref(false);
const activeTab = ref('mis-aulas');
const enrollingId = ref<string | null>(null);

const snackbar = ref({ show: false, text: '', color: 'success' });

onMounted(async () => {
  await Promise.all([
    loadClassrooms(),
    loadAssignments()
  ]);
});

const upcomingAssignments = computed(() => {
  return assignments.value.slice(0, 5); // Show top 5 soonest
});

const loadAssignments = async () => {
  if (!authStore.user) return;
  loadingAssignments.value = true;
  try {
    assignments.value = await dataStore.fetchAssignments();
  } catch (error) {
    console.error('Error loading assignments', error);
  } finally {
    loadingAssignments.value = false;
  }
};

const getClassroomName = (aulaId: string) => {
  const cls = classrooms.value.find(c => c.id === aulaId);
  return cls ? cls.name : 'Aula Desconocida';
};

watch(showExplore, async (val) => {
  if (val) {
    await loadAvailableClassrooms();
  }
});

const loadClassrooms = async () => {
  if (!authStore.user) return;
  loading.value = true;
  try {
    classrooms.value = await dataStore.fetchClassrooms(authStore.user.id);
  } catch (error) {
    showSnackbar('Error al cargar aulas', 'error');
  } finally {
    loading.value = false;
  }
};

const loadAvailableClassrooms = async () => {
  if (!authStore.user) return;
  loadingExplore.value = true;
  try {
    availableClassrooms.value = await dataStore.fetchAvailableClassrooms(authStore.user.id);
  } catch (error) {
    console.error('Error fetching available classrooms', error);
  } finally {
    loadingExplore.value = false;
  }
};

const enroll = async (aula: Classroom) => {
  if (!authStore.user) return;
  enrollingId.value = aula.id;
  try {
    await dataStore.enrollInClassroom(aula.id, authStore.user.id);
    showSnackbar(`¡Te inscribiste con éxito en ${aula.name}!`, 'success');
    await loadClassrooms();
    await loadAvailableClassrooms();
  } catch (error: any) {
    showSnackbar(error.message || 'Error al inscribirse', 'error');
  } finally {
    enrollingId.value = null;
  }
};

const showSnackbar = (text: string, color: string) => {
  snackbar.value = { show: true, text, color };
};
</script>

<style scoped>
.bg-slate-50 { background-color: #f8fafc; }
.bg-slate-900 { background-color: #0f172a !important; }
.text-slate-900 { color: #0f172a; }
.text-slate-800 { color: #1e293b; }
.text-slate-500 { color: #64748b; }
.text-slate-400 { color: #94a3b8; }
.text-slate-300 { color: #cbd5e1; }

.min-vh-100 { min-height: 100vh; }

.classroom-card {
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0 !important;
}

.classroom-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1) !important;
}

.hover-card {
  transition: all 0.2s ease;
}

.hover-card:hover {
  border-color: rgba(var(--v-theme-primary), 0.5) !important;
  background-color: white !important;
}

.line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }

.tracking-widest {
  letter-spacing: 1.5px !important;
}

.card-gradient {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%) !important;
}
</style>
