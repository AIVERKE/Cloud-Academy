import { defineStore } from 'pinia';
import { ref } from 'vue';

export type Role = 'Docente' | 'Estudiante' | 'Root';

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false);
  const user = ref<{ id: string; name: string; role: Role; email: string; avatar: string } | null>(null);

  const login = async (email: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    // Assign role based on email or default to Estudiante
    let role: Role = 'Estudiante';
    let id = 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380101'; // Real Student ID
    
    if (email.includes('docente')) {
      role = 'Docente';
      id = 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380002'; // Real Teacher ID
    }
    if (email.includes('admin') || email.includes('root')) {
      role = 'Root';
      id = 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380001'; // Real Root ID
    }

    isAuthenticated.value = true;
    user.value = {
      id,
      name: email.split('@')[0],
      email,
      role,
      avatar: 'https://cdn.vuetifyjs.com/images/john.jpg'
    };
  };

  const logout = () => {
    isAuthenticated.value = false;
    user.value = null;
  };

  const toggleRole = (newRole: Role) => {
    if (user.value) {
      user.value.role = newRole;
    }
  };

  return { isAuthenticated, user, login, logout, toggleRole };
});
