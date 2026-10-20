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

/**
 * Builds the headers for a fetch() call that uses Sanctum cookie auth.
 *
 * @param {Object} [extra] - Extra headers merged onto the defaults.
 *
 * @returns {Object}
 */
export const getSanctumFetchHeaders = (extra = {}) => {
  // Axios stores the decoded XSRF cookie name Laravel expects as a header.
  // Reading the cookie once here keeps CSRF logic out of feature services.
  const match = document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]*)/);
  const xsrfToken = match ? decodeURIComponent(match[1]) : "";

  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
    ...(xsrfToken ? { "X-XSRF-TOKEN": xsrfToken } : {}),
    ...extra,
  };
};

/**
 * Builds an absolute API URL from the Axios base URL and a path.
 *
 * @param {string} path
 *
 * @returns {string}
 */
export const apiUrl = (path) => {
  const base = (api.defaults.baseURL || "").replace(/\/$/, "");
  const suffix = String(path).replace(/^\//, "");

  return `${base}/${suffix}`;
};