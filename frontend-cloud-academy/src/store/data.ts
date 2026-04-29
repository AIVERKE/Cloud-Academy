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
  const fetchClassrooms = async (userId: string) => {
    try {
      const response = await fetch('http://localhost:3000/aulas', {
        headers: { 'user-id': userId }
      });
      if (!response.ok) throw new Error('Error al obtener aulas');
      const data = await response.json();
      // Map backend fields to frontend expected fields
      return data.map((a: any) => ({
        id: a.id,
        name: a.nombre,
        codigo_acceso: a.codigo_acceso,
        description: a.descripcion || ''
      }));
    } catch (error) {
      console.error('Fetch Classrooms Error:', error);
      return [];
    }
  };

  const createClassroom = async (classroom: Omit<Classroom, 'id'>, userId: string) => {
    try {
      const response = await fetch('http://localhost:3000/aulas', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'user-id': userId 
        },
        body: JSON.stringify({
          nombre: classroom.name,
          codigo_acceso: classroom.codigo_acceso,
          descripcion: classroom.description
        })
      });
      if (!response.ok) throw new Error('Error al crear aula');
      return await response.json();
    } catch (error) {
      console.error('Create Classroom Error:', error);
      throw error;
    }
  };

  const fetchAssignments = async (aulaId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/aulas/${aulaId}/tareas`);
      if (!response.ok) throw new Error('Error fetching assignments');
      return await response.json();
    } catch (error) {
      console.error('Fetch Assignments Error:', error);
      return [];
    }
  };

  const createAssignment = async (assignment: { aulaId: string, titulo: string, descripcion: string, fecha_limite: string }) => {
    try {
      const response = await fetch(`http://localhost:3000/aulas/${assignment.aulaId}/tareas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: assignment.titulo,
          descripcion: assignment.descripcion,
          fecha_limite: assignment.fecha_limite
        })
      });
      if (!response.ok) throw new Error('Error creating assignment');
      return await response.json();
    } catch (error) {
      console.error('Create Assignment Error:', error);
      throw error;
    }
  };

  const fetchSubmissions = async (tareaId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/entregas/tarea/${tareaId}`);
      if (!response.ok) throw new Error('Error fetching submissions');
      return await response.json();
    } catch (error) {
      console.error('Fetch Submissions Error:', error);
      return [];
    }
  };

  const fetchStudents = async (aulaId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/aulas/${aulaId}/estudiantes`);
      if (!response.ok) throw new Error('Error fetching students');
      return await response.json();
    } catch (error) {
      console.error('Fetch Students Error:', error);
      return [];
    }
  };

  const updateSubmissionGrade = async (submissionId: string, grade: number, userId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/entregas/${submissionId}/calificar`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'user-id': userId
        },
        body: JSON.stringify({ calificacion: grade })
      });
      if (!response.ok) throw new Error('Error updating grade');
      return await response.json();
    } catch (error) {
      console.error('Update Grade Error:', error);
      throw error;
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

  const syncDriveResources = async () => {
    try {
      const response = await fetch('http://localhost:3000/admin/sync-drive', {
        method: 'POST'
      });
      if (!response.ok) throw new Error('Error al sincronizar');
      return await response.json();
    } catch (error) {
      console.error('Sync Error:', error);
      return { success: false, error: 'No se pudo conectar con el backend' };
    }
  };

  const fetchSheetData = async (sheetId: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Mock data based on the sheetId
    return [
      { id: 'usr_001', name: 'Diego (Admin)', email: 'diego@umsa.bo', role: 'Root', timestamp: new Date().toISOString() },
      { id: 'usr_002', name: 'Jules (Estudiante)', email: 'jules@umsa.bo', role: 'Estudiante', timestamp: new Date().toISOString() },
    ];
  };

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('http://localhost:3000/admin/stats');
      if (!response.ok) throw new Error('Error al obtener estadísticas');
      return await response.json();
    } catch (error) {
      console.error('Dashboard Stats Error:', error);
      return {
        activeUsers: 0,
        driveFiles: 0,
        uptime: '0%',
        pendingAlerts: 0
      };
    }
  };

  const fetchTeacherStats = async (userId: string) => {
    try {
      const response = await fetch('http://localhost:3000/aulas/docente/stats', {
        headers: { 'user-id': userId }
      });
      if (!response.ok) throw new Error('Error al obtener estadísticas de docente');
      return await response.json();
    } catch (error) {
      console.error('Teacher Stats Error:', error);
      return {
        activeClassrooms: 0,
        pendingSubmissions: 0,
        totalResources: 0,
        averageGrade: 0
      };
    }
  };

  return {
    classrooms, assignments, submissions, auditLogs,
    fetchClassrooms, createClassroom,
    fetchAssignments, createAssignment,
    fetchSubmissions, updateSubmissionGrade, submitAssignment,
    fetchAuditLogs, syncDriveResources, fetchSheetData, fetchDashboardStats, fetchTeacherStats
  };
});
