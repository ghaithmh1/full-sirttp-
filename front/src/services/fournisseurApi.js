import axios from 'axios';

// Create axios instance with base config
const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Add request interceptor to inject token
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

export const getFournisseurs = () => api.get('/fournisseurs');
export const getFournisseur = (id) => api.get(`/fournisseurs/${id}`);
export const createFournisseur = (fournisseur) => api.post('/fournisseurs', fournisseur);
export const updateFournisseur = (id, fournisseur) => api.put(`/fournisseurs/${id}`, fournisseur);
export const deleteFournisseur = (id) => api.delete(`/fournisseurs/${id}`);