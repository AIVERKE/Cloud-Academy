<template>
  <v-container fluid class="pa-8">
    <!-- Header -->
    <v-row class="mb-8" align="center">
      <v-col cols="12" md="8">
        <h1 class="text-h3 font-weight-black mb-2 gradient-text">Recursos de Drive</h1>
        <p class="text-subtitle-1 text-on-surface-variant opacity-70">
          Materiales sincronizados desde el ecosistema Cloud para acceso institucional.
        </p>
      </v-col>
      <v-col cols="12" md="4" class="text-md-right">
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Buscar archivos..."
          variant="solo-filled"
          flat
          hide-details
          rounded="xl"
          class="elevation-1"
        ></v-text-field>
      </v-col>
    </v-row>

    <!-- Loading State -->
    <v-row v-if="loading" class="fill-height align-center justify-center py-16">
      <v-col cols="12" class="text-center">
        <v-progress-circular indeterminate color="primary" size="64" width="6"></v-progress-circular>
        <div class="mt-4 text-h6 font-weight-bold opacity-60">Consultando la nube...</div>
      </v-col>
    </v-row>

    <!-- Empty State -->
    <v-row v-else-if="filteredResources.length === 0" class="py-16">
      <v-col cols="12" class="text-center">
        <v-icon icon="mdi-folder-open-outline" size="100" color="grey-lighten-2" class="mb-4"></v-icon>
        <h3 class="text-h5 font-weight-bold opacity-60">No se encontraron recursos</h3>
        <p class="text-body-1 opacity-40">Probá con otros términos de búsqueda o sincronizá el Drive.</p>
      </v-col>
    </v-row>

    <!-- Resources Grid -->
    <v-row v-else>
      <v-col v-for="item in filteredResources" :key="item.id" cols="12" sm="6" md="4" lg="3">
        <v-card class="resource-card overflow-hidden h-100" rounded="xl" elevation="1">
          <!-- File Type Background Header -->
          <div class="file-header" :class="getFileTypeColorClass(item.mimeType)">
            <v-icon :icon="getFileIcon(item.mimeType)" size="48" color="white" class="opacity-80"></v-icon>
          </div>
          
          <v-card-text class="pa-5">
            <div class="text-overline mb-1 font-weight-black opacity-60 text-uppercase tracking-widest">
              {{ getFileTypeName(item.mimeType) }}
            </div>
            <h3 class="text-h6 font-weight-black text-truncate mb-2" :title="item.name">
              {{ item.name }}
            </h3>
            <div class="d-flex align-center opacity-60 text-caption mb-4">
              <v-icon icon="mdi-calendar" size="14" class="mr-1"></v-icon>
              Actualizado recientemente
            </div>

            <v-btn
              block
              color="primary"
              variant="flat"
              rounded="lg"
              :href="item.webViewLink"
              target="_blank"
              prepend-icon="mdi-google-drive"
              class="text-none font-weight-bold"
              elevation="0"
            >
              Abrir en Drive
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
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
const search = ref('');

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

const filteredResources = computed(() => {
  if (!search.value) return resources.value;
  const q = search.value.toLowerCase();
  return resources.value.filter(r => 
    r.name.toLowerCase().includes(q) || 
    getFileTypeName(r.mimeType).toLowerCase().includes(q)
  );
});

const getFileIcon = (mimeType: string) => {
  if (mimeType.includes('pdf')) return 'mdi-file-pdf-box';
  if (mimeType.includes('image')) return 'mdi-file-image-outline';
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return 'mdi-file-excel-outline';
  if (mimeType.includes('document') || mimeType.includes('word')) return 'mdi-file-document-outline';
  if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return 'mdi-file-presentation-box';
  if (mimeType.includes('folder')) return 'mdi-folder-google';
  if (mimeType.includes('video')) return 'mdi-video-outline';
  return 'mdi-file-outline';
};

const getFileTypeName = (mimeType: string) => {
  if (mimeType.includes('pdf')) return 'Documento PDF';
  if (mimeType.includes('image')) return 'Imagen / Arte';
  if (mimeType.includes('spreadsheet')) return 'Hoja de Cálculo';
  if (mimeType.includes('document')) return 'Documento de Texto';
  if (mimeType.includes('presentation')) return 'Presentación';
  if (mimeType.includes('folder')) return 'Carpeta';
  if (mimeType.includes('video')) return 'Video / Multimedia';
  return 'Archivo';
};

const getFileTypeColorClass = (mimeType: string) => {
  if (mimeType.includes('pdf')) return 'bg-pdf';
  if (mimeType.includes('image')) return 'bg-image';
  if (mimeType.includes('spreadsheet')) return 'bg-excel';
  if (mimeType.includes('document')) return 'bg-word';
  if (mimeType.includes('folder')) return 'bg-folder';
  return 'bg-default';
};

onMounted(() => {
  fetchResources();
});
</script>

<style scoped>
.gradient-text {
  background: linear-gradient(135deg, #1e293b 0%, #1976d2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.resource-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(0, 0, 0, 0.05) !important;
}

.resource-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px -10px rgba(0,0,0,0.15) !important;
}

.file-header {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

/* Header Backgrounds based on file type */
.bg-pdf { background: linear-gradient(135deg, #ef4444, #b91c1c); }
.bg-image { background: linear-gradient(135deg, #8b5cf6, #6d28d9); }
.bg-excel { background: linear-gradient(135deg, #10b981, #047857); }
.bg-word { background: linear-gradient(135deg, #3b82f6, #1d4ed8); }
.bg-folder { background: linear-gradient(135deg, #f59e0b, #b45309); }
.bg-default { background: linear-gradient(135deg, #64748b, #334155); }

.tracking-widest {
  letter-spacing: 2px !important;
}

.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
