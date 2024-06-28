import axios from 'axios';
import { message } from 'ant-design-vue';
import { BASE_URL } from '@/constants';
import router from '@/router';

const service = axios.create({
  withCredentials: false,
  baseURL: BASE_URL,
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
    const { code, msg } = response.data;
    if (code === 401 || code === 10002) {
      router.push({ name: 'login' });
      return Promise.reject(response.data);
    }
    if (code === 10001) {
      router.push({ name: 'install' });
      return Promise.reject(response.data);
    }
    if (code === -1 && msg) {
      message.warning(msg);
      return Promise.reject(response.data);
    }
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default service;
