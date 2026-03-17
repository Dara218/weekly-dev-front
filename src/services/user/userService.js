import { API_ENDPOINT } from "@/constants/endpoint"
import { api } from "../common/http"

/**
 * Creates a new user in the backend.
 *
 * @param {Object} form - The user payload to submit.
 *
 * @returns {Promise} Axios response promise from the create user endpoint.
 */
export const createUser = (form) => api.post(API_ENDPOINT.USER.CREATE_USER, form);

/**
 * Creates a bulk new user in the backend.
 *
 * @param {Object} payload - The user payload to submit.
 *
 * @returns {Promise} Axios response promise from the create user endpoint.
 */
export const createUserBulk = (payload) => api.post(API_ENDPOINT.USER.CREATE_USER_BULK, payload);

/**
 * Updates a new user in the backend.
 *
 * @param {Object} form - The user payload to submit.
 *
 * @returns {Promise} Axios response promise from the update user endpoint.
 */
export const updateUser = (id, form) => api.put(`${API_ENDPOINT.USER.UPDATE_USER}/${id}`, form);

/**
 * Deletes an existing user in the backend.
 *
 * @returns {Promise} Axios response promise from the update user endpoint.
 */
export const deleteUser = (id) => api.delete(`${API_ENDPOINT.USER.DELETE_USER}/${id}`);

/**
 * Deletes an existing users in the backend.
 * 
 * @param {Array} ids - The user ids.
 *
 * @returns {Promise} Axios response promise from the update user endpoint.
 */
export const deleteUsers = (ids) => api.delete(API_ENDPOINT.USER.DELETE_USERS, { data: { ids } });