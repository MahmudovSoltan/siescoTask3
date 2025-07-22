import axios from 'axios';

const API_BASE_URL = 'https://localhost:7046'

const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});



export default instance;
