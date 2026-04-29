import { defineStore } from 'pinia';
import { ref } from 'vue';
import { SyncStatus, EstadoEntrega } from '../types/enums';

export interface Classroom {
  id: string;
  name: string;
  codigo_acceso: string;
  description?: string;
}

export interface Assignment {
  id: string;
  aulaId: string;
  titulo: string;
  descripcion: string;
  fecha_limite: string; // ISO string
  estado?: EstadoEntrega; // for student view
}

export interface Submission {
  id: string;
  tareaId: string;
  estudianteNombre: string;
  google_drive_url: string;
  fecha_entrega: string; // ISO string
  sync_status: SyncStatus;
  calificacion: number | null;
}

export interface AuditLog {
  id: string;
  fechaHora: string;
  usuarioId: string;
  accion: string;
  detalle: any;
}

export const useDataStore = defineStore('data', () => {
  // Mock Data
  const classrooms = ref<Classroom[]>([
    { id: '1', name: 'Ingeniería de Software', codigo_acceso: 'SOFT123', description: 'Aula de Ingeniería de Software' },
    { id: '2', name: 'Bases de Datos II', codigo_acceso: 'BD2-456', description: 'Aula de Bases de Datos Avanzadas' }
  ]);

  const assignments = ref<Assignment[]>([
    { id: '101', aulaId: '1', titulo: 'Proyecto Final', descripcion: 'Entrega del proyecto final', fecha_limite: new Date(Date.now() + 86400000 * 3).toISOString() },
    { id: '102', aulaId: '1', titulo: 'Práctica 1', descripcion: 'Primera práctica', fecha_limite: new Date(Date.now() - 86400000).toISOString() },
    { id: '201', aulaId: '2', titulo: 'Laboratorio SQL', descripcion: 'Consultas complejas', fecha_limite: new Date(Date.now() + 86400000 * 5).toISOString() }
  ]);

  const submissions = ref<Submission[]>([
    { id: '1001', tareaId: '101', estudianteNombre: 'Juan Perez', google_drive_url: 'https://drive.google.com/file/d/123', fecha_entrega: new Date().toISOString(), sync_status: SyncStatus.Sincronizado, calificacion: 85 },
    { id: '1002', tareaId: '101', estudianteNombre: 'Maria Gomez', google_drive_url: 'https://drive.google.com/file/d/456', fecha_entrega: new Date().toISOString(), sync_status: SyncStatus.Pendiente_Actualizacion, calificacion: null },
    { id: '1003', tareaId: '101', estudianteNombre: 'Carlos Lopez', google_drive_url: 'https://drive.google.com/file/d/789', fecha_entrega: new Date().toISOString(), sync_status: SyncStatus.Error_Sync, calificacion: 0 },
  ]);

  const auditLogs = ref<AuditLog[]>([
    { id: '1', fechaHora: new Date().toISOString(), usuarioId: 'user_123', accion: 'CREATE_CLASSROOM', detalle: { name: 'Ingeniería de Software', code: 'SOFT123' } },
    { id: '2', fechaHora: new Date(Date.now() - 3600000).toISOString(), usuarioId: 'user_456', accion: 'SUBMIT_ASSIGNMENT', detalle: { tareaId: '101', fileUrl: 'https://drive.google.com/file/d/123' } },
  ]);

  // Actions with simulated network delay
  const fetchClassrooms = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return classrooms.value;
  };

  const createClassroom = async (classroom: Omit<Classroom, 'id'>) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newClass = { ...classroom, id: Math.random().toString(36).substr(2, 9) };
    classrooms.value.push(newClass);
    return newClass;
  };

  const fetchAssignments = async (aulaId?: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    let result = assignments.value;
    if (aulaId) {
      result = result.filter(a => a.aulaId === aulaId);
    }
    // Enrich with status for students
    return result.map(a => {
        let estado = EstadoEntrega.Pendiente;
        if (new Date(a.fecha_limite) < new Date()) estado = EstadoEntrega.Atrasado;
        // Mock checking if submitted
        if (submissions.value.find(s => s.tareaId === a.id)) estado = EstadoEntrega.Calificado;
        return { ...a, estado };
    });
  };

  const createAssignment = async (assignment: Omit<Assignment, 'id'>) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newTask = { ...assignment, id: Math.random().toString(36).substr(2, 9) };
    assignments.value.push(newTask);
    return newTask;
  };

  const fetchSubmissions = async (tareaId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return submissions.value.filter(s => s.tareaId === tareaId);
  };

  const updateSubmissionGrade = async (submissionId: string, grade: number) => {
     await new Promise(resolve => setTimeout(resolve, 500));
     const sub = submissions.value.find(s => s.id === submissionId);
     if (sub) {
         sub.calificacion = grade;
         sub.sync_status = SyncStatus.Pendiente_Actualizacion; // Mark as pending sync
     }
  };

  const submitAssignment = async (tareaId: string, url: string, studentName: string) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      submissions.value.push({
          id: Math.random().toString(36).substr(2, 9),
          tareaId,
          estudianteNombre: studentName,
          google_drive_url: url,
          fecha_entrega: new Date().toISOString(),
          sync_status: SyncStatus.Pendiente_Actualizacion,
          calificacion: null
      });
  };

  const fetchAuditLogs = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return auditLogs.value;
  };

  return {
    classrooms, assignments, submissions, auditLogs,
    fetchClassrooms, createClassroom,
    fetchAssignments, createAssignment,
    fetchSubmissions, updateSubmissionGrade, submitAssignment,
    fetchAuditLogs
  };
});