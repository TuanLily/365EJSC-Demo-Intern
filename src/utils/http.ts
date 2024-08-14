import axios, { AxiosInstance } from 'axios';

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
            if (error.response?.status === 401) {
                // TODO: Có thể điều hướng đến trang login hoặc trang 404 khi token k hợp lệ
            }
            return Promise.reject(error);
        }
    );

    return instance;
};

const http = createHttpInstance();

export default http;
