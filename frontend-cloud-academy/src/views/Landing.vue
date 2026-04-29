<template>
  <div class="min-h-screen flex flex-col bg-background text-on-background">
    <LandingNavbar />
    
    <main class="flex-grow">
      <LandingHero />
      <LandingFeatures />
      <LandingVision />
    </main>

    <LandingFooter />
  </div>
</template>

<script setup lang="ts">
import LandingNavbar from '../components/landing/LandingNavbar.vue';
import LandingHero from '../components/landing/LandingHero.vue';
import LandingFeatures from '../components/landing/LandingFeatures.vue';
import LandingVision from '../components/landing/LandingVision.vue';
import LandingFooter from '../components/landing/LandingFooter.vue';
</script>

<style>
/* Any global landing styles can go here if index.css is not enough */
</style>
