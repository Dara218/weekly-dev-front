import { MESSAGE } from "@/constants/message";
import { deleteStudentFile } from "@/services/file/deleteService";
import { ref } from "vue";

/**
 * Composable for handling file deletion.
 *
 * Provides a method to delete a student file and a reactive state
 * to track whether the delete action is currently in progress.
 *
 * @returns {{
 *  deleteFile: (fileId: number | string) => Promise<any>,
 *  isSubmitBtnClicked: import('vue').Ref<boolean>
 * }}
 */
export const useDeleteFile = () => {
  const isSubmitBtnClicked = ref(false);

  /**
   * Deletes a student file by its ID.
   *
   * Sets a loading state to prevent multiple submissions while the request
   * is in progress. Throws a formatted error message if the request fails.
   *
   * @async
   * 
   * @param {number|string} fileId - The unique identifier of the file to delete.
   *
   * @returns {Promise<any>} The API response from the delete request.
   *
   * @throws {Error} When the deletion fails.
   */
  const deleteFile = async (fileId) => {
    try {
      isSubmitBtnClicked.value = true;

      const response = deleteStudentFile(fileId);

      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || MESSAGE.ERROR.ERROR_DELETING_FILE);
    } finally {
      isSubmitBtnClicked.value = false;
    }
  }

  return { deleteFile, isSubmitBtnClicked };
}