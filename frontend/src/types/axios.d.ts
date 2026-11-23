// src/types/axios.d.ts
import 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    skipGlobalErrorAlert?: boolean;
  }

  export interface InternalAxiosRequestConfig {
    skipGlobalErrorAlert?: boolean;
  }
}