<script setup>
  import {onMounted, reactive, ref} from 'vue';
  import {useRoute, useRouter} from 'vue-router';
  import CommonModal from "@/components/common/CommonModal.vue";
  import api from "@/api/index.js";
  import {useAuthStore} from "@/stores/auth.js";
  import CommonButton from "@/components/common/CommonButton.vue";
  import CommonInput from "@/components/common/CommonInput.vue";
  import {useModalStore} from "@/stores/modal.js";
  import {storeToRefs} from "pinia";

  const router = useRouter();
  const route = useRoute();
  const authStore = useAuthStore();
  const modalStore = useModalStore();
  const { isShowModal, modalConfig } = storeToRefs(modalStore);

  const backUrl = route.query.bu ? decodeURIComponent(route.query.bu) : '/';

  const loginForm = ref({
    loginId: '',
    loginPassword: ''
  });

  const loginIdRef = ref(null);
  const loginPasswordRef = ref(null);

  const isSubmitting = ref(false);

  const loginNullModal = () => {
    modalStore.openModal({
      title: '로그인 실패',
      message: '아이디 또는 비밀번호를 입력해 주세요',
      confirmText: '확인',
      type: 'alert',
      confirm: () => {
        if (loginForm.value?.loginId) {
          loginPasswordRef.value?.focus();
        } else {
          loginIdRef.value?.focus();
        }
      },
      outSideClose: true
    })
  }

  const loginFailModal = (failMsg) => {
    modalStore.openModal({
      title: '로그인 실패',
      message: failMsg,
      confirmText: '확인',
      type: 'alert',
      confirm: () => {loginPasswordRef.value?.focus()},
      cancel: null,
      outSideClose: true
    })
  }

  const loginSuccessModal = () => {
    modalStore.openModal({
      title: '로그인 성공',
      message: '로그인 되었습니다',
      confirmText: '확인',
      type: 'alert',
      confirm: () => {router.replace(backUrl)},
      cancel: null,
      outSideClose: false
    })
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
          :maxlength="20"
          @enter="fnLogin"
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
    </div>

  </div>

  <CommonModal
      v-model="isShowModal"
      :title="modalConfig.title"
      :message="modalConfig.message"
      :confirmText="modalConfig.confirmText"
      :cancelText="modalConfig.cancelText"
      :outSideClose="modalConfig.outSideClose"
      :type="modalConfig.type"
      @confirm="modalConfig.confirm"
      @cancel="modalConfig.cancel"
  />
</template>