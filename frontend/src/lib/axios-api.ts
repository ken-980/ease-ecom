import axios from 'axios';
import { baseUrl } from '../configs';

export const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});