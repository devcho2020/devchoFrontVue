<script setup>

import CommonInput from "@/components/common/CommonInput.vue";
import CommonSelectBox from "@/components/common/CommonSelectBox.vue";
import CodeInfoItems from "@/components/code-info/CodeInfoItems.vue";
import CommonButton from "@/components/common/CommonButton.vue";
import api from "@/api/index.js";
import {onMounted, reactive, ref} from "vue";

const props = defineProps({
        modelValue: Boolean,
        selectCodeInfoForm: Object,
        searchS: String
  });

  const isLoading = ref(false);
  const codeInfoList = ref([]);
  const codeInfoListTotal = ref(0);
  const searchValue = ref('');
  const selectCodeInfoForm = reactive({
    code: '',
    codeLevel: '',
  })

  const searchOption = [
    {label:'코드+이름', value: 'all'},
    {label:'코드', value: 'code'},
    {label:'이름' , value: 'codeName'}
  ]

  const searchOpt = ref('all');
  const modalSearchS = ref(props.searchS);

  const emit = defineEmits(['update:modelValue', 'confirm', 'cancel', 'select']);

const fnSelectedCodeInfo = (codeInfo) => {
  selectCodeInfoForm.code = codeInfo.code
  selectCodeInfoForm.codeLevel = codeInfo.codeLevel
};

  const fnConfirm = () => {
    if (selectCodeInfoForm != null) {
      emit('update:modelValue', false);
      emit('select', selectCodeInfoForm);
    } else {
    }
  }

  const fnCancel = () => {
    emit('update:modelValue', false);
  }

  const fnGetCodeList = async () => {
    if (isLoading.value) return;

    try {
      isLoading.value = true;
      const response = await api.get('/code-info', {
        params: {
          selectedOption: searchOpt.value,
          searchValue: modalSearchS.value
        }
      });
      searchValue.value = modalSearchS.value;
      codeInfoList.value = response.data?.codeInfoList
      codeInfoListTotal.value = response.data?.total;
    } catch (e) {
      console.error(e)
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(() => {
    fnSelectedCodeInfo(props.selectCodeInfoForm);
    fnGetCodeList();
  })

</script>

<template>
  <Teleport to="body">
    <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
    >
      <div v-if="modelValue" class="fixed inset-0 z-[9998] flex items-center justify-center p-4 text-white">
        <div class="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"></div>

        <div class="min-w-200 min-h-150 relative bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden transform transition-all">
          <div class="flex h-full flex-col justify-between min-h-150">

            <div class="w-full h-full">
              <div class="flex flex-col justify-between items-center gap-4">
                <div class="flex w-full justify-between">
                  <div class="flex w-2/3 gap-2">
                    <CommonSelectBox
                        v-model="searchOpt"
                        :options="searchOption"
                    />
                    <CommonInput
                        v-model="modalSearchS"
                        @enter="fnGetCodeList"
                        label="검색어"
                    />
                    <CommonButton
                        @click="fnGetCodeList"
                        variant="gray"
                    >검색</CommonButton>
                  </div>

                </div>
              </div>
              <div class="flex gap-2 mt-4 h-150">

                <div class="bg-slate-900/30 rounded-xl border border-slate-800 overflow-y-auto w-full p-4 group text-lg">
                  <div class="flex justify-between border-b border-slate-800 mb-2">
                    <div>
                        <span>선택된 부모 코드 [{{ selectCodeInfoForm?.code }}]</span>
                    </div>
                    <p>총 {{ codeInfoListTotal }}개</p>
                  </div>
                  <div v-if="codeInfoListTotal === 0" class="text-center">
                    코드를 추가해 주세요
                  </div>
                  <CodeInfoItems v-for="codeInfo in codeInfoList"
                                 :key="codeInfo.code"
                                 :codeInfo="codeInfo"
                                 :isOpen="true"
                                 :searchValue="searchValue"
                                 :selectedCode="selectCodeInfoForm.code"
                                 @dblclick="fnSelectedCodeInfo"
                  />
                </div>

              </div>
            </div>

            <div class="flex border-t border-slate-800">
              <button
                  @click="fnCancel"
                  class="flex-1 px-4 py-4 text-sm font-medium text-slate-500 hover:bg-slate-800/50 transition-colors border-r border-slate-800"
              >취소</button>
              <button
                  @click="fnConfirm"
                  class="flex-1 px-4 py-4 text-sm font-bold text-blue-400 hover:bg-blue-500/5 transition-colors"
              >부모 코드 적용</button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>

</style>