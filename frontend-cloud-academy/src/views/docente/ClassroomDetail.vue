<template>
  <v-container class="py-8">
    <!-- Header Premium -->
    <v-row class="mb-6 animate__animated animate__fadeIn">
      <v-col cols="12">
        <div class="d-flex align-center mb-2">
          <v-btn 
            icon="mdi-arrow-left" 
            variant="tonal" 
            color="slate-700" 
            class="mr-4"
            @click="$router.push({ name: 'TeacherDashboard' })"
          ></v-btn>
          <div class="text-overline text-primary font-weight-bold">DETALLE DEL AULA</div>
        </div>
        
        <div class="d-flex justify-space-between align-end flex-wrap">
          <div>
            <h1 class="text-h3 font-weight-bold slate-900 mb-1">
              {{ classroom?.name || 'Cargando...' }}
            </h1>
            <p class="text-subtitle-1 text-medium-emphasis">
              {{ classroom?.description || 'Sin descripción disponible' }}
            </p>
          </div>
          <div class="mt-4 mt-sm-0">
            <v-chip
              color="primary"
              variant="flat"
              rounded="lg"
              class="px-4 py-6"
              elevation="2"
            >
              <v-icon start icon="mdi-key-variant"></v-icon>
              <span class="text-h6 font-weight-bold">{{ classroom?.codigo_acceso }}</span>
              <v-btn 
                icon="mdi-content-copy" 
                variant="text" 
                size="small" 
                class="ml-2"
                @click="copyCode(classroom?.codigo_acceso || '')"
              ></v-btn>
            </v-chip>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- Navigation Tabs Premium -->
    <v-card class="rounded-xl elevation-2 overflow-hidden border-light mb-8">
      <v-tabs v-model="tab" color="primary" align-tabs="start" class="px-4 pt-2">
        <v-tab value="tareas" class="text-none font-weight-medium">
          <v-icon start icon="mdi-file-document-outline"></v-icon>
          Tareas y Actividades
        </v-tab>
        <v-tab value="estudiantes" class="text-none font-weight-medium">
          <v-icon start icon="mdi-account-group-outline"></v-icon>
          Estudiantes ({{ students.length }})
        </v-tab>
        <v-tab value="ajustes" class="text-none font-weight-medium">
          <v-icon start icon="mdi-cog-outline"></v-icon>
          Configuración
        </v-tab>
      </v-tabs>

      <v-divider></v-divider>

      <v-window v-model="tab" class="pa-6 bg-slate-50">
        <!-- Tareas Tab -->
        <v-window-item value="tareas">
          <div class="d-flex justify-space-between align-center mb-6">
            <h3 class="text-h5 font-weight-bold slate-800">Gestionar Tareas</h3>
            <v-btn 
              color="primary" 
              prepend-icon="mdi-plus" 
              rounded="lg"
              elevation="2"
              class="px-6"
              @click="dialog = true"
            >
              Nueva Tarea
            </v-btn>
          </div>

          <v-row v-if="loadingAssignments">
            <v-col v-for="i in 3" :key="i" cols="12">
              <v-skeleton-loader type="article" class="rounded-xl border-light"></v-skeleton-loader>
            </v-col>
          </v-row>

          <v-row v-else>
            <v-col v-for="assignment in assignments" :key="assignment.id" cols="12">
              <v-card 
                variant="flat" 
                class="rounded-xl border-light hover-card transition-swing"
              >
                <v-card-text class="pa-5">
                  <v-row align="center">
                    <v-col cols="12" md="8">
                      <div class="d-flex align-center mb-2">
                        <v-avatar color="primary-lighten-5" size="40" class="mr-3">
                          <v-icon color="primary" icon="mdi-notebook-edit-outline"></v-icon>
                        </v-avatar>
                        <h4 class="text-h6 font-weight-bold slate-800">{{ assignment.titulo }}</h4>
                      </div>
                      <p class="text-body-1 text-medium-emphasis mb-4 ml-13">
                        {{ assignment.descripcion || 'Sin descripción' }}
                      </p>
                      <div class="d-flex align-center ml-13">
                        <v-chip size="small" variant="tonal" color="info" class="mr-3">
                          <v-icon start icon="mdi-calendar-clock" size="14"></v-icon>
                          Límite: {{ formatDate(assignment.fecha_limite) }}
                        </v-chip>
                        <v-chip size="small" variant="tonal" color="slate-600">
                          <v-icon start icon="mdi-clock-outline" size="14"></v-icon>
                          Creada: {{ formatDate(assignment.fecha_creacion) }}
                        </v-chip>
                      </div>
                    </v-col>
                    <v-col cols="12" md="4" class="text-md-right mt-4 mt-md-0">
                      <v-btn
                        color="primary"
                        variant="elevated"
                        rounded="lg"
                        block
                        prepend-icon="mdi-eye-check-outline"
                        class="mb-2"
                        @click="goToSubmissions(assignment.id)"
                      >
                        Ver Entregas
                      </v-btn>
                      <v-btn
                        variant="text"
                        color="slate-500"
                        rounded="lg"
                        prepend-icon="mdi-pencil-outline"
                        class="text-none"
                      >
                        Editar
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col v-if="assignments.length === 0" cols="12" class="text-center py-12">
              <v-icon icon="mdi-folder-open-outline" size="64" color="slate-300" class="mb-4"></v-icon>
              <h3 class="text-h6 slate-400">No hay tareas publicadas aún</h3>
              <v-btn 
                variant="text" 
                color="primary" 
                class="mt-2"
                @click="dialog = true"
              >Crear la primera tarea</v-btn>
            </v-col>
          </v-row>
        </v-window-item>

        <!-- Estudiantes Tab -->
        <v-window-item value="estudiantes">
          <div class="d-flex justify-space-between align-center mb-6">
            <h3 class="text-h5 font-weight-bold slate-800">Estudiantes Inscritos</h3>
            <v-btn 
              variant="tonal" 
              prepend-icon="mdi-email-outline" 
              rounded="lg"
              class="text-none"
            >
              Enviar correo masivo
            </v-btn>
          </div>

          <v-card variant="flat" class="rounded-xl border-light overflow-hidden">
            <v-table hover>
              <thead class="bg-slate-100">
                <tr>
                  <th class="text-left font-weight-bold slate-700">Estudiante</th>
                  <th class="text-left font-weight-bold slate-700">Email</th>
                  <th class="text-center font-weight-bold slate-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="student in students" :key="student.id">
                  <td>
                    <div class="d-flex align-center py-2">
                      <v-avatar size="32" color="primary-lighten-4" class="mr-3">
                        <span class="text-caption font-weight-bold primary-darken-2">
                          {{ student.nombre_completo.charAt(0) }}
                        </span>
                      </v-avatar>
                      <span class="font-weight-medium">{{ student.nombre_completo }}</span>
                    </div>
                  </td>
                  <td>{{ student.email }}</td>
                  <td class="text-center">
                    <v-btn icon="mdi-message-outline" variant="text" size="small" color="primary"></v-btn>
                    <v-btn icon="mdi-dots-vertical" variant="text" size="small" color="slate-400"></v-btn>
                  </td>
                </tr>
                <tr v-if="students.length === 0">
                  <td colspan="3" class="text-center py-8 text-medium-emphasis">
                    No hay estudiantes inscritos en este momento.
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card>
        </v-window-item>

        <!-- Ajustes Tab -->
        <v-window-item value="ajustes">
           <v-row>
             <v-col cols="12" md="6">
               <v-card variant="outlined" class="rounded-xl pa-4 mb-4">
                 <v-card-title class="px-0">Ajustes Generales</v-card-title>
                 <v-text-field label="Nombre del Aula" v-model="classroom!.name" variant="outlined" rounded="lg" class="mt-4"></v-text-field>
                 <v-textarea label="Descripción" v-model="classroom!.description" variant="outlined" rounded="lg"></v-textarea>
                 <v-btn color="primary" rounded="lg">Guardar Cambios</v-btn>
               </v-card>
             </v-col>
             <v-col cols="12" md="6">
                <v-card variant="outlined" border="error" class="rounded-xl pa-4">
                 <v-card-title class="px-0 text-error">Zona de Peligro</v-card-title>
                 <p class="text-body-2 mb-4">Una vez que elimines el aula, no habrá vuelta atrás. Por favor, asegúrate.</p>
                 <v-btn color="error" variant="flat" rounded="lg">Eliminar Aula</v-btn>
               </v-card>
             </v-col>
           </v-row>
        </v-window-item>
      </v-window>
    </v-card>

    <!-- Dialogo Nueva Tarea Premium -->
    <v-dialog v-model="dialog" max-width="600" persistent>
      <v-card class="rounded-xl pa-2">
        <v-card-title class="d-flex justify-space-between align-center px-4 pt-4 pb-0">
          <span class="text-h5 font-weight-bold">Publicar Nueva Tarea</span>
          <v-btn icon="mdi-close" variant="text" @click="dialog = false"></v-btn>
        </v-card-title>
        
        <v-card-text class="pa-4">
          <v-form ref="form" v-model="valid">
            <v-text-field
              v-model="newAssignment.titulo"
              label="Título de la Actividad"
              placeholder="Ej: Informe de Arquitectura Cloud"
              variant="outlined"
              rounded="lg"
              class="mb-4"
              :rules="[v => !!v || 'El título es requerido']"
              required
            ></v-text-field>

            <v-textarea
              v-model="newAssignment.descripcion"
              label="Instrucciones y Descripción"
              placeholder="Detalla qué deben entregar los estudiantes..."
              variant="outlined"
              rounded="lg"
              rows="4"
              class="mb-4"
            ></v-textarea>

            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newAssignment.fecha_limite"
                  label="Fecha de Cierre"
                  type="date"
                  variant="outlined"
                  rounded="lg"
                  prepend-inner-icon="mdi-calendar"
                  :rules="dateRules"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Hora de Cierre"
                  type="time"
                  variant="outlined"
                  rounded="lg"
                  prepend-inner-icon="mdi-clock-outline"
                  defaultValue="23:59"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-4 pt-0">
          <v-spacer></v-spacer>
          <v-btn 
            variant="text" 
            color="slate-500" 
            rounded="lg" 
            class="px-6"
            @click="dialog = false"
          >
            Cancelar
          </v-btn>
          <v-btn 
            color="primary" 
            variant="elevated" 
            rounded="lg" 
            class="px-8"
            :loading="creating"
            @click="createAssignment"
          >
            Publicar Tarea
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" rounded="lg" elevation="24">
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
import { useDataStore } from '../../store/data';
import { useAuthStore } from '../../store/auth';

