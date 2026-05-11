<template>
  <div
    :class="[
      'd-flex',
      'mb-4',
      message.role === 'user' ? 'justify-end' : 'justify-start'
    ]"
  >
    <!-- Avatar para el asistente -->
    <v-avatar
      v-if="message.role === 'assistant'"
      color="primary"
      size="36"
      class="mr-2 mt-1"
    >
      <v-icon color="white">mdi-robot</v-icon>
    </v-avatar>

    <!-- Burbuja de mensaje -->
    <div
      :class="[
        'message-bubble',
        message.role === 'user' ? 'user-message text-white' : 'assistant-message'
      ]"
    >
      <div class="message-content text-body-1" v-html="formattedContent"></div>
      <div class="message-time text-caption mt-1" :class="message.role === 'user' ? 'text-white-50' : 'text-medium-emphasis'">
        {{ formattedTime }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ChatMessage } from '../../types/ai-chat';

const props = defineProps<{
  message: ChatMessage;
}>();

// Simple parser to handle bold text (asterisks) and line breaks.
// For a full markdown parser we would need marked.js, but this is a lightweight approach.
const formattedContent = computed(() => {
  let content = props.message.content;
  // Handle line breaks
  content = content.replace(/\n/g, '<br/>');
  // Handle bold text **text**
  content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  return content;
});

const formattedTime = computed(() => {
  const date = new Date(props.message.timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
});
</script>

<style scoped>
.message-bubble {
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 16px;
  word-break: break-word;
}

.user-message {
  background-color: #1976d2; /* Primary color */
  border-bottom-right-radius: 4px;
}

.assistant-message {
  background-color: #f5f5f5;
  border-bottom-left-radius: 4px;
  color: #333;
}

.message-time {
  text-align: right;
}
</style>
