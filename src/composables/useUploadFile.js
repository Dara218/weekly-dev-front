import { MESSAGE } from "@/constants/message";
import { uploadStudentFile } from "@/services/file/uploadService";

/**
 * Composable for uploading student files.
 *
 * Provides a method to upload a file associated with a student
 * using multipart/form-data.
 *
 * @returns {{
 *  upload: (studentId: number|string, file: File) => Promise<any>
 * }}
 */
export const useUploadStudentFile = () => {
  /**
   * Uploads a file for a specific student. Creates a FormData payload and sends it to the backend service.
   *
   * @async
   *
   * @param {number|string} studentId - The ID of the student.
   * @param {File} file - The file to be uploaded.
   *
   * @returns {Promise<any>} The API response from the upload request.
   *
   * @throws {Error} When validation fails or the upload request fails.
   */
  const upload = async (studentId, file) => {
    // Create form data
    let formData = new FormData();
    formData.append('file', file);
    formData.append('id', studentId);

    try {
      if (!formData) return;

      const response = await uploadStudentFile(formData);

      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || MESSAGE.ERROR.ERROR_UPLOADING_FILE);
    }
  }

  return { upload };
};