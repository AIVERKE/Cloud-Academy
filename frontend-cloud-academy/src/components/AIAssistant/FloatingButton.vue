<template>
  <v-btn
    class="floating-chat-btn"
    color="primary"
    icon
    size="x-large"
    elevation="8"
    @click="toggleChat"
    v-show="!state.isOpen"
  >
    <v-icon size="32">mdi-robot-outline</v-icon>
  </v-btn>
</template>

<script setup lang="ts">
import { useAIChat } from '../../composables/useAIChat';

const { state, toggleChat } = useAIChat();
</script>

<style scoped>
.floating-chat-btn {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 999;
  transition: transform 0.2s;
}

.floating-chat-btn:hover {
  transform: scale(1.05);
}
</style>
