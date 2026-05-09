<template>
  <nav class="bg-white/80 dark:bg-slate-950/80 backdrop-blur-md text-slate-900 dark:text-slate-50 font-['Inter'] text-sm font-medium tracking-tight fixed top-0 w-full z-50 border-b border-slate-200 dark:border-slate-800 transition-all duration-300">
    <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
      <div class="flex items-center gap-8">
        <router-link to="/" class="text-xl font-bold tracking-tighter text-slate-900 dark:text-white">G-ACADEMIC SUITE</router-link>
        
        <!-- Desktop Menu -->
        <div class="hidden md:flex items-center gap-6">
          <a v-for="link in navLinks" :key="link.href" :href="link.href" class="text-on-surface-variant hover:text-secondary dark:text-slate-400 dark:hover:text-secondary-fixed-dim transition-colors duration-200">
            {{ link.text }}
          </a>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <div class="hidden md:flex items-center gap-4">
          <v-btn variant="text" to="/login" class="text-on-surface-variant hover:text-secondary dark:text-slate-400 dark:hover:text-secondary-fixed-dim transition-colors duration-200">Ingresar</v-btn>
          <v-btn color="primary-container" to="/register" class="bg-primary-container text-on-primary-container px-4 py-2 rounded font-label-caps text-label-caps hover:opacity-90 transition-opacity">Registrarse</v-btn>
        </div>

        <!-- Mobile Toggle -->
        <button @click="isMenuOpen = !isMenuOpen" class="md:hidden p-2 text-on-surface-variant hover:text-secondary dark:text-slate-400 dark:hover:text-secondary-fixed-dim focus:outline-none transition-colors" aria-label="Toggle Menu">
          <span class="material-symbols-outlined text-2xl">
            {{ isMenuOpen ? 'close' : 'menu' }}
          </span>
        </button>
      </div>
    </div>

    <!-- Mobile Menu Overlay -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-[-10px]"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-[-10px]"
    >
      <div v-if="isMenuOpen" class="md:hidden absolute top-16 left-0 w-full bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 shadow-xl z-40 overflow-hidden">
        <div class="flex flex-col p-6 gap-6">
          <a v-for="link in navLinks" :key="link.href" :href="link.href" @click="isMenuOpen = false" class="text-lg font-semibold text-on-surface-variant hover:text-secondary dark:text-slate-300 dark:hover:text-secondary-fixed-dim transition-all duration-200 flex items-center justify-between border-b border-surface-variant dark:border-slate-800 pb-3 pt-1 px-3 hover:bg-surface-container-high dark:hover:bg-slate-900 rounded-lg group">
            {{ link.text }}
            <span class="material-symbols-outlined text-sm opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all">arrow_forward</span>
          </a>
          
          <div class="flex flex-col gap-4 mt-4"> 
            <v-btn block variant="outlined" to="/login" @click="isMenuOpen = false" class="py-6">Ingresar</v-btn>
            <v-btn block color="primary-container" to="/register" @click="isMenuOpen = false" class="py-6">Registrarse</v-btn>
          </div>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const isMenuOpen = ref(false);

const navLinks = [
  { href: '#intro', text: 'Intro' },
  { href: '#problema', text: 'El Problema' },
  { href: '#solucion', text: 'La Solución' },
  { href: '#proyecto', text: 'Funcionalidades' },
  { href: '#vision', text: 'Visión' },
  { href: '#equipo', text: 'Equipo' },
];
</script>

<style scoped>
/* Ensure smooth transitions */
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>
