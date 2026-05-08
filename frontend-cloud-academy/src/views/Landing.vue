<template>
  <div class="min-h-screen flex flex-col bg-background text-on-background">
    <LandingNavbar />
    
    <main class="flex-grow">
      <LandingHero />
      
      <!-- New Sections -->
      <LandingIntro />
      <LandingProblem />
      <LandingSolution />
      <LandingProject />
      <LandingVision />
      <LandingTeam />
    </main>

    <LandingFooter />
  </div>
</template>

<script setup lang="ts">
import LandingNavbar from '../components/landing/LandingNavbar.vue';
import LandingHero from '../components/landing/LandingHero.vue';
import LandingVision from '../components/landing/LandingVision.vue';
import LandingIntro from '../components/landing/LandingIntro.vue';
import LandingProblem from '../components/landing/LandingProblem.vue';
import LandingSolution from '../components/landing/LandingSolution.vue';
import LandingProject from '../components/landing/LandingProject.vue';
import LandingTeam from '../components/landing/LandingTeam.vue';
import LandingFooter from '../components/landing/LandingFooter.vue';
</script>

<style>
/* Any global landing styles can go here if index.css is not enough */
</style>
