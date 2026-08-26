import { ref } from "vue";
import { useNotificationStore } from "@/stores/useNotificationStore";

let initialized = false;

/**
 * Reactive ref holding the most recently received real-time notification.
 */
export const latestNotification = ref(null);

/**
 * Subscribes to the user's private notification channel via Laravel Echo.
 *
 * @param {number} userId - The authenticated user's ID.
 */
export function initializeNotifications(userId) {
  if (initialized) return;

  initialized = true;
  const notifications = useNotificationStore();

  window.Echo
    .private(`App.Models.User.${userId}`)
    .notification((notification) => {
      notifications.incrementUnreadNotificationCount();
      latestNotification.value = notification;
    });
}
