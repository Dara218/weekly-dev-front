import { defineStore } from "pinia";
import { getUnreadCount, getUnreadNotification } from "@/services/notification/notificationService";
import { MESSAGE } from "@/constants/message";

export const useNotificationStore = defineStore('notifications', {
  state: () => ({
    unread_notification_count: 0,
    unread_notification: [],
  }),
  actions: {
    /**
     * Fetches the unread notification count from the backend.
     */
    async fetchUnreadNotificationCount()
    {
      try {
        const { data } = await getUnreadCount();

        this.unread_notification_count = Number(data.count) || 0;
      } catch (error) {
        console.error(MESSAGE.ERROR.ERROR_FETCHING_NOTIFICATION_COUNT, error);
      }
    },
    /**
     * Fetches the list of unread notifications from the backend.
     */
    async fetchUnreadNotification()
    {
      try {
        const { data } = await getUnreadNotification();

        this.unread_notification = data.unread ?? [];
      } catch (error) {
        console.error(MESSAGE.ERROR.ERROR_FETCHING_NOTIFICATION_COUNT, error);
      }
    },
    /**
     * Increments the unread count and refreshes the notification list.
     */
    incrementUnreadNotificationCount()
    {
      this.unread_notification_count = Number(this.unread_notification_count) + 1;
      this.fetchUnreadNotification();
    },
    /**
     * Resets the unread notification count and clears the unread list.
     */
    resetUnreadNotificationCount()
    {
      this.unread_notification_count = 0;
      this.unread_notification = [];
    },
  },
});
