// src/services/authService.js
import axios from 'axios';
import {api_url} from "../../api";

const API_URL = api_url;

export const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
};

export const register = async (email, password) => {
    const response = await axios.post(`${API_URL}/register`, { email, password });
    return response.data;
};