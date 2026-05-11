import { reactive } from 'vue';
import axios from 'axios';
import type { ChatState, ChatMessage } from '../types/ai-chat';

const state = reactive<ChatState>({
  messages: [],
  isOpen: false,
  isLoading: false,
  error: null,
});

export function useAIChat() {
  const MAX_MESSAGES = 10;
  
  const toggleChat = () => {
    state.isOpen = !state.isOpen;
    if (state.isOpen && state.messages.length === 0) {
      sendWelcomeMessage();
    }
  };
  
  const sendWelcomeMessage = () => {
    const welcomeMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: '¡Hola! Soy el asistente de Cloud Academy. Estoy aquí para ayudarte con cualquier duda sobre la plataforma, los módulos o sobre la UMSA. ¿En qué te puedo ayudar hoy?',
      timestamp: Date.now(),
    };
    state.messages.push(welcomeMsg);
  };
  
  const sendMessage = async (content: string) => {
    if (!content.trim() || state.isLoading) return;
    
    // Check if we hit the limit (considering user+assistant pairs)
    // 10 messages limit (5 user questions)
    const userMessagesCount = state.messages.filter(m => m.role === 'user').length;
    if (userMessagesCount >= MAX_MESSAGES) {
      state.error = 'Has alcanzado el límite de preguntas en esta sesión.';
      return;
    }
    
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: content.trim(),
      timestamp: Date.now(),
    };
    
    state.messages.push(userMsg);
    state.isLoading = true;
    state.error = null;
    
    try {
      // Backend URL should be mapped correctly or use API base URL
      const response = await axios.post('http://localhost:3000/ai-chat/message', {
        messages: state.messages.map(m => ({
          role: m.role,
          content: m.content
        }))
      });
      
      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response.data.content,
        timestamp: Date.now(),
      };
      
      state.messages.push(assistantMsg);
    } catch (err: any) {
      console.error('Error sending message:', err);
      state.error = 'Error al comunicarse con el asistente. Intenta de nuevo más tarde.';
      
      // Let's create an error message bubble to let user know
      const errorMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Lo siento, tuve un problema al procesar tu solicitud. Por favor intenta de nuevo.',
        timestamp: Date.now(),
      };
      state.messages.push(errorMsg);
    } finally {
      state.isLoading = false;
    }
  };
  
  const resetChat = () => {
    state.messages = [];
    state.error = null;
    sendWelcomeMessage();
  };
  
  return {
    state,
    toggleChat,
    sendMessage,
    resetChat,
  };
}
