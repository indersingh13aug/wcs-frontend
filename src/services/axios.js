import axios from "axios";
import Swal from "sweetalert2";


const API_BASE_URL = import.meta.env.VITE_API_URL;

const instance = axios.create({
  baseURL: API_BASE_URL,
  // withCredentials: true,
});
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🛡️ Handle expired token
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Swal.fire("Session Expired", "Please login again.", "warning").then(() => {
        localStorage.removeItem("token");
        window.location.href = "/login"; // adjust path
      });
    }
    return Promise.reject(error);
  }
);

export default instance;
