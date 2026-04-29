<template>
  <v-container fluid class="pa-8">
    <!-- Header Section -->
    <v-row class="mb-6 align-center">
      <v-col>
        <div class="d-flex align-center mb-1">
          <v-icon icon="mdi-shield-check" color="primary" size="32" class="mr-3"></v-icon>
          <h1 class="text-h4 font-weight-black text-slate-900">Bitácora de Auditoría</h1>
        </div>
        <p class="text-body-1 text-slate-500 ml-11">Cumplimiento ISO 27001 - Monitoreo en tiempo real y respaldo en Google Sheets.</p>
      </v-col>
      <v-col cols="auto">
        <v-btn 
          color="success" 
          variant="elevated" 
          prepend-icon="mdi-google-spreadsheet" 
          class="mr-3 text-none font-weight-bold"
          rounded="lg"
          @click="openGoogleSheets"
        >
          Ver en Google Sheets
        </v-btn>
        <v-btn 
          color="primary" 
          variant="tonal" 
          prepend-icon="mdi-refresh" 
          rounded="lg"
          @click="loadData"
          :loading="loading"
        >
          Recargar
        </v-btn>
      </v-col>
    </v-row>

    <!-- Stats Row -->
    <v-row class="mb-6">
      <v-col cols="12" md="3" v-for="stat in auditStats" :key="stat.label">
        <v-card border flat rounded="xl" :class="['pa-6', stat.bgClass]">
          <div :class="['text-overline font-weight-black mb-1', stat.textClass]">{{ stat.label }}</div>
          <div :class="['text-h4 font-weight-black', stat.textClass]">{{ stat.value }}</div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Filters -->
    <v-card border flat rounded="xl" class="mb-8 pa-2">
      <v-card-text>
        <v-row align="center">
          <v-col cols="12" md="5">
            <v-text-field
              v-model="searchDate"
              label="Filtrar por Fecha (YYYY-MM-DD)"
              prepend-inner-icon="mdi-calendar-search"
              variant="filled"
              density="comfortable"
              hide-details
              rounded="lg"
              clearable
              class="custom-field"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="5">
            <v-select
              v-model="searchAction"
              :items="actionTypes"
              label="Filtrar por Tipo de Acción"
              prepend-inner-icon="mdi-format-list-bulleted-type"
              variant="filled"
              density="comfortable"
              hide-details
              rounded="lg"
              clearable
              class="custom-field"
            ></v-select>
          </v-col>
          <v-col cols="12" md="2">
             <div class="text-center">
               <v-chip size="x-small" color="success" class="font-weight-black" variant="elevated">
                 SYNC: ACTIVE
               </v-chip>
             </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Data Table -->
    <v-card border flat rounded="xl" class="overflow-hidden">
      <v-data-table
        :headers="headers"
        :items="filteredLogs"
        :loading="loading"
        class="audit-table"
        hover
      >
        <template v-slot:loading>
          <v-skeleton-loader type="table-row@5"></v-skeleton-loader>
        </template>

        <template v-slot:item.fechaHora="{ item }">
          <div class="d-flex flex-column">
            <span class="text-body-2 font-weight-bold text-slate-800">
              {{ new Date(item.fechaHora).toLocaleDateString('es-BO') }}
            </span>
            <span class="text-caption text-slate-500 mt-n1">
              {{ new Date(item.fechaHora).toLocaleTimeString('es-BO') }}
            </span>
          </div>
        </template>

        <template v-slot:item.usuarioId="{ item }">
          <v-chip variant="flat" size="small" class="font-weight-bold px-3 bg-slate-100 text-slate-700">
            <v-icon start icon="mdi-account-circle-outline" size="14"></v-icon>
            {{ item.usuarioId || 'SISTEMA' }}
          </v-chip>
        </template>

        <template v-slot:item.accion="{ item }">
          <v-chip 
            size="small" 
            :color="getActionColor(item.accion)" 
            variant="flat"
            class="font-weight-black"
          >
            {{ item.accion }}
          </v-chip>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn
            color="primary"
            variant="tonal"
            size="small"
            rounded="lg"
            prepend-icon="mdi-magnify"
            class="text-none font-weight-bold"
            @click="viewDetails(item)"
          >
            Detalles
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Detail Dialog -->
    <v-dialog v-model="dialog" max-width="700">
      <v-card rounded="xl" elevation="24">
        <v-card-title class="bg-slate-900 text-white pa-6 d-flex align-center">
          <v-icon icon="mdi-xml" class="mr-3"></v-icon>
          <div>
            <div class="text-h5 font-weight-black">Carga Útil del Evento</div>
            <div class="text-caption opacity-70">Datos técnicos registrados por el interceptor de auditoría</div>
          </div>
        </v-card-title>
        
        <v-card-text class="pa-6 bg-slate-50">
          <div class="code-container rounded-xl">
            <pre class="bg-slate-900 text-blue-lighten-4 pa-6 rounded-xl text-caption overflow-x-auto"><code>{{ formattedDetail }}</code></pre>
          </div>
        </v-card-text>

        <v-card-actions class="pa-6 bg-slate-50">
          <v-spacer></v-spacer>
          <v-btn color="slate-900" variant="text" rounded="lg" class="font-weight-bold" @click="dialog = false">Cerrar</v-btn>
          <v-btn color="primary" variant="elevated" rounded="lg" class="font-weight-bold px-6" @click="copyToClipboard">Copiar JSON</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useDataStore, type AuditLog } from '../../store/data';
