<template>
  <v-card rounded="xl" elevation="0" class="border bg-white h-100">
    <v-card-title class="pa-6 text-h5 font-weight-bold text-slate-900">
      {{ title }}
    </v-card-title>
    <v-card-text class="pa-6 pt-0">
      <v-hover v-for="(action, index) in actions" :key="index" v-slot="{ isHovering, props }">
        <v-btn
          v-bind="props"
          block
          :color="action.color"
          variant="tonal"
          rounded="xl"
          size="x-large"
          class="mb-4 d-flex justify-start text-none action-btn"
          :class="{'elevation-4': isHovering}"
          :to="action.to"
          :loading="loadingAction === action.title"
          @click="handleClick(action)"
        >
          <template v-slot:prepend>
            <v-icon :icon="action.icon" class="mr-4 transition-transform" size="28" :class="{'scale-icon': isHovering}"></v-icon>
          </template>
          <div class="text-left action-text-container">
            <div class="font-weight-bold title-text">{{ action.title }}</div>
            <div class="text-caption opacity-70 desc-text">{{ action.desc }}</div>
          </div>
        </v-btn>
      </v-hover>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
defineProps<{
  title?: string;
  actions: Array<{
    title: string;
    desc: string;
    icon: string;
    color: string;
    to?: string;
    handler?: () => void;
  }>;
  loadingAction?: string;
}>();

const emit = defineEmits(['action-clicked']);

const handleClick = (action: any) => {
  if (action.handler) {
    emit('action-clicked', action.title);
    action.handler();
  }
};
</script>

<style scoped>
.text-slate-900 { color: #0f172a; }

.action-btn {
  transition: all 0.3s ease;
  min-height: 80px !important;
  height: auto !important;
  padding: 16px !important;
}

.action-text-container {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: calc(100% - 40px); /* Leave room for icon */
}

.title-text {
  white-space: normal;
  line-height: 1.2;
  margin-bottom: 4px;
}

.desc-text {
  white-space: normal;
  line-height: 1.2;
}

.scale-icon {
  transform: scale(1.15);
}
</style>
