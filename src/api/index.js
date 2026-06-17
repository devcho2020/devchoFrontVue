import axios from "axios";
import {useAuthStore} from "@/stores/auth.js";

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        "Content-Type": 'application/json'
    },
    timeout: 5000,
})


api.interceptors.request.use(
    (config) => {
        const authStore = useAuthStore();
        if (authStore.accessToken) {
            config.headers.Authorization = `Bearer ${authStore.accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

export default api;