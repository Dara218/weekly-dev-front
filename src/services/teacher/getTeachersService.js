import { API_ENDPOINT } from "@/constants/endpoint";
import { api } from "../common/http";

/**
 * Fetches the list of teachers from the backend.
 * 
 * @param {Object} keywords - Filter and search parameters sent as query string (class, section, gender, etc.).
 *
 * @returns {Promise} Axios response promise containing teachers data.
 */
export const getTeachers = (keywords) => api.get(API_ENDPOINT.TEACHER.GET_TEACHER, { params: keywords });
