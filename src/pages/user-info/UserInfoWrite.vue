<script setup>
  import CommonButton from "@/components/common/CommonButton.vue";
  import CommonInput from "@/components/common/CommonInput.vue";
  import {computed, reactive, ref} from "vue";
  import CommonModal from "@/components/common/CommonModal.vue";
  import {useRoute, useRouter} from "vue-router";
  import {useModalStore} from "@/stores/modal.js";
  import {storeToRefs} from "pinia";
  import {commonJS} from "@/script/common.js";
  import api from "@/api/index.js";
  import CommonSelectBox from "@/components/common/CommonSelectBox.vue";

  const route = useRoute()
  const router = useRouter();
  const modalStore = useModalStore();
  const userInfoId = ref(null);
  const isLoading = ref(false);
  const {isShowModal, modalConfig} = storeToRefs(modalStore);

  const levelOption = [
    {label:'일반회원', value: 9},
    {label:'운영' , value: 1}
  ]

  const form = reactive({
    userId: '',
    password: '',
    userName: '',
    position: '',
    level: 9
  })

  const vaildationMessages = reactive({
    userId: {vaildationCheckOk: false, message: '4~10자 영문+숫자 ID를 입력해 주세요'},
    userName: {vaildationCheckOk: false, message: '2~5자를 입력해 주세요'},
    password: {vaildationCheckOk: false, message: '4~15자 비밀번호를 입력해 주세요'},
    passwordCheck: {vaildationCheckOk: false, message: ''}
  })

  const validationCheck = computed(() => {
    return !commonJS.strRegex('userId', form.userId)
        || !commonJS.strRegex('userName', form.userName)
        || !commonJS.strRegex('password', form.password)
        || form.password !== passwordCheck.value
        || !userIdDuplication.duplicationCheckOk
  });

  const loginIdRef = ref(null);
  const passwordCheck = ref('');
  const userIdDuplication = reactive({
    duplicationCheckOk: false,
    userId: ''
  });


  const fnModalCancel = () => {
    modalStore.openModal({
      title: '작성 취소',
      message: '회원 추가를 취소하시겠습니까?',
      confirmText: '목록',
      cancelText: '닫기',
      type: 'confirm',
      confirm: () => {router.push({path: '/user-info', query: route.query})},
      cancel: null,
      outSideClose: true
    })
  };

  const fnVaildationCheck = () => {

    if (userIdDuplication.userId !== form.userId) {
      userIdDuplication.duplicationCheckOk = false;
    }

    if (!commonJS.strRegex('userId', form.userId)) {
      vaildationMessages.userId.vaildationCheckOk = false;
      vaildationMessages.userId.message = '4~10자 영문+숫자 ID를 입력해 주세요'
    } else if (!userIdDuplication.duplicationCheckOk) {
      vaildationMessages.userId.vaildationCheckOk = false;
      vaildationMessages.userId.message = '아이디 중복 확인을 해주세요'
    } else {
      vaildationMessages.userId.vaildationCheckOk = true;
    }

    if (!commonJS.strRegex('userName', form.userName)) {
      vaildationMessages.userName.vaildationCheckOk = false;
      vaildationMessages.userName.message = '2~5자를 입력해 주세요'
    } else {
      vaildationMessages.userName.vaildationCheckOk = true;
    }

    if (!commonJS.strRegex('password', form.password)) {
      vaildationMessages.password.vaildationCheckOk = false;
      vaildationMessages.password.message = '4~15자 비밀번호를 입력해 주세요'
    } else {
      vaildationMessages.password.vaildationCheckOk = true;
    }

    if (form.password !== passwordCheck.value) {
      vaildationMessages.passwordCheck.vaildationCheckOk = false;
      vaildationMessages.passwordCheck.message = '비밀번호가 일치하지 않습니다 다시 확인해 주세요'
    } else {
      vaildationMessages.passwordCheck.vaildationCheckOk = true;
    }
  }

  const fnModalSaveConfirm = () => {
    modalStore.openModal({
      title: '입력 완료',
      message: '입력하신 내용으로 회원을 추가하시겠습니까?',
      confirmText: '저장',
      cancelText: '닫기',
      type: 'confirm',
      confirm: fnSaveUserInfo,
      cancel: null,
      outSideClose: true
    })
  }

  const fnModalSave = () => {
    modalStore.openModal({
      title: '회원 추가 완료',
      message: '회원추가가 완료 되었습니다',
      confirmText: '확인',
      type: 'alert',
      confirm: () => {router.push({path: `/user-info/${userInfoId.value}`, query: route.query})},
      outSideClose: false
    })
  }

  const fnCheckIdDuplication = async () => {
    if (isLoading.value) return;

    try {
      const response = await api.get('/user-info/check-id', {
        params: {
          userId: form.userId
        }
      })
      if (response.data.duplicationCheckOk) {
        userIdDuplication.duplicationCheckOk = true;
        userIdDuplication.userId = form.userId;
        vaildationMessages.userId.vaildationCheckOk = true;

        modalStore.openModal({
          title: '아이디 중복확인',
          message: response.data.message,
          confirmText: '확인',
          type: 'alert',
          confirm: null,
          outSideClose: true
        })
      } else {
        userIdDuplication.duplicationCheckOk = false;

        modalStore.openModal({
          title: '아이디 중복확인',
          message: response.data.message,
          confirmText: '확인',
          type: 'alert',
          confirm: () => {
            loginIdRef.value?.focus()
          },
          outSideClose: true
        })
      }
    } catch (e) {
      console.error(e)
    } finally {
      isLoading.value = false;
    }
  };

  const fnSaveUserInfo = async () => {

    if (!validationCheck) return;

    if (isLoading.value) return;

    try {
      isLoading.value = true;

      const response = await api.post('/user-info', form);
      userInfoId.value = response.data;
      fnModalSave();
    } catch (e) {
      console.error(e);
    } finally {
      isLoading.value = false;
    }
  };
