import axios from 'axios';

// Create axios instance with interceptors
const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Add request interceptor
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Add response interceptor
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Article endpoints
export const getArticlesForCurrentEntreprise = () => api.get('/articles');
export const getArticlesByEntrepriseId = (entrepriseId) => 
  api.get(`/articles/entreprise/${entrepriseId}`);
export const getArticle = (id) => api.get(`/articles/${id}`);
export const createArticle = (article) => api.post('/articles', article);
export const updateArticle = (id, article) => api.put(`/articles/${id}`, article);
export const deleteArticle = (id) => api.delete(`/articles/${id}`);