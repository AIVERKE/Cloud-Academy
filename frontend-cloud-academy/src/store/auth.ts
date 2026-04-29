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
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    // Assign role based on email or default to Estudiante
    let role: Role = 'Estudiante';
    let id = 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380101'; // Default Student ID
    
    if (email.includes('docente')) {
      role = 'Docente';
      id = 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380002'; // Teacher ID used in seeds
    } else if (email.includes('admin') || email.includes('root')) {
      role = 'Root';
      id = 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380001'; // Root ID used in seeds
    }

    const userData: UserData = {
      id,
      name: email.split('@')[0],
      email,
      role,
      avatar: 'https://cdn.vuetifyjs.com/images/john.jpg'
    };

    isAuthenticated.value = true;
    user.value = userData;

    // Save to localStorage
    localStorage.setItem('ca_user', JSON.stringify(userData));
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
