<template>
  <nav class="bg-white/80 dark:bg-slate-950/80 backdrop-blur-md text-slate-900 dark:text-slate-50 font-['Inter'] text-sm font-medium tracking-tight fixed top-0 w-full z-50 border-b border-slate-200 dark:border-slate-800 active:scale-95 transition-transform duration-150">
    <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
      <div class="flex items-center gap-8">
        <router-link to="/" class="text-xl font-bold tracking-tighter text-slate-900 dark:text-white">G-ACADEMIC SUITE</router-link>
        <div class="hidden md:flex items-center gap-6">
          <a class="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-200" href="#solutions">Solutions</a>
          <a class="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-200" href="#integration">Integration</a>
          <a class="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-200" href="#vision">Vision</a>
          <a class="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-200" href="#">Docs</a>
        </div>
      </div>
      <div class="flex items-center gap-4">
        <v-btn variant="text" to="/login" class="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-200">Ingresar</v-btn>
        <v-btn color="primary-container" to="/register" class="bg-primary-container text-on-primary-container px-4 py-2 rounded font-label-caps text-label-caps hover:opacity-90 transition-opacity">Registrarse</v-btn>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
// No extra logic needed for now
</script>
