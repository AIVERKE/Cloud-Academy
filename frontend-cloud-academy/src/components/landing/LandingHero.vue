<template>
  <section class="max-w-container-max mx-auto px-gutter mb-xl mt-xl pt-24 relative overflow-hidden">
    <!-- Decorative background elements -->
    <div class="absolute top-10 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse-soft"></div>
    <div class="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse-soft" style="animation-delay: 2s"></div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center relative z-10">
      <div class="lg:col-span-7 flex flex-col gap-md hero-text">
        <span class="inline-block px-sm py-xs bg-secondary-fixed/20 text-secondary border border-secondary-fixed rounded-full w-max font-label-caps text-label-caps uppercase animate-fade-in">CLOUD ACADEMY</span>
        <h1 class="font-h1 text-h1 text-on-background leading-tight title-animate">La Evolución del Aprendizaje Cloud</h1>
        <p class="font-body-lg text-body-lg text-on-surface-variant max-w-2xl description-animate">
          Una plataforma integral que conecta la potencia de PostgreSQL con la flexibilidad de Google Cloud Ecosystem, 
          automatizando la gestión académica a través de interoperabilidad inteligente.
        </p>
        <div class="flex flex-wrap gap-4 mt-sm buttons-animate">
          <v-btn color="primary" size="large" to="/login" class="bg-primary text-on-primary px-md py-sm rounded-lg font-body-md text-body-md hover:bg-gradient-to-b hover:from-primary hover:to-secondary transition-all shine-effect">
            Explorar Plataforma
          </v-btn>
          <v-btn variant="outlined" color="secondary" size="large" class="border border-secondary text-secondary px-md py-sm rounded-lg font-body-md text-body-md hover:bg-secondary/10 transition-colors">
            Ver Documentación
          </v-btn>
        </div>
      </div>
      <div class="lg:col-span-5 relative mt-12 lg:mt-0 hero-image-container">
        <div class="absolute inset-0 bg-secondary-fixed-dim/20 blur-3xl rounded-full animate-pulse-soft"></div>
        <img 
          alt="Cloud Data Visualization" 
          class="w-full h-auto rounded-xl border border-surface-variant object-cover shadow-2xl relative z-10 animate-float" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBEWoGj7tBQGfg0GGghydb3DuC2JCg3yHyHw-IHbooYWbqq1LZ1KbafKCZem7ILZVpqFRZWsCxYoa5Es8GRkE_mWB7S00cXHyP95dsWp3dB5W9CMOwTS4CmVE4iavj-0FYp2H34V1Ym2gnJbDZ_b1rGlRmhcHIvHR0xD4AxMv-CuRbAXTgy4CLZYyrIQ_nhFsFaYdOwW6zl8p8N4wgnjbdO3Xrhu80fmIGD1tL7XiLadNszZMqBJI8ZMtTvsGMlbyOmNSfXtj8QlvI"
        />
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
      duration: 1200
    }
  });

  tl.add('.hero-text > *', {
    translateY: [30, 0],
    opacity: [0, 1],
    delay: stagger(200)
  })
  .add('.hero-image-container', {
    scale: [0.9, 1],
    opacity: [0, 1],
    duration: 1500
  }, '-=1000');
});
</script>
