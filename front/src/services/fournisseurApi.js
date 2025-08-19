import axios from 'axios';

const API_URL = 'http://localhost:5000/api/fournisseurs';

export const getFournisseurs = () => axios.get(API_URL);
export const getFournisseur = (id) => axios.get(`${API_URL}/${id}`);
export const createFournisseur = (fournisseur) => axios.post(API_URL, fournisseur);
export const updateFournisseur = (id, fournisseur) => axios.put(`${API_URL}/${id}`, fournisseur);
export const deleteFournisseur = (id) => axios.delete(`${API_URL}/${id}`);