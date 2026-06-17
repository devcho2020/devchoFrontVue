<script setup>
import {useRoute, useRouter} from "vue-router";
  import api from "@/api/index.js";
  import {onMounted, ref} from "vue";
  import CommonSelectBox from "@/components/common/CommonSelectBox.vue";
  import CommonModal from "@/components/common/CommonModal.vue";
  import CommonInput from "@/components/common/CommonInput.vue";
  import CommonButton from "@/components/common/CommonButton.vue";
  import CommonTextarea from "@/components/common/CommonTextarea.vue";

  const areaOptions = [
    {label:'BACKEND', value: 'BACKEND'},
    {label:'FRONTEND', value: 'FRONTEND'},
    {label:'DEVOPS', value: 'DEVOPS'},
  ];

  const route = useRoute();
  const router = useRouter();
  const errorLog = ref({});
  const errorLogId = route.params.id;

  const isLoading = ref(false);
  const isShowModal = ref(false);

  const fnGetErrorLogDetail = async () => {
    if (isLoading.value) return;

    try {
      isLoading.value = true;
      const response = await api.get(`/error-log/${errorLogId}`);
      errorLog.value = response.data;
    } catch (e) {
      isShowModal.value = true;
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
    <div class="bg-slate-900/50 rounded-2xl border border-slate-800 p-8 space-y-6">
      <div class="w-full">
        <label class="text-xs font-bold text-slate-400 uppercase tracking-widest">Title</label>
        <CommonInput
            v-model="errorLog.title"
            @labelStr=""
            :disabled="true"
            placeholder="에러 명칭 또는 요약된 제목을 입력하세요"
            :maxlength="Number(80)"
        />
      </div>

      <div class="w-full">
        <label class="text-xs font-bold text-slate-400 uppercase tracking-widest">Area</label>
        <commonSelectBox
            v-model="errorLog.area"
            :options="areaOptions"
            :disabled="true"
            class="w-full" />
      </div>

      <div class="w-full">
        <label class="text-xs font-bold text-slate-400 uppercase tracking-widest">Content</label>
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
      title="잘못된 접근입니다"
      message="존재하지 않는 에러 로그입니다"
      :outSideClose="false"
      @confirm="() => {router.push({path: `/error-log`, query: route.query})}"
  />
</template>

<style scoped>

</style>