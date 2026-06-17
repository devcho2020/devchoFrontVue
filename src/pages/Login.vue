<script setup>
import {onMounted, reactive, ref} from 'vue';
  import {useRoute, useRouter} from 'vue-router';
  import CommonModal from "@/components/common/CommonModal.vue";
  import api from "@/api/index.js";
  import {useAuthStore} from "@/stores/auth.js";
  import CommonButton from "@/components/common/CommonButton.vue";
import CommonInput from "@/components/common/CommonInput.vue";

  const loginModal = reactive({
    title: '로그인 실패',
    message: '아이디 또는 비밀번호를 확인해 주세요',
    confirmText: '확인',
    cancelText: '',
    confirm: null,
    cancel: null,
    type: 'alert',
    outSideClose: true
  });

  const router = useRouter();
  const route = useRoute();
  const authStore = useAuthStore();
  const backUrl = route.query.bu ? decodeURIComponent(route.query.bu) : '/';

  const isShowModal = ref(false);

  const loginForm = ref({
    loginId: '',
    loginPassword: ''
  });

  const loginIdRef = ref(null);
  const loginPasswordRef = ref(null);

  const isSubmitting = ref(false);

  const loginNullModal = () => {
    loginModal.title = '로그인 실패';
    loginModal.message = '아이디 또는 비밀번호를 입력해 주세요';
    loginModal.confirmText = '확인';
    loginModal.cancelText = '';
    loginModal.confirm = () => {
      if (loginForm.value?.loginId) {
        loginPasswordRef.value?.focus();
      } else {
        loginIdRef.value?.focus();
      }
    };
    loginModal.cancel = null;
    loginModal.type = 'alert';

    isShowModal.value = true;
  }

  const loginFailModal = (failMsg) => {
    loginModal.title = '로그인 실패';
    loginModal.message = failMsg;
    loginModal.confirmText = '확인';
    loginModal.cancelText = '';
    loginModal.confirm = () => {loginPasswordRef.value?.focus();};
    loginModal.cancel = null;
    loginModal.type = 'alert';

    isShowModal.value = true;
  }

  const loginSuccessModal = () => {
    loginModal.title = '로그인 성공';
    loginModal.message = '로그인 되었습니다';
    loginModal.confirmText = '확인';
    loginModal.cancelText = '';
    loginModal.confirm = () => {router.replace(backUrl)};
    loginModal.cancel = null;
    loginModal.type = 'alert';

    isShowModal.value = true;
  }

  // 로그인 실행 함수
  const fnLogin = async () => {
    if (!loginForm.value.loginId || !loginForm.value.loginPassword) {
      loginNullModal();
      return;
    }

    try {
      isSubmitting.value = true;

      const response = await api.post('/auth/login', loginForm.value);

      if (response?.data?.loginResult) {
        authStore.setLoginInfo(response.data.token, response.data.userInfo);
        loginSuccessModal();
      } else {
        loginFailModal(response.data?.failMsg);
      }

    } catch (error) {
      console.error('로그인 실패:', error);
    } finally {
      isSubmitting.value = false;
    }
  };

  onMounted(() => {
    if (authStore.accessToken) router.replace(backUrl);

    loginIdRef.value?.focus();
  })

</script>

<template>
  <div class="max-w-md mx-auto mt-20 p-6 bg-slate-900 border border-slate-800 rounded-xl shadow-md">
    <h2 class="text-2xl font-bold text-center text-white mb-6 tracking-wide">SIGN IN</h2>

    <div>
      <div class="pb-2">
        <label class="block text-sm font-medium text-slate-400 mb-1">Username</label>
      </div>
      <CommonInput
          v-model="loginForm.loginId"
          ref="loginIdRef"
          inputRef="loginIdRef"
          type="text"
          :maxlength="20"
          placeholder="아이디를 입력하세요"
      />
    </div>

    <div>
      <div class="pb-2">
        <label class="block text-sm font-medium text-slate-400 mb-1">Password</label>
      </div>
      <CommonInput
          v-model="loginForm.loginPassword"
          ref="loginPasswordRef"
          type="password"
          maxlength="20"
          placeholder="비밀번호를 입력하세요"
      />
    </div>
    <div class="flex gap-4 pt-4">

        <CommonButton type="button" buttonWidthClass="w-full">
          회원가입
        </CommonButton>
        <CommonButton type="submit" buttonWidthClass="w-full"
                      @click="fnLogin"
          :disabled="isSubmitting"
        >
          로그인
        </CommonButton>
<!--        <button-->
<!--            type="submit"-->
<!--            :disabled="isSubmitting"-->
<!--            class="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-semibold rounded-lg transition-colors mt-2"-->
<!--        >-->
<!--          {{ isSubmitting ? '인증 중...' : '로그인' }}-->
<!--        </button>-->
    </div>

  </div>

  <CommonModal
      v-model="isShowModal"
      :title="loginModal.title"
      :message="loginModal.message"
      :confirmText="loginModal.confirmText"
      :cancelText="loginModal.cancelText"
      :outSideClose="loginModal.outSideClose"
      @cancel="loginModal.cancel"
      @confirm="loginModal.confirm"
      :type="loginModal.type"
  />
</template>