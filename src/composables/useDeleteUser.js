import { MESSAGE } from "@/constants/message";
import { deleteUser, deleteUsers } from "@/services/user/userService"

/**
 * Composable for deleting user(s).
 *
 * Provides a method to delete a single user or multiple users
 * depending on the input type.
 *
 * @returns {{
 *  handleDeleteUser: (userId: number|string|Array<number|string>) => Promise<any>
 * }}
 */
export const useDeleteUser = () => {
  /**
   * Deletes a user or multiple users.
   *
   * Calls the appropriate API based on whether the provided ID
   * is a single value or an array of IDs.
   *
   * @async
   * @param {number|string|Array<number|string>} userId - A single user ID or an array of user IDs.
   *
   * @returns {Promise<any>} The API response from the delete request(s).
   *
   * @throws {Error} When the deletion request fails.
   */
  const handleDeleteUser = async (userId) => {
    try {
      return Array.isArray(userId)
        ? await deleteUsers(userId)
        : await deleteUser(userId);
    } catch (error) {
      throw new Error(error.response?.data?.message || MESSAGE.ERROR.STUDENT_DELETION_FAILED);
    }
  }

  return { handleDeleteUser };
}