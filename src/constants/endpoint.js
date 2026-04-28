export const API_ENDPOINT = {
  AUTH: {
    LOGIN: 'login',
    SANCTUM_COOKIE: 'sanctum/csrf-cookie',
  },
  USER: {
    GET_AUTH_USER: 'api/user',
    CREATE_USER: 'api/user/store',
    CREATE_USER_BULK: 'api/user/bulk-store',
    UPDATE_USER: 'api/user/update',
    DELETE_USER: 'api/user/delete',
    DELETE_USERS: 'api/user/bulk-delete',
  },
  STUDENT: {
    GET_STUDENT: 'api/students',
  },
  PARENT: {
    GET_PARENT: 'api/parents',
  },
  FILE: {
    UPLOAD_STUDENT_FILE: 'api/students/file/upload',
    GET_FILE_BY_ID: 'api/user/file/get',
    DELETE_STUDENT_FILE: 'api/students/file/delete',
  },
  STORAGE_BUCKET: `${import.meta.env.VITE_STORAGE_BUCKET_BASE_URL}/weekly-dev/`,
};