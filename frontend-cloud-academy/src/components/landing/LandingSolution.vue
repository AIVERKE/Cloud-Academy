<template>
  <section id="solucion" class="max-w-container-max mx-auto px-gutter mb-xl py-16 relative">
    <div class="bg-primary-container rounded-3xl p-xl flex flex-col lg:flex-row gap-xl items-center relative overflow-hidden solution-card shadow-2xl">
      <!-- Decorative background -->
      <div class="absolute inset-0 bg-gradient-to-br from-primary-container via-primary-container to-secondary-container/20"></div>
      <div class="absolute -top-32 -right-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-soft"></div>
      
      <div class="relative z-10 lg:w-1/2 flex flex-col gap-md solution-text">
        <div class="flex items-center gap-xs">
          <span class="material-symbols-outlined text-secondary-fixed text-3xl">lightbulb</span>
          <h2 class="font-h2 text-h2 text-on-primary">La Solución </h2>
        </div>
        <p class="font-body-lg text-body-lg text-on-primary-container leading-relaxed">
          G-Academic Suite surge como una respuesta integral a estos problemas. Nuestra propuesta se basa en la implementación de un 
          <strong class="text-white">gestor de entregas académicas en la nube</strong> que centraliza la gestión de activos institucionales.
        </p>
        <p class="font-body-md text-body-md text-on-primary-container leading-relaxed mt-2">
          A través de la integración de herramientas de Google, buscamos automatizar el ciclo de entrega y notificación, garantizando 
          un acceso seguro y controlado mediante identidad federada. Esto no solo optimiza la gestión de la información, sino que 
          también mejora la experiencia de docentes y estudiantes.
        </p>
      </div>

      <div class="relative z-10 lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-sm solution-features">
        <div class="bg-surface/10 backdrop-blur-sm border border-white/10 p-md rounded-xl flex items-start gap-sm solution-item">
          <span class="material-symbols-outlined text-secondary-fixed mt-1">cloud_done</span>
          <div>
            <h4 class="font-h3 text-h3 text-white text-base mb-1">Gestión en la Nube</h4>
            <p class="font-body-sm text-body-sm text-on-primary-container text-xs">Centralización total de activos institucionales.</p>
          </div>
        </div>
        <div class="bg-surface/10 backdrop-blur-sm border border-white/10 p-md rounded-xl flex items-start gap-sm solution-item">
          <span class="material-symbols-outlined text-tertiary-fixed mt-1">autorenew</span>
          <div>
            <h4 class="font-h3 text-h3 text-white text-base mb-1">Automatización</h4>
            <p class="font-body-sm text-body-sm text-on-primary-container text-xs">Ciclos de entrega y notificación automáticos.</p>
          </div>
        </div>
        <div class="bg-surface/10 backdrop-blur-sm border border-white/10 p-md rounded-xl flex items-start gap-sm solution-item">
          <span class="material-symbols-outlined text-secondary-container mt-1">shield_person</span>
          <div>
            <h4 class="font-h3 text-h3 text-white text-base mb-1">Acceso Seguro</h4>
            <p class="font-body-sm text-body-sm text-on-primary-container text-xs">Control mediante identidad federada de Google.</p>
          </div>
        </div>
        <div class="bg-surface/10 backdrop-blur-sm border border-white/10 p-md rounded-xl flex items-start gap-sm solution-item">
          <span class="material-symbols-outlined text-primary-fixed mt-1">mood</span>
          <div>
            <h4 class="font-h3 text-h3 text-white text-base mb-1">Mejor Experiencia</h4>
            <p class="font-body-sm text-body-sm text-on-primary-container text-xs">Optimización para docentes y estudiantes.</p>
          </div>
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

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        tl.add('.solution-card', {
          scale: [0.95, 1],
          opacity: [0, 1],
          duration: 1200
        })
        .add('.solution-text > *', {
          translateY: [20, 0],
          opacity: [0, 1],
          delay: stagger(150)
        }, '-=800')
        .add('.solution-item', {
          translateX: [30, 0],
          opacity: [0, 1],
          delay: stagger(100)
        }, '-=600');
        observer.disconnect();
      }
    });
  }, { threshold: 0.2 });

  const section = document.getElementById('solucion');
  if (section) {
    const card = section.querySelector('.solution-card');
    if (card) (card as HTMLElement).style.opacity = '0';
    
    const elementsToHide = section.querySelectorAll('.solution-text > *, .solution-item');
    elementsToHide.forEach(el => {
      (el as HTMLElement).style.opacity = '0';
    });
    observer.observe(section);
  }
});
</script>
