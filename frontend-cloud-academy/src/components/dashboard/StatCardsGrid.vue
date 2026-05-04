<template>
  <v-row>
    <v-col v-for="(stat, index) in stats" :key="index" cols="12" sm="6" md="3">
      <v-hover v-slot="{ isHovering, props }">
        <v-card 
          v-bind="props"
          :elevation="isHovering ? 8 : 0"
          class="stat-card border" 
          rounded="xl"
          :class="{'on-hover': isHovering}"
        >
          <v-card-text class="d-flex align-center pa-6">
            <v-avatar :color="stat.color + '-lighten-5'" size="64" rounded="xl" class="mr-4 transition-all" :class="{'avatar-hover': isHovering}">
              <v-icon :icon="stat.icon" :color="stat.color" size="32"></v-icon>
            </v-avatar>
            <div>
              <div class="text-overline mb-0 text-grey-darken-1 font-weight-bold">{{ stat.label }}</div>
              <div class="text-h4 font-weight-black text-slate-900">{{ stat.value }}</div>
            </div>
          </v-card-text>
        </v-card>
      </v-hover>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
defineProps<{
  stats: Array<{
    label: string;
    value: string | number;
    icon: string;
    color: string;
  }>
}>();
</script>

<style scoped>
.stat-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: white;
  border-color: rgba(226, 232, 240, 1) !important;
}

.on-hover {
  transform: translateY(-6px);
  border-color: rgba(var(--v-theme-primary), 0.3) !important;
}

.avatar-hover {
  transform: scale(1.1);
}

.text-slate-900 {
  color: #0f172a;
}
</style>
