import axios from "axios";
import {useAuthStore} from "@/stores/auth.js";
import {useModalStore} from "@/stores/modal.js";
import router from "@/router/index.js";

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        "Content-Type": 'application/json'
    },
    timeout: 5 * 60 * 1000,
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

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error?.response?.data?.status === 401
            && error?.response?.data?.errorCode === 'ERR_TOKEN_EXPIRED') {

            const currentFullPath = router.currentRoute.value.fullPath;
            const modalStore = useModalStore();
            const authStore = useAuthStore();
            authStore.logout();
            modalStore.openModal({
                title: '로그인',
                message: error?.response?.data?.message,
                confirmText: '확인',
                type: 'alert',
                confirm: () => router.push(`/login?bu=${encodeURIComponent(currentFullPath)}`),
                outSideClose: false
            })
        } else {

        }
    }
)

export default api;