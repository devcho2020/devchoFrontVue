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

  const router = useRouter();
  const route = useRoute();
  const modalStore = useModalStore();
  const { isShowModal, modalConfig } = storeToRefs(modalStore);

  const tipBoardId = route.params.id;
  const tipBoard = ref({});
  const isLoading = ref(false);

  const fnMoveTipBoardList = () => {
    router.push({
      path: `/tip-board`,
      query: route.query
    })
  };

  const fnMoveTipBoardUpdate = () => {
    router.push({
      path: `/tip-board/update/${tipBoardId}`,
      query: route.query
    })
  };

  const fnGetTipBoardDetail = async () => {
    if (isLoading.value) return;

    try {
      isLoading.value = true;
      const response = await api.get(`/tip-board/${tipBoardId}`);
      tipBoard.value = response.data
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
    fnGetTipBoardDetail();
  })
</script>

<template>
  <div class="mx-auto space-y-6">
    <div class="flex justify-end gap-3">
      <commonButton @click="fnMoveTipBoardList" variant="gray">
        목록
      </commonButton>
      <commonButton @click="fnMoveTipBoardUpdate" variant="primary">
        수정
      </commonButton>
    </div>
    <div class="bg-slate-900/50 rounded-2xl border border-slate-800 p-8 space-y-6">
      <div class="w-full">
        <div class="flex justify-between pb-2">
          <label class="text-xs font-bold text-slate-400 uppercase tracking-widest">Title</label>
          <span class="text-ls font-bold">
            <CommonDateFormat :date="String(tipBoard.updatedAt || tipBoard.createdAt)" format="YYYY년 MM월 DD일"/>
            {{ tipBoard.updatedAt ? '수정' : '작성' }}
          </span>
        </div>
        <CommonInput
            v-model="tipBoard.title"
            @labelStr=""
            :disabled="true"
            placeholder="에러 명칭 또는 요약된 제목을 입력하세요"
            :maxlength="Number(80)"
        />
      </div>

      <div class="w-full">
        <div class="pb-2">
          <label class="text-xs font-bold text-slate-400 uppercase tracking-widest ">Content</label>
        </div>
        <CommonTextarea
            v-model="tipBoard.content"
            :rows="Number(12)"
            :maxLength="Number(300)"
            :disabled="true"
            placeholder="에러 원인, 해결 방법, 참고 코드 등을 자유롭게 적어주세요."
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