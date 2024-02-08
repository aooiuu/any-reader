import axios from 'axios';

const service = axios.create({
  withCredentials: true,
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000
});

service.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default service;
