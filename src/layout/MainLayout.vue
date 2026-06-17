<script setup>
  import {useRoute, useRouter} from "vue-router";
  import {computed, reactive, ref} from "vue";
  import {COMMON_MAIN_MENU} from "@/components/common/CommonMainMenu.vue"
  import CommonButton from "@/components/common/CommonButton.vue";
  import {useAuthStore} from "@/stores/auth.js";
  import CommonModal from "@/components/common/CommonModal.vue";
  import {storeToRefs} from "pinia";

  const route = useRoute();
  const router = useRouter();
  const authStore = useAuthStore();
  const { accessToken, user: userInfo } = storeToRefs(authStore);

  const isShowModal = ref(false);

  const mainMenuList = computed(() => {
    return COMMON_MAIN_MENU.filter((mainMenu) => {

      if (mainMenu.type !== 'side') return false;
      if (!mainMenu.level) return true;
      const userLevel = userInfo?.value?.level || 9999;
      return mainMenu.level >= userLevel;
    })
  })

  const mainModal = reactive({
    title: '',
    message: '',
    confirmText: '',
    cancelText: '',
    confirm: null,
    cancel: null,
    type: 'confirm',
    outSideClose: true
  });

  const pageTitle = computed(() => route.meta.title || '');
  const pageSubTitle = computed(() => route.meta.subTitle || '');
  const paths = computed(() => route.path === '/' ? '' : route.path);

  
  const fnLogout = () => {

    mainModal.title = '로그아웃';
    mainModal.message = '로그아웃 하시겠습니까?';
    mainModal.confirmText = '로그아웃';
    mainModal.type = 'confirm'
    mainModal.confirm = () => {
      authStore.logout();
      router.go(0);
    };
    mainModal.cancelText = '취소'
    mainModal.cancel = null;
    isShowModal.value = true
  }

</script>

<template>
  <div class="overflow-auto bg-slate-950 text-slate-200 font-mono h-screen">

    <nav class="fixed left-0 top-0 h-full w-30 bg-slate-900 border-r border-slate-800 flex flex-col items-center py-8 z-20">
      <router-link v-if="accessToken" to="/" class="flex w-20 h-15 bg-blue-600 rounded items-center justify-center mb-12 font-bold text-white">
        {{ userInfo?.userName }}
      </router-link>
      <router-link v-if="!accessToken" to="/" class="flex w-20 h-15 bg-gray-700 rounded items-center justify-center mb-12 font-bold text-white">
        HOME
      </router-link>
      <div class="flex-1 space-y-8 text-slate-400">
        <template v-for="(mainMenu, i) in mainMenuList" :key="i">
          <router-link :to="'/' + mainMenu.path"
                       :class="route.path === '/' + mainMenu.path ? 'text-white': ''"
                       class="block hover:text-white cursor-pointer text-center">
            <span class="block text-xs">{{mainMenu.title}}</span>
          </router-link>
        </template>
      </div>
    </nav>

    <div class="ml-28">
      <header
          class="h-14 border-b border-slate-800 flex items-center px-8 bg-slate-950/50 backdrop-blur-md sticky top-0">
        <div class="flex justify-between w-full h-8 items-center">
          <div class="text-xs text-slate-500 uppercase tracking-widest">
            <span>/cho<span class="text-blue-400">{{ paths }}</span></span>
          </div>
          <div v-if="!accessToken && !route.path.includes('/login')">
            <CommonButton
                @click="() => {router.push(`/login?bu=${encodeURIComponent(route.fullPath)}`)}"
            >
              Login
            </CommonButton>
          </div>
          <div v-if="accessToken">
            <CommonButton
                @click="() => {fnLogout()}"
            >
              Logout
            </CommonButton>
          </div>
        </div>
      </header>

      <main class="max-w-8xl px-16 py-4 min-w-240">
        <section class="h-8 mb-12">
          <h2 v-if="pageTitle" class="text-3xl font-bold text-white mb-2">{{ pageTitle }}</h2>
          <p class="text-slate-400">{{ pageSubTitle }}</p>
        </section>

        <div class="border-t border-slate-800 pt-4">
          <RouterView/>
        </div>
      </main>
    </div>

  </div>

  <CommonModal
      v-model="isShowModal"
      :title="mainModal.title"
      :message="mainModal.message"
      :confirmText="mainModal.confirmText"
      :cancelText="mainModal.cancelText"
      :outSideClose="mainModal.outSideClose"
      @cancel="mainModal.cancel"
      @confirm="mainModal.confirm"
      :type="mainModal.type"
  />
</template>

<style scoped>

</style>