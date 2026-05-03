<template>
  <div class="min-h-screen flex bg-surface-container-lowest font-body-md text-on-surface antialiased overflow-hidden">
    <!-- Left Side: Visual / Brand (Hidden on mobile) -->
    <div class="hidden lg:flex lg:w-1/2 bg-primary-container relative flex-col justify-between p-xl overflow-hidden">
      <!-- Decorative patterns -->
      <div class="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div class="absolute -top-24 -left-24 w-96 h-96 bg-secondary rounded-full blur-[120px]"></div>
        <div class="absolute bottom-48 right-0 w-64 h-64 bg-tertiary-fixed-dim rounded-full blur-[100px]"></div>
      </div>
      
      <div class="relative z-10 flex items-center gap-2 cursor-pointer" @click="router.push('/')">
        <span class="material-symbols-outlined text-white text-3xl" style="font-variation-settings: 'FILL' 1;">hub</span>
        <span class="text-2xl font-bold tracking-tighter text-white">G-ACADEMIC SUITE</span>
      </div>

      <div class="relative z-10 space-y-md">
        <h2 class="text-h1 text-white leading-tight font-h1">Unite a la<br/>comunidad educativa.</h2>
        <p class="text-body-lg text-on-primary-container/80 max-w-lg">
          Crea tu cuenta hoy y accede a la plataforma de gestión académica más avanzada del mercado.
        </p>
      </div>

      <div class="relative z-10 flex items-center justify-between text-on-primary-container/60 text-sm">
        <span>© 2026 Cloud Academy Project</span>
        <div class="flex gap-md">
          <a href="#" class="hover:text-white transition-colors">Privacy</a>
          <a href="#" class="hover:text-white transition-colors">Terms</a>
        </div>
      </div>

      <!-- Animated image element -->
      <div class="absolute top-1/2 right-[-10%] translate-y-[-50%] w-[80%] opacity-40 pointer-events-none animate-float">
        <img 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBEWoGj7tBQGfg0GGghydb3DuC2JCg3yHyHw-IHbooYWbqq1LZ1KbafKCZem7ILZVpqFRZWsCxYoa5Es8GRkE_mWB7S00cXHyP95dsWp3dB5W9CMOwTS4CmVE4iavj-0FYp2H34V1Ym2gnJbDZ_b1rGlRmhcHIvHR0xD4AxMv-CuRbAXTgy4CLZYyrIQ_nhFsFaYdOwW6zl8p8N4wgnjbdO3Xrhu80fmIGD1tL7XiLadNszZMqBJI8ZMtTvsGMlbyOmNSfXtj8QlvI" 
          alt="Cloud Architecture" 
          class="w-full h-auto rounded-3xl"
        />
      </div>
    </div>

    <!-- Right Side: Register Form -->
    <div class="w-full lg:w-1/2 flex flex-col justify-center items-center p-md sm:p-xl bg-background relative">
      <!-- Mobile Top Bar -->
      <div class="lg:hidden absolute top-0 left-0 right-0 p-md flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-outline-variant z-20">
        <div class="flex items-center gap-2" @click="router.push('/')">
          <span class="material-symbols-outlined text-primary-container" style="font-variation-settings: 'FILL' 1;">hub</span>
          <span class="font-bold tracking-tighter">G-ACADEMIC</span>
        </div>
        <v-btn variant="text" size="small" to="/">Inicio</v-btn>
      </div>

      <div class="w-full max-w-[420px] login-card">
        <div class="mb-xl entrance-item">
          <div class="w-12 h-12 bg-secondary-fixed flex items-center justify-center rounded-xl mb-md">
            <span class="material-symbols-outlined text-secondary text-2xl" style="font-variation-settings: 'FILL' 1;">person_add</span>
          </div>
          <h1 class="text-h2 font-h2 text-on-surface mb-xs">Registro de Estudiantes</h1>
          <p class="text-body-md text-on-surface-variant">Unite a nuestra comunidad educativa hoy mismo</p>
        </div>

        <form class="space-y-md" @submit.prevent="submit">
          <div class="space-y-sm">
            <div class="entrance-item">
              <label class="block text-label-caps font-label-caps text-on-surface-variant mb-xs" for="name">Nombre Completo</label>
              <div class="relative group">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-secondary">
                  <span class="material-symbols-outlined text-lg">person</span>
                </div>
                <input 
                  v-model="form.nombre_completo"
                  class="block w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all hover:border-outline" 
                  id="name" 
                  placeholder="Juan Pérez" 
                  required 
                />
              </div>
            </div>

            <div class="entrance-item">
              <label class="block text-label-caps font-label-caps text-on-surface-variant mb-xs" for="email">E-mail</label>
              <div class="relative group">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-secondary">
                  <span class="material-symbols-outlined text-lg">mail</span>
                </div>
                <input 
                  v-model="form.email"
                  class="block w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all hover:border-outline" 
                  id="email" 
                  placeholder="usuario@ejemplo.com" 
                  required 
                  type="email"
                />
              </div>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-md">
              <div class="entrance-item">
                <label class="block text-label-caps font-label-caps text-on-surface-variant mb-xs" for="password">Contraseña</label>
                <div class="relative group">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-secondary">
                    <span class="material-symbols-outlined text-lg">lock</span>
                  </div>
                  <input 
                    v-model="form.password"
                    class="block w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all hover:border-outline" 
                    id="password" 
                    placeholder="••••••••" 
                    required 
                    type="password"
                  />
                </div>
              </div>

              <div class="entrance-item">
                <label class="block text-label-caps font-label-caps text-on-surface-variant mb-xs" for="confirm-password">Confirmar</label>
                <div class="relative group">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-secondary">
                    <span class="material-symbols-outlined text-lg">verified_user</span>
                  </div>
                  <input 
                    v-model="confirmPassword"
                    class="block w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all hover:border-outline" 
                    id="confirm-password" 
                    placeholder="••••••••" 
                    required 
                    type="password"
                  />
                </div>
              </div>
            </div>
          </div>

          <v-alert
            v-if="error"
            type="error"
            variant="tonal"
            class="rounded-xl entrance-item mt-md"
          >
            {{ error }}
          </v-alert>

          <v-alert
            v-if="success"
            type="success"
            variant="tonal"
            class="rounded-xl entrance-item mt-md"
          >
            {{ success }}
          </v-alert>

          <div class="entrance-item pt-md">
            <button 
              :disabled="loading"
              class="w-full flex justify-center items-center gap-2 py-4 px-6 bg-primary text-white rounded-xl font-mono-data text-mono-data hover:bg-primary/90 focus:ring-4 focus:ring-primary/10 transition-all shadow-lg hover:shadow-primary/20 disabled:opacity-50" 
              type="submit"
            >
              <span v-if="loading" class="animate-spin h-5 w-5 border-2 border-white/20 border-t-white rounded-full"></span>
              {{ loading ? 'Registrando...' : 'Crear Cuenta' }}
              <span v-if="!loading" class="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
          </div>
        </form>

        <div class="mt-xl text-center entrance-item">
          <p class="text-body-sm text-on-surface-variant">
            ¿Ya tienes una cuenta? 
            <router-link to="/login" class="font-bold text-secondary hover:underline transition-all">Inicia Sesión</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth';
