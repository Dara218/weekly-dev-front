import { API_ENDPOINT } from "@/constants/endpoint";
import { api } from "../common/http";

/**
 * Fetches the list of sections from the backend.
 *
 * @returns {Promise} Axios response promise containing sections data.
 */
export const getSections = () => api.get(API_ENDPOINT.SECTION.GET_SECTION);