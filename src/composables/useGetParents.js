import { getParents as fetchParentsFromAPI } from "@/services/parents/getParentsService";

/**
 * Composable for retrieving parent records.
 *
 * Provides a method to fetch and return a list of parents,
 * typically used for dropdown selections or form inputs.
 *
 * @returns {{
 *  get: () => Promise<Array>
 * }}
 */
export const useGetParents = () => {
  /**
   * Fetches the list of parents.
   *
   * Calls the backend service and returns the extracted parent data.
   *
   * @async
   *
   * @returns {Promise<Array>} Array of parent objects.
   *
   * @throws {Error} When the request fails.
   */
  const get = async () => {
    try {
      const response = await fetchParentsFromAPI();

      return response.data.data;
    } catch (error) {
      console.error(error);
    }
  }

  return { get };
};