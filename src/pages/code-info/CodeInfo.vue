<script setup>
  import CommonInput from "@/components/common/CommonInput.vue";
  import CommonSelectBox from "@/components/common/CommonSelectBox.vue";
  import CommonButton from "@/components/common/CommonButton.vue";
  import {onMounted, reactive, ref} from "vue";
  import api from "@/api/index.js";
  import CodeInfoItems from "@/components/code-info/CodeInfoItems.vue";
  import CodeWriteModal from "@/components/code-info/CodeWriteModal.vue"
  import CommonDateFormat from "@/components/common/CommonDateFormat.vue";
  import CodeInfoItemsModal from "@/components/code-info/CodeInfoItemsModal.vue";
  import {useModalStore} from "@/stores/modal.js";
  import {storeToRefs} from "pinia";
  import CommonModal from "@/components/common/CommonModal.vue";

  const isLoading = ref(false);
  const codeInfoList = ref([]);
  const codeInfoListTotal = ref(0);
  const isShowCodeWriteModal = ref(false);
  const isShowCodeItemsModal = ref(false);
  const searchValue = ref('');

  const selectCodeInfoForm = reactive({
    code: '',
    codeLevel: 0,
    parentCode: '',
    codeName: '',
    codeDesc: '',
    useYn: 'Y',
    codeSort: '',
    creator: '',
    createdAt: '',
    updater: '',
    updatedAt: ''
  })

  const modalStore = useModalStore();
  const { isShowModal, modalConfig } = storeToRefs(modalStore);

  const searchOption = [
    {label:'코드+이름', value: 'all'},
    {label:'코드', value: 'code'},
    {label:'이름' , value: 'codeName'}
  ]

  const useYnOption = [
    {label: '사용', value: true},
    {label: '미사용', value: false}
  ]

  const searchParams = reactive({
    opt: 'all',
    s: ''
  })



  const fnParentCodeModal = () => {
    if (selectCodeInfoForm.code) {
      isShowCodeItemsModal.value = true;
    } else {
      modalStore.openModal({
        title: '코드 수정',
        message: '수정할 코드를 선택해 주세요',
        confirmText: '확인',
        type: 'alert',
        confirm: null,
        outSideClose: true
      })
    }
  };

  const fnSetParentCode = (parentCode) => {
      if (parentCode !== null && parentCode?.code) {
        selectCodeInfoForm.parentCode = parentCode.code;
        selectCodeInfoForm.codeLevel = (parentCode.codeLevel || 0) + 1;
      } else {
        selectCodeInfoForm.parentCode = null;
        selectCodeInfoForm.codeLevel = 0;
      }
  };

  const fnSelectedCodeInfo = (codeInfo) => {
        selectCodeInfoForm.code = codeInfo.code;
        selectCodeInfoForm.codeLevel = codeInfo.codeLevel;
        selectCodeInfoForm.parentCode = codeInfo.parentCode?.code;
        selectCodeInfoForm.codeName = codeInfo.codeName;
        selectCodeInfoForm.codeDesc = codeInfo.codeDesc;
        selectCodeInfoForm.useYn = codeInfo.useYn;
        selectCodeInfoForm.codeSort = codeInfo.codeSort;
        selectCodeInfoForm.creator = codeInfo.creator;
        selectCodeInfoForm.createdAt = codeInfo.createdAt;
        selectCodeInfoForm.updater = codeInfo.updater;
        selectCodeInfoForm.updatedAt = codeInfo.updatedAt;
  };

  const fnSaveCodeInfo = async () => {
    if (isLoading.value) return;

    try {
      isLoading.value = true;
      await api.put(`/code-info/${selectCodeInfoForm.code}`, selectCodeInfoForm);

    } catch (e) {
      console.error(e)
    } finally {
      isLoading.value = false;
    }
  }

  const fnGetCodeList = async () => {
    if (isLoading.value) return;

    try {
      isLoading.value = true;
      const response = await api.get('/code-info', {
        params: {
          selectedOption: searchParams.opt,
          searchValue: searchParams.s
        }
      });
      searchValue.value = searchParams.s;
      codeInfoList.value = [...(response.data?.codeInfoList || [])];
      codeInfoListTotal.value = response.data?.total || 0;
    } catch (e) {
      console.error(e)
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(() => {
    fnGetCodeList();
  })
</script>

<template>
  <div class="w-full h-full">
    <div class="flex flex-col justify-between items-center gap-4">
      <div class="flex w-full justify-between">
        <div class="flex w-2/3 gap-2">
          <CommonSelectBox
              v-model="searchParams.opt"
              :options="searchOption"
          />
          <CommonInput
              v-model="searchParams.s"
              @enter="fnGetCodeList"
              label="검색어"
          />
          <CommonButton
              @click="fnGetCodeList"
              variant="gray"
          >검색</CommonButton>
        </div>
        <div class="flex gap-2">

        <CommonButton
            @click="() => {isShowCodeWriteModal = true;}"
        >코드추가</CommonButton>
        <CommonButton
            @click="fnSaveCodeInfo"
        >저장</CommonButton>
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
              :selectedCode="selectCodeInfoForm.code"
              @dblclick="fnSelectedCodeInfo"
          />
        </div>
      </div>
      <div class="bg-slate-900/30 rounded-xl border border-slate-800 overflow-hidden w-4/6 p-4">

        <div class="flex flex-col gap-2">
          <div class="w-full flex flex-col gap-2">
            <div>
              생성 {{ selectCodeInfoForm.creator?.userName || ' - ' }}님
              생성일 : <CommonDateFormat :date="String(selectCodeInfoForm.createdAt)"/>
            </div>
            <div>
              수정 {{ selectCodeInfoForm.updater?.userName || ' - ' }}님
              수정일 : <CommonDateFormat :date="String(selectCodeInfoForm.updatedAt)"/>
            </div>
          </div>
          <div class="w-full">
            <label class="text-lg font-bold text-slate-400 uppercase tracking-widest">
              코드명(수정불가)
            </label>
            <CommonInput
                v-model="selectCodeInfoForm.code"
                @labelStr=""
                disabled
                placeholder="수정하실 코드를 선택해 주세요"
            />
          </div>
          <div class="w-full">
            <label class="text-lg font-bold text-slate-400 uppercase tracking-widest">
              부모코드
            </label>
            <div class="flex gap-2">
              <CommonInput
                  v-model="selectCodeInfoForm.parentCode"
                  @labelStr=""
                  disabled
                  placeholder=" "
              />
              <CommonButton
                  @click="fnSetParentCode"
                  variant="gray"
              >초기화</CommonButton>
              <CommonButton
                  @click="fnParentCodeModal"
              >변경</CommonButton>
            </div>
          </div>
          <div class="w-full">
            <label class="text-lg font-bold text-slate-400 uppercase tracking-widest">
              코드 레벨 (대분류 : 0)
            </label>
            <CommonInput
                v-model="selectCodeInfoForm.codeLevel"
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
                v-model="selectCodeInfoForm.codeName"
                @labelStr=""
                placeholder=" "
            />
          </div>
          <div class="w-full">
            <label class="text-lg font-bold text-slate-400 uppercase tracking-widest">
              코드 순서
            </label>
            <CommonInput
                v-model="selectCodeInfoForm.codeSort"
                @labelStr=""
                placeholder=" "
            />
          </div>
          <div class="w-full">
            <label class="text-lg font-bold text-slate-400 uppercase tracking-widest">
              사용 여부
            </label>
            <CommonSelectBox
                v-model="selectCodeInfoForm.useYn"
                :options="useYnOption"
            />
          </div>
        </div>

      </div>
    </div>
  </div>
  <CodeWriteModal
      v-if="isShowCodeWriteModal"
      v-model="isShowCodeWriteModal"
      :selectCodeInfoForm="selectCodeInfoForm"
      :searchS="searchValue"
      @save="fnGetCodeList"
  />
  <CodeInfoItemsModal
      v-if="isShowCodeItemsModal"
      v-model="isShowCodeItemsModal"
      :selectCodeInfoForm="selectCodeInfoForm"
      :searchS="searchValue"
      @click="fnSetParentCode"
  />
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