const route = useRoute();
const router = useRouter();
const dataStore = useDataStore();
const authStore = useAuthStore();

const classroomId = route.params.id as string;
const classroom = ref<any>(null);
const assignments = ref<any[]>([]);
const students = ref<any[]>([]);
const tab = ref('tareas');

const loadingAssignments = ref(true);
const dialog = ref(false);
const valid = ref(false);
const form = ref<any>(null);
const creating = ref(false);

// Default date set to 7 days from now
const defaultDate = new Date();
defaultDate.setDate(defaultDate.getDate() + 7);

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
  await loadClassroomDetails();
  await loadAssignments();
  await loadStudents();
});

const loadClassroomDetails = async () => {
  if (!authStore.user?.id) return;
  const classes = await dataStore.fetchClassrooms(authStore.user.id);
  classroom.value = classes.find((c: any) => c.id === classroomId) || null;
};

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

const loadStudents = async () => {
  try {
    students.value = await dataStore.fetchStudents(classroomId);
  } catch (error) {
    console.error('Error loading students:', error);
  }
};

const createAssignment = async () => {
  const { valid: isFormValid } = await form.value.validate();
  if (!isFormValid) return;

  creating.value = true;
  try {
    // Append end of day time
    const isoDate = new Date(newAssignment.value.fecha_limite + 'T23:59:59').toISOString();

    await dataStore.createAssignment({
      aulaId: classroomId,
      titulo: newAssignment.value.titulo,
      descripcion: newAssignment.value.descripcion,
      fecha_limite: isoDate
    });

    dialog.value = false;
    newAssignment.value = {
      titulo: '',
      descripcion: '',
      fecha_limite: defaultDate.toISOString().split('T')[0]
    };

    showSnackbar('¡Tarea publicada exitosamente! 🚀', 'success');
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

const copyCode = (code: string) => {
  navigator.clipboard.writeText(code);
  showSnackbar('Código de acceso copiado', 'success');
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const showSnackbar = (text: string, color: string) => {
  snackbar.value = { show: true, text, color };
};
</script>

<style scoped>
.slate-900 { color: #0f172a; }
.slate-800 { color: #1e293b; }
.slate-700 { color: #334155; }
.slate-400 { color: #94a3b8; }
.slate-300 { color: #cbd5e1; }
.bg-slate-50 { background-color: #f8fafc; }
.bg-slate-100 { background-color: #f1f5f9; }

.border-light {
  border: 1px solid rgba(0, 0, 0, 0.05) !important;
}

.hover-card {
  transition: all 0.3s ease;
}

.hover-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05) !important;
  border-color: var(--v-primary-base) !important;
}

.primary-lighten-5 { background-color: #e0f2fe; }
.primary-lighten-4 { background-color: #bae6fd; }
.primary-darken-2 { color: #075985; }
</style>
