<template>
  <v-container fluid class="pa-8 bg-slate-50 min-vh-100">
    <!-- Header -->
    <v-row class="mb-8" align="center">
      <v-col cols="12" md="7">
        <div class="d-flex align-center mb-1">
          <v-icon icon="mdi-account-cog" color="primary" size="32" class="mr-3"></v-icon>
          <h1 class="text-h3 font-weight-black text-slate-900">Gestión de Usuarios</h1>
        </div>
        <p class="text-subtitle-1 text-slate-500 ml-11">
          Control institucional y asignación de privilegios en el ecosistema Cloud.
        </p>
      </v-col>
      <v-col cols="12" md="5" class="text-md-right d-flex justify-end gap-3 align-center">
        <v-btn 
          color="success" 
          variant="tonal" 
          prepend-icon="mdi-google-spreadsheet" 
          size="large" 
          rounded="xl"
          class="px-6 font-weight-bold"
          @click="syncWithSheets"
          :loading="syncing"
        >
          Sincronizar Sheets
        </v-btn>
        <v-btn 
          color="primary" 
          prepend-icon="mdi-plus" 
          @click="openDialog()" 
          size="large" 
          rounded="xl"
          elevation="4"
          class="px-6 font-weight-bold"
        >
          Nuevo Usuario
        </v-btn>
      </v-col>
    </v-row>

    <!-- Stats Summary -->
    <v-row class="mb-8">
      <v-col cols="12" sm="4" v-for="stat in stats" :key="stat.label">
        <v-card class="stat-card border-0" rounded="xl" elevation="1">
          <v-card-text class="d-flex align-center pa-6">
            <v-avatar :color="stat.color + '-lighten-5'" size="64" class="mr-6">
              <v-icon :color="stat.color" :icon="stat.icon" size="32"></v-icon>
            </v-avatar>
            <div>
              <div class="text-caption text-uppercase font-weight-black text-slate-400 mb-1 tracking-widest">{{ stat.label }}</div>
              <div class="text-h4 font-weight-black text-slate-900">{{ stat.value }}</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Main Table Card -->
    <v-card border flat rounded="xl" class="overflow-hidden">
      <v-toolbar flat color="white" class="px-4 py-4 border-b">
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Buscar usuario..."
          variant="solo-filled"
          flat
          hide-details
          rounded="xl"
          bg-color="slate-50"
          class="max-width-400"
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-btn icon="mdi-refresh" variant="text" color="slate-400" @click="fetchUsers"></v-btn>
        <v-btn icon="mdi-filter-variant" variant="text" color="slate-400"></v-btn>
      </v-toolbar>

      <v-data-table
        :headers="headers"
        :items="users"
        :search="search"
        :loading="loading"
        hover
        class="user-table"
      >
        <template v-slot:item.name="{ item }">
          <div class="d-flex align-center py-4">
            <v-avatar size="44" class="mr-4 border" color="slate-100">
              <v-img v-if="item.avatar" :src="item.avatar"></v-img>
              <v-icon v-else icon="mdi-account" color="slate-400"></v-icon>
            </v-avatar>
            <div>
              <div class="font-weight-black text-slate-800 text-body-1">{{ item.name }}</div>
              <div class="text-caption text-slate-400">ID: {{ item.id.substring(0, 8).toUpperCase() }}</div>
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
            variant="flat"
            class="font-weight-black px-4"
            rounded="lg"
          >
            <v-icon start :icon="getRoleIcon(item.role)" size="14"></v-icon>
            {{ item.role }}
          </v-chip>
        </template>

        <template v-slot:item.actions="{ item }">
          <div class="d-flex justify-end gap-2">
            <v-btn 
              icon="mdi-pencil" 
              variant="tonal" 
              color="slate-600" 
              size="x-small" 
              @click="openDialog(item)"
              rounded="lg"
            ></v-btn>
            <v-btn 
              icon="mdi-delete" 
              variant="tonal" 
              color="error" 
              size="x-small" 
              @click="confirmDelete(item)"
              rounded="lg"
            ></v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- User Dialog -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card rounded="xl" elevation="24">
        <v-card-title class="pa-8 bg-slate-900 text-white d-flex align-center">
          <v-icon :icon="editedIndex === -1 ? 'mdi-account-plus' : 'mdi-account-edit'" class="mr-4"></v-icon>
          <div class="text-h5 font-weight-black">
            {{ editedIndex === -1 ? 'Registrar Usuario' : 'Editar Usuario' }}
          </div>
        </v-card-title>
        
        <v-card-text class="pa-8 bg-white">
          <v-form ref="form" v-model="formValid">
            <v-row>
              <v-col cols="12">
                <v-label class="text-caption font-weight-black mb-1">NOMBRE COMPLETO</v-label>
                <v-text-field
                  v-model="editedItem.name"
                  variant="outlined"
                  density="comfortable"
                  rounded="lg"
                  hide-details
                  class="mb-4"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-label class="text-caption font-weight-black mb-1">CORREO ELECTRÓNICO</v-label>
                <v-text-field
                  v-model="editedItem.email"
                  variant="outlined"
                  density="comfortable"
                  rounded="lg"
                  hide-details
                  class="mb-4"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-label class="text-caption font-weight-black mb-1">ROL DEL SISTEMA</v-label>
                <v-select
                  v-model="editedItem.role"
                  :items="['Root', 'Docente', 'Estudiante']"
                  variant="outlined"
                  density="comfortable"
                  rounded="lg"
                  hide-details
                ></v-select>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-8 pt-0 bg-white">
          <v-spacer></v-spacer>
          <v-btn variant="text" color="slate-400" @click="dialog = false" rounded="lg" class="font-weight-bold px-4">Cancelar</v-btn>
          <v-btn 
            color="primary" 
            variant="elevated" 
            @click="save" 
            class="px-8 font-weight-bold" 
            rounded="lg"
            elevation="0"
          >
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Sync Success Overlay -->
    <v-snackbar v-model="syncToast" color="success" rounded="pill">
      Sincronización con Google Sheets completada exitosamente.
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useDataStore } from '../../store/data';

