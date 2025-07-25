
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
            originalRequest._retry = true;
            try {
                const res = await axiosInstance.post("/api/Auth/Refresh", {
                    refreshToken: refresh,
                });
                const { accessToken, refreshToken } = res.data;
                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("refresh", refreshToken);
                originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
                return axiosInstance(originalRequest);
            } catch (err) {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refresh_token");
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;