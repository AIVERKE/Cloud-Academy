<template>
  <section id="proyecto" class="max-w-container-max mx-auto px-gutter mb-xl py-16">
    <div class="flex flex-col gap-sm mb-lg text-center items-center">
      <h2 class="font-h2 text-h2 text-on-background">Funcionalidades</h2>
      <p class="font-body-md text-body-md text-on-surface-variant max-w-3xl">
        G-Academic Suite es un ecosistema de orquestación en la nube que combina la potencia de Google Cloud con una arquitectura de control propia. Entre sus funcionalidades clave se incluyen:
      </p>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter features-grid">
      <!-- Feature 1 -->
      <div class="bg-surface-container-lowest border border-surface-variant rounded-xl p-lg flex flex-col gap-md card-hover transition-colors group relative overflow-hidden project-card">
        <div class="absolute -right-8 -top-8 w-32 h-32 bg-primary-fixed/30 rounded-full blur-2xl group-hover:bg-primary-fixed/50 transition-colors"></div>
        <div class="w-12 h-12 rounded-lg bg-surface flex items-center justify-center border border-outline-variant relative z-10">
          <span class="material-symbols-outlined text-primary text-2xl">folder_managed</span>
        </div>
        <div class="relative z-10">
          <h3 class="font-h3 text-h3 text-on-surface mb-xs text-lg">Centralización de Entregas</h3>
          <p class="font-body-sm text-body-sm text-on-surface-variant">Un repositorio único para la recepción de trabajos, eliminando la dispersión de datos.</p>
        </div>
      </div>
      
      <!-- Feature 2 -->
      <div class="bg-surface-container-lowest border border-surface-variant rounded-xl p-lg flex flex-col gap-md card-hover transition-colors group relative overflow-hidden project-card">
        <div class="absolute -right-8 -top-8 w-32 h-32 bg-secondary-fixed/30 rounded-full blur-2xl group-hover:bg-secondary-fixed/50 transition-colors"></div>
        <div class="w-12 h-12 rounded-lg bg-surface flex items-center justify-center border border-outline-variant relative z-10">
          <span class="material-symbols-outlined text-secondary text-2xl">fingerprint</span>
        </div>
        <div class="relative z-10">
          <h3 class="font-h3 text-h3 text-on-surface mb-xs text-lg">Integridad y Trazabilidad</h3>
          <p class="font-body-sm text-body-sm text-on-surface-variant">Marcas temporales y una base de datos híbrida que aseguran la veracidad de cada entrega.</p>
        </div>
      </div>
      
      <!-- Feature 3 -->
      <div class="bg-surface-container-lowest border border-surface-variant rounded-xl p-lg flex flex-col gap-md card-hover transition-colors group relative overflow-hidden project-card">
        <div class="absolute -right-8 -top-8 w-32 h-32 bg-tertiary-fixed/30 rounded-full blur-2xl group-hover:bg-tertiary-fixed/50 transition-colors"></div>
        <div class="w-12 h-12 rounded-lg bg-surface flex items-center justify-center border border-outline-variant relative z-10">
          <span class="material-symbols-outlined text-tertiary-fixed-dim text-2xl">speed</span>
        </div>
        <div class="relative z-10">
          <h3 class="font-h3 text-h3 text-on-surface mb-xs text-lg">Interfaz Moderna y Ágil</h3>
          <p class="font-body-sm text-body-sm text-on-surface-variant">Una plataforma intuitiva que responde a las necesidades actuales de estudiantes y docentes en tiempo real.</p>
        </div>
      </div>
      
      <!-- Feature 4 -->
      <div class="bg-surface-container-lowest border border-surface-variant rounded-xl p-lg flex flex-col gap-md card-hover transition-colors group relative overflow-hidden project-card">
        <div class="absolute -right-8 -top-8 w-32 h-32 bg-error-container/30 rounded-full blur-2xl group-hover:bg-error-container/50 transition-colors"></div>
        <div class="w-12 h-12 rounded-lg bg-surface flex items-center justify-center border border-outline-variant relative z-10">
          <span class="material-symbols-outlined text-error text-2xl">security</span>
        </div>
        <div class="relative z-10">
          <h3 class="font-h3 text-h3 text-on-surface mb-xs text-lg">Seguridad de Datos</h3>
          <p class="font-body-sm text-body-sm text-on-surface-variant">Implementación de estándares internacionales de seguridad, garantizando la confidencialidad e integridad.</p>
        </div>
      </div>

      <!-- Feature 5 (from Features) -->
      <div class="bg-surface-container-lowest border border-surface-variant rounded-xl p-lg flex flex-col gap-md card-hover transition-colors group relative overflow-hidden project-card">
        <div class="absolute -right-8 -top-8 w-32 h-32 bg-primary-fixed/30 rounded-full blur-2xl group-hover:bg-primary-fixed/50 transition-colors"></div>
        <div class="w-12 h-12 rounded-lg bg-surface flex items-center justify-center border border-outline-variant relative z-10">
          <span class="material-symbols-outlined text-primary text-2xl">database</span>
        </div>
        <div class="relative z-10">
          <h3 class="font-h3 text-h3 text-on-surface mb-xs text-lg">Persistencia Local Robusta</h3>
          <p class="font-body-sm text-body-sm text-on-surface-variant">Uso de PostgreSQL para control de usuarios, roles y entregas con TypeORM.</p>
        </div>
      </div>

      <!-- Feature 6 (from Features) -->
      <div class="bg-surface-container-lowest border border-surface-variant rounded-xl p-lg flex flex-col gap-md card-hover transition-colors group relative overflow-hidden project-card">
        <div class="absolute -right-8 -top-8 w-32 h-32 bg-secondary-fixed/30 rounded-full blur-2xl group-hover:bg-secondary-fixed/50 transition-colors"></div>
        <div class="w-12 h-12 rounded-lg bg-surface flex items-center justify-center border border-outline-variant relative z-10">
          <span class="material-symbols-outlined text-secondary text-2xl">cloud_sync</span>
        </div>
        <div class="relative z-10">
          <h3 class="font-h3 text-h3 text-on-surface mb-xs text-lg">Ecosistema Google Drive</h3>
          <p class="font-body-sm text-body-sm text-on-surface-variant">Sincronización bidireccional de materiales y recursos directamente desde la nube.</p>
        </div>
      </div>

      <!-- Feature 7 (from Features) -->
      <div class="bg-surface-container-lowest border border-surface-variant rounded-xl p-lg flex flex-col gap-md card-hover transition-colors group relative overflow-hidden project-card">
        <div class="absolute -right-8 -top-8 w-32 h-32 bg-tertiary-fixed/30 rounded-full blur-2xl group-hover:bg-tertiary-fixed/50 transition-colors"></div>
        <div class="w-12 h-12 rounded-lg bg-surface flex items-center justify-center border border-outline-variant relative z-10">
          <span class="material-symbols-outlined text-tertiary-container text-2xl">table_chart</span>
        </div>
        <div class="relative z-10">
          <h3 class="font-h3 text-h3 text-on-surface mb-xs text-lg">Auditoría en Google Sheets</h3>
          <p class="font-body-sm text-body-sm text-on-surface-variant">Automatización de registros administrativos en hojas de cálculo compartidas.</p>
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
      duration: 800
    }
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        tl.add('.project-card', {
          translateY: [40, 0],
          opacity: [0, 1],
          delay: stagger(150)
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.1 });

  const section = document.getElementById('proyecto');
  if (section) {
    const cards = section.querySelectorAll('.project-card');
    cards.forEach(card => {
      (card as HTMLElement).style.opacity = '0';
    });
    observer.observe(section);
  }
});
</script>
