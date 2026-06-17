<script setup>
  import CommonTextarea from "@/components/common/CommonTextarea.vue";
  import CommonButton from "@/components/common/CommonButton.vue";
  import CommonInput from "@/components/common/CommonInput.vue";
  import CommonModal from "@/components/common/CommonModal.vue";
  import {useRoute, useRouter} from "vue-router";
  import {computed, reactive, ref} from "vue";
  import api from "@/api/index.js";

  const router = useRouter();
  const route = useRoute();

  const freeBoardWriteModal = reactive({
    title: '',
    message: '',
    confirmText: '',
    cancelText: '',
    confirm: null,
    cancel: null,
    type: 'confirm',
    outSideClose: true
  })

  const freeBoardId = ref(null);
  const isShowModal = ref(false);
  const isLoading = ref(false);
  const validationSubmit = computed(() => !(form.title.trim().length > 2 && form.content.trim().length > 9));

  const form = reactive({
    title: '',
    content: ''
  })

  const fnModalCancel = () => {
    freeBoardWriteModal.title = '작성 취소';
    freeBoardWriteModal.message = '자유게시판 작성을 취소하시겠습니까?';
    freeBoardWriteModal.confirmText = '목록';
    freeBoardWriteModal.cancelText = '닫기';
    freeBoardWriteModal.confirm = () => {router.push({path: '/free-board', query: route.query})};
    freeBoardWriteModal.cancel = null;
    isShowModal.value = true
  }

  const fnModalConfirm = () => {
    if (!validationSubmit) {
      return
    }

    freeBoardWriteModal.title = '입력 완료';
    freeBoardWriteModal.message = '입력하신 자유게시판 내용을 저장하시겠습니까?';
    freeBoardWriteModal.confirmText = '저장';
    freeBoardWriteModal.cancelText = '닫기';
    freeBoardWriteModal.confirm = fnSaveFreeBoard;
    freeBoardWriteModal.cancel = null;

    isShowModal.value = true
  }

  const fnModalSave = () => {

    freeBoardWriteModal.title = '작성 완료';
    freeBoardWriteModal.message = '자유게시판 작성이 완료되었습니다';
    freeBoardWriteModal.confirmText = '확인';
    freeBoardWriteModal.confirm = () => {router.push({path: `/free-board/${freeBoardId.value}`, query: route.query})};
    freeBoardWriteModal.type = 'alert';
    freeBoardWriteModal.outSideClose = false;

    isShowModal.value = true
  }

  const fnSaveFreeBoard = async () => {
    if (isLoading.value) return;

    try {
      isLoading.value = true;

      const response = await api.post('/free-board', form);
      freeBoardId.value = response.data;

      fnModalSave();

    } catch (e) {
      console.error(e);
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
            placeholder="자유게시판 제목을 입력해주세요"
            :maxlength="Number(80)"
        />
      </div>

      <div class="w-full">
        <label class="text-xs font-bold text-slate-400 uppercase tracking-widest">Content</label>
        <CommonTextarea
            v-model="form.content"
            :rows="Number(12)"
            :maxLength="Number(300)"
            placeholder="자유게시판 내용을 입력해주세요"
        />
      </div>
    </div>
  </div>

  <CommonModal
      v-model="isShowModal"
      :title="freeBoardWriteModal.title"
      :message="freeBoardWriteModal.message"
      :confirmText="freeBoardWriteModal.confirmText"
      :cancelText="freeBoardWriteModal.cancelText"
      :outSideClose="freeBoardWriteModal.outSideClose"
      @cancel="freeBoardWriteModal.cancel"
      @confirm="freeBoardWriteModal.confirm"
      :type="freeBoardWriteModal.type"
  />
</template>

<style scoped>

</style>