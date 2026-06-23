<script setup>
  import {useRoute, useRouter} from "vue-router";
  import {onMounted, ref} from "vue";
  import api from "@/api/index.js";
  import CommonTextarea from "@/components/common/CommonTextarea.vue";
  import CommonButton from "@/components/common/CommonButton.vue";
  import CommonInput from "@/components/common/CommonInput.vue";
  import CommonModal from "@/components/common/CommonModal.vue";
  import CommonDateFormat from "@/components/common/CommonDateFormat.vue";
  import {useModalStore} from "@/stores/modal.js";
  import {storeToRefs} from "pinia";
  import {useAuthStore} from "@/stores/auth.js";

  const router = useRouter();
  const route = useRoute();
  const modalStore = useModalStore();
  const { isShowModal, modalConfig } = storeToRefs(modalStore);
  const authStore = useAuthStore();
  const { user: userInfo } = storeToRefs(authStore);

  const freeBoardId = route.params.id;
  const freeBoard = ref({});
  const isLoading = ref(false);

  const fnMoveFreeBoardList = () => {
    router.push({
      path: `/free-board`,
      query: route.query
    })
  };

  const fnMoveFreeBoardUpdate = () => {
    router.push({
      path: `/free-board/update/${freeBoardId}`,
      query: route.query
    })
  };

  const fnGetFreeBoardDetail = async () => {
    if (isLoading.value) return;

    try {
      isLoading.value = true;
      const response = await api.get(`/free-board/${freeBoardId}`);
      freeBoard.value = response.data
    } catch (e) {
      console.error(e);

      modalStore.openModal({
        title: '잘못된 접근입니다',
        message: '존재하지 않는 에러 로그입니다',
        confirmText: '확인',
        type: 'alert',
        confirm: () => {router.push({path: `/error-log`, query: route.query})},
        outSideClose: false
      })
    } finally {
      isLoading.value = false;
    }
  }

  onMounted(() => {
    fnGetFreeBoardDetail();
  })
</script>

<template>
  <div class="mx-auto space-y-6">
    <div class="flex justify-end gap-3">
      <commonButton @click="fnMoveFreeBoardList" variant="gray">
        목록
      </commonButton>
      <commonButton
          v-if="userInfo !== null && userInfo.id === freeBoard.creator?.id"
          @click="fnMoveFreeBoardUpdate" variant="primary"
      >
        수정
      </commonButton>
    </div>
    <div class="bg-slate-900/50 rounded-2xl border border-slate-800 p-8 space-y-6">
      <div class="w-full">
        <div class="flex justify-between">
          <label class="text-lg font-bold text-slate-400 uppercase tracking-widest">Title</label>
          <div class="w-full flex gap-2 justify-end items-end pb-2">
            <div v-if="freeBoard.creator"
                 class="text-xs font-bold"
            >
              <CommonDateFormat :date="String(freeBoard.createdAt)" format="YYYY년 MM월 DD일"/> {{ freeBoard.creator.userName }} 작성
            </div>
            <div v-if="freeBoard.updater"
                 class="text-xs font-bold"
            >
              / <CommonDateFormat :date="String(freeBoard.updatedAt)" format="YYYY년 MM월 DD일"/> {{ freeBoard.updater.userName }} 수정
            </div>
          </div>
        </div>
        <CommonInput
            v-model="freeBoard.title"
            @labelStr=""
            :disabled="true"
            :maxlength="Number(80)"
        />
      </div>
      <div class="w-full">
        <div class="pb-2">
          <label class="text-lg font-bold text-slate-400 uppercase tracking-widest ">Content</label>
        </div>
        <CommonTextarea
            v-model="freeBoard.content"
            :rows="Number(12)"
            :maxLength="Number(300)"
            :disabled="true"
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