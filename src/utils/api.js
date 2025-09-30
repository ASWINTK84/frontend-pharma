import axios from 'axios';

const API = axios.create({
  baseURL: 'https://backend-pharma-1quk.onrender.com',
});

// Interceptor to add correct token
API.interceptors.request.use(config => {
  // check route
  if (config.url.startsWith('/admin')) {
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
  } else {
    const userToken = localStorage.getItem('token');
    if (userToken) {
      config.headers.Authorization = `Bearer ${userToken}`;
    }
  }
  return config;
});

export default API;
