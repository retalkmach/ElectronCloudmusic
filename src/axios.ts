import axios from 'axios';

const config = {
  baseURL: 'http://127.0.0.1:3000',
  timeout: 5000,
  withCredentials: true,
};
const instance = axios.create(config);

export default instance;
