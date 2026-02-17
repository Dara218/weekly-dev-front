// src/services/common/http.js
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

/**
 * Axios instance configured with base URL and credentials.
 *
 * @type {import("axios").AxiosInstance}
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});