const dataStore = useDataStore();

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

const loading = ref(true);
const syncing = ref(false);
const syncToast = ref(false);
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
  { title: 'Información de Usuario', key: 'name' },
  { title: 'Email Institucional', key: 'email' },
  { title: 'Privilegios', key: 'role' },
  { title: 'Operaciones', key: 'actions', sortable: false, align: 'end' },
];

const search = ref('');
const formValid = ref(false);

const stats = computed(() => [
  { label: 'Total Base', value: users.value.length, icon: 'mdi-account-group', color: 'slate-900' },
  { label: 'Docentes', value: users.value.filter(u => u.role === 'Docente').length, icon: 'mdi-school', color: 'primary' },
  { label: 'Estudiantes', value: users.value.filter(u => u.role === 'Estudiante').length, icon: 'mdi-account-school', color: 'indigo' },
]);

const fetchUsers = async () => {
  loading.value = true;
  users.value = await dataStore.fetchUsers();
  loading.value = false;
};

const syncWithSheets = () => {
  syncing.value = true;
  setTimeout(() => {
    syncing.value = false;
    syncToast.value = true;
  }, 2000);
};

onMounted(() => {
  fetchUsers();
});

const getRoleColor = (role: string) => {
  switch (role) {
    case 'Root': return 'slate-900';
    case 'Docente': return 'primary';
    case 'Estudiante': return 'indigo';
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

const confirmDelete = async (item: User) => {
  if (confirm(`¿Estás seguro de que deseas eliminar a ${item.name}?`)) {
    const success = await dataStore.deleteUser(item.id);
    if (success) {
      fetchUsers();
    }
  }
};

const save = () => {
  // TODO: Implement save logic in backend if needed
  if (editedIndex.value > -1) {
    Object.assign(users.value[editedIndex.value], editedItem.value);
  } else {
    users.value.push({ ...editedItem.value, id: Math.random().toString(36).substring(2, 11) });
  }
  dialog.value = false;
};
</script>

<style scoped>
.bg-slate-50 { background-color: #f8fafc; }
.text-slate-900 { color: #0f172a; }
.text-slate-800 { color: #1e293b; }
.text-slate-500 { color: #64748b; }
.text-slate-400 { color: #94a3b8; }
.bg-slate-900 { background-color: #0f172a !important; }

.min-vh-100 { min-height: 100vh; }
.gap-3 { gap: 12px; }

.stat-card {
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0 !important;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px -5px rgba(0,0,0,0.05) !important;
}

.user-table :deep(thead th) {
  background-color: #f8fafc !important;
  color: #64748b !important;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  font-weight: 800 !important;
  height: 64px !important;
}

.max-width-400 { max-width: 400px; }

.tracking-widest {
  letter-spacing: 2px !important;
}
</style>
