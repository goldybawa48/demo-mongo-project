import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL,
  timeout: 8000,
});

export const getHealth = () => api.get('/health');
export const getEnv = () => api.get('/env');
export const getUsers = () => api.get('/users');
export const createUser = (payload) => api.post('/users', payload);
export const deleteUser = (id) => api.delete(`/users/${id}`);
export const getLogs = () => api.get('/logs');

export default api;
