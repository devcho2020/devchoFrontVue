import {defineStore} from "pinia";
import {computed, ref} from "vue";

export const useAuthStore = defineStore('auth', () => {
    const accessToken = ref(localStorage.getItem('accessToken') || null);
    const user = ref(JSON.parse(localStorage.getItem('user')) || null);

    const isLoggedIn = computed(() => !!accessToken.value);

    const setLoginInfo = (token, userInfo) => {
        accessToken.value = token;
        user.value = userInfo;

        localStorage.setItem('accessToken', token);
        localStorage.setItem('user', JSON.stringify(userInfo));
    }

    const logout = () => {
        accessToken.value = null;
        user.value = null;

        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
    }

    return {
        accessToken,
        user,
        isLoggedIn,
        setLoginInfo,
        logout
    }
})