<template>
  <v-card class="chat-window d-flex flex-column" elevation="8" v-show="state.isOpen">
    <!-- Header -->
    <v-toolbar color="primary" dark density="compact">
      <v-avatar size="32" class="ml-2 mr-3">
        <v-icon color="white">mdi-robot-outline</v-icon>
      </v-avatar>
      <v-toolbar-title class="text-subtitle-1 font-weight-bold">Asistente Cloud Academy</v-toolbar-title>
      <v-spacer></v-spacer>
      
      <v-tooltip bottom>
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props" size="small" @click="resetChat" :disabled="state.isLoading">
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </template>
        <span>Reiniciar conversación</span>
      </v-tooltip>

      <v-btn icon size="small" @click="toggleChat">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>

    <!-- Error Alert -->
    <v-alert v-if="state.error" type="error" density="compact" class="mx-2 mt-2 mb-0" closable @click:close="state.error = null">
      {{ state.error }}
    </v-alert>

    <!-- Chat History -->
    <v-card-text class="flex-grow-1 overflow-y-auto chat-history" ref="chatContainer">
      <div v-if="state.messages.length === 0" class="d-flex flex-column align-center justify-center h-100 text-medium-emphasis">
        <v-icon size="64" color="grey-lighten-2" class="mb-4">mdi-forum</v-icon>
        <p>Inicia una conversación con el asistente.</p>
      </div>
      
      <MessageBubble 
        v-for="msg in state.messages" 
        :key="msg.id" 
        :message="msg" 
      />

      <!-- Typing indicator -->
      <div v-if="state.isLoading" class="d-flex justify-start mb-4">
        <v-avatar color="primary" size="36" class="mr-2 mt-1">
          <v-icon color="white">mdi-robot</v-icon>
        </v-avatar>
        <div class="typing-indicator assistant-message">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </div>
      </div>
    </v-card-text>

    <!-- Input Area -->
    <v-divider></v-divider>
    <v-card-actions class="px-3 py-3 input-area">
      <v-text-field
        v-model="newMessage"
        placeholder="Escribe tu mensaje..."
        variant="outlined"
        density="compact"
        hide-details
        @keyup.enter="handleSend"
        :disabled="state.isLoading || isLimitReached"
        class="mr-2"
        bg-color="white"
      ></v-text-field>
      <v-btn
        color="primary"
        icon="mdi-send"
        variant="elevated"
        @click="handleSend"
        :loading="state.isLoading"
        :disabled="!newMessage.trim() || isLimitReached"
      ></v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import MessageBubble from './MessageBubble.vue';
import { useAIChat } from '../../composables/useAIChat';

const { state, toggleChat, sendMessage, resetChat } = useAIChat();

const newMessage = ref('');
const chatContainer = ref<HTMLElement | null>(null);

const MAX_USER_MESSAGES = 10;

const isLimitReached = computed(() => {
  return state.messages.filter(m => m.role === 'user').length >= MAX_USER_MESSAGES;
});

const handleSend = async () => {
  if (!newMessage.value.trim() || state.isLoading || isLimitReached.value) return;
  
  const content = newMessage.value;
  newMessage.value = ''; // clear input early
  
  await sendMessage(content);
};

// Scroll to bottom when messages change
watch(
  () => state.messages.length,
  () => {
    nextTick(() => {
      if (chatContainer.value) {
        chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
      }
    });
  }
);
</script>

<style scoped>
.chat-window {
  position: fixed;
  bottom: 80px;
  right: 24px;
  width: 350px;
  height: 500px;
  max-height: calc(100vh - 100px);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15) !important;
}

/* For mobile responsiveness */
@media (max-width: 600px) {
  .chat-window {
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100vh;
    max-height: 100vh;
    border-radius: 0;
  }
}

.chat-history {
  background-color: #fafafa;
  padding: 16px;
  scroll-behavior: smooth;
}

.input-area {
  background-color: white;
}

.typing-indicator {
  padding: 12px 16px;
  border-radius: 16px;
  border-bottom-left-radius: 4px;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  gap: 4px;
  height: 44px;
}

.dot {
  width: 6px;
  height: 6px;
  background-color: #999;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out both;
}

.dot:nth-child(1) {
  animation-delay: -0.32s;
}

.dot:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes bounce {
  0%, 80%, 100% { 
    transform: scale(0);
  } 40% { 
    transform: scale(1);
  }
}
</style>
