import { API_ENDPOINT } from "@/constants/endpoint";
import { api } from "../common/http";

/**
 * Fetches files for a specific user from the backend.
 *
 * @param {number|string} userId - ID of the user.
 * @param {Object} [params={}] - Optional query parameters (e.g., limit, offset).
 *
 * @returns {Promise} Axios response promise containing file data.
 */
export const getFileById = (userId, params = {}) =>
  api.get(`${API_ENDPOINT.FILE.GET_FILE_BY_ID}/${userId}`, { params });