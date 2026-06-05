import { API_ENDPOINT } from "@/constants/endpoint";
import { api } from "../common/http";

/**
 * Fetches the list of classes from the backend.
 *
 * @returns {Promise} Axios response promise containing classes data.
 */
export const getClasses = () => api.get(API_ENDPOINT.CLASSES.GET_CLASSES);