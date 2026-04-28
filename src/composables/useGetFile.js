import { MESSAGE } from "@/constants/message";
import { getFileById } from "@/services/file/getFileService";

/**
 * Composable for retrieving student files.
 *
 * Provides a method to fetch files associated with a specific user,
 * with optional query parameters such as pagination.
 *
 * @returns {{
 *  get: (userId: number | string, params?: Record<string, any>) => Promise<any>
 * }}
 */
export const useGetFile = () => {
  /**
   * Fetches files for a given user.
   * Calls the backend service to retrieve files and supports optional parameters such as limit and offset for pagination.
   *
   * @async
   * @param {number|string} userId - The ID of the user whose files will be fetched.
   * @param {Object} [params={}] - Optional query parameters (e.g., limit, offset).
   *
   * @returns {Promise<any>} The API response containing file data.
   *
   * @throws {Error} When the request fails.
   */
  const get = async (userId, params = {}) => {
    try {
      return await getFileById(userId, params);
    } catch (error) {
      throw new Error(error.response?.data?.message || MESSAGE.ERROR.ERROR_FETCHING_FILE);
    }
  };

  return { get };
};