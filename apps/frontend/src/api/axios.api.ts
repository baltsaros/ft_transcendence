import axios from 'axios';
import Cookies from 'js-cookie';

export const instance = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    Authorization: 'Bearer ' + Cookies.get("jwt_token") || '',
  },
})