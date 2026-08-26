<template>
  <!-- Notification Panel -->
  <div
    class="absolute right-0 top-14 z-50 w-[360px] max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white shadow-2xl overflow-hidden"
  >
    <!-- Header -->
    <div class="flex items-center justify-between border-b border-gray-200 px-4 py-3">
      <div>
        <h2 class="font-semibold text-gray-900">
          {{ LABEL.NOTIFICATIONS }}
        </h2>
        <p class="text-xs text-gray-500">
          {{ LABEL.UNREAD_COUNT(props.count) }}
        </p>
      </div>

      <button
        @click="markAllAsRead"
        class="text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
      >
        {{ LABEL.BUTTON.MARK_ALL_AS_READ }}
      </button>
    </div>

    <!-- Notifications -->
    <ul class="max-h-[420px] overflow-y-auto">
      <li
        v-for="unreadNotification in notifications.unread_notification"
        :key="unreadNotification.id"
        class="w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition text-left border-b border-gray-100"
      >
        <div class="mt-1 h-2.5 w-2.5 rounded-full bg-blue-500 shrink-0"></div>

        <div class="flex-1">
          <p class="text-sm font-semibold text-gray-900">
            {{ unreadNotification.data.title }}
          </p>
          <p class="mt-0.5 text-sm text-gray-800">
            {{ unreadNotification.data.message }}
          </p>
          <p class="mt-1 text-xs text-gray-500">
            {{ convertDateToIsoFormat(unreadNotification.created_at) }}
          </p>
        </div>
      </li>
    </ul>

    <!-- Footer -->
    <div class="border-t border-gray-200 p-3">
      <button
        :disabled="!hasUnreadNotification"
        class="button-common-navigation"
      >
        {{ LABEL.BUTTON.VIEW_ALL_NOTIFICATION }}
      </button>
    </div>
  </div>
</template>

<script setup>
  import { computed, onMounted } from 'vue';
  import { getUnreadNotification, processUnreadNotification } from '@/services/notification/notificationService';
  import { useNotificationStore } from '@/stores/useNotificationStore';
  import { convertDateToIsoFormat } from '@/utils/commonOptionUtils';
  import { LABEL } from '@/constants/label';

  /**
   * Component props.
   */
  const props = defineProps({
    count: Number,
  });

  /**
   * Run methods before the page loads.
   */
  onMounted(() => {
    handleGetUnreadNotification();
  });

  /**
   * Notification store for unread count and notification list.
   */
  const notifications = useNotificationStore();
  const hasUnreadNotification = computed(() => notifications.unread_notification_count > 0);

  /**
   * Fetches unread notifications from the backend and updates the store.
   */
  const handleGetUnreadNotification = async () => {
    try {
      const response = await getUnreadNotification();

      if (!response.data.success) return;

      notifications.fetchUnreadNotification();
    } catch (error) {
      console.error(error.response.data.errors);
    }
  };

  /**
   * Marks all notifications as read and resets the unread count.
   */
  const markAllAsRead = async () => {
    try {
      const response = await processUnreadNotification();

      if (!response.data.success) return;

      notifications.resetUnreadNotificationCount();
    } catch (error) {
      console.error(error.response.data.errors);
    }
  };
</script>
