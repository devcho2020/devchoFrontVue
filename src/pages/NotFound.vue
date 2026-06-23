<script setup>
  import CommonButton from "@/components/common/CommonButton.vue";
  import {useRouter} from "vue-router";
  const router = useRouter();
</script>

<template>
  <div class="flex flex-col gap-4 font-bold text-xl items-center justify-center">
    <div>페이지를 찾을 수 없습니다dfs</div>
    <div>입력하신 주소가 잘못되었거나 변경되었을 수 있습니다.</div>
    <CommonButton @click="() => {router.push('/')}">
      HOME으로
    </CommonButton>
  </div>
</template>

<style scoped>

</style>
