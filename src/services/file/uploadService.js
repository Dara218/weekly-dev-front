import { API_ENDPOINT } from "@/constants/endpoint";
import { api } from "../common/http";

/**
 * Uploads a student file to the backend.
 *
 * @param {FormData} formData - Form data containing the file and student ID.
 *
 * @returns {Promise} Axios response promise.
 */
export const uploadStudentFile = (formData) => api.post(API_ENDPOINT.FILE.UPLOAD_STUDENT_FILE, formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});