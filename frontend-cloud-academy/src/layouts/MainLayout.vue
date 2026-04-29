<template>
  <v-app>
    <!-- Top Navigation Bar -->
    <v-app-bar class="main-app-bar" elevation="0">
      <v-app-bar-nav-icon @click="drawer = !drawer" color="white"></v-app-bar-nav-icon>

      <v-app-bar-title class="text-white font-weight-black">
        CLOUD ACADEMY
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <!-- Dev Hack: Role Toggle -->
      <v-menu v-if="authStore.user">
        <template v-slot:activator="{ props }">
          <v-btn color="white" v-bind="props" variant="tonal" class="mr-4 glass-btn">
            {{ authStore.user.role }}
          </v-btn>
        </template>
        <v-list class="rounded-lg mt-2">
          <v-list-item @click="handleToggleRole('Docente')">
            <v-list-item-title>Docente</v-list-item-title>
          </v-list-item>
          <v-list-item @click="handleToggleRole('Estudiante')">
            <v-list-item-title>Estudiante</v-list-item-title>
          </v-list-item>
          <v-list-item @click="handleToggleRole('Root')">
            <v-list-item-title>Root (Admin)</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <!-- User Avatar & Menu -->
      <v-menu v-if="authStore.user">
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props" class="mr-2">
            <v-avatar size="40" class="elevation-4">
              <v-img :src="authStore.user.avatar" alt="User"></v-img>
            </v-avatar>
          </v-btn>
        </template>

        <v-card min-width="250" rounded="xl" class="mt-2 elevation-12">
          <v-list>
            <v-list-item
              :prepend-avatar="authStore.user.avatar"
              :title="authStore.user.name"
              :subtitle="authStore.user.email"
              class="pa-4"
            ></v-list-item>
          </v-list>
          <v-divider></v-divider>
          <v-list nav>
            <v-list-item @click="handleLogout" color="error" prepend-icon="mdi-logout" title="Cerrar Sesión"></v-list-item>
          </v-list>
        </v-card>
      </v-menu>

      <v-btn v-else to="/login" variant="elevated" color="white" class="mr-4 text-primary font-weight-bold">
        Ingresar
      </v-btn>
    </v-app-bar>

    <!-- Side Navigation Drawer -->
    <v-navigation-drawer 
      v-model="drawer" 
      :permanent="$vuetify.display.mdAndUp"
      class="sidebar-drawer"
      width="280"
    >
      <div class="pa-6 text-center">
        <v-icon icon="mdi-cloud-lock" size="48" color="primary" class="mb-2"></v-icon>
        <div class="text-h6 font-weight-black">API BRIDGE</div>
      </div>

      <v-list nav class="px-4">
        <template v-for="item in menuItems" :key="item.title">
          <v-list-item
            :to="item.to"
            :prepend-icon="item.icon"
            :title="item.title"
            exact
            rounded="xl"
            class="mb-1 nav-item"
            active-color="primary"
          ></v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main class="bg-slate-50">
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore, type Role } from '../store/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const drawer = ref(true);

const menuItems = computed(() => {
  const role = authStore.user?.role;
  const items = [
    { title: 'Dashboard', icon: 'mdi-view-dashboard', to: '/dashboard' },
    { title: 'Recursos', icon: 'mdi-folder-google', to: '/dashboard/recursos' }
  ];

  if (role === 'Docente') {
    items.splice(1, 0, { title: 'Mis Aulas', icon: 'mdi-google-classroom', to: '/dashboard/docente/aulas' });
  } else if (role === 'Estudiante') {
    items.splice(1, 0, { title: 'Mis Aulas', icon: 'mdi-google-classroom', to: '/dashboard/estudiante/aulas' });
    items.splice(2, 0, { title: 'Mis Tareas', icon: 'mdi-format-list-checks', to: '/dashboard/estudiante/pendientes' });
  } else if (role === 'Root') {
    items.push({ title: 'Auditoría', icon: 'mdi-shield-check', to: '/dashboard/admin/auditoria' });
  }
  
  return items;
});

const handleToggleRole = (role: Role) => {
  authStore.toggleRole(role);
  // Force re-evaluation of home route redirect
  router.push('/dashboard');
};

const handleLogout = () => {
  authStore.logout();
  router.push('/');
};
</script>

<style scoped>
.main-app-bar {
  background: linear-gradient(90deg, #1e293b 0%, #334155 100%) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
}

.glass-btn {
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.sidebar-drawer {
  border-right: 1px solid rgba(0, 0, 0, 0.05) !important;
}

.nav-item {
  transition: all 0.2s ease;
}

.nav-item:hover {
  background: rgba(var(--v-theme-primary), 0.05);
  transform: translateX(5px);
}

.bg-slate-50 {
  background-color: #f8fafc;
}
</style>
