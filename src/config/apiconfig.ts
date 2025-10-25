import axios from 'axios';

const api = axios.create({
  baseURL: 'https://nodeface.naturalaloe.dev/',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, 
});

let sessionExpiredCallback: (() => void) | null = null;
let isInitialLoad = true;

export const setSessionExpiredCallback = (callback: () => void) => {
  sessionExpiredCallback = callback;
};

export const setInitialLoadComplete = () => {
  isInitialLoad = false;
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const is401 = error.response?.status === 401;
    if (is401 && !isInitialLoad && sessionExpiredCallback) {
      sessionExpiredCallback();
    }
    
    return Promise.reject(error);
  }
);

export default api;