import { API_ENDPOINT } from "@/constants/endpoint";
import { api } from "../common/http";

/**
 * Fetches the list of students for the teacher, filtered by the given keywords.
 *
 * @param {Object} keywords - Filter and search parameters sent as query string (class, section, gender, etc.).
 *
 * @returns {Promise} Axios response promise containing the students collection.
 */
export const getStudents = (keywords) => api.get(API_ENDPOINT.STUDENT.GET_STUDENT, { params: keywords });