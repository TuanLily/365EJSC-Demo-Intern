import axios, { AxiosInstance } from 'axios';
import { useNavigate } from 'react-router-dom';

const createHttpInstance = (): AxiosInstance => {
    const instance: AxiosInstance = axios.create({
        baseURL: 'http://localhost:4000/',
        timeout: 10000,
        headers: {
            'Content-Type': 'application/json'
        }
    });

    instance.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    instance.interceptors.response.use(
        (response) => response,
        (error) => {
            const navigate = useNavigate(); 
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                // Token hết hạn hoặc không hợp lệ
                localStorage.removeItem('accessToken'); 
                navigate('/login');
            }
            return Promise.reject(error);
        }
    );

    return instance;
};

const http = createHttpInstance();

export default http;
