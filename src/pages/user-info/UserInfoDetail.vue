<script setup>
  import CommonButton from "@/components/common/CommonButton.vue";
  import CommonInput from "@/components/common/CommonInput.vue";
  import {onMounted, reactive, ref} from "vue";
  import CommonModal from "@/components/common/CommonModal.vue";
  import {useRoute, useRouter} from "vue-router";
  import {useModalStore} from "@/stores/modal.js";
  import {storeToRefs} from "pinia";
  import api from "@/api/index.js";
  import CommonSelectBox from "@/components/common/CommonSelectBox.vue";

  const route = useRoute();
  const router = useRouter();
  const modalStore = useModalStore();
  const userInfoId = ref(route.params.id);
  const isLoading = ref(false);
  const {isShowModal, modalConfig} = storeToRefs(modalStore);

  const levelOption = [
    {label: '일반회원', value: 9},
    {label: '운영', value: 1}
  ]

  const form = reactive({
    userId: '',
    password: '',
    userName: '',
    position: '',
    level: 9
  })

  const loginIdRef = ref(null);

  const fnMoveUserInfoList = () => {
    router.push({
      path: '/user-info',
      query: route.query
    })
  };
  const fnMoveUserInfoUpdate = () => {
    router.push({
      path: `/user-info/update/${userInfoId.value}`,
      query: route.query
    })
  };

  const fnModalResetUserPassword = () => {
    modalStore.openModal({
      title: '비밀번호 초기화',
      message: '사용자 비밀번호를 초기화 하시겠습니까?',
      confirmText: '호기화',
      cancelText: '취소',
      type: 'confirm',
      confirm: fnResetUserPassword,
      cancel: null,
      outSideClose: true
    })
  };

  const fnResetUserPassword = async () => {
      if (isLoading.value) return;

      try {
        isLoading.value = true;

        await api.put(`/user-info/reset-password/${userInfoId.value}`)

        modalStore.openModal({
          title: '비밀번호 초기화',
          message: '비밀번호가 초기화 되었습니다',
          confirmText: '확인',
          type: 'alert',
          confirm: null,
          outSideClose: true
        })
      } catch (e) {

      } finally {
        isLoading.value = false;
      }
  };

  const fnGetUserInfo = async () => {
      if (isLoading.value) return;

      try {
        isLoading.value = true;

        const response = await api.get(`/user-info/${userInfoId.value}`);
        const { userId, userName, position, level } = response.data

        form.userId = userId;
        form.userName = userName;
        form.position = position;
        form.level = level;

      } catch (e) {
        console.error(e);
      } finally {
        isLoading.value = false;
      }
  };


  onMounted(() => {
    fnGetUserInfo();
  })
</script>

<template>
  <div class="flex justify-end gap-3">
    <CommonButton @click="fnMoveUserInfoList" variant="gray">목록</CommonButton>
    <CommonButton @click="fnModalResetUserPassword" >비밀번호<br/>초기화</CommonButton>
    <CommonButton @click="fnMoveUserInfoUpdate" >수정</CommonButton>
  </div>
  <form class=" mx-auto mt-5 p-6 bg-slate-900 border border-slate-800 rounded-xl shadow-md" onsubmit="return false;">

    <div class="flex flex-col gap-1 border-b pb-2 border-slate-800">
      <label class="block text-lg font-medium text-slate-400 mb-1">
        <span class="ml-2 text-xs text-red-700">*</span>
        회원등급
        <span class="text-xs"></span>
      </label>
      <CommonSelectBox
          v-model="form.level"
          :options="levelOption"
          :disabled="true"
      />
    </div>
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-1 border-b pb-2 border-slate-800">
        <label class="block text-lg font-medium text-slate-400 mb-1">
          <span class="ml-2 text-xs text-red-700">*</span>
          ID
          <span class="text-xs">(4~10 영문 + 숫자)</span>
        </label>
        <div class="flex justify-between">
          <div class="w-4/5 flex justify-start">
            <CommonInput
                v-model="form.userId"
                ref="loginIdRef"
                widthClass="w-3/5"
                type="text"
                :maxlength="10"
                :disabled="true"
                placeholder="아이디를 입력해 주세요"
            />
            <div class="w-2/5 flex items-end">
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-1 border-b pb-2 border-slate-800">
        <label class="block text-lg font-medium text-slate-400 mb-1">
          <span class="ml-2 text-xs text-red-700">*</span>
          이름
        </label>
        <div class="w-4/5 flex justify-start">
          <CommonInput
              v-model="form.userName"
              widthClass="w-3/5"
              type="text"
              :maxlength="8"
              :disabled="true"
              placeholder="이름을 입력해 주세요"
          />
          <div class="w-2/5 flex items-end">
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-1 border-b pb-2 border-slate-800">
        <label class="block text-lg font-medium text-slate-400 mb-1">position</label>
        <div class="w-4/5 flex justify-start">
          <CommonInput
              v-model="form.position"
              widthClass="w-3/5"
              type="text"
              :maxlength="30"
              :disabled="true"
              placeholder="개발 position을 입력해 주세요"
          />
          <div class="w-2/5">
          </div>
        </div>
      </div>
    </div>
  </form>
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

<style scoped>

</style>