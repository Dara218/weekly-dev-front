import { ref } from "vue";
import { MESSAGE } from "@/constants/message";
import { updateUser } from "@/services/user/userService";

/**
 * Composable for creating and updating a teacher with submission state.
 *
 * @param {Object} form - Reactive form object containing teacher data.
 * @param {number|string} userId - The ID of the user to update.
 *
 * @returns {Object} Submission helpers and submission state.
 */
export const useCreateAndUpdateTeacher = (form, userId) => {
  const isSubmitBtnClicked = ref(false);

  /**
   * Submits the form data to update a teacher.
   *
   * @returns {Promise<Object>} API response data.
   *
   * @throws {Error} If the update request fails.
   */
  const submit = async () => {
    try {
      isSubmitBtnClicked.value = true;

      const response = await updateUser(userId, form);

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || MESSAGE.ERROR.USER_UPDATE_FAILED);
    } finally {
      isSubmitBtnClicked.value = false;
    }
  }

  return { submit, isSubmitBtnClicked };
}