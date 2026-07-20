<script setup>

  import CommonInput from "@/components/common/CommonInput.vue";
  import CommonSelectBox from "@/components/common/CommonSelectBox.vue";
  import CodeInfoItems from "@/components/code-info/CodeInfoItems.vue";
  import CommonButton from "@/components/common/CommonButton.vue";
  import api from "@/api/index.js";
  import {computed, onMounted, reactive, ref} from "vue";
  import {useModalStore} from "@/stores/modal.js";
  import {storeToRefs} from "pinia";
  import CommonModal from "@/components/common/CommonModal.vue";
  import {commonJS} from "@/script/common.js";
  import CommonTextarea from "@/components/common/CommonTextarea.vue";

  const props = defineProps({
      modelValue: Boolean,
      selectCodeInfoForm: Object,
      searchS: String,
      modalOpenCodeList: {
        type: Array,
        default: []
      }
    });

  const modalStore = useModalStore();
  const { isShowModal, modalConfig } = storeToRefs(modalStore);

  const isLoading = ref(false);
  const codeInfoList = ref([]);
  const codeInfoListTotal = ref(0);
  const searchValue = ref('');
  const codeInput = ref('');
  const codeInputRef = ref(null);
  const searchOpt = ref('all');
  const modalSearchS = ref(props.searchS);

  const codeInfoForm = reactive({
    code: '',
    parentCode: '',
    codeLevel: 0,
    codeName: '',
    codeDesc: '',
    codeSort: 1,
    useYn: '',
  });

  const codeDuplication = reactive({
    duplicationCheckOk : false,
    code: ''
  });
  const searchOption = [
    {label:'코드+이름', value: 'all'},
    {label:'코드', value: 'code'},
    {label:'이름' , value: 'codeName'}
  ]

  const useYnOption = [
    {label: '사용', value: true},
    {label: '미사용', value: false}
  ]

  const validationMessages = reactive({
    code: {validationCheckOk: false, message: '코드 명을 입력해 주세요(영어 대문자 4~8자)'},
    codeName: {validationCheckOk: false, message: '코드명을 입력해 주세요(2~10자)'},
  })

  const emit = defineEmits(['update:modelValue', 'save', 'cancel', 'toggleOpen']);

  const validationCheck = computed(() => {
    return !commonJS.strRegex('code', codeInput.value)
        || !commonJS.strRegex('codeName', codeInfoForm.codeName)
        || !codeDuplication.duplicationCheckOk
  })

  const fnVaildationCheck = () => {
      if (!commonJS.strRegex('code', codeInput.value)) {
        validationMessages.code.validationCheckOk = false;
        validationMessages.code.message = '코드를 입력해 주세요(영어 대문자 4~8자)';
      } else if (!codeDuplication.duplicationCheckOk) {
        validationMessages.code.validationCheckOk = false;
        validationMessages.code.message = '코드 중복확인을 해주세요';
      } else {
        validationMessages.code.validationCheckOk = true;
      }

    if (!commonJS.strRegex('codeName', codeInfoForm.codeName)) {
        validationMessages.codeName.validationCheckOk = false;
        validationMessages.codeName.message = '코드명을 입력해 주세요(2~10자)';
      } else {
        validationMessages.codeName.validationCheckOk = true;
      }
  };

  const fnSetCode = () => {

      const newCode = codeInput.value.toUpperCase();
      if (codeInfoForm?.parentCode) {
        codeInfoForm.code = codeInfoForm.parentCode + '_' + newCode;
      } else {
        codeInfoForm.code = newCode;
      }
      codeInput.value = newCode;

      codeDuplication.duplicationCheckOk = !!(newCode
          && codeDuplication.code === codeInfoForm.code);
    fnVaildationCheck();
  }

  const fnSetParentCode = (codeInfo) => {

    if (codeInfo?.code) {
      codeInfoForm.code = codeInfo.code + '_' + codeInput.value;
      codeInfoForm.parentCode = codeInfo.code;
      codeInfoForm.codeLevel = codeInfo.codeLevel + 1;
    } else {
      codeInfoForm.code = codeInput.value;
      codeInfoForm.parentCode = '';
      codeInfoForm.codeLevel = 0;
    }

    codeDuplication.duplicationCheckOk = codeInfoForm.code === codeDuplication.code;
  };

  const fnSaveCodeInfo = async () => {
    if (isLoading.value) return;
    try {
      isLoading.value = true;

      await api.post('/code-info', codeInfoForm);

      modalStore.openModal({
        title: '코드 추가',
        message: `${codeInfoForm.codeName}[${codeInfoForm.code}]\n코드 추가가 완료 되었습니다`,
        confirmText: '확인',
        type: 'alert',
        confirm: () => {
          emit('save');
          fnGetCodeList();
          // emit('update:modelValue', false);
        },
        outSideClose: false
      })

    } catch (e) {
      console.error(e)
    } finally {
      isLoading.value = false;
    }

  }

  const fnCancel = () => {
    emit('update:modelValue', false);
  }

  const fnCheckCodeDuplication = async () => {
    if (isLoading.value) return;

    try {
      isLoading.value = true;

      const response = await api.get('/code-info/check-code', {
        params: {
          code: codeInfoForm.code
        }
      })

      if (response.data.duplicationCheckOk) {
        codeDuplication.duplicationCheckOk = true;
        codeDuplication.code = codeInfoForm.code;
        fnVaildationCheck();

        modalStore.openModal({
          title: '아이디 중복확인',
          message: response.data.message,
          confirmText: '확인',
          type: 'alert',
          confirm: null,
          outSideClose: true
        })
      } else {
        codeDuplication.duplicationCheckOk = false;
        codeDuplication.code = '';

        modalStore.openModal({
          title: '아이디 중복확인',
          message: response.data.message,
          confirmText: '확인',
          type: 'alert',
          confirm: () => {codeInputRef.value?.focus()},
          outSideClose: true
        })
      }

    } catch (e) {
      console.error(e)
    } finally {
      isLoading.value = false;
    }
  };

  const fnGetCodeList = async () => {
    if (isLoading.value) return;

    codeInfoList.value = [];
    try {
      isLoading.value = true;
      const response = await api.get('/code-info', {
        params: {
          selectedOption: searchOpt.value,
          searchValue: modalSearchS.value
        }
      });
      searchValue.value = modalSearchS.value;
      codeInfoList.value = response.data?.codeInfoList || [];
      codeInfoListTotal.value = response.data?.total || 0;
    } catch (e) {
      console.error(e)
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(() => {
    if (props.selectCodeInfoForm?.code) {
      codeInfoForm.parentCode = props.selectCodeInfoForm.parentCode;
      fnSetParentCode(props.selectCodeInfoForm);
    }
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

        <div class="min-w-250 max-w-250 min-h-150 relative bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden transform transition-all">
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

                <div class="bg-slate-900/30 rounded-xl border border-slate-800 w-2/6 pl-2 pb-2 max-h-150 overflow-auto">
                  <div class="w-full min-w-max sticky top-0 left-0 pr-4 flex justify-end border-b border-slate-800 mb-2 bg-slate-900 z-10">
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
                        :modalOpenCodeList="modalOpenCodeList"
                        :selectedCode="codeInfoForm.parentCode"
                        @toggleOpen="(code, isOpenChildren) => emit('toggleOpen', code, isOpenChildren)"
                        @dblclick="fnSetParentCode"
                    />
                  </div>
                </div>
                <div class="bg-slate-900/30 rounded-xl border border-slate-800 overflow-auto w-4/6 p-4">

                  <div class="flex flex-col gap-2">
                    <div class="w-full flex">
                      <div class="w-1/3">
                        <label class="text-lg font-bold text-slate-400 uppercase tracking-widest">
                          코드명
                        </label>
                        <div class="flex gap-2">
                          <CommonInput
                              v-model="codeInput"
                              @input="fnSetCode"
                              ref="codeInputRef"
                              @labelStr=""
                              :maxlength="8"
                              placeholder="코드명(영문 대문자 4~8자)"
                          />
                        </div>
                        <div v-if="!validationMessages.code.validationCheckOk" class="ml-2 text-xs text-red-700 align-text-bottom">
                          {{ validationMessages.code.message }}
                        </div>
                      </div>
                      <div class="w-2/3">
                        <label class="text-lg font-bold text-slate-400 uppercase tracking-widest">
                          적용될 코드명(수정불가)
                        </label>
                        <div class="flex gap-2">
                          <CommonInput
                              v-model="codeInfoForm.code"
                              @labelStr=""
                              :maxlength="20"
                              disabled
                              placeholder="부모코드_코드명 으로 적용됩니다"
                          />
                          <CommonButton
                              @click="fnCheckCodeDuplication"
                              :disabled="codeDuplication.duplicationCheckOk || !commonJS.strRegex('code', codeInput)"
                          >중복 확인</CommonButton>
                        </div>
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
                          @input="fnVaildationCheck"
                          @labelStr=""
                          :maxlength="10"
                          placeholder="코드 명을 입력해 주세요(한글 또는 영어 2~10자)"
                      />
                      <div v-if="!validationMessages.codeName.validationCheckOk" class="ml-2 text-xs text-red-700 align-text-bottom">
                        {{ validationMessages.codeName.message }}
                      </div>
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
                    <div class="w-full">
                      <label class="text-lg font-bold text-slate-400 uppercase tracking-widest">
                        코드 설명
                      </label>
                      <CommonTextarea
                          v-model="codeInfoForm.codeDesc"
                          :rows="Number(12)"
                          :maxLength="Number(300)"
                          placeholder="코드에 대한 설명을 작성해 주세요"
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
                  :class="validationCheck ? 'text-slate-500' : 'text-blue-400 hover:bg-blue-500/5'"
                  :disabled="validationCheck"
                  class="flex-1 px-4 py-4 text-sm font-bold transition-colors"
              >코드 추가</button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

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