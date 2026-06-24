import {createRouter, createWebHistory, RouterView} from "vue-router";
import HomePage from "@/pages/Home.vue";
import MainLayout from "@/layout/MainLayout.vue";
import {COMMON_MAIN_MENU} from '@/components/common/CommonMainMenu.vue'
import {useAuthStore} from "@/stores/auth.js";
import {storeToRefs} from "pinia";
import {useModalStore} from "@/stores/modal.js";
import NotFound from "@/pages/NotFound.vue";

const componentsMap = {
    'NotFound': NotFound,
    'HomePage': HomePage,
    'RouterView': RouterView,
    'Login': () => import('@/pages/Login.vue'),
    'UserJoin': () => import('@/pages/UserJoin.vue'),
    'Profile': () => import('@/pages/Profile.vue'),
    'FreeBoard': () => import('@/pages/free-board/FreeBoard.vue'),
    'FreeBoardWrite': () => import('@/pages/free-board/FreeBoardWrite.vue'),
    'FreeBoardUpdate': () => import('@/pages/free-board/FreeBoardUpdate.vue'),
    'FreeBoardDetail': () => import('@/pages/free-board/FreeBoardDetail.vue'),
    'TipBoard': () => import('@/pages/tip-board/TipBoard.vue'),
    'TipBoardWrite': () => import('@/pages/tip-board/TipBoardWrite.vue'),
    'TipBoardUpdate': () => import('@/pages/tip-board/TipBoardUpdate.vue'),
    'TipBoardDetail': () => import('@/pages/tip-board/TipBoardDetail.vue'),
    'ErrorLog': () => import('@/pages/error-log/ErrorLog.vue'),
    'ErrorLogWrite': () => import('@/pages/error-log/ErrorLogWrite.vue'),
    'ErrorLogUpdate': () => import('@/pages/error-log/ErrorLogUpdate.vue'),
    'ErrorLogDetail': () => import('@/pages/error-log/ErrorLogDetail.vue'),
    'UserInfo': () => import('@/pages/user-info/UserInfo.vue'),
    'UserInfoWrite': () => import('@/pages/user-info/UserInfoWrite.vue'),
    'UserInfoUpdate': () => import('@/pages/user-info/UserInfoUpdate.vue'),
    'UserInfoDetail': () => import('@/pages/user-info/UserInfoDetail.vue'),
}

const commonMainMenu = COMMON_MAIN_MENU.map((cmm) => {

    if (cmm.children && cmm.children.length > 0) {
        cmm.children = cmm.children.map((children) => {
            if (!children.component && typeof children.component !== 'string') return;
            return {
                ...children,
                component: componentsMap[children.component]
            }
        })
    }

    return {
        ...cmm,
        component: componentsMap[cmm.component]
    }
})

const routes = [
    {
        path: '/',
        component: MainLayout,
        children: commonMainMenu
    }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

router.beforeEach((to, from, next) => {

    const authStore = useAuthStore();
    const { accessToken, user: userInfo } = storeToRefs(authStore);
    const userLevel = userInfo?.value?.level || 9;
    const modalStore = useModalStore();

    if (to.meta.requiresAuth
        && !accessToken.value) {
        modalStore.openModal({
            title: '권한 없음',
            message: '로그인 후 이용해 주세요',
            confirmText: '확인',
            cancelText: '',
            type: 'alert',
            confirm: () => {router.push(`/login?bu=${encodeURIComponent(to.fullPath)}`)},
            cancel: null,
            outSideClose: false
        })
        return next(false);
    }

    if (!isNaN(to.meta?.level)
        && !(parseInt(to.meta.level) >=userLevel)) {
        modalStore.openModal({
            title: '권한 없음',
            message: '접근 권한이 없습니다\n관리자에게 문의해주세요',
            confirmText: '확인',
            cancelText: '',
            type: 'alert',
            confirm: () => {router.push('/')},
            cancel: null,
            outSideClose: false
        })
        return next(false);
    }

    next()
})

export default router;