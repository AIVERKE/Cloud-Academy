<template>
  <v-container fluid class="pa-8 bg-slate-50 min-vh-100">
    <!-- Header -->
    <v-row class="mb-8" align="center">
      <v-col cols="12" md="8">
        <div class="d-flex align-center mb-1">
          <v-icon icon="mdi-cloud-sync" color="primary" size="32" class="mr-3"></v-icon>
          <h1 class="text-h3 font-weight-black text-slate-900">Recursos de Drive</h1>
        </div>
        <p class="text-subtitle-1 text-slate-500 ml-11">
          Materiales sincronizados desde el ecosistema Cloud Academy para acceso institucional.
        </p>
      </v-col>
      <v-col cols="12" md="4" class="text-md-right">
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Buscar archivos..."
          variant="solo"
          flat
          hide-details
          rounded="xl"
          class="search-bar elevation-2"
          bg-color="white"
        ></v-text-field>
      </v-col>
    </v-row>

    <!-- Loading State -->
    <v-row v-if="loading" class="fill-height align-center justify-center py-16">
      <v-col cols="12" class="text-center">
        <v-progress-circular indeterminate color="primary" size="64" width="6"></v-progress-circular>
        <div class="mt-4 text-h6 font-weight-bold text-slate-400">Sincronizando con Google Drive...</div>
      </v-col>
    </v-row>

    <!-- Empty State -->
    <v-row v-else-if="filteredResources.length === 0" class="py-16">
      <v-col cols="12" class="text-center">
        <v-avatar size="160" color="slate-100" class="mb-6">
          <v-icon icon="mdi-folder-open-outline" size="80" color="slate-300"></v-icon>
        </v-avatar>
        <h3 class="text-h5 font-weight-black text-slate-700">No se encontraron recursos</h3>
        <p class="text-body-1 text-slate-400">Probá con otros términos de búsqueda o revisá los permisos de Drive.</p>
      </v-col>
    </v-row>

    <!-- Resources Grid -->
    <v-row v-else>
      <v-col v-for="item in filteredResources" :key="item.id" cols="12" sm="6" md="4" lg="3">
        <v-card class="resource-card border-0 overflow-hidden h-100" rounded="xl" elevation="1">
          <!-- File Type Background Header -->
          <div class="file-header" :class="getFileTypeColorClass(item.mimeType)">
            <v-icon :icon="getFileIcon(item.mimeType)" size="56" color="white" class="icon-glow"></v-icon>
            <div class="header-overlay"></div>
          </div>
          
          <v-card-text class="pa-6">
            <div class="d-flex align-center justify-space-between mb-2">
              <v-chip size="x-small" class="font-weight-black px-3" :color="getFileTypeColor(item.mimeType)" variant="flat" rounded="lg">
                {{ getFileTypeName(item.mimeType) }}
              </v-chip>
              <v-icon icon="mdi-dots-vertical" size="18" color="slate-300"></v-icon>
            </div>
            
            <h3 class="text-h6 font-weight-black text-slate-900 mb-4 line-clamp-2" :title="item.name">
              {{ item.name }}
            </h3>

            <div class="d-flex align-center text-caption text-slate-500 mb-6 font-weight-medium">
              <v-avatar size="20" class="mr-2 opacity-80">
                <v-img src="https://www.gstatic.com/images/branding/product/2x/drive_2020q4_48dp.png"></v-img>
              </v-avatar>
              Google Cloud Asset
            </div>

            <v-btn
              block
              color="primary"
              variant="flat"
              rounded="lg"
              :href="item.webViewLink"
              target="_blank"
              prepend-icon="mdi-eye-outline"
              class="text-none font-weight-bold py-6"
              elevation="0"
            >
              Visualizar
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
  if (mimeType.includes('image')) return 'mdi-file-image';
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return 'mdi-file-table';
  if (mimeType.includes('document') || mimeType.includes('word')) return 'mdi-file-word';
  if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return 'mdi-file-presentation-box';
  if (mimeType.includes('folder')) return 'mdi-folder';
  if (mimeType.includes('video')) return 'mdi-video';
  return 'mdi-file';
};

const getFileTypeName = (mimeType: string) => {
  if (mimeType.includes('pdf')) return 'PDF Document';
  if (mimeType.includes('image')) return 'Imagen';
  if (mimeType.includes('spreadsheet')) return 'Hoja de Cálculo';
  if (mimeType.includes('document')) return 'Documento';
  if (mimeType.includes('presentation')) return 'Diapositivas';
  if (mimeType.includes('folder')) return 'Carpeta';
  if (mimeType.includes('video')) return 'Video';
  return 'Archivo';
};

const getFileTypeColor = (mimeType: string) => {
  if (mimeType.includes('folder')) return 'amber-darken-2';
  if (mimeType.includes('pdf') || mimeType.includes('document')) return 'primary';
  if (mimeType.includes('image')) return 'indigo';
  return 'slate-600';
};

const getFileTypeColorClass = (mimeType: string) => {
  if (mimeType.includes('pdf')) return 'bg-slate-900';
  if (mimeType.includes('image')) return 'bg-primary-gradient';
  if (mimeType.includes('spreadsheet')) return 'bg-slate-800';
  if (mimeType.includes('document')) return 'bg-slate-700';
  if (mimeType.includes('folder')) return 'bg-amber-gradient';
  return 'bg-default';
};

onMounted(() => {
  fetchResources();
});
</script>

<style scoped>
.bg-slate-50 { background-color: #f8fafc; }
.text-slate-900 { color: #0f172a; }
.text-slate-800 { color: #1e293b; }
.text-slate-700 { color: #334155; }
.text-slate-500 { color: #64748b; }
.text-slate-400 { color: #94a3b8; }
.text-slate-300 { color: #cbd5e1; }
.bg-slate-100 { background-color: #f1f5f9; }
.bg-slate-900 { background-color: #0f172a !important; }

.min-vh-100 { min-height: 100vh; }

.search-bar {
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
}

.search-bar:focus-within {
  border-color: #3b82f6;
  box-shadow: 0 4px 20px -5px rgba(59, 130, 246, 0.2) !important;
}

.resource-card {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 1px solid rgba(0, 0, 0, 0.05) !important;
  background: white;
}

.resource-card:hover {
  transform: translateY(-12px);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1) !important;
}

.file-header {
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.icon-glow {
  filter: drop-shadow(0 0 10px rgba(255,255,255,0.3));
  z-index: 2;
}

.header-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0) 80%);
  z-index: 1;
}

.bg-slate-900 { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); }
.bg-slate-800 { background: linear-gradient(135deg, #1e293b 0%, #334155 100%); }
.bg-slate-700 { background: linear-gradient(135deg, #334155 0%, #475569 100%); }
.bg-primary-gradient { background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); }
.bg-amber-gradient { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); }
.bg-default { background: linear-gradient(135deg, #94a3b8, #475569); }

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tracking-widest {
  letter-spacing: 1.5px !important;
}
</style>
