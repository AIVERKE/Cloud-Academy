<template>
  <v-app>
    <!-- Top Navigation Bar -->
    <v-app-bar color="primary" dark>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-app-bar-title>
        Cloud Academy
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <!-- Dev Hack: Role Toggle -->
      <v-menu v-if="authStore.user">
        <template v-slot:activator="{ props }">
          <v-btn color="white" v-bind="props" variant="outlined" class="mr-4">
            Ver como: {{ authStore.user.role }}
          </v-btn>
        </template>
        <v-list>
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
          <v-btn icon v-bind="props">
            <v-avatar>
              <v-img :src="authStore.user.avatar" alt="User"></v-img>
            </v-avatar>
          </v-btn>
        </template>

        <v-card min-width="200">
          <v-list>
            <v-list-item
              :prepend-avatar="authStore.user.avatar"
              :title="authStore.user.name"
              :subtitle="authStore.user.email"
            ></v-list-item>
          </v-list>
          <v-divider></v-divider>
          <v-list>
            <v-list-item @click="handleLogout" prepend-icon="mdi-logout" title="Cerrar Sesión"></v-list-item>
          </v-list>
        </v-card>
      </v-menu>
    </v-app-bar>

    <!-- Side Navigation Drawer -->
    <v-navigation-drawer v-model="drawer" :permanent="$vuetify.display.mdAndUp">
      <v-list nav>
        <template v-for="item in menuItems" :key="item.title">
          <v-list-item
            :to="item.to"
            :prepend-icon="item.icon"
            :title="item.title"
            exact
          ></v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main class="bg-background">
      <v-container fluid>
        <router-view></router-view>
      </v-container>
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
  if (role === 'Docente') {
    return [
      { title: 'Mis Aulas', icon: 'mdi-google-classroom', to: { name: 'TeacherDashboard' } }
    ];
  } else if (role === 'Estudiante') {
    return [
      { title: 'Mis Aulas', icon: 'mdi-google-classroom', to: { name: 'StudentDashboard' } },
      { title: 'Pendientes', icon: 'mdi-format-list-checks', to: { name: 'AssignmentList' } }
    ];
  } else if (role === 'Root') {
    return [
      { title: 'Auditoría', icon: 'mdi-shield-check', to: { name: 'AuditLogs' } }
    ];
  }
  return [];
});

const handleToggleRole = (role: Role) => {
  authStore.toggleRole(role);
  // Force re-evaluation of home route redirect
  router.push('/');
};

const handleLogout = () => {
  authStore.logout();
  router.push({ name: 'Login' });
};
</script>
