import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
const AUTH_URL = process.env.REACT_APP_AUTH_URL || 'http://localhost:8000/api/auth';

// Helper to get token
const getToken = () => localStorage.getItem('access_token');

// Create API instances
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const authApi = axios.create({
    baseURL: AUTH_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests for API
api.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Auth API calls
export const register = (userData) => authApi.post('/register/', userData);
export const login = (credentials) => authApi.post('/login/', credentials);
export const refreshToken = (refresh) => authApi.post('/token/refresh/', { refresh });
export const logout = (refreshToken) => authApi.post('/logout/', { refresh: refreshToken });
export const getProfile = () => {
    const token = getToken();
    return authApi.get('/profile/', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};
export const updateProfile = (data) => {
    const token = getToken();
    return authApi.put('/profile/', data, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};
export const getUsers = () => {
    const token = getToken();
    return authApi.get('/users/', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};
export const createUser = (userData) => {
    const token = getToken();
    return authApi.post('/users/create/', userData, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};

// Letter API calls
export const getLetters = () => api.get('/letters/');
export const getLetter = (id) => api.get(`/letters/${id}/`);
export const createLetter = (data) => api.post('/letters/', data);
export const updateLetter = (id, data) => api.put(`/letters/${id}/`, data);
export const deleteLetter = (id) => api.delete(`/letters/${id}/`);
export const importCSV = (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/letters/import_csv/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};
export const downloadPDF = (id) => {
    return api.get(`/letters/${id}/download_pdf/`, {
        responseType: 'blob'
    });
};

export default api;