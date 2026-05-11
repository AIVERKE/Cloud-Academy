<template>
  <div class="ai-assistant-container">
    <FloatingButton />
    <ChatWindow />
  </div>
</template>

<script setup lang="ts">
import FloatingButton from './FloatingButton.vue';
import ChatWindow from './ChatWindow.vue';
</script>

<style scoped>
.ai-assistant-container {
  position: relative;
  z-index: 9999;
}
</style>
