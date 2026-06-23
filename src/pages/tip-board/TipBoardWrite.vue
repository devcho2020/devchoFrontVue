<script setup>
  import CommonTextarea from "@/components/common/CommonTextarea.vue";
  import CommonButton from "@/components/common/CommonButton.vue";
  import CommonInput from "@/components/common/CommonInput.vue";
  import CommonModal from "@/components/common/CommonModal.vue";
  import {useRoute, useRouter} from "vue-router";
  import {computed, reactive, ref} from "vue";
  import api from "@/api/index.js";
  import {useModalStore} from "@/stores/modal.js";
  import {storeToRefs} from "pinia";

  const router = useRouter();
  const route = useRoute();
  const modalStore = useModalStore();
  const { isShowModal, modalConfig } = storeToRefs(modalStore);

  const tipBoardId = ref(null);
  const isLoading = ref(false);
  const validationSubmit = computed(() => !(form.title.trim().length > 2 && form.content.trim().length > 9));

  const form = reactive({
    title: '',
    content: ''
  })

  const fnModalCancel = () => {
    modalStore.openModal({
      title: '작성 취소',
      message: '팁 게시판 작성을 취소하시겠습니까?',
      confirmText: '목록',
      cancelText: '닫기',
      type: 'confirm',
      confirm: () => {router.push({path: '/tip-board', query: route.query})},
      cancel: null,
      outSideClose: true
    })
  }

  const fnModalConfirm = () => {
    if (!validationSubmit) {
      return
    }
    modalStore.openModal({
      title: '입력 완료',
      message: '입력하신 팁 게시판 내용을 저장하시겠습니까?',
      confirmText: '저장',
      cancelText: '닫기',
      type: 'confirm',
      confirm: fnSaveTipBoard,
      cancel: null,
      outSideClose: true
    })
  }

  const fnModalSave = () => {
    modalStore.openModal({
      title: '작성 완료',
      message: '팁 게시판 작성이 완료되었습니다',
      confirmText: '확인',
      type: 'alert',
      confirm: () => {router.push({path: `/tip-board/${tipBoardId.value}`, query: route.query})},
      outSideClose: false
    })
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
        <label class="text-lg font-bold text-slate-400 uppercase tracking-widest">Title</label>
        <CommonInput
            v-model="form.title"
            @labelStr=""
            placeholder="팁 게시판 제목을 입력해주세요"
            :maxlength="Number(80)"
        />
      </div>

      <div class="w-full">
        <label class="text-lg font-bold text-slate-400 uppercase tracking-widest">Content</label>
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