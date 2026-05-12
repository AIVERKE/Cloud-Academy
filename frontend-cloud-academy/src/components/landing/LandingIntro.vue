<template>
  <section id="intro" class="max-w-container-max mx-auto px-gutter mb-xl py-16">
    <div class="flex flex-col gap-sm mb-lg text-center items-center intro-text">
      <span class="inline-block px-sm py-xs bg-secondary-fixed/20 text-secondary border border-secondary-fixed rounded-full w-max font-label-caps text-label-caps uppercase">G-ACADEMIC SUITE</span>
      <h2 class="font-h2 text-h2 text-on-background mt-4">Transformando la Gestión Académica con el Poder de la Nube</h2>
      <p class="font-body-lg text-body-lg text-on-surface-variant max-w-4xl mt-4">
        Surge como una respuesta a la creciente necesidad de modernizar 
        la gestión académica, aprovechando las ventajas de la computación en la nube. 
        G-Academic Suite es una solución innovadora diseñada para optimizar la gestión de entregas académicas, calificaciones 
        y retroalimentación. Utilizando servicios de Google Cloud Platform, 
        buscamos transformar la manera en que interactuamos con los recursos 
        académicos, garantizando una plataforma robusta y eficiente que promueva 
        la colaboración entre docentes y alumnos. Este enfoque no solo mejora la 
        experiencia educativa, sino que también asegura la integridad y seguridad 
        de la información. 
      </p>
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
        tl.add('.intro-text > *', {
          translateY: [30, 0],
          opacity: [0, 1],
          delay: stagger(150)
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.2 });

  const section = document.getElementById('intro');
  if (section) {
    const elementsToHide = section.querySelectorAll('.intro-text > *');
    elementsToHide.forEach(el => {
      (el as HTMLElement).style.opacity = '0';
    });
    observer.observe(section);
  }
});
</script>
