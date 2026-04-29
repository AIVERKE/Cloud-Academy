<template>
  <v-container fluid class="pa-8">
    <!-- Header -->
    <v-row class="mb-8" align="center">
      <v-col cols="12" md="8">
        <h1 class="text-h3 font-weight-black mb-2 gradient-text">Gestión de Usuarios</h1>
        <p class="text-subtitle-1 text-on-surface-variant opacity-70">
          Control total sobre el acceso institucional y la asignación de roles.
        </p>
      </v-col>
      <v-col cols="12" md="4" class="text-md-right">
        <v-btn 
          color="primary" 
          prepend-icon="mdi-account-plus" 
          @click="openDialog()" 
          size="large" 
          rounded="xl"
          elevation="4"
          class="px-6 py-3"
        >
          Nuevo Usuario
        </v-btn>
      </v-col>
    </v-row>

    <!-- Stats Summary -->
    <v-row class="mb-8">
      <v-col cols="12" sm="4" v-for="stat in stats" :key="stat.label">
        <v-card class="stat-card border-0 overflow-hidden" rounded="xl" elevation="0">
          <div class="stat-gradient" :style="{ background: `linear-gradient(135deg, ${stat.bgStart}, ${stat.bgEnd})` }"></div>
          <v-card-text class="d-flex align-center pa-6 relative-content">
            <v-avatar color="white" size="56" elevation="2" class="mr-6">
              <v-icon :color="stat.color" :icon="stat.icon" size="28"></v-icon>
            </v-avatar>
            <div class="text-white">
              <div class="text-caption text-uppercase font-weight-bold opacity-80 mb-1 tracking-widest">{{ stat.label }}</div>
              <div class="text-h4 font-weight-black">{{ stat.value }}</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Main Table Card -->
    <v-card class="main-table-card border-0" rounded="xl" elevation="1">
      <v-toolbar flat color="transparent" class="px-4 py-4">
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Buscar por nombre o correo..."
          variant="solo-filled"
          flat
          hide-details
          rounded="xl"
          class="max-width-400"
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-btn icon="mdi-filter-variant" variant="text" class="mr-2"></v-btn>
        <v-btn icon="mdi-export-variant" variant="text"></v-btn>
      </v-toolbar>

      <v-data-table
        :headers="headers"
        :items="users"
        :search="search"
        :loading="loading"
        hover
        class="user-table-custom"
      >
        <template v-slot:item.name="{ item }">
          <div class="d-flex align-center py-4">
            <v-avatar size="42" class="mr-4 elevation-1">
              <v-img v-if="item.avatar" :src="item.avatar"></v-img>
              <v-icon v-else icon="mdi-account" color="primary"></v-icon>
            </v-avatar>
            <div>
              <div class="font-weight-bold text-body-1">{{ item.name }}</div>
              <div class="text-caption opacity-60">ID: {{ item.id.substring(0, 8) }}</div>
            </div>
          </div>
        </template>

        <template v-slot:item.email="{ item }">
          <span class="text-body-2 font-weight-medium text-primary">{{ item.email }}</span>
        </template>

        <template v-slot:item.role="{ item }">
          <v-chip
            :color="getRoleColor(item.role)"
            size="small"
            variant="tonal"
            class="font-weight-black px-4 py-3"
            rounded="lg"
          >
            <v-icon start :icon="getRoleIcon(item.role)" size="16" class="mr-1"></v-icon>
            {{ item.role }}
          </v-chip>
        </template>

        <template v-slot:item.actions="{ item }">
          <div class="d-flex justify-end gap-2">
            <v-btn 
              icon="mdi-pencil-outline" 
              variant="text" 
              color="indigo" 
              size="small" 
              @click="openDialog(item)"
              class="action-btn"
            ></v-btn>
            <v-btn 
              icon="mdi-delete-outline" 
              variant="text" 
              color="error" 
              size="small" 
              @click="confirmDelete(item)"
              class="action-btn"
            ></v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- User Dialog -->
    <v-dialog v-model="dialog" max-width="550" persistent transition="dialog-bottom-transition">
      <v-card rounded="xl" class="pa-4">
        <v-card-title class="pa-6 text-h5 font-weight-black d-flex align-center">
          <v-icon :icon="editedIndex === -1 ? 'mdi-account-plus' : 'mdi-account-edit'" class="mr-4" color="primary"></v-icon>
          {{ editedIndex === -1 ? 'Registrar Nuevo Usuario' : 'Actualizar Información' }}
        </v-card-title>
        
        <v-card-text class="pa-6 pt-0">
          <v-form ref="form" v-model="formValid">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="editedItem.name"
                  label="Nombre Completo"
                  variant="outlined"
                  density="comfortable"
                  prepend-inner-icon="mdi-account"
                  rounded="lg"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="editedItem.email"
                  label="Correo Institucional"
                  variant="outlined"
                  density="comfortable"
                  prepend-inner-icon="mdi-email"
                  placeholder="usuario@umsa.bo"
                  rounded="lg"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-select
                  v-model="editedItem.role"
                  :items="['Root', 'Docente', 'Estudiante']"
                  label="Rol Asignado"
                  variant="outlined"
                  density="comfortable"
                  prepend-inner-icon="mdi-shield-account"
                  rounded="lg"
                  required
                ></v-select>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-6">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="dialog = false" rounded="xl" class="px-6">Cancelar</v-btn>
          <v-btn 
            color="primary" 
            variant="elevated" 
            @click="save" 
            class="px-8 font-weight-bold" 
            rounded="xl"
            elevation="4"
          >
            Confirmar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation -->
    <v-dialog v-model="dialogDelete" max-width="450" persistent>
      <v-card rounded="xl" class="pa-4 text-center">
        <v-card-text class="pa-8">
          <v-icon icon="mdi-alert-circle-outline" color="error" size="80" class="mb-6"></v-icon>
          <h3 class="text-h5 font-weight-black mb-4">¿Confirmar eliminación?</h3>
          <p class="text-body-1 opacity-70 mb-0">
            Esta acción revocará todos los accesos de <strong>{{ editedItem.name }}</strong>. No se puede deshacer.
          </p>
        </v-card-text>
        <v-card-actions class="pa-6 pt-0 d-flex justify-center">
          <v-btn variant="text" @click="dialogDelete = false" rounded="xl" class="px-8">Atrás</v-btn>
          <v-btn 
            color="error" 
            variant="elevated" 
            @click="deleteItemConfirm" 
            class="px-8 font-weight-bold" 
            rounded="xl"
            elevation="4"
          >
            Sí, eliminar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

