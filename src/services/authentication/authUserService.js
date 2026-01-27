import { API_ENDPOINT } from "@/constants/endpoint"
import { api } from "../common/http"

/**
 * Sends user login credentials to the backend.
 *
 * @param {Object} credentials - The login payload (e.g. email/username and password).
 * @returns {Promise} Axios response promise from the login endpoint.
 */
export const handleLogin = (credentials) =>
  api.post(API_ENDPOINT.AUTH.LOGIN, credentials);

/**
 * Fetches the currently authenticated user from the backend.
 *
 * @returns {Promise} Axios response promise containing the auth user data.
 */
export const getAuthUser = () =>
  api.get(API_ENDPOINT.USER.GET_AUTH_USER);

/**
 * Requests the CSRF cookie required by Laravel Sanctum before
 * making state-changing authenticated requests.
 *
 * @returns {Promise} Axios response promise for the CSRF cookie call.
 */
export const getCsrfCookie = () =>
  api.get(API_ENDPOINT.AUTH.SANCTUM_COOKIE);