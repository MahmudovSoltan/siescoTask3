
import axios from "axios";


const baseURL = 'https://localhost:7046'

const axiosInstance = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",

    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken && config.headers) {
            config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const refresh = localStorage.getItem("refresh");
        if (error.response?.status === 401 && !originalRequest._retry && refresh) {
            location.href = "/login"
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;