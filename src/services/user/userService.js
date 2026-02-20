import { API_ENDPOINT } from "@/constants/endpoint"
import { api } from "../common/http"

/**
 * Creates a new user in the backend.
 *
 * @param {Object} form - The user payload to submit.
 * @returns {Promise} Axios response promise from the create user endpoint.
 */
export const createUser = (form) => api.post(API_ENDPOINT.USER.CREATE_USER, form);

/**
 * Updates a new user in the backend.
 *
 * @param {Object} form - The user payload to submit.
 * @returns {Promise} Axios response promise from the update user endpoint.
 */
export const updateUser = (id, form) => api.put(`${API_ENDPOINT.USER.UPDATE_USER}/${id}`, form);