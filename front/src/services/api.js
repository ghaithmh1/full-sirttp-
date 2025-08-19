import axios from 'axios';

const API_URL = 'http://localhost:5000/api/articles';

export const getArticles = () => axios.get(API_URL);
export const getArticlesByEntrepriseId = (entrepriseId) =>
  axios.get(`${API_URL}/entreprise/${entrepriseId}`);
export const getArticle = (id) => axios.get(`${API_URL}/${id}`);
export const createArticle = (article) => axios.post(API_URL, article);
export const updateArticle = (id, article) => axios.patch(`${API_URL}/${id}`, article);
export const deleteArticle = (id) => axios.delete(`${API_URL}/${id}`);   