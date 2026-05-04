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
        <h2 class="text-h1 text-white leading-tight font-h1">Integración inteligente,<br/>gestión simplificada.</h2>
        <p class="text-body-lg text-on-primary-container/80 max-w-lg">
          La primera plataforma académica diseñada para la interoperabilidad total entre sistemas legados y servicios cloud modernos.
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

    <!-- Right Side: Login Form -->
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
          <div class="w-12 h-12 bg-primary-fixed flex items-center justify-center rounded-xl mb-md">
            <span class="material-symbols-outlined text-primary text-2xl" style="font-variation-settings: 'FILL' 1;">school</span>
          </div>
          <h1 class="text-h2 font-h2 text-on-surface mb-xs">Acceder</h1>
          <p class="text-body-md text-on-surface-variant">Ingresa tus credenciales para acceder</p>
        </div>

        <form class="space-y-lg" @submit.prevent="submit">
          <div class="space-y-md">
            <div class="entrance-item">
              <label class="block text-label-caps font-label-caps text-on-surface-variant mb-xs" for="email">E-mail</label>
              <div class="relative group">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-secondary" :class="{'text-error': fieldErrors.email}">
                  <span class="material-symbols-outlined text-lg">mail</span>
                </div>
                <input 
                  v-model="email"
                  @input="clearError('email')"
                  :class="['block w-full pl-10 pr-4 py-3 bg-surface-container-low border rounded-xl text-body-sm focus:outline-none focus:ring-2 transition-all', fieldErrors.email ? 'border-error focus:ring-error/20 focus:border-error' : 'border-outline-variant focus:ring-secondary/20 focus:border-secondary hover:border-outline']" 
                  id="email" 
                  name="email" 
                  placeholder="usuario@ejemplo.com" 
                  type="email"
                />
              </div>
              <Transition name="fade">
                <span v-if="fieldErrors.email" class="text-xs text-error mt-1 ml-1 block">{{ fieldErrors.email }}</span>
              </Transition>
            </div>
            
            <div class="entrance-item">
              <label class="block text-label-caps font-label-caps text-on-surface-variant mb-xs" for="password">Contraseña</label>
              <div class="relative group">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-secondary" :class="{'text-error': fieldErrors.password}">
                  <span class="material-symbols-outlined text-lg">lock</span>
                </div>
                <input 
                  v-model="password"
                  @input="clearError('password')"
                  :class="['block w-full pl-10 pr-4 py-3 bg-surface-container-low border rounded-xl text-body-sm focus:outline-none focus:ring-2 transition-all', fieldErrors.password ? 'border-error focus:ring-error/20 focus:border-error' : 'border-outline-variant focus:ring-secondary/20 focus:border-secondary hover:border-outline']" 
                  id="password" 
                  name="password" 
                  placeholder="••••••••" 
                  type="password"
                />
              </div>
              <Transition name="fade">
                <span v-if="fieldErrors.password" class="text-xs text-error mt-1 ml-1 block">{{ fieldErrors.password }}</span>
              </Transition>
            </div>
          </div>

          <Transition name="slide-fade">
            <v-alert
              v-if="error"
              type="error"
              variant="tonal"
              class="rounded-xl entrance-item"
            >
              {{ error }}
            </v-alert>
          </Transition>

          <div class="flex items-center justify-between entrance-item">
            <label class="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" v-model="rememberMe" class="w-4 h-4 rounded border-outline-variant text-secondary focus:ring-secondary/20 cursor-pointer"/>
              <span class="text-body-sm text-on-surface-variant group-hover:text-on-surface transition-colors">Recordarme</span>
            </label>
            <a href="#" class="text-body-sm font-medium text-secondary hover:text-secondary-container transition-colors">¿Olvidaste tu clave?</a>
          </div>

          <div class="entrance-item pt-sm space-y-md">
            <button 
              :disabled="loading"
              class="w-full flex justify-center items-center gap-2 py-4 px-6 bg-primary-container text-white rounded-xl font-mono-data text-mono-data hover:bg-slate-900 focus:ring-4 focus:ring-primary/10 transition-all shadow-lg hover:shadow-primary/20 disabled:opacity-50" 
              type="submit"
            >
              <span v-if="loading" class="animate-spin h-5 w-5 border-2 border-white/20 border-t-white rounded-full"></span>
              {{ loading ? 'Autenticando...' : 'Iniciar Sesión' }}
              <span v-if="!loading" class="material-symbols-outlined text-lg">login</span>
            </button>
            
            <div class="relative flex items-center py-2">
              <div class="flex-grow border-t border-outline-variant"></div>
              <span class="flex-shrink-0 mx-4 text-on-surface-variant text-label-sm">o</span>
              <div class="flex-grow border-t border-outline-variant"></div>
            </div>

            <button
              @click.prevent="router.push('/register')"
              type="button"
              class="w-full flex justify-center items-center gap-2 py-3 px-6 bg-surface border border-outline text-primary rounded-xl font-mono-data text-mono-data hover:bg-surface-container-low focus:ring-4 focus:ring-primary/10 transition-all"
            >
              <span>Crear nueva cuenta</span>
              <span class="material-symbols-outlined text-lg">person_add</span>
            </button>
          </div>
        </form>
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

const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const loading = ref(false);
const error = ref('');

const fieldErrors = reactive({
  email: '',
  password: ''
});

const validateEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const clearError = (field: 'email' | 'password') => {
  fieldErrors[field] = '';
  error.value = '';
};

onMounted(() => {
  const savedEmail = localStorage.getItem('ca_remembered_email');
  if (savedEmail) {
    email.value = savedEmail;
    rememberMe.value = true;
  }

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
  let isValid = true;
  error.value = '';

  if (!email.value) {
    fieldErrors.email = 'El correo electrónico es requerido';
    isValid = false;
  } else if (!validateEmail(email.value)) {
    fieldErrors.email = 'El formato del correo es inválido';
    isValid = false;
  }

  if (!password.value) {
    fieldErrors.password = 'La contraseña es requerida';
    isValid = false;
  }

  if (!isValid) return;

  loading.value = true;

  try {
    await authStore.login(email.value, password.value);
    
    if (rememberMe.value) {
      localStorage.setItem('ca_remembered_email', email.value);
    } else {
      localStorage.removeItem('ca_remembered_email');
    }

    router.push('/dashboard');
  } catch (err) {
    error.value = 'Credenciales inválidas o error de conexión.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
@reference "tailwindcss";

/* Specific overrides for professional feel */
input::placeholder {
  color: var(--color-outline);
  opacity: 0.5;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>
