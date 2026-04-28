import { API_ENDPOINT } from "@/constants/endpoint";
import { api } from "../common/http";

/**
 * Deletes a student file from the backend.
 *
 * @param {number|string} fileId - ID of the file to delete.
 *
 * @returns {Promise} Axios response promise.
 */
export const deleteStudentFile = (fileId) =>
  api.delete(`${API_ENDPOINT.FILE.DELETE_STUDENT_FILE}/${fileId}`);