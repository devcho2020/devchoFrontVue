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

const tipBoardWriteModal = reactive({
  title: '',
  message: '',
  confirmText: '',
  cancelText: '',
  confirm: null,
  cancel: null,
  type: 'confirm',
  outSideClose: true
});

const tipBoardId = ref(null);
const isShowModal = ref(false);
const isLoading = ref(false);
const validationSubmit = computed(() => !(form.title.trim().length > 2 && form.content.trim().length > 9));

const form = reactive({
  title: '',
  content: ''
})

const fnModalCancel = () => {
  tipBoardWriteModal.title = '작성 취소';
  tipBoardWriteModal.message = '팁 게시판 작성을 취소하시겠습니까?';
  tipBoardWriteModal.confirmText = '목록';
  tipBoardWriteModal.cancelText = '닫기';
  tipBoardWriteModal.confirm = () => {router.push({path: '/tip-board', query: route.query})};
  tipBoardWriteModal.cancel = null;
  isShowModal.value = true
}

const fnModalConfirm = () => {
  if (!validationSubmit) {
    return
  }

  tipBoardWriteModal.title = '입력 완료';
  tipBoardWriteModal.message = '입력하신 팁 게시판 내용을 저장하시겠습니까?';
  tipBoardWriteModal.confirmText = '저장';
  tipBoardWriteModal.cancelText = '닫기';
  tipBoardWriteModal.confirm = fnSaveTipBoard;
  tipBoardWriteModal.cancel = null;

  isShowModal.value = true
}

const fnModalSave = () => {

  tipBoardWriteModal.title = '작성 완료';
  tipBoardWriteModal.message = '팁 게시판 작성이 완료되었습니다';
  tipBoardWriteModal.confirmText = '확인';
  tipBoardWriteModal.confirm = () => {router.push({path: `/tip-board/${tipBoardId.value}`, query: route.query})};
  tipBoardWriteModal.type = 'alert';
  tipBoardWriteModal.outSideClose = false;

  isShowModal.value = true
}

const fnSaveTipBoard = async () => {
  if (isLoading.value) return;

  try {
    isLoading.value = true;

    const response = await api.post('/tip-board', form);
    tipBoardId.value = response.data;

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
            placeholder="팁 게시판 제목을 입력해주세요"
            :maxlength="Number(80)"
        />
      </div>

      <div class="w-full">
        <label class="text-xs font-bold text-slate-400 uppercase tracking-widest">Content</label>
        <CommonTextarea
            v-model="form.content"
            :rows="Number(12)"
            :maxLength="Number(300)"
            placeholder="팁 게시판 내용을 입력해주세요"
        />
      </div>
    </div>
  </div>

  <CommonModal
      v-model="isShowModal"
      :title="tipBoardWriteModal.title"
      :message="tipBoardWriteModal.message"
      :confirmText="tipBoardWriteModal.confirmText"
      :cancelText="tipBoardWriteModal.cancelText"
      :outSideClose="tipBoardWriteModal.outSideClose"
      @cancel="tipBoardWriteModal.cancel"
      @confirm="tipBoardWriteModal.confirm"
      :type="tipBoardWriteModal.type"
  />
</template>

<style scoped>

</style>