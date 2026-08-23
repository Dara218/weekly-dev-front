import { API_ENDPOINT } from "@/constants/endpoint";
import { api } from "../common/http";

/**
 * Fetches the unread notification count from the backend.
 *
 * @returns {Promise} Axios response promise containing the unread count.
 */
export const getUnreadCount = () => api.get(API_ENDPOINT.NOTIFICATION.GET_UNREAD_COUNT);

/**
 * Fetches the list of unread notifications from the backend.
 *
 * @returns {Promise} Axios response promise containing unread notifications.
 */
export const getUnreadNotification = () => api.get(API_ENDPOINT.NOTIFICATION.GET_UNREAD_NOTIFICATION);

/**
 * Marks all notifications as read on the backend.
 *
 * @returns {Promise} Axios response promise from the mark-all-as-read endpoint.
 */
export const processUnreadNotification = () => api.put(API_ENDPOINT.NOTIFICATION.MARK_ALL_AS_READ);