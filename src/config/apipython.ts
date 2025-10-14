import axios from 'axios';

export const PY_BASE_URL = 'https://facerecognition.naturalaloe.dev/';

const apiPy = axios.create({
  baseURL: PY_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default apiPy;