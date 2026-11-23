// src/lib/axios-api.ts
import axios from 'axios';
import { baseUrl } from '../configs';
import { showAlert } from './alert-store';

declare module 'axios' {
  export interface AxiosRequestConfig {
    skipGlobalErrorAlert?: boolean;
  }
  export interface InternalAxiosRequestConfig {
    skipGlobalErrorAlert?: boolean;
  }
}

export const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.config?.skipGlobalErrorAlert) {
      if (!error.response) {
        showAlert({
          variant: 'error',
          message:
            'Cannot reach the server. Check your connection or backend status.',
        });
      } else if (error.response.status >= 500) {
        showAlert({
          variant: 'error',
          message:
            error.response.data?.message ||
            'A server error occurred while loading data.',
        });
      }
    }

    return Promise.reject(error);
  }
);