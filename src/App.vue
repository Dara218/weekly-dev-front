<template>
  <!-- Navbar -->
  <div v-if="isAuthenticated">
    <Navbar />
  </div>

  <div :class="isAuthenticated ? 'sm:mt-14 mt-20' : ''">
    <RouterView />
    <Toast v-if="isHasNotification" @close="closeNotification"/>
  </div>
</template>

<script setup>
  /**
   * Root application layout.
   *
   * Renders the navbar for authenticated users, the router view,
   * and a toast for incoming real-time notifications.
   */
  import { watch, ref } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useAuthStore } from './stores/useAuthStore';
  import { initializeNotifications, latestNotification } from './plugins/notification-listener';
  import Navbar from './views/components/Navbar.vue';
  import Toast from './views/components/notification/Toast.vue';

  const auth = useAuthStore();
  const { isAuthenticated } = storeToRefs(auth);
  const isHasNotification = ref(false);

  watch(
    isAuthenticated,
    (authenticated) => {
      if (!authenticated || !auth.user?.id) {
        return;
      }

      initializeNotifications(auth.user.id);
    },
    {
      immediate: true,
    }
  );

  watch(latestNotification, (notification) => {
    if (!notification) {
      return;
    }

    isHasNotification.value = true;
  });

  /**
   * Hides the notification toast when the close button is clicked.
   */
  const closeNotification = () => isHasNotification.value = false;
</script>
