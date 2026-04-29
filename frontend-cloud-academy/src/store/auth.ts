import { defineStore } from 'pinia';
import { ref } from 'vue';

export type Role = 'Docente' | 'Estudiante' | 'Root';

interface UserData {
  id: string;
  name: string;
  role: Role;
  email: string;
  avatar: string;
}

export const useAuthStore = defineStore('auth', () => {
  // Load initial state from localStorage
  const savedUser = localStorage.getItem('ca_user');
  const initialUser = savedUser ? JSON.parse(savedUser) : null;
  const initialAuth = !!initialUser;

  const isAuthenticated = ref(initialAuth);
  const user = ref<UserData | null>(initialUser);

  const login = async (email: string) => {
    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (!response.ok) throw new Error('Error de autenticación');
      
      const data = await response.json();
      
      const userData: UserData = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        avatar: 'https://cdn.vuetifyjs.com/images/john.jpg'
      };

      isAuthenticated.value = true;
      user.value = userData;

      // Save to localStorage
      localStorage.setItem('ca_user', JSON.stringify(userData));
    } catch (error) {
      console.error('Login Error:', error);
      throw error;
    }
  };

  const logout = () => {
    isAuthenticated.value = false;
    user.value = null;
    localStorage.removeItem('ca_user');
  };

  const toggleRole = (newRole: Role) => {
    if (user.value) {
      user.value.role = newRole;
      localStorage.setItem('ca_user', JSON.stringify(user.value));
    }
  };

  return { isAuthenticated, user, login, logout, toggleRole };
});
