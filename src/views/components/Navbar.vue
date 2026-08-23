<template>
  <nav class="navbar">
    <!-- Logo -->
    <div class="navbar__logo">
      <div class="navbar__logo-icon">WD</div>
      <span class="navbar__logo-text">{{ LABEL.TITLE }}</span>
    </div>

    <!-- Right -->
    <div class="navbar__actions">
      <!-- Notification -->
      <div class="relative">
        <button
          class="navbar__icon-btn"
          @click.stop="toggleNotificationBar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="navbar__icon"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002
                6.002 0 00-4-5.659V5a2 2 0 10-4
                0v.341C7.67 6.165 6 8.388 6
                11v3.159c0 .538-.214 1.055-.595
                1.436L4 17h5m6 0v1a3 3 0
                11-6 0v-1m6 0H9"
            />
          </svg>

          <span
            class="navbar__badge"
            v-if="unread_notification_count > 0"
          >
            {{ unread_notification_count }}
          </span>
        </button>

        <Content
          v-if="isNotificationBarOpen"
          :count="unread_notification_count"
        />
      </div>

      <!-- Dropdown -->
      <div class="navbar__dropdown">
        <button
          class="navbar__dropdown-trigger"
          @click="toggleDropdown"
        >
          <span>{{ userName }}</span>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="navbar__chevron"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        <div
          v-show="isOpen"
          class="navbar__dropdown-menu"
        >
          <a href="#" class="navbar__dropdown-item">
            {{ LABEL.PROFILE }}
          </a>

          <button
            @click="logout"
            class="navbar__dropdown-item navbar__dropdown-item--danger cursor-pointer"
          >
            {{ LABEL.BUTTON.LOGOUT }}
          </button>
        </div>
      </div>
    </div>
  </nav>

  <!-- Notification overlay -->
  <div
    v-if="isNotificationBarOpen"
    class="fixed inset-0 z-40"
    @click="isNotificationBarOpen = false"
  ></div>

  <!-- Dropdown overlay -->
  <div
    v-if="isOpen"
    class="navbar__overlay"
    @mousedown="toggleDropdown"
  ></div>
</template>

<script setup>
  import { ref } from 'vue';
  import { storeToRefs } from 'pinia';
  import router from '@/router';
  import { useAuthStore } from '@/stores/useAuthStore';
  import { useNotificationStore } from '@/stores/useNotificationStore';
  import Content from './notification/Content.vue';
  import { LABEL } from '@/constants/label';

  /**
   * Auth store for the currently logged-in user.
   */
  const auth = useAuthStore();

  /**
   * Notification store for unread notification count.
   */
  const notification = useNotificationStore();
  const { unread_notification_count } = storeToRefs(notification);

  const user = auth.user;
  const userName = `${user.first_name} ${user.last_name}`;
  const errorMessage = ref(null);
  const isOpen = ref(false);
  const isNotificationBarOpen = ref(false);

  /**
   * Toggles the user dropdown menu visibility.
   */
  const toggleDropdown = () => {
    isOpen.value = !isOpen.value;
  };

  /**
   * Toggles the notification panel visibility.
   */
  const toggleNotificationBar = () => {
    isNotificationBarOpen.value = !isNotificationBarOpen.value;
  };

  /**
   * Calls the logout api from the backend.
   */
  const logout = async () => {
    try {
      await auth.logout();

      router.push({ name: 'login' });
    } catch (error) {
      errorMessage.value = error;
    }
  };
</script>