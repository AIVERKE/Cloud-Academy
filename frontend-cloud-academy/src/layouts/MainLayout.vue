<template>
  <v-app>
    <!-- Side Navigation Drawer - DARK THEME -->
    <v-navigation-drawer 
      v-model="drawer" 
      permanent
      class="sidebar-drawer-dark"
      width="280"
      elevation="10"
    >
      <!-- Brand/Logo Section -->
      <div class="brand-section pa-8 text-center bg-dark-accent">
        <div class="logo-container mb-4">
          <v-icon icon="mdi-cloud-lock" size="48" color="primary" class="entrance-pop"></v-icon>
          <div class="logo-glow-blue"></div>
        </div>
        <div class="text-h6 font-weight-black text-white tracking-tight lh-1">API BRIDGE</div>
        <div class="text-caption text-primary font-weight-bold ls-1 opacity-90">Cloud Academy Suite</div>
      </div>

      <!-- User Profile Card - Integrated Dark -->
      <div v-if="authStore.user" class="px-6 mb-6 mt-4">
        <div class="profile-card-dark pa-4 rounded-xl d-flex align-center">
          <v-avatar size="44" class="mr-3 profile-avatar-dark">
            <v-img :src="authStore.user.avatar"></v-img>
          </v-avatar>
          <div class="overflow-hidden">
            <div class="text-caption text-uppercase font-weight-black text-primary ls-1 mb-n1">
              {{ authStore.user.role }}
            </div>
            <div class="text-body-2 font-weight-bold text-white text-truncate">
              {{ authStore.user.name }}
            </div>
          </div>
          <v-spacer></v-spacer>
          <v-icon icon="mdi-dots-vertical" size="18" color="white" class="opacity-30"></v-icon>
        </div>
      </div>

      <!-- Navigation Menu -->
      <v-list nav class="px-4 nav-list-dark">
        <template v-for="item in menuItems" :key="item.title">
          <v-list-item
            :to="item.to"
            :prepend-icon="item.icon"
            :title="item.title"
            exact
            rounded="lg"
            class="mb-2 nav-item-dark py-3"
            active-class="nav-item-active-dark"
          >
            <template v-slot:append v-if="$route.path === item.to">
              <v-icon icon="mdi-chevron-right" size="16" class="active-arrow"></v-icon>
            </template>
          </v-list-item>
        </template>
      </v-list>

      <v-spacer></v-spacer>

      <!-- Bottom Actions -->
      <template v-slot:append>
        <div class="pa-6 bottom-actions-dark">
          <!-- Logout Button -->
          <v-btn
            block
            color="primary"
            variant="elevated"
            rounded="lg"
            size="large"
            prepend-icon="mdi-logout-variant"
            @click="handleLogout"
            class="text-none font-weight-bold logout-btn-dark"
          >
            Cerrar Sesión
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main class="bg-main-light">
      <div class="content-wrapper">
        <router-view v-slot="{ Component }">
          <transition name="page-fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '../store/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const drawer = ref(true);

const menuItems = computed(() => {
  const role = authStore.user?.role;
  const items = [
    { title: 'Dashboard', icon: 'mdi-view-dashboard-outline', to: '/dashboard' },
    { title: 'Recursos', icon: 'mdi-folder-open-outline', to: '/dashboard/recursos' }
  ];

  if (role === 'Docente') {
    items.splice(1, 0, { title: 'Mis Aulas', icon: 'mdi-google-classroom', to: '/dashboard/docente/aulas' });
  } else if (role === 'Estudiante') {
    items.splice(1, 0, { title: 'Mis Aulas', icon: 'mdi-school-outline', to: '/dashboard/estudiante/aulas' });
    items.splice(2, 0, { title: 'Mis Tareas', icon: 'mdi-format-list-checks', to: '/dashboard/estudiante/pendientes' });
  } else if (role === 'Root') {
    items.push({ title: 'Gestión Usuarios', icon: 'mdi-account-group-outline', to: '/dashboard/admin/usuarios' });
    items.push({ title: 'Infraestructura', icon: 'mdi-server-network', to: '/dashboard/admin/infraestructura' });
    items.push({ title: 'Auditoría', icon: 'mdi-shield-search', to: '/dashboard/admin/auditoria' });
  }
  
  return items;
});

const handleLogout = () => {
  authStore.logout();
  router.push('/');
};
</script>

<style scoped>
/* Sidebar Dark Theme */
.sidebar-drawer-dark {
  background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%) !important;
  color: white !important;
  border-right: none !important;
}

.bg-dark-accent {
  background: rgba(255, 255, 255, 0.02);
}

/* Logo Section */
.logo-glow-blue {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50px;
  height: 50px;
  background: #3b82f6;
  filter: blur(30px);
  opacity: 0.2;
  z-index: -1;
}

/* Profile Card Dark */
.profile-card-dark {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}
.profile-avatar-dark {
  border: 2px solid rgba(59, 130, 246, 0.5);
  box-shadow: 0 0 15px rgba(59, 130, 246, 0.2);
}

/* Nav List Dark */
.nav-item-dark {
  color: #94a3b8 !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-item-dark:hover {
  background: rgba(255, 255, 255, 0.05) !important;
  color: white !important;
  transform: translateX(4px);
}

:deep(.nav-item-active-dark) {
  background: linear-gradient(90deg, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0) 100%) !important;
  color: #60a5fa !important;
  border-left: 4px solid #3b82f6 !important;
  border-radius: 0 8px 8px 0 !important;
  font-weight: 700 !important;
}

:deep(.nav-item-active-dark .v-icon) {
  color: #60a5fa !important;
}

.active-arrow {
  opacity: 0.5;
}

/* Bottom Actions Dark */
.bottom-actions-dark {
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}
.logout-btn-dark {
  box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3) !important;
}

/* Main Layout Styles */
.bg-main-light {
  background-color: #f1f5f9 !important;
}
.content-wrapper {
  padding: 24px;
}

/* Transitions */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: all 0.3s ease;
}
.page-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Global Utility Classes */
.lh-1 { line-height: 1; }
.ls-1 { letter-spacing: 1px; }
.bg-slate-900 { background-color: #0f172a !important; }
.border-slate-700 { border: 1px solid #334155 !important; }
</style>
