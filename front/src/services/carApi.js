import axios from 'axios';

const API_URL = 'http://localhost:5000/api/cars';

// Create axios instance with base URL and interceptors
const api = axios.create({
  baseURL: API_URL
});

// Add token to all requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response logging for debugging
api.interceptors.response.use(
  response => {
    console.log('API Success:', response.config.url, response.data);
    return response;
  },
  error => {
    console.error('API Error:', error.config.url, error.response);
    return Promise.reject(error);
  }
);

export const getCars = () => api.get('/');
export const getCar = (id) => api.get(`/${id}`);
export const createCar = (car) => api.post('/', car);
export const updateCar = (id, car) => api.put(`/${id}`, car);
export const deleteCar = (id) => api.delete(`/${id}`);