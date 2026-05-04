<template>
  <v-card rounded="xl" elevation="0" class="border h-100">
    <v-card-title class="pa-6 d-flex align-center flex-wrap">
      <div class="d-flex align-center">
        <v-avatar color="primary-lighten-5" size="40" class="mr-3">
          <v-icon icon="mdi-pulse" color="primary"></v-icon>
        </v-avatar>
        <span class="text-h5 font-weight-bold text-slate-900">{{ title }}</span>
      </div>
      <v-spacer></v-spacer>
      <v-btn variant="text" color="primary" class="font-weight-bold mt-2 mt-sm-0 text-none">Ver todo</v-btn>
    </v-card-title>
    <v-divider></v-divider>
    <v-list class="pa-0">
      <transition-group name="list" tag="div">
        <v-list-item
          v-for="(item, i) in activities"
          :key="i"
          class="pa-6 border-b last:border-0 list-item-hover"
          :class="{ 'bg-slate-50/50': i % 2 === 0 }"
        >
          <template v-slot:prepend>
            <v-avatar :color="item.color" size="44" class="mr-4 elevation-1">
              <v-icon :icon="item.icon" color="white" size="22"></v-icon>
            </v-avatar>
          </template>
          <v-list-item-title class="font-weight-black text-slate-900 text-wrap">{{ item.title }}</v-list-item-title>
          <v-list-item-subtitle class="text-slate-600 mt-1 text-wrap" style="line-height: 1.4;">{{ item.time }} — {{ item.description }}</v-list-item-subtitle>
          <template v-slot:append>
            <v-chip 
              size="small" 
              variant="flat" 
              color="grey-darken-4" 
              class="font-weight-bold uppercase d-none d-sm-flex ml-2"
            >
              {{ item.tag }}
            </v-chip>
          </template>
        </v-list-item>
      </transition-group>
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  activities: Array<{
    title: string;
    description: string;
    time: string;
    icon: string;
    color: string;
    tag: string;
  }>
}>();
</script>

<style scoped>
.text-slate-900 { color: #0f172a; }
.text-slate-600 { color: #475569; }
.bg-slate-50 { background-color: #f8fafc; }
.border-b { border-bottom: 1px solid #e2e8f0; }

.list-item-hover {
  transition: background-color 0.2s ease;
}
.list-item-hover:hover {
  background-color: #f1f5f9 !important;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
