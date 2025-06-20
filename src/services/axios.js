import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const instance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Automatically attach access_token
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token'); // or from your AuthContext
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
