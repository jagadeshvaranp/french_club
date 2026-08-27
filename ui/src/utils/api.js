import axios from 'axios';

const api = axios.create({
  baseURL: '', // Relative base URL resolves via Vite server proxy configuration
});

// Request interceptor to inject Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
