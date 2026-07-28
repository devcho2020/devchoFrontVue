<script setup>
 import CommonSelectBox from "@/components/common/CommonSelectBox.vue";
 import api from "@/api/index.js";
 import {onMounted, ref, watch} from "vue";

 const props = defineProps({
   modelValue: String,
   parentCode: String,
   isAddAll: {
     type: Boolean,
     default: true
   }
 })

 const isLoading = ref(false);
 const codeOption = ref([]);
 const selectedValue = ref(props.modelValue || null);

 const emit = defineEmits(['update:modelValue'])

 const fnGetAreaOptionList = async () => {
   if (isLoading.value) return;

   try {
     isLoading.value = true;
     const response = await api.get(`/code-info/children/${props.parentCode}`);
     fnSetCodeOptionList(response.data.codeInfoList);

   } catch (e) {
     console.error(e);
   } finally {
     isLoading.value = false;
   }
 };

 const fnSetCodeOptionList = (codeInfoList) => {
   codeOption.value = codeInfoList.map((codeInfo) => {
     return {label: codeInfo.codeName, value: codeInfo.code}
   })

   if (props.isAddAll) {
     codeOption.value.unshift({label: '영영 전체', value: 'all'})
   } else if (props.modelValue === undefined || !props.modelValue) {
     selectedValue.value = codeOption.value[0].value;
   }
 };

 watch(selectedValue, (newSelectedValue)=> {
  emit('update:modelValue', newSelectedValue);
 })

 onMounted(() => {
   fnGetAreaOptionList();
 })
</script>

<template>
  <CommonSelectBox
      v-model="selectedValue"
      :options="codeOption"
      class="w-full"
  />
</template>