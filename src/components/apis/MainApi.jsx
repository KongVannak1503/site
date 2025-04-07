// src/config.js
export const API_URL = 'http://localhost:7001/api/';
import jwt_decode from 'jwt-decode';

const token = localStorage.getItem('token');

export const decodedToken = token ? jwt_decode(token) : null;

export const TOKEN = token ? `Bearer ${token}` : '';

