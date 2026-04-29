<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">Recursos de Drive</h1>
        <p class="text-subtitle-1 mb-6">
          Listado de materiales sincronizados desde la nube.
        </p>
      </v-col>
    </v-row>

    <v-row v-if="loading">
      <v-col cols="12" class="text-center">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </v-col>
    </v-row>

    <v-row v-else-if="resources.length === 0">
      <v-col cols="12">
        <v-alert type="info" variant="tonal">
          No hay recursos disponibles en este momento.
        </v-alert>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col v-for="item in resources" :key="item.id" cols="12" sm="6" md="4">
        <v-card class="mx-auto" elevation="2">
          <v-list-item class="pa-4">
            <template v-slot:prepend>
              <v-avatar color="blue-lighten-4">
                <v-icon color="blue-darken-2" :icon="getFileIcon(item.mimeType)"></v-icon>
              </v-avatar>
            </template>
            <v-list-item-title class="text-h6">{{ item.name }}</v-list-item-title>
            <v-list-item-subtitle>{{ item.mimeType }}</v-list-item-subtitle>
          </v-list-item>

          <v-divider></v-divider>

          <v-card-actions>
            <v-btn
              color="primary"
              variant="text"
              :href="item.webViewLink"
              target="_blank"
              prepend-icon="mdi-open-in-new"
            >
              Ver en Drive
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

interface Resource {
  id: string;
  name: string;
  googleDriveId: string;
  webViewLink: string;
  mimeType: string;
}

const resources = ref<Resource[]>([]);
const loading = ref(true);

const fetchResources = async () => {
  try {
    const response = await axios.get('http://localhost:3000/recursos');
    resources.value = response.data;
  } catch (error) {
    console.error('Error fetching resources:', error);
  } finally {
    loading.value = false;
  }
};

const getFileIcon = (mimeType: string) => {
  if (mimeType.includes('pdf')) return 'mdi-file-pdf-box';
  if (mimeType.includes('image')) return 'mdi-file-image';
  if (mimeType.includes('spreadsheet')) return 'mdi-file-excel';
  if (mimeType.includes('document')) return 'mdi-file-document';
  if (mimeType.includes('folder')) return 'mdi-folder';
  return 'mdi-file';
};

onMounted(() => {
  fetchResources();
});
</script>
