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
  const codeInfoForm = reactive({
    code: '',
    parentCode: '',
    codeLevel: 0,
    codeName: '',
    codeSort: 1,
    useYn: '',
  })

  const searchOption = [
    {label:'코드+이름', value: 'all'},
    {label:'코드', value: 'code'},
    {label:'이름' , value: 'codeName'}
  ]
  const useYnOption = [
    {label: '사용', value: true},
    {label: '미사용', value: false}
  ]

  const searchOpt = ref('all');
  const searchS = ref(props.searchS);

  const emit = defineEmits(['update:modelValue', 'save', 'cancel']);

  const fnSetParentCode = (codeInfo) => {
    if (codeInfo?.code) {
      codeInfoForm.parentCode = codeInfo.code;
      codeInfoForm.codeLevel = codeInfo.codeLevel + 1;
    } else {
      codeInfoForm.parentCode = '';
      codeInfoForm.codeLevel = 0;
    }
  };

  const fnSaveCodeInfo = async () => {
    if (isLoading.value) return;
    try {
      isLoading.value = true;

      const response = await api.post('/code-info', codeInfoForm);

      console.log(response)
      emit('save');
      emit('update:modelValue', false);

    } catch (e) {
      console.error(e)
    } finally {
      isLoading.value = false;
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
          searchValue: searchS.value
        }
      });
      searchValue.value = searchS.value;
      codeInfoList.value = response.data?.codeInfoList
      codeInfoListTotal.value = response.data?.total;
    } catch (e) {
      console.error(e)
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(() => {
    fnSetParentCode(props.selectCodeInfoForm);
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

        <div class="min-w-250 min-h-150 relative bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden transform transition-all">
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
                        v-model="searchS"
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

                <div class="bg-slate-900/30 rounded-xl border border-slate-800 w-2/6 p-4 max-h-150 overflow-auto">
                  <div class="sticky top-0 right-0 flex justify-end border-b border-slate-800 mb-2 bg-slate-900/90 z-10">
                    <span>총 {{ codeInfoListTotal }}개</span>
                  </div>
                  <div class="min-w-max">
                    <div v-if="codeInfoListTotal === 0" class="text-center text-slate-500 py-8">
                      코드를 추가해 주세요
                    </div>

                    <CodeInfoItems
                        v-for="codeInfo in codeInfoList"
                        :key="codeInfo.code"
                        :codeInfo="codeInfo"
                        :searchValue="searchValue"
                        :selectedCode="selectCodeInfoForm.parentCode"
                        @dblclick="fnSetParentCode"
                    />
                  </div>
                </div>
                <div class="bg-slate-900/30 rounded-xl border border-slate-800 overflow-hidden w-4/6 p-4">

                  <div class="flex flex-col gap-2">
                    <div class="w-full">
                      <label class="text-lg font-bold text-slate-400 uppercase tracking-widest">
                        코드명(수정불가)
                      </label>
                      <div class="flex gap-2">
                        <CommonInput
                            v-model="codeInfoForm.code"
                            @labelStr=""
                            :maxlength="20"
                            placeholder="코드명을 작성해 주세요(영문 대문자 4~20자)"
                        />
                        <CommonInput
                            v-model="codeInfoForm.code"
                            @labelStr=""
                            :maxlength="20"
                            disabled
                            placeholder="부모코드_코드명 으로 적용됩니다"
                        />
                        <CommonButton
                            @click="fnSetParentCode"
                        >중복 확인</CommonButton>
                      </div>
                    </div>
                    <div class="w-full">
                      <label class="text-lg font-bold text-slate-400 uppercase tracking-widest">
                        부모코드
                      </label>
                      <div class="flex gap-2">
                        <CommonInput
                            v-model="codeInfoForm.parentCode"
                            @labelStr=""
                            disabled
                            placeholder="좌측 코드 목록에서 코드를 더블클릭해 선택해 주세요"
                        />
                        <CommonButton
                            @click="fnSetParentCode"
                            variant="gray"
                        >초기화</CommonButton>
                      </div>
                    </div>
                    <div class="w-full">
                      <label class="text-lg font-bold text-slate-400 uppercase tracking-widest">
                        코드 레벨 (대분류 : 0)
                      </label>
                      <CommonInput
                          v-model="codeInfoForm.codeLevel"
                          @labelStr=""
                          disabled
                          placeholder=" "
                      />
                    </div>
                    <div class="w-full">
                      <label class="text-lg font-bold text-slate-400 uppercase tracking-widest">
                        코드 명
                      </label>
                      <CommonInput
                          v-model="codeInfoForm.codeName"
                          @labelStr=""
                          :maxlength="10"
                          placeholder="코드 명을 입력해 주세요(한글 또는 영어 2~10자)"
                      />
                    </div>
                    <div class="w-full">
                      <label class="text-lg font-bold text-slate-400 uppercase tracking-widest">
                        코드 순서
                      </label>
                      <CommonInput
                          v-model="codeInfoForm.codeSort"
                          inputType="Number"
                          @labelStr=""
                          placeholder=" "
                      />
                    </div>
                    <div class="w-full">
                      <label class="text-lg font-bold text-slate-400 uppercase tracking-widest">
                        사용 여부
                      </label>
                      <CommonSelectBox
                          v-model="codeInfoForm.useYn"
                          :options="useYnOption"
                      />
                    </div>
                  </div>

                </div>
              </div>
            </div>


            <div class="flex border-t border-slate-800">
              <button
                  @click="fnCancel"
                  class="flex-1 px-4 py-4 text-sm font-medium text-slate-500 hover:bg-slate-800/50 transition-colors border-r border-slate-800"
              >취소</button>
              <button
                  @click="fnSaveCodeInfo"
                  class="flex-1 px-4 py-4 text-sm font-bold text-blue-400 hover:bg-blue-500/5 transition-colors"
              >코드 추가</button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>

</style>