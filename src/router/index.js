import Login from '@/views/pages/authentication/Login.vue';
import ResetPassword from '@/views/pages/authentication/ResetPassword.vue';
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
      alias: '/',
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: ResetPassword,
    }
  ],
})

export default router;
