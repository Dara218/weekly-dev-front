import { useAuthStore } from '@/stores/useAuthStore';
import { createRouter, createWebHistory } from 'vue-router'
import { USER_ROLE } from '@/constants/userRole';
import Login from '@/views/pages/authentication/Login.vue';
import AdminDashboard from '@/views/pages/admin/AdminDashboard.vue';
import ResetPassword from '@/views/pages/authentication/ResetPassword.vue';
import ParentDashboard from '@/views/pages/parent/ParentDashboard.vue';
import StudentDashboard from '@/views/pages/student/StudentDashboard.vue';
import TeacherDashboard from '@/views/pages/teacher/TeacherDashboard.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
      alias: '/',
      meta: { requiresGuest: true },
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: ResetPassword,
      meta: { requiresGuest: true },
    },
    // Students routes
    {
      path: '/student/dashboard',
      name: 'user-dashboard',
      component: StudentDashboard,
      meta: {
        requiresAuth: true,
        role: USER_ROLE.STUDENT,
      },
    },
    // Admin routes
    {
      path: '/admin/dashboard',
      name: 'admin-dashboard',
      component: AdminDashboard,
      meta: {
        requiresAuth: true,
        role: USER_ROLE.ADMIN,
      },
    },
    // Teacher routes
    {
      path: '/teacher/dashboard',
      name: 'teacher-dashboard',
      component: TeacherDashboard,
      meta: {
        requiresAuth: true,
        role: USER_ROLE.TEACHER,
      },
    },
    // Parent routes
    {
      path: '/parent/dashboard',
      name: 'parent-dashboard',
      component: ParentDashboard,
      meta: {
        requiresAuth: true,
        role: USER_ROLE.PARENT,
      },
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();
  const userRole = auth.user?.role;

  // If unauthenticated user access authenticated routes
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return next({
      path: '/login',
      query: { redirect: to.fullPath },
    });
  }

  // If authenticated user access other role page
  if (to.meta.requiresAuth && auth.isAuthenticated) {
    if (userRole !== to.meta.role) {
      if (auth.isStudent) next({ path: '/student/dashboard'});
      if (auth.isAdmin) next({ path: '/admin/dashboard'});
      if (auth.isTeacher) next({ path: '/teacher/dashboard'});
      if (auth.isParent) next({ path: '/parent/dashboard'});

      return next('/login');
    }
  }

  // If authenticated students access guest routes
  if (to.meta.requiresGuest && auth.isAuthenticated && auth.isStudent) {
    return next({ path: '/student/dashboard'});
  }

  // If authenticated admins access guest routes
  if (to.meta.requiresGuest && auth.isAuthenticated && auth.isAdmin) {
    return next({ path: '/admin/dashboard'});
  }

  // If authenticated teachers access guest routes
  if (to.meta.requiresGuest && auth.isAuthenticated && auth.isTeacher) {
    return next({ path: '/teacher/dashboard'});
  }

  // If authenticated parents access guest routes
  if (to.meta.requiresGuest && auth.isAuthenticated && auth.isParent) {
    return next({ path: '/parent/dashboard'});
  }

  // If no redirect needed, continue
  next();
});

export default router;