const loading = ref(true);
const dialog = ref(false);
const dialogDelete = ref(false);
const users = ref<User[]>([]);
const editedIndex = ref(-1);

const editedItem = ref<User>({
  id: '',
  name: '',
  email: '',
  role: 'Estudiante'
});

const defaultItem: User = {
  id: '',
  name: '',
  email: '',
  role: 'Estudiante'
};

const headers: any = [
  { title: 'Usuario', key: 'name' },
  { title: 'Email', key: 'email' },
  { title: 'Rol', key: 'role' },
  { title: 'Acciones', key: 'actions', sortable: false, align: 'end' },
];

const search = ref('');
const formValid = ref(false);

const stats = computed(() => [
  { 
    label: 'Total Usuarios', 
    value: users.value.length, 
    icon: 'mdi-account-group', 
    color: 'primary',
    bgStart: '#1e293b', // Slate 800
    bgEnd: '#334155'    // Slate 700
  },
  { 
    label: 'Docentes', 
    value: users.value.filter(u => u.role === 'Docente').length, 
    icon: 'mdi-school', 
    color: 'info',
    bgStart: '#1976D2', // Primary Blue
    bgEnd: '#2196F3'    // Info Blue
  },
  { 
    label: 'Estudiantes', 
    value: users.value.filter(u => u.role === 'Estudiante').length, 
    icon: 'mdi-account-school', 
    color: 'success',
    bgStart: '#3b82f6', // Bright Blue
    bgEnd: '#60a5fa'    // Lighter Blue
  },
]);

onMounted(async () => {
  // Simulate API fetch
  setTimeout(() => {
    users.value = [
      { id: '1', name: 'Diego (Admin)', email: 'diego@umsa.bo', role: 'Root', avatar: 'https://i.pravatar.cc/150?u=1' },
      { id: '2', name: 'Alejandro (Admin)', email: 'alejandro@umsa.bo', role: 'Root', avatar: 'https://i.pravatar.cc/150?u=2' },
      { id: '3', name: 'Jules (Estudiante)', email: 'jules@umsa.bo', role: 'Estudiante', avatar: 'https://i.pravatar.cc/150?u=3' },
      { id: '4', name: 'Prof. Garcia', email: 'garcia@umsa.bo', role: 'Docente', avatar: 'https://i.pravatar.cc/150?u=4' },
    ];
    loading.value = false;
  }, 800);
});

const getRoleColor = (role: string) => {
  switch (role) {
    case 'Root': return 'slate-900';
    case 'Docente': return 'primary';
    case 'Estudiante': return 'info';
    default: return 'grey';
  }
};

const getRoleIcon = (role: string) => {
  switch (role) {
    case 'Root': return 'mdi-shield-crown';
    case 'Docente': return 'mdi-school';
    case 'Estudiante': return 'mdi-account-school';
    default: return 'mdi-account';
  }
};

const openDialog = (item?: User) => {
  if (item) {
    editedIndex.value = users.value.indexOf(item);
    editedItem.value = Object.assign({}, item);
  } else {
    editedIndex.value = -1;
    editedItem.value = Object.assign({}, defaultItem);
  }
  dialog.value = true;
};

const confirmDelete = (item: User) => {
  editedIndex.value = users.value.indexOf(item);
  editedItem.value = Object.assign({}, item);
  dialogDelete.value = true;
};

const deleteItemConfirm = () => {
  users.value.splice(editedIndex.value, 1);
  dialogDelete.value = false;
};

const save = () => {
  if (editedIndex.value > -1) {
    Object.assign(users.value[editedIndex.value], editedItem.value);
  } else {
    users.value.push({ ...editedItem.value, id: Math.random().toString(36).substring(2, 11) });
  }
  dialog.value = false;
};
</script>

<style scoped>
.gradient-text {
  background: linear-gradient(135deg, #1e293b 0%, #1976d2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.stat-card {
  position: relative;
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-gradient {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.9;
  z-index: 0;
}

.relative-content {
  position: relative;
  z-index: 1;
}

.main-table-card {
  background: rgba(255, 255, 255, 0.8) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
}

.max-width-400 {
  max-width: 400px;
}

.user-table-custom :deep(thead) {
  background: rgba(var(--v-theme-primary), 0.05);
}

.user-table-custom :deep(th) {
  font-weight: 800 !important;
  text-transform: uppercase;
  font-size: 0.75rem !important;
  letter-spacing: 1px !important;
  color: rgba(var(--v-theme-on-surface), 0.6) !important;
  height: 60px !important;
}

.action-btn {
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: rgba(var(--v-theme-primary), 0.1);
  transform: scale(1.1);
}

.tracking-widest {
  letter-spacing: 2px !important;
}

.gap-2 {
  gap: 8px;
}
</style>
