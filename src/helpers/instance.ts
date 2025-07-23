
import axios from "axios";


const baseURL ='https://localhost:7046'

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

// axiosInstance.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//         const originalRequest = error.config;
//         const refresh = getCookie("refresh_token");
//         if (error.response?.status === 401 && !originalRequest._retry && refresh) {
//             originalRequest._retry = true;
//             try {
//                 const res = await axios.post(API_CONTROLLER.auth("/Refresh"), {
//                     refreshToken: refresh,
//                 });
//                 const { accessToken, refreshToken } = res.data;
//                 setCookie("accessToken", accessToken);
//                 setCookie("refresh_token", refreshToken);
//                 originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
//                 return axiosInstance(originalRequest);
//             } catch (err) {
//                 deleteCookie("accessToken");
//                 deleteCookie("refresh_token");
//                 return Promise.reject(err);
//             }
//         }

//         return Promise.reject(error);
//     }
// );

export default axiosInstance;