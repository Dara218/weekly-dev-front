import { API_ENDPOINT } from "@/constants/endpoint";
import { api } from "../common/http";

/**
 * Fetches the list of parents from the backend.
 *
 * @returns {Promise} Axios response promise containing parents data.
 */
export const getParents = () => api.get(API_ENDPOINT.PARENT.GET_PARENT);
