import { getParents as fetchParentsFromAPI } from "@/services/parents/getParentsService";

/**
 * Fetches and returns the list of parents for selection.
 *
 * @returns {Promise<Array>} Parents list.
 */
export const getParents = async () => {
  const response = await fetchParentsFromAPI();

  return response.data.data;
};