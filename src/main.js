import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import './assets/styles/style.css'
import './plugins/echo';
import { useAuthStore } from './stores/useAuthStore'
import { useNotificationStore } from './stores/useNotificationStore.js'

const app = createApp(App);

app.use(createPinia());

const auth = useAuthStore();
await auth.getAuthenticatedUser();

/**
 * Fetch unread notification data when the user is already authenticated on app load.
 */
if (auth.isAuthenticated) {
  const notifications = useNotificationStore();
  await notifications.fetchUnreadNotificationCount();
  await notifications.fetchUnreadNotification();
}

app.use(router);

app.mount('#app');
