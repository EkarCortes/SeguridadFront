import axios from 'axios';
import { getAccessToken } from '../services/authService';

const api = axios.create({
  baseURL: 'https://nodeface.naturalaloe.dev/',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, 
});

// Interceptor para agregar el token a cada request
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`🔐 Request a ${config.url} con token`);
    } else {
      console.log(`⚠️ Request a ${config.url} SIN token`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Variable global para manejar el modal de sesión expirada
let onSessionExpired: (() => void) | null = null;

export function setSessionExpiredHandler(handler: () => void) {
  onSessionExpired = handler;
}

// Interceptor para manejar errores 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log('🚫 Error 401 detectado - Sesión expirada');
      if (onSessionExpired) {
        onSessionExpired();
      }
    }
    return Promise.reject(error);
  }
);

export default api;