import { useAuthStore } from '../../store/auth';

const authStore = useAuthStore();
const dataStore = useDataStore();
const logs = ref<AuditLog[]>([]);
const loading = ref(true);

const searchDate = ref('');
const searchAction = ref('');

const dialog = ref(false);
const selectedDetail = ref<any>(null);

const headers: any = [
  { title: 'Estampa Temporal', key: 'fechaHora' },
  { title: 'Actor del Evento', key: 'usuarioId' },
  { title: 'Acción Ejecutada', key: 'accion' },
  { title: 'Inspección', key: 'actions', sortable: false, align: 'end' },
];

const actionTypes = computed(() => {
  const actions = new Set(logs.value.map(log => log.accion));
  return Array.from(actions);
});

onMounted(async () => {
  await loadData();
});

const loadData = async () => {
  loading.value = true;
  try {
    const userId = authStore.user?.id;
    if (userId) {
      logs.value = await dataStore.fetchAuditLogs(userId);
    } else {
      console.warn('No user ID available for audit logs fetch');
    }
  } catch (error) {
    console.error('Error fetching audit logs', error);
  } finally {
    loading.value = false;
  }
};

const countLogs = (type: string) => {
  return logs.value.filter(l => l.accion.includes(type)).length;
};

const filteredLogs = computed(() => {
  let result = logs.value;
  if (searchDate.value) {
    result = result.filter(log => log.fechaHora.startsWith(searchDate.value));
  }
  if (searchAction.value) {
    result = result.filter(log => log.accion === searchAction.value);
  }
  return result.sort((a, b) => new Date(b.fechaHora).getTime() - new Date(a.fechaHora).getTime());
});

const getActionColor = (action: string) => {
  if (action.includes('CREATE')) return 'success';
  if (action.includes('UPDATE') || action.includes('SUBMIT') || action.includes('ENROLL')) return 'primary';
  if (action.includes('DELETE') || action.includes('ERROR')) return 'error';
  return 'slate-600';
};

const auditStats = computed(() => [
  { label: 'Eventos Totales', value: logs.value.length, bgClass: 'bg-slate-900', textClass: 'text-white' },
  { label: 'Creaciones', value: countLogs('CREATE'), bgClass: 'bg-white', textClass: 'text-success' },
  { label: 'Modificaciones', value: countLogs('UPDATE') + countLogs('SUBMIT') + countLogs('ENROLL'), bgClass: 'bg-white', textClass: 'text-primary' },
  { label: 'Alertas', value: countLogs('DELETE') + countLogs('ERROR'), bgClass: 'bg-white', textClass: 'text-error' },
]);

const viewDetails = (item: AuditLog) => {
  selectedDetail.value = item.detalle;
  dialog.value = true;
};

const formattedDetail = computed(() => {
  if (!selectedDetail.value) return '{}';
  return JSON.stringify(selectedDetail.value, null, 2);
});

const openGoogleSheets = () => {
  const sheetId = '1QK0NPB07KEIGEB3HugQ1T6OAAZReYxCU0dofBG3Iq_o';
  window.open(`https://docs.google.com/spreadsheets/d/${sheetId}/edit`, '_blank');
};

const copyToClipboard = () => {
  navigator.clipboard.writeText(formattedDetail.value);
  // Add a toast notification here if available
};
</script>

<style scoped>
.text-slate-900 { color: #0f172a; }
.text-slate-800 { color: #1e293b; }
.text-slate-700 { color: #334155; }
.text-slate-500 { color: #64748b; }
.bg-slate-50 { background-color: #f8fafc; }
.bg-slate-100 { background-color: #f1f5f9; }
.bg-slate-900 { background-color: #0f172a; }

.audit-table :deep(thead th) {
  background-color: #f8fafc !important;
  color: #64748b !important;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  font-weight: 800 !important;
}

.custom-field :deep(.v-field__input) {
  font-weight: 500;
}

.code-container {
  box-shadow: inset 0 2px 10px rgba(0,0,0,0.5);
}

.ls-1 { letter-spacing: 1px; }
</style>