import { createTimeline, stagger } from 'animejs';

const router = useRouter();
const authStore = useAuthStore();

const form = reactive({
  nombre_completo: '',
  email: '',
  password: ''
});

const confirmPassword = ref('');
const loading = ref(false);
const error = ref('');
const success = ref('');

onMounted(() => {
  const tl = createTimeline({
    defaults: {
      ease: 'outExpo',
      duration: 1000
    }
  });

  tl.add('.entrance-item', {
    translateY: [20, 0],
    opacity: [0, 1],
    delay: stagger(80)
  });
});

const submit = async () => {
  if (form.password !== confirmPassword.value) {
    error.value = 'Las contraseñas no coinciden';
    return;
  }

  if (form.password.length < 8) {
    error.value = 'La contraseña debe tener al menos 8 caracteres';
    return;
  }

  loading.value = true;
  error.value = '';
  success.value = '';

  try {
    await authStore.register({ ...form });
    success.value = 'Registro exitoso. Redirigiendo al login...';
    setTimeout(() => {
      router.push('/login');
    }, 2000);
  } catch (err: any) {
    error.value = err.message || 'Error al registrar usuario.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
@reference "tailwindcss";

input::placeholder {
  color: var(--color-outline);
  opacity: 0.5;
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0% { transform: translateY(-50%) translateX(0px); }
  50% { transform: translateY(-55%) translateX(10px); }
  100% { transform: translateY(-50%) translateX(0px); }
}
</style>
