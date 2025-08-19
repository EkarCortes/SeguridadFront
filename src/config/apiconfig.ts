import axios from 'axios';

const api = axios.create({
  baseURL: 'http://ruta/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, 
});



export default api;