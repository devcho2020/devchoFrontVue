<script setup>

  import {useRoute, useRouter} from "vue-router";
  import {computed, onMounted, reactive, ref} from "vue";
  import api from "@/api/index.js";
  import CommonTextarea from "@/components/common/CommonTextarea.vue";
  import CommonButton from "@/components/common/CommonButton.vue";
  import CommonInput from "@/components/common/CommonInput.vue";
  import CommonModal from "@/components/common/CommonModal.vue";
  import {useModalStore} from "@/stores/modal.js";
  import {storeToRefs} from "pinia";

  const route = useRoute();
  const router = useRouter();

  const modalStore = useModalStore();
  const { isShowModal, modalConfig } = storeToRefs(modalStore);

  const freeBoardId = route.params.id;
  const isLoading = ref(false);
  const form = reactive({
    title: '',
    content: '',
  });
  const validationSubmit = computed(() => !(form.title.trim().length > 2 && form.content.trim().length > 9));

  const fnModalCancel = () => {
    modalStore.openModal({
      title: '수정 취소',
      message: '자유게시판 내용 수정을 취소하시겠습니까?',
      confirmText: '취소',
      cancelText: '닫기',
      type: 'confirm',
      confirm: () => {router.push({path: `/free-board/${freeBoardId}`, query: route.query})},
      cancel: null,
      outSideClose: true
    })
  };

  const fnModalSaveConfirm = () => {
    if (!validationSubmit) {
      return
    }

    modalStore.openModal({
      title: '입력 완료',
      message: '입력하신 자유게시판 내용을 저장하시겠습니까?',
      confirmText: '저장',
      cancelText: '닫기',
      type: 'confirm',
      confirm: fnSaveFreeBoard,
      cancel: null,
      outSideClose: true
    })
  }

  const fnModalSave = () => {
    modalStore.openModal({
      title: '수정 완료',
      message: '자유게시판 내용이 수정되었습니다',
      confirmText: '확인',
      type: 'alert',
      confirm: () => {router.push({path: `/free-board/${freeBoardId}`, query: route.query})},
      outSideClose: true
    })
  }

  const getFreeBoardDetail = async () => {
    if (isLoading.value) return

    try {
      isLoading.value = true;
      const response = await api.get(`/free-board/${freeBoardId}`);
      const { title, content, area } = response.data;
      Object.assign(form, {title, content, area});
    } catch (e) {
      console.error(e);
    } finally {
      isLoading.value = false;
    }
  };

  const fnSaveFreeBoard = async () => {
      if (isLoading.value) return;

      try {
        isLoading.value = true;
        await api.put(`/free-board/${freeBoardId}`, form);
        fnModalSave();
      } catch (e) {
        console.error(e);
      } finally {
        isLoading.value = false;
      }
  };


  onMounted(() => {
    getFreeBoardDetail();
  })
</script>

<template>
  <div class="mx-auto space-y-6">
    <div class="flex justify-end gap-3">
      <commonButton @click="fnModalCancel" variant="gray">
        취소
      </commonButton>
      <commonButton
          @click="fnModalSaveConfirm"
          variant="primary"
          :disabled="validationSubmit"
      >
        저장
      </commonButton>
    </div>
    <div class="bg-slate-900/50 rounded-2xl border border-slate-800 p-8 space-y-6">
      <div class="w-full">
        <div class="flex justify-between pb-2">
          <label class="text-lg font-bold text-slate-400 uppercase tracking-widest">Title</label>
        </div>
        <CommonInput
            v-model="form.title"
            @labelStr=""
            placeholder="자유게시판 제목을 입력해주세요"
            :maxlength="Number(80)"
        />
      </div>

      <div class="w-full">
        <div class="pb-2">
          <label class="text-lg font-bold text-slate-400 uppercase tracking-widest ">Content</label>
        </div>
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