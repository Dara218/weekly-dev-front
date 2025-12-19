import { API_ENDPOINT } from "@/constants/endpoint"
import { api } from "../common/http"

export const handleLogin = (credentials) => api.post(API_ENDPOINT.AUTH.LOGIN, credentials);
export const getAuthUser = () => api.get(API_ENDPOINT.USER.GET_AUTH_USER);
export const getCsrfCookie = () => api.get(API_ENDPOINT.AUTH.SANCTUM_COOKIE);