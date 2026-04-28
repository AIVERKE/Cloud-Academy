<template>
  <v-container fluid>
    <v-row class="mb-4">
      <v-col>
        <h1 class="text-h4">Panel de Auditoría (ISO 27001)</h1>
      </v-col>
    </v-row>

    <!-- Filters -->
    <v-card class="mb-6 elevation-2">
      <v-card-text>
        <v-row align="center">
          <v-col cols="12" md="4">
            <v-text-field
              v-model="searchDate"
              label="Filtrar por Fecha (YYYY-MM-DD)"
              prepend-inner-icon="mdi-calendar"
              variant="outlined"
              density="compact"
              hide-details
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="searchAction"
              :items="actionTypes"
              label="Tipo de Acción"
              prepend-inner-icon="mdi-filter"
              variant="outlined"
              density="compact"
              hide-details
              clearable
            ></v-select>
          </v-col>
          <v-col cols="12" md="4" class="text-right">
             <v-btn color="secondary" variant="tonal" prepend-icon="mdi-refresh" @click="loadData">
               Recargar Logs
             </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Data Table -->
    <v-card class="elevation-2">
      <v-data-table
        :headers="headers"
        :items="filteredLogs"
        :loading="loading"
        hover
      >
        <template v-slot:loading>
          <v-skeleton-loader type="table-row@5"></v-skeleton-loader>
        </template>

        <template v-slot:item.fechaHora="{ item }">
          <span class="text-caption font-weight-medium">
            {{ new Date(item.fechaHora).toLocaleString() }}
          </span>
        </template>

        <template v-slot:item.accion="{ item }">
          <v-chip size="small" :color="getActionColor(item.accion)" variant="tonal">
            {{ item.accion }}
          </v-chip>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn
            color="primary"
            variant="text"
            size="small"
            prepend-icon="mdi-code-json"
            @click="viewDetails(item)"
          >
            Ver Detalle
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Detail Dialog -->
    <v-dialog v-model="dialog" max-width="600">
      <v-card>
        <v-card-title class="bg-primary text-white">Detalle de Auditoría</v-card-title>
        <v-card-text class="pa-4 bg-grey-lighten-4">
          <pre class="bg-grey-darken-3 text-green-accent-2 pa-4 rounded text-caption overflow-x-auto"><code>{{ formattedDetail }}</code></pre>
        </v-card-text>
        <v-card-actions class="bg-grey-lighten-4">
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="dialog = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useDataStore, type AuditLog } from '../../store/data';

const dataStore = useDataStore();
const logs = ref<AuditLog[]>([]);
const loading = ref(true);

const searchDate = ref('');
const searchAction = ref('');

const dialog = ref(false);
const selectedDetail = ref<any>(null);

const headers: any = [
  { title: 'Fecha/Hora', key: 'fechaHora' },
  { title: 'Usuario ID', key: 'usuarioId' },
  { title: 'Acción', key: 'accion' },
  { title: '', key: 'actions', sortable: false, align: 'end' },
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
    logs.value = await dataStore.fetchAuditLogs();
  } catch (error) {
    console.error('Error fetching audit logs', error);
  } finally {
    loading.value = false;
  }
};

const filteredLogs = computed(() => {
  let result = logs.value;
  if (searchDate.value) {
    result = result.filter(log => log.fechaHora.startsWith(searchDate.value));
  }
  if (searchAction.value) {
    result = result.filter(log => log.accion === searchAction.value);
  }
  // Sort descending by date
  return result.sort((a, b) => new Date(b.fechaHora).getTime() - new Date(a.fechaHora).getTime());
});

const getActionColor = (action: string) => {
  if (action.includes('CREATE')) return 'success';
  if (action.includes('UPDATE') || action.includes('SUBMIT')) return 'info';
  if (action.includes('DELETE') || action.includes('ERROR')) return 'error';
  return 'secondary';
};

const viewDetails = (item: AuditLog) => {
  selectedDetail.value = item.detalle;
  dialog.value = true;
};

const formattedDetail = computed(() => {
  if (!selectedDetail.value) return '{}';
  return JSON.stringify(selectedDetail.value, null, 2);
});
</script>
