import axios from 'axios';
import { Message } from '@arco-design/web-react';
import { useUserStore } from '../store/useUserStore';

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000,
});

request.interceptors.request.use((config) => {
  const token = useUserStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

request.interceptors.response.use(
  (response) => {
    const { code, message, data } = response.data;
    if (code === 0) {
      return data;
    }
    Message.error(message || '请求失败');
    return Promise.reject(new Error(message));
  },
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;
    if (status === 401) {
      useUserStore.getState().logout();
    }
    Message.error(message || '网络错误');
    return Promise.reject(error);
  },
);

export default request;
