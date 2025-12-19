import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import './assets/styles/style.css'
import { useAuthStore } from './stores/useAuthStore'

const app = createApp(App);

app.use(createPinia());

const auth = useAuthStore();
await auth.getAuthenticatedUser();

app.use(router);

app.mount('#app');
