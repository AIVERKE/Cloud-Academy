import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../modules/auth/views/LoginView.vue'),
  },
  {
    path: '/classrooms',
    name: 'Classrooms',
    component: () => import('../modules/classrooms/views/ClassroomListView.vue'),
  },
  // Add more modular routes here
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
