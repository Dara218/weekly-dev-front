import { useMessageStore } from "@/stores/useMessageStore";

/**
 * Subscribes to the user's private chat channel via Laravel Echo.
 *
 * @param {number} userId - The authenticated user's ID.
 */
export const initMessageListener = (userId) => {
  if (!window.Echo) return;

  window.Echo
    .private(`chat.${userId}`)
    .listen(".message.sent", (event) => {
      const messageStore = useMessageStore();
      messageStore.addIncomingMessage(event);
    });
};
