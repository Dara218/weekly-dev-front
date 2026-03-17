import { MESSAGE } from "@/constants/message";
import { deleteUser, deleteUsers } from "@/services/user/userService"

/**
 * Call the delete user or delete bulk users api.
 *
 * @param {number} userId 
 * 
 * @returns {Promise<Array>} Parents list.
 */
export const useDeleteUser = async (userId) => {
  try {
    return Array.isArray(userId)
      ? await deleteUsers(userId)
      : await deleteUser(userId);
  } catch (error) {
    throw new Error(error.response?.data?.message || MESSAGE.ERROR.STUDENT_DELETION_FAILED)
  }
}