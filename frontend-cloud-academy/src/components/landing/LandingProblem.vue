<template>
  <section id="problema" class="max-w-container-max mx-auto px-gutter mb-xl py-16 relative">
    <div class="flex flex-col md:flex-row gap-xl items-center">
      <div class="md:w-1/2 flex flex-col gap-md problem-text">
        <h2 class="font-h2 text-h2 text-error">El Problema</h2>
        <p class="font-body-lg text-body-lg text-on-surface-variant">
          En la actualidad, la gestión académica enfrenta serias deficiencias que afectan la calidad del proceso educativo. 
          La fragmentación de la información es un problema crítico, ya que los trabajos se envían a través de correos y 
          aplicaciones de mensajería, lo que dificulta su seguimiento y gestión.
        </p>
        <p class="font-body-md text-body-md text-on-surface-variant"> 
          Además, la falta de una plataforma adecuada con lleva a la pérdida de integridad y trazabilidad de las entregas, 
          aumentando la vulnerabilidad de los datos almacenados en dispositivos locales. Todo esto, sumado a la ausencia 
          de auditoría en la calificación, pone en riesgo la transparencia y confianza en el sistema educativo.
        </p>
      </div>
      <div class="md:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-md problem-grid">
        <div class="bg-error-container/30 border border-error/20 p-md rounded-xl flex flex-col gap-xs problem-card">
          <span class="material-symbols-outlined text-error text-2xl">call_split</span>
          <h4 class="font-h3 text-h3 text-on-surface text-lg">Fragmentación</h4>
          <p class="font-body-sm text-body-sm text-on-surface-variant">Trabajos dispersos en correos y mensajería.</p>
        </div>
        <div class="bg-error-container/30 border border-error/20 p-md rounded-xl flex flex-col gap-xs problem-card">
          <span class="material-symbols-outlined text-error text-2xl">history_toggle_off</span>
          <h4 class="font-h3 text-h3 text-on-surface text-lg">Sin Trazabilidad</h4>
          <p class="font-body-sm text-body-sm text-on-surface-variant">Pérdida de integridad en las entregas.</p>
        </div>
        <div class="bg-error-container/30 border border-error/20 p-md rounded-xl flex flex-col gap-xs problem-card">
          <span class="material-symbols-outlined text-error text-2xl">no_encryption</span>
          <h4 class="font-h3 text-h3 text-on-surface text-lg">Vulnerabilidad</h4>
          <p class="font-body-sm text-body-sm text-on-surface-variant">Datos expuestos en dispositivos locales.</p>
        </div>
        <div class="bg-error-container/30 border border-error/20 p-md rounded-xl flex flex-col gap-xs problem-card">
          <span class="material-symbols-outlined text-error text-2xl">gavel</span>
          <h4 class="font-h3 text-h3 text-on-surface text-lg">Falta de Auditoría</h4>
          <p class="font-body-sm text-body-sm text-on-surface-variant">Riesgo en la transparencia educativa.</p>
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
        tl.add('.problem-text > *', {
          translateX: [-30, 0],
          opacity: [0, 1],
          delay: stagger(150)
        })
        .add('.problem-card', {
          scale: [0.9, 1],
          opacity: [0, 1],
          delay: stagger(100)
        }, '-=800');
        observer.disconnect();
      }
    });
  }, { threshold: 0.2 });

  const section = document.getElementById('problema');
  if (section) {
    // Initial state
    const elementsToHide = section.querySelectorAll('.problem-text > *, .problem-card');
    elementsToHide.forEach(el => {
      (el as HTMLElement).style.opacity = '0';
    });
    observer.observe(section);
  }
});
</script>

<style scoped>
.problem-card {
  transition: transform 0.3s ease;
}
.problem-card:hover {
  transform: translateY(-5px);
}
</style>