</script>

<template>
  <div class="flex justify-end gap-3">
    <CommonButton @click="fnModalCancel" variant="gray">목록</CommonButton>
    <CommonButton @click="fnModalSaveConfirm" :disabled="validationCheck">수정</CommonButton>
  </div>
  <form class=" mx-auto mt-5 p-6 bg-slate-900 border border-slate-800 rounded-xl shadow-md" onsubmit="return false;">

    <div class="flex flex-col gap-1 pb-2">
      <label class="block text-lg font-medium text-slate-400 mb-1">
        <span class="ml-2 text-xs text-red-700">*</span>
        회원등급
        <span class="text-xs"></span>
      </label>
      <CommonSelectBox
          v-model="form.level"
          :options="levelOption"
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
                @input="fnVaildationCheck"
                ref="loginIdRef"
                widthClass="w-3/5"
                type="text"
                :maxlength="10"
                :disabled="isLoading"
                placeholder="아이디를 입력해 주세요"
            />
            <div class="w-2/5 flex items-end">
              <div v-if="!vaildationMessages.userId.vaildationCheckOk"
                   class="ml-2 text-xs text-red-700 align-text-bottom">
                {{ vaildationMessages.userId.message }}
              </div>
            </div>
          </div>
          <CommonButton @click="fnCheckIdDuplication"
                        :disabled="userIdDuplication.duplicationCheckOk || !commonJS.strRegex('userId', form.userId)">
            중복확인
          </CommonButton>
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
              @input="fnVaildationCheck"
              widthClass="w-3/5"
              type="text"
              :maxlength="8"
              :disabled="isLoading"
              placeholder="이름을 입력해 주세요"
          />
          <div class="w-2/5 flex items-end">
            <div v-if="!vaildationMessages.userName.vaildationCheckOk"
                 class="ml-2 text-xs text-red-700 align-text-bottom">
              {{ vaildationMessages.userName.message }}
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-2 border-b pb-2 border-slate-800">
        <label class="block text-lg font-medium text-slate-400 mb-1">
          <span class="ml-2 text-xs text-red-700">*</span>
          비밀번호/비밀번호 확인
          <span class="text-xs">(4~15자)</span>
        </label>
        <div class="w-4/5 flex justify-start">
          <CommonInput
              v-model="form.password"
              @input="fnVaildationCheck"
              widthClass="w-3/5"
              inputType="password"
              :maxlength="15"
              :disabled="isLoading"
              placeholder="비밀번호를 입력해 주세요"
          />
          <div class="w-2/5 flex items-end">
            <div v-if="!vaildationMessages.password.vaildationCheckOk"
                 class="ml-2 text-xs text-red-700 align-text-bottom">
              {{ vaildationMessages.password.message }}
            </div>
          </div>
        </div>
        <div class="w-4/5 flex justify-start">
          <CommonInput
              v-model="passwordCheck"
              @input="fnVaildationCheck"
              widthClass="w-3/5"
              inputType="password"
              :maxlength="15"
              :disabled="isLoading"
              placeholder="비밀번호를 확인해 주세요"
          />
          <div class="w-2/5 flex items-end">
            <div v-if="!vaildationMessages.passwordCheck.vaildationCheckOk"
                 class="ml-2 text-xs text-red-700 align-text-bottom">
              {{ vaildationMessages.passwordCheck.message }}
            </div>
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
              :disabled="isLoading"
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