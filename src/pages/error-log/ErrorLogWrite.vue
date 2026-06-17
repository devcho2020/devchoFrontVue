<script setup>
  import CommonInput from "@/components/common/CommonInput.vue";
  import CommonSelectBox from "@/components/common/CommonSelectBox.vue";
  import CommonButton from "@/components/common/CommonButton.vue";
  import {computed, reactive, ref} from "vue";
  import CommonTextarea from "@/components/common/CommonTextarea.vue";
  import CommonModal from "@/components/common/CommonModal.vue";
  import api from "@/api/index.js";
  import {useRoute, useRouter} from "vue-router";

  const errorLogWriteModal = reactive({
    title: '',
    message: '',
    confirmText: '',
    cancelText: '',
    confirm: null,
    cancel: null,
    type: 'confirm',
    outSideClose: true
  })

  const areaOptions = [
    {label:'BACKEND', value: 'BACKEND'},
    {label:'FRONTEND', value: 'FRONTEND'},
    {label:'DEVOPS', value: 'DEVOPS'},
  ];

  const form = reactive({
    title: '',
    content: '',
    area: areaOptions[0].value,
  });

  const route = useRoute();
  const router = useRouter();
  const errorLogId = ref(null);
  const isShowModal = ref(false);
  const isLoading = ref(false);
  const validationSubmit = computed(() => !(form.title.trim().length > 2 && form.content.trim().length > 9));

  const fnModalCancel = () => {
    errorLogWriteModal.title = '작성 취소';
    errorLogWriteModal.message = '에러로그 작성을 취소하시겠습니까?';
    errorLogWriteModal.confirmText = '목록';
    errorLogWriteModal.cancelText = '닫기';
    errorLogWriteModal.confirm = () => {router.push({path: '/error-log', query: route.query})};
    errorLogWriteModal.cancel = null;
    isShowModal.value = true
  }

  const fnModalConfirm = () => {
    if (!validationSubmit) {
      return
    }

    errorLogWriteModal.title = '입력 완료';
    errorLogWriteModal.message = '입력하신 에러 로그를 저장하시겠습니까?';
    errorLogWriteModal.confirmText = '저장';
    errorLogWriteModal.cancelText = '닫기';
    errorLogWriteModal.confirm = fnSaveErrorLog;
    errorLogWriteModal.cancel = null;

    isShowModal.value = true
  }

  const fnModalSave = () => {

    errorLogWriteModal.title = '작성 완료';
    errorLogWriteModal.message = '에러로그가 작성되었습니다';
    errorLogWriteModal.confirmText = '확인';
    errorLogWriteModal.confirm = () => {router.push({path: `/error-log/${errorLogId.value}`, query: route.query})};
    errorLogWriteModal.type = 'alert';
    errorLogWriteModal.outSideClose = false;

    isShowModal.value = true
  }

  const fnSaveErrorLog = async () => {
    if (isLoading.value) return;

    try {
      isLoading.value = true;
      const response = await api.post('/error-log', form);
      errorLogId.value = response.data;

      fnModalSave();
    } catch (e) {
      // TODO 작성 실패 처리
      console.error(e)
    } finally {
      isLoading.value = false;
    }
  }

</script>

<template>
  <div class="mx-auto space-y-6">
    <div class="flex justify-end gap-3">
      <commonButton @click="fnModalCancel" variant="gray">취소</commonButton>
      <commonButton @click="fnModalConfirm" variant="primary" :disabled="validationSubmit">
        저장
      </commonButton>
    </div>
    <div class="bg-slate-900/50 rounded-2xl border border-slate-800 p-8 space-y-6">
      <div class="w-full">
        <label class="text-xs font-bold text-slate-400 uppercase tracking-widest">Title</label>
        <CommonInput
            v-model="form.title"
            @labelStr=""
            placeholder="에러 명칭 또는 요약된 제목을 입력해주세요"
            :maxlength="Number(80)"
        />
      </div>

      <div class="w-full">
        <label class="text-xs font-bold text-slate-400 uppercase tracking-widest">Area</label>
        <commonSelectBox v-model="form.area" :options="areaOptions" class="w-full" />
      </div>

      <div class="w-full">
        <label class="text-xs font-bold text-slate-400 uppercase tracking-widest">Content</label>
        <CommonTextarea
            v-model="form.content"
            :rows="Number(12)"
            :maxLength="Number(300)"
            placeholder="에러 원인, 해결 방법, 참고 코드 등을 입력해주세요."
        />
      </div>
    </div>
  </div>

  <CommonModal
      v-model="isShowModal"
      :title="errorLogWriteModal.title"
      :message="errorLogWriteModal.message"
      :confirmText="errorLogWriteModal.confirmText"
      :cancelText="errorLogWriteModal.cancelText"
      :outSideClose="errorLogWriteModal.outSideClose"
      @cancel="errorLogWriteModal.cancel"
      @confirm="errorLogWriteModal.confirm"
      :type="errorLogWriteModal.type"
  />
</template>

<style scoped>

</style>