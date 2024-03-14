import axios from 'axios'

// const apiBaseUrl = import.meta.env.NODE_ENV === 'development'
//     ? import.meta.env.API_BASE_URL_DEV
//     : import.meta.env.API_BASE_URL_PRODUCTION;
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL_DEV
console.log(apiBaseUrl)

const createAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (token) {
        return { 'Authorization': `Bearer ${token}` }
    }
    return {}
}

const axiosInstance = axios.create({
    baseURL: apiBaseUrl,
    headers: createAuthHeaders()
});

export default axiosInstance;