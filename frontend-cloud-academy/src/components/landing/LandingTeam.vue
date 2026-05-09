<template>
  <section id="equipo" class="max-w-container-max mx-auto px-gutter mb-xl py-16">
    <div class="flex flex-col gap-sm mb-xl text-center items-center">
      <h2 class="font-h2 text-h2 text-on-background">Equipo</h2>
      <p class="font-body-lg text-body-lg text-on-surface-variant max-w-4xl">
        Nuestro equipo está compuesto por cinco estudiantes de la carrera de informática de la Universidad Mayor de San Andrés (UMSA):
      </p>
    </div>

    <div class="flex flex-wrap justify-center gap-lg team-grid">
      <div v-for="(member, index) in team" :key="index" class="bg-surface border border-surface-variant rounded-2xl p-lg flex flex-col items-center text-center w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] card-hover team-card relative overflow-hidden group">
        <div class="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div class="w-20 h-20 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-h2 text-2xl mb-md shadow-md border-2 border-surface relative z-10">
          {{ getInitials(member.name) }}
        </div>
        <h3 class="font-h3 text-h3 text-on-surface text-lg mb-xs relative z-10">{{ member.name }}</h3>
        <p class="font-body-sm text-body-sm text-secondary relative z-10 font-medium mb-xs">{{ member.role }}</p>
      </div>
    </div>

    <div class="mt-xl text-center max-w-3xl mx-auto team-footer">
      <p class="font-body-md text-body-md text-on-surface-variant italic">
        "Estamos comprometidos con la innovación y la mejora continua en el ámbito educativo, y creemos firmemente que G-Academic Suite puede marcar una diferencia significativa en nuestra institución. "
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { createTimeline, stagger } from 'animejs';

const team = [
  {
    name: 'Diego Andrés Gutiérrez Flores',
    role: 'Desarrollo de software y gestión de proyectos.'
  },
  {
    name: 'Alejandro Leonardo Morales Torrez',
    role: 'Bases de datos y seguridad informática.'
  },
  {
    name: 'Joel Andrés Flores Santalla',
    role: 'Diseñador de interfaces y experiencia de usuario.'
  },
  {
    name: 'Oscar Hugo Mendoza Vargas',
    role: 'Analista de sistemas'
  },
  {
    name: 'Isrrael Ricardo Sirpa Durán',
    role: 'Desarrollador Web'
  }
];

const getInitials = (name: string) => {
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return parts[0][0] + parts[1][0];
  }
  return parts[0][0];
};

onMounted(() => {
  const tl = createTimeline({
    defaults: {
      ease: 'outBack',
      duration: 800
    }
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        tl.add('.team-card', {
          scale: [0.8, 1],
          opacity: [0, 1],
          delay: stagger(150)
        })
        .add('.team-footer', {
          translateY: [20, 0],
          opacity: [0, 1],
          ease: 'outExpo'
        }, '-=400');
        observer.disconnect();
      }
    });
  }, { threshold: 0.1 });

  const section = document.getElementById('equipo');
  if (section) {
    const cards = section.querySelectorAll('.team-card, .team-footer');
    cards.forEach(card => {
      (card as HTMLElement).style.opacity = '0';
    });
    observer.observe(section);
  }
});
</script>
