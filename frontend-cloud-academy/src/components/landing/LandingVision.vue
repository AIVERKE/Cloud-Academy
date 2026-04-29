<template>
  <section id="vision" class="max-w-container-max mx-auto px-gutter mb-xl py-16">
    <div class="bg-primary-container rounded-xl p-xl flex flex-col md:flex-row gap-xl items-start relative overflow-hidden vision-card">
      <div class="absolute inset-0 bg-gradient-to-br from-primary-container to-surface-tint/20"></div>
      <div class="relative z-10 md:w-1/3 flex flex-col gap-md vision-left">
        <h2 class="font-h2 text-h2 text-on-primary">Visión</h2>
        <p class="font-body-lg text-body-lg text-on-primary-container italic border-l-4 border-secondary pl-4">
          "Integración invisible para una gestión visible."
        </p>
      </div>
      <div class="relative z-10 md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-lg vision-right">
        <div class="flex flex-col gap-sm vision-item">
          <div class="flex items-center gap-xs">
            <span class="material-symbols-outlined text-secondary-fixed text-xl">sync_alt</span>
            <h4 class="font-mono-data text-mono-data text-on-primary uppercase tracking-wider">Sincronización</h4>
          </div>
          <p class="font-body-sm text-body-sm text-on-primary-container">Los datos fluyen sin esfuerzo entre tu servidor y la nube.</p>
        </div>
        <div class="flex flex-col gap-sm vision-item">
          <div class="flex items-center gap-xs">
            <span class="material-symbols-outlined text-tertiary-fixed text-xl">verified_user</span>
            <h4 class="font-mono-data text-mono-data text-on-primary uppercase tracking-wider">Integridad</h4>
          </div>
          <p class="font-body-sm text-body-sm text-on-primary-container">Validaciones estrictas y auditoría constante.</p>
        </div>
        <div class="flex flex-col gap-sm vision-item">
          <div class="flex items-center gap-xs">
            <span class="material-symbols-outlined text-inverse-primary text-xl">architecture</span>
            <h4 class="font-mono-data text-mono-data text-on-primary uppercase tracking-wider">Escalabilidad</h4>
          </div>
          <p class="font-body-sm text-body-sm text-on-primary-container">Arquitectura modular (NestJS + Vue 3) para la UMSA.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { createTimeline, stagger } from 'animejs';

onMounted(() => {
  const tl = createTimeline({
    defaults: {
      ease: 'outExpo',
      duration: 1000
    }
  });

  tl.add('.vision-card', {
    scale: [0.95, 1],
    opacity: [0, 1],
    duration: 1200
  })
  .add('.vision-left', {
    translateX: [-30, 0],
    opacity: [0, 1]
  }, '-=800')
  .add('.vision-item', {
    translateY: [20, 0],
    opacity: [0, 1],
    delay: stagger(100)
  }, '-=600');
});
</script>
