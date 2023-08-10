import axios from 'axios';
import Cookies from 'js-cookie';
// import { getTokenFromLocalStorage } from '../helpers/localstorage.helper';

export const instance = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    Authorization: 'Bearer ' + Cookies.get("jwt_token") || '',
    // Authorization: 'Bearer ' + getTokenFromLocalStorage() || '',
  },
})