import axios from 'axios';

const API_URL = 'http://localhost:5000/api/activities';

// Create axios instance with token
const api = axios.create({
  baseURL: API_URL
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      console.error(
        'Activity API Error:', 
        error.config.url, 
        error.response.status,
        error.response.data
      );
    } else {
      console.error('Activity API Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export const getActivities = () => api.get('/');
export const getEntityActivities = (model, id) => api.get(`/${model}/${id}`);