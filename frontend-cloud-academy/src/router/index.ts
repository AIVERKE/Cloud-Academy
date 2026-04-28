import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '../store/auth';

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Home',
        redirect: _to => {
          const authStore = useAuthStore();
          if (authStore.user?.role === 'Docente') return { name: 'TeacherDashboard' };
          if (authStore.user?.role === 'Root') return { name: 'AuditLogs' };
          return { name: 'StudentDashboard' };
        }
      },
      // Docente Routes
      {
        path: 'docente/aulas',
        name: 'TeacherDashboard',
        component: () => import('../views/docente/TeacherDashboard.vue'),
        meta: { role: 'Docente' }
      },
      {
        path: 'docente/aulas/:id',
        name: 'ClassroomDetail',
        component: () => import('../views/docente/ClassroomDetail.vue'),
        meta: { role: 'Docente' }
      },
      {
        path: 'docente/aulas/:aulaId/tareas/:tareaId/entregas',
        name: 'SubmissionsTable',
        component: () => import('../views/docente/SubmissionsTable.vue'),
        meta: { role: 'Docente' }
      },
      // Estudiante Routes
      {
        path: 'estudiante/aulas',
        name: 'StudentDashboard',
        component: () => import('../views/estudiante/StudentDashboard.vue'),
        meta: { role: 'Estudiante' }
      },
      {
        path: 'estudiante/pendientes',
        name: 'AssignmentList',
        component: () => import('../views/estudiante/AssignmentList.vue'),
        meta: { role: 'Estudiante' }
      },
      {
        path: 'estudiante/aulas/:aulaId/tareas/:tareaId/entregar',
        name: 'SubmissionForm',
        component: () => import('../views/estudiante/SubmissionForm.vue'),
        meta: { role: 'Estudiante' }
      },
      // Admin Routes
      {
        path: 'admin/auditoria',
        name: 'AuditLogs',
        component: () => import('../views/admin/AuditLogs.vue'),
        meta: { role: 'Root' }
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login' });
  } else if (to.name === 'Login' && authStore.isAuthenticated) {
    next({ name: 'Home' });
  } else if (to.meta.role && authStore.user?.role !== to.meta.role) {
    // Basic RBAC - redirect home if accessing another role's route
    next({ name: 'Home' });
  } else {
    next();
  }
});

export default router;
