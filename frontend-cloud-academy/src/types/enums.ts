export enum SyncStatus {
  Sincronizado = 'Sincronizado',
  Pendiente_Actualizacion = 'Pendiente_Actualizacion',
  Error_Sync = 'Error_Sync',
}

export enum EstadoEntrega {
  Pendiente = 'Pendiente',
  Calificado = 'Calificado',
  Atrasado = 'Atrasado',
}

export function getSyncStatusColor(status: SyncStatus | string): string {
  switch (status) {
    case SyncStatus.Sincronizado:
      return 'success';
    case SyncStatus.Pendiente_Actualizacion:
      return 'warning';
    case SyncStatus.Error_Sync:
      return 'error';
    default:
      return 'grey';
  }
}

export function getEstadoEntregaColor(status: EstadoEntrega | string): string {
  switch (status) {
    case EstadoEntrega.Pendiente:
      return 'info';
    case EstadoEntrega.Calificado:
      return 'success';
    case EstadoEntrega.Atrasado:
      return 'error';
    default:
      return 'grey';
  }
}
