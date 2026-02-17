import { getParents } from "@/services/parents/getParentsService";

/**
 * Fetches and returns the list of parents for selection.
 *
 * @returns {Promise<Array>} Parents list.
 */
export const getStudentParents = async () => {
  const response = await getParents();

  return response.data.data;
};
