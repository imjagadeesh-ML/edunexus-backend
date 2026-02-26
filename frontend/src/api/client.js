import axios from 'axios';

const client = axios.create({
    baseURL: 'https://edunexus-backend-f3n5.onrender.com/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include JWT token
client.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default client;
