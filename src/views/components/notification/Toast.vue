<template>
  <div class="fixed inset-x-4 bottom-4 z-50 sm:inset-x-auto sm:bottom-5 sm:left-5 sm:w-full sm:max-w-sm">
    <div class="overflow-hidden rounded-xl border border-blue-200 bg-white shadow-xl">
      <div class="flex items-start gap-4 p-4">
        <!-- Icon -->
        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0a3 3 0 11-6 0h6z"
            />
          </svg>
        </div>

        <!-- Content -->
        <div class="min-w-0 flex-1">
          <h3 class="truncate text-sm font-semibold text-gray-900">
            {{ title }}
          </h3>

          <p class="mt-1 wrap-break-word text-sm text-gray-600">
            {{ message }}
          </p>

          <p class="mt-2 text-xs text-gray-400">
            {{ LABEL.JUST_NOW }}
          </p>
        </div>

        <!-- Close -->
        <button
          class="shrink-0 rounded-md p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          @click="closeNotification"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div class="h-1 bg-blue-500"></div>
    </div>
  </div>
</template>

<script setup>
  import { computed } from 'vue';
  import { latestNotification } from '@/plugins/notification-listener';
  import { LABEL } from '@/constants/label';

  /**
   * Component emits.
   */
  const emit = defineEmits('close');

  /**
   * Closes the notification toast.
   */
  const closeNotification = () => emit('close');

  /**
   * Title from the Echo payload (available even when the unread list is empty).
   */
  const title = computed(() => {
    const notification = latestNotification.value;

    return notification?.title ?? notification?.data?.title ?? '';
  });

  /**
   * Message body from the Echo payload (available even when the unread list is empty).
   */
  const message = computed(() => {
    const notification = latestNotification.value;

    return notification?.message ?? notification?.data?.message ?? '';
  });
</script>
