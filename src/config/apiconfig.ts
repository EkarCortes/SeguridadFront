import axios from 'axios';

const api = axios.create({
  baseURL: 'http://20.3.129.141:8000/',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, 
});



export default api;