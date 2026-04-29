<template>
  <v-container fluid>
    <v-row class="mb-4">
      <v-col>
        <h1 class="text-h4 font-weight-bold">Control de Infraestructura</h1>
        <p class="text-subtitle-1 text-on-surface-variant">Gestión de recursos cloud y bases de datos federadas</p>
      </v-col>
    </v-row>

    <v-row>
      <!-- Drive Sync Section -->
      <v-col cols="12" md="6">
        <v-card rounded="xl" class="elevation-2 border h-100">
          <v-card-title class="pa-6 d-flex align-center">
            <v-icon icon="mdi-google-drive" color="green" class="mr-3"></v-icon>
            Google Drive Assets
          </v-card-title>
          <v-card-text class="px-6 pb-6">
            <p class="mb-6 opacity-70">
              Sincroniza manualmente los archivos del repositorio central con la base de datos local (PostgreSQL).
            </p>
            
            <v-alert
              v-if="syncStatus"
              :type="syncStatus.type"
              variant="tonal"
              class="mb-4 rounded-lg"
              closable
            >
              {{ syncStatus.message }}
            </v-alert>

            <v-btn
              block
              size="x-large"
              color="primary"
              variant="elevated"
              prepend-icon="mdi-sync"
              :loading="syncing"
              @click="handleSync"
              class="rounded-xl font-weight-bold"
            >
              Sincronizar Recursos
            </v-btn>

            <div class="mt-6 pt-6 border-t d-flex justify-space-between align-center">
              <span class="text-caption font-weight-bold uppercase opacity-40">Última sincronización</span>
              <span class="text-caption font-mono">{{ lastSync || 'Nunca' }}</span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Google Sheets Config Section -->
      <v-col cols="12" md="6">
        <v-card rounded="xl" class="elevation-2 border h-100">
          <v-card-title class="pa-6 d-flex align-center">
            <v-icon icon="mdi-google-spreadsheet" color="green-darken-2" class="mr-3"></v-icon>
            Google Sheets Bridge
          </v-card-title>
          <v-card-text class="px-6 pb-6">
            <v-text-field
              v-model="sheetId"
              label="Spreadsheet ID"
              variant="outlined"
              hint="ID de la hoja donde se registran los eventos del sistema"
              persistent-hint
              class="mb-6"
            >
              <template v-slot:append-inner>
                <v-btn icon="mdi-link-variant" variant="text" size="small" @click="openSheet"></v-btn>
              </template>
            </v-text-field>

            <div class="d-flex flex-column gap-2">
              <div class="d-flex gap-4">
                <v-btn
                  variant="tonal"
                  color="secondary"
                  prepend-icon="mdi-table-edit"
                  @click="handleFetchSheet"
                  class="flex-grow-1"
                >
                  Explorar Sheet
                </v-btn>
                <v-btn
                  variant="flat"
                  color="success"
                  prepend-icon="mdi-check-circle"
                  @click="saveConfig"
                >
                  Guardar
                </v-btn>
              </div>
              <v-btn
                block
                color="info"
                variant="outlined"
                prepend-icon="mdi-export"
                @click="handleExportLogs"
                class="rounded-xl font-weight-bold"
                :loading="exporting"
              >
                Exportar Datos (Logs)
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Sheets Data Explorer (Full width below) -->
    <v-row v-if="showEditor" class="mt-6">
      <v-col cols="12">
        <v-card rounded="xl" class="elevation-2 border">
          <v-card-title class="pa-6 d-flex align-center bg-grey-lighten-4">
            <span class="font-weight-bold">Explorador de Google Sheet (Registro de Auditoría)</span>
            <v-spacer></v-spacer>
            <v-btn icon="mdi-close" variant="text" size="small" @click="showEditor = false"></v-btn>
          </v-card-title>
          <v-card-text class="pa-0">
            <div class="pa-6 d-flex justify-center" v-if="loadingSheet">
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </div>
            <v-data-table
              v-else
              :headers="sheetHeaders"
              :items="sheetRows"
              hover
            >
              <template v-slot:item.role="{ item }">
                <v-chip size="x-small">{{ item.role }}</v-chip>
              </template>
              <template v-slot:item.timestamp="{ item }">
                <span class="text-caption">{{ new Date(item.timestamp).toLocaleString() }}</span>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useDataStore } from '../../store/data';

const dataStore = useDataStore();
const syncing = ref(false);
const syncStatus = ref<{ type: 'success' | 'error', message: string } | null>(null);
const lastSync = ref('');
const sheetId = ref('1A2B3C4D5E6F7G8H9I0J_K_L_M_N_O_P');
const showEditor = ref(false);
const loadingSheet = ref(false);
const exporting = ref(false);

const loadLastSync = async () => {
  const timestamp = await dataStore.fetchLastSyncTime();
  if (timestamp) {
    lastSync.value = new Date(timestamp).toLocaleString();
  }
};

onMounted(() => {
  loadLastSync();
});

const sheetHeaders: any = [
  { title: 'Dato A', key: '0' },
  { title: 'Dato B', key: '1' },
  { title: 'Dato C', key: '2' },
  { title: 'Dato D', key: '3' },
];

const sheetRows = ref<any[]>([]);

const handleSync = async () => {
  syncing.value = true;
  syncStatus.value = null;
  
  try {
    const result = await dataStore.syncDriveResources();
    syncStatus.value = {
      type: 'success',
      message: `Sincronización completada: ${result.creados + result.actualizados} recursos procesados correctamente.`
    };
    await loadLastSync();
  } catch (error) {
    syncStatus.value = { type: 'error', message: 'Error en la sincronización con Google Drive.' };
  } finally {
    syncing.value = false;
  }
};

const handleFetchSheet = async () => {
  loadingSheet.value = true;
  showEditor.value = true;
  try {
    const data = await dataStore.fetchSheetData(sheetId.value);
    // data es string[][], lo convertimos a objetos para el data-table
    sheetRows.value = data.map((row: any) => {
      const obj: any = {};
      row.forEach((cell: any, index: number) => {
        obj[index.toString()] = cell;
      });
      return obj;
    });
  } catch (error) {
    console.error(error);
  } finally {
    loadingSheet.value = false;
  }
};

const handleExportLogs = async () => {
  exporting.value = true;
  try {
    await dataStore.exportLogsToSheet(sheetId.value);
    alert('Logs exportados exitosamente a Google Sheets.');
  } catch (error) {
    alert('Error al exportar logs. Verifica el Spreadsheet ID.');
  } finally {
    exporting.value = false;
  }
};

const saveConfig = () => {
  alert('Configuración guardada correctamente.');
};

const openSheet = () => {
  window.open(`https://docs.google.com/spreadsheets/d/${sheetId.value}`, '_blank');
};
</script>

<style scoped>
.h-100 {
  height: 100%;
}
</style>
