<template>
  <section id="solutions" class="max-w-container-max mx-auto px-gutter mb-xl py-16">
    <div class="flex flex-col gap-sm mb-lg">
      <h2 class="font-h2 text-h2 text-on-background">El Proyecto</h2>
      <p class="font-body-md text-body-md text-on-surface-variant max-w-3xl">
        Cloud Academy no es solo un gestor de tareas; es un puente de datos (API Bridge) diseñado para demostrar cómo los sistemas modernos pueden interoperar entre bases de datos relacionales y servicios en la nube.
      </p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-gutter features-grid">
      <!-- Feature 1 -->
      <div class="bg-surface-container-lowest border border-surface-variant rounded-xl p-lg flex flex-col gap-md card-hover transition-colors group relative overflow-hidden feature-card">
        <div class="absolute -right-8 -top-8 w-32 h-32 bg-primary-fixed/30 rounded-full blur-2xl group-hover:bg-primary-fixed/50 transition-colors"></div>
        <div class="w-12 h-12 rounded-lg bg-surface flex items-center justify-center border border-outline-variant relative z-10">
          <span class="material-symbols-outlined text-primary text-2xl">database</span>
        </div>
        <div class="relative z-10">
          <h3 class="font-h3 text-h3 text-on-surface mb-xs">Persistencia Local Robusta</h3>
          <p class="font-body-sm text-body-sm text-on-surface-variant">Uso de PostgreSQL para control de usuarios, roles y entregas con TypeORM.</p>
        </div>
      </div>
      <!-- Feature 2 -->
      <div class="bg-surface-container-lowest border border-surface-variant rounded-xl p-lg flex flex-col gap-md card-hover transition-colors group relative overflow-hidden feature-card">
        <div class="absolute -right-8 -top-8 w-32 h-32 bg-secondary-fixed/30 rounded-full blur-2xl group-hover:bg-secondary-fixed/50 transition-colors"></div>
        <div class="w-12 h-12 rounded-lg bg-surface flex items-center justify-center border border-outline-variant relative z-10">
          <span class="material-symbols-outlined text-secondary text-2xl">cloud_sync</span>
        </div>
        <div class="relative z-10">
          <h3 class="font-h3 text-h3 text-on-surface mb-xs">Ecosistema Google Drive</h3>
          <p class="font-body-sm text-body-sm text-on-surface-variant">Sincronización bidireccional de materiales y recursos directamente desde la nube.</p>
        </div>
      </div>
      <!-- Feature 3 -->
      <div class="bg-surface-container-lowest border border-surface-variant rounded-xl p-lg flex flex-col gap-md card-hover transition-colors group relative overflow-hidden feature-card">
        <div class="absolute -right-8 -top-8 w-32 h-32 bg-tertiary-fixed/30 rounded-full blur-2xl group-hover:bg-tertiary-fixed/50 transition-colors"></div>
        <div class="w-12 h-12 rounded-lg bg-surface flex items-center justify-center border border-outline-variant relative z-10">
          <span class="material-symbols-outlined text-tertiary-container text-2xl">table_chart</span>
        </div>
        <div class="relative z-10">
          <h3 class="font-h3 text-h3 text-on-surface mb-xs">Auditoría en Google Sheets</h3>
          <p class="font-body-sm text-body-sm text-on-surface-variant">Automatización de registros administrativos en hojas de cálculo compartidas.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { animate, stagger } from 'animejs';

onMounted(() => {
  animate('.feature-card', {
    translateY: [40, 0],
    opacity: [0, 1],
    delay: stagger(150),
    ease: 'outQuad',
    duration: 800,
  });
});
</script>
