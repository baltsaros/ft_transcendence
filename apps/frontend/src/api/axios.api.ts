import axios from 'axios';
import { getTokenFromLocalStorage } from '../helpers/localstorage.helper';
import Cookies from 'js-cookie';

export const instance = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    Authorization: 'Bearer ' + Cookies.get("jwt_token") || '',
    // Authorization: 'Bearer ' + getTokenFromLocalStorage() || '',
  },
})