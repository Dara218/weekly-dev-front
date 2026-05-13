import { MESSAGE } from "@/constants/message";
import { USER_ROLE } from "@/constants/userRole";
import { getAuthUser, getCsrfCookie, handleLogin, handleLogout } from "@/services/authentication/authUserService";
import { defineStore } from "pinia";

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    error: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,
    isStudent: (state) => state.user?.role === USER_ROLE.STUDENT,
    isAdmin: (state) => state.user?.role === USER_ROLE.ADMIN,
    isTeacher: (state) => state.user?.role === USER_ROLE.TEACHER,
    isParent: (state) => state.user?.role === USER_ROLE.PARENT,
  },
  actions: {
    /**
     * Get the authenticated user data.
     */
    async getAuthenticatedUser() {
      try {
        const authUser = await getAuthUser();

        this.user = authUser.data;
      } catch (error) {
        console.error('getAuthenticatedUser error', error);
      }
    },
    /**
     * Login the user with provided credentials.
     *
     * @param {Object} loginDetails - User login credentials (email, password)
     *
     * @throws {Error} Throws error if login fails
     */
    async login(loginDetails) {
      try {
        // Get CSRF cookie
        await getCsrfCookie();

        const response = await handleLogin(loginDetails);

        if (!response.data.success) {
          this.user = null;

          return;
        }

        this.user = response.data.data;

        return response;
      } catch (error) {
        this.user = null;

        throw new Error(error.response?.data?.message || MESSAGE.ERROR.INVALID_LOGIN_DETAILS);
      }
    },
    /**
     * Logout the user.
     *
     * @throws {Error} Throws error if logout fails
     */
    async logout()
    {
      try {
        const response = await handleLogout();

        if (response.data.success) {
          this.$reset();
        }
      } catch (error) {
        throw new Error(error.response?.data?.message || MESSAGE.ERROR.FAILED_LOGOUT);
      }
    }
  },
});