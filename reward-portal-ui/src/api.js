import axios from "axios";

/**
 * Create Axios instance
 */
const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json"
  }
});

/**
 * Attach / Remove Authorization header
 */
export const setAuthToken = (token) => {
  if (token) {
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common["Authorization"];
  }
};

/**
 * Global response interceptor
 * - Auto logout on 401
 */
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default API;