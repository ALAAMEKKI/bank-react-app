import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Mock API For mock data 
});

export default api;
