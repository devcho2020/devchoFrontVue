<script setup>
  import {useRoute, useRouter} from "vue-router";
  import api from "@/api/index.js";
  import {onMounted, ref} from "vue";
  import CommonSelectBox from "@/components/common/CommonSelectBox.vue";
  import CommonModal from "@/components/common/CommonModal.vue";
  import CommonInput from "@/components/common/CommonInput.vue";
  import CommonButton from "@/components/common/CommonButton.vue";
  import CommonTextarea from "@/components/common/CommonTextarea.vue";
  import {useModalStore} from "@/stores/modal.js";
  import {storeToRefs} from "pinia";
  import CommonDateFormat from "@/components/common/CommonDateFormat.vue";

  const areaOptions = [
    {label:'BACKEND', value: 'BACKEND'},
    {label:'FRONTEND', value: 'FRONTEND'},
    {label:'DEVOPS', value: 'DEVOPS'},
  ];

  const route = useRoute();
  const router = useRouter();
  const modalStore = useModalStore();
  const { isShowModal, modalConfig } = storeToRefs(modalStore);

  const errorLog = ref({});
  const errorLogId = route.params.id;
  const isLoading = ref(false);

  const fnGetErrorLogDetail = async () => {
    if (isLoading.value) return;

    try {
      isLoading.value = true;
      const response = await api.get(`/error-log/${errorLogId}`);
      errorLog.value = response.data;
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

  const fnMoveErrorLogList = () => {
    router.push({
      path: '/error-log',
      query: route.query
    })

  }

  const fnMoveErrorLogUpdate = () => {
    router.push({
        path: `/error-log/update/${errorLogId}`,
        query: route.query
    });
  }

  onMounted(() => {
    fnGetErrorLogDetail();
  })

</script>

<template>
  <div class="mx-auto space-y-6">
    <div class="flex justify-end gap-3">
      <commonButton @click="fnMoveErrorLogList" variant="gray">
        목록
      </commonButton>
      <commonButton @click="fnMoveErrorLogUpdate" variant="primary">
        수정
      </commonButton>
    </div>
    <div class="bg-slate-900/50 rounded-2xl border border-slate-800 pt-4 px-8 space-y-6">
      <div class="w-full">
        <div class="flex justify-between">
          <label class="text-lg font-bold text-slate-400 uppercase tracking-widest">Title</label>
          <div class="w-full flex gap-2 justify-end items-end pb-2">
            <div v-if="errorLog.creator"
                 class="text-xs font-bold"
            >
              <CommonDateFormat :date="String(errorLog.createdAt)" format="YYYY년 MM월 DD일"/> {{ errorLog.creator.userName }} 작성
            </div>
            <div v-if="errorLog.updater"
                 class="text-xs font-bold"
            >
              / <CommonDateFormat :date="String(errorLog.updatedAt)" format="YYYY년 MM월 DD일"/> {{ errorLog.updater.userName }} 수정
            </div>
          </div>
        </div>
        <CommonInput
            v-model="errorLog.title"
            @labelStr=""
            :disabled="true"
            placeholder="에러 명칭 또는 요약된 제목을 입력하세요"
            :maxlength="Number(80)"
        />
      </div>

      <div class="w-full">
        <label class="text-lg font-bold text-slate-400 uppercase tracking-widest">Area</label>
        <commonSelectBox
            v-model="errorLog.area"
            :options="areaOptions"
            :disabled="true"
            class="w-full" />
      </div>

      <div class="w-full">
        <label class="text-lg font-bold text-slate-400 uppercase tracking-widest">Content</label>
        <CommonTextarea
            v-model="errorLog.content"
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