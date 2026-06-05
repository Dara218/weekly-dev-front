import { API_ENDPOINT } from "@/constants/endpoint";
import { api } from "../common/http";

/**
 * Fetches the list of academic years from the backend.
 *
 * @returns {Promise} Axios response promise containing academic years data.
 */
export const getAcademicYears = () => api.get(API_ENDPOINT.ACADEMIC_YEAR.GET_ACADEMIC_YEAR);