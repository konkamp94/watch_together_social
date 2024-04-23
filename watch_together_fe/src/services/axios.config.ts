import axios from 'axios'

// const apiBaseUrl = import.meta.env.NODE_ENV === 'development'
//     ? import.meta.env.API_BASE_URL_DEV
//     : import.meta.env.API_BASE_URL_PRODUCTION;
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL_DEV

export const createAuthHeaders = () => {
    const token = localStorage.getItem('token');

    if (token) {
        return { 'Authorization': `Bearer ${token}` }
    }
    return {}
}

export const axiosInstance = axios.create({
    baseURL: apiBaseUrl
});