<script setup>
  import CommonButton from "@/components/common/CommonButton.vue";
  import CommonInput from "@/components/common/CommonInput.vue";
  import CommonModal from "@/components/common/CommonModal.vue";
  import {useRoute, useRouter} from "vue-router";
  import {computed, reactive, ref} from "vue";
  import api from "@/api/index.js";
  import CommonSelectBox from "@/components/common/CommonSelectBox.vue";

  const router = useRouter();
  const route = useRoute();

  const levelOption = [
    {label:'일반회원', value: 9},
    {label:'운영' , value: 1}
  ]

  const tipBoardWriteModal = reactive({
    title: '',
    message: '',
    confirmText: '',
    cancelText: '',
    confirm: null,
    cancel: null,
    type: 'confirm',
    outSideClose: true
  })

  const tipBoardId = ref(null);
  const isShowModal = ref(false);
  const isLoading = ref(false);
  const validationSubmit = computed(() => {
    return true
  });

  const form = reactive({
    userId: 'admin',
    password: '1234',
    userName: 'admin',
    level: 1,
    phone: null,
    position: '',
  })

  const fnModalCancel = () => {
    tipBoardWriteModal.title = '작성 취소';
    tipBoardWriteModal.message = '팁 게시판 작성을 취소하시겠습니까?';
    tipBoardWriteModal.confirmText = '목록';
    tipBoardWriteModal.cancelText = '닫기';
    tipBoardWriteModal.confirm = () => {router.push({path: '/tip-board', query: route.query})};
    tipBoardWriteModal.cancel = null;
    isShowModal.value = true
  }

  const fnModalConfirm = () => {
    if (!validationSubmit) {
      return
    }

    tipBoardWriteModal.title = '입력 완료';
    tipBoardWriteModal.message = '입력하신 팁 게시판 내용을 저장하시겠습니까?';
    tipBoardWriteModal.confirmText = '저장';
    tipBoardWriteModal.cancelText = '닫기';
    tipBoardWriteModal.confirm = fnSaveTipBoard;
    tipBoardWriteModal.cancel = null;

    isShowModal.value = true
  }

  const fnModalSave = () => {

    tipBoardWriteModal.title = '작성 완료';
    tipBoardWriteModal.message = '팁 게시판 작성이 완료되었습니다';
    tipBoardWriteModal.confirmText = '확인';
    tipBoardWriteModal.confirm = () => {router.push({path: `/tip-board/${tipBoardId.value}`, query: route.query})};
    tipBoardWriteModal.type = 'alert';
    tipBoardWriteModal.outSideClose = false;

    isShowModal.value = true
  }

  const fnSaveTipBoard = async () => {
    if (isLoading.value) return;

    try {
      isLoading.value = true;

      const response = await api.post('/user-info', form);
      tipBoardId.value = response.data;

      fnModalSave();

    } catch (e) {
      console.error(e);
    } finally {
      isLoading.value = false;
    }

  }
</script>

<template>
  <div class="mx-auto space-y-6">
    <div class="flex justify-end gap-3">
      <commonButton @click="fnModalCancel" variant="gray">취소</commonButton>
<!--      <commonButton @click="fnModalConfirm" variant="primary" :disabled="validationSubmit">-->
      <commonButton @click="fnModalConfirm" variant="primary" >
        저장
      </commonButton>
    </div>
    <form class="bg-slate-900/50 rounded-2xl border border-slate-800 p-8 space-y-6" onsubmit="false">
      <div class="w-full">
        <label class="text-xs font-bold text-slate-400 uppercase tracking-widest">등급설정</label>
        <CommonSelectBox
            v-model="form.level"
            :options="levelOption"
        />
      </div>
      <div class="w-full">
        <label class="text-xs font-bold text-slate-400 uppercase tracking-widest">ID 6~8자(영문+숫자)</label>
        <div class="flex justify-between gap-4">
          <CommonInput
              v-model="form.userId"
              @labelStr=""
              placeholder=" ID를 입력해주세요 "
              :maxlength="Number(80)"
          />
          <CommonButton>중복확인</CommonButton>
        </div>
      </div>
      <div class="w-full">
        <label class="text-xs font-bold text-slate-400 uppercase tracking-widest">비밀번호</label>
        <CommonInput
            v-model="form.password"
            @labelStr=""
            placeholder="비밀번호를 입력해주세요"
            :maxlength="Number(80)"
        />
      </div>
      <div class="w-full">
        <label class="text-xs font-bold text-slate-400 uppercase tracking-widest">비밀번호 확인</label>
        <CommonInput
            input-type="password"
            @labelStr=""
            placeholder="비밀번호를 확인해주세요"
            :maxlength="Number(80)"
        />
        <label class="text-xs text-red-700 font-bold">비밀번호가 일치하지 않습니다.</label>
      </div>
      <div class="w-full">
        <label class="text-xs font-bold text-slate-400 uppercase tracking-widest">이름</label>
        <CommonInput
            v-model="form.userName"
            @labelStr=""
            placeholder="이름을 입력해주세요"
            :maxlength="Number(80)"
        />
      </div>
      <div class="w-full">
        <label class="text-xs font-bold text-slate-400 uppercase tracking-widest">핸드폰번호를 입력해주세요</label>
        <CommonInput
            v-model="form.phone"
            @labelStr=""
            placeholder="'-'를 제외한 핸드폰번호 11자리를 입력해주세요"
            :maxlength="Number(80)"
        />
      </div>
      <div class="w-full">
        <label class="text-xs font-bold text-slate-400 uppercase tracking-widest">ID 6~8자(영문+숫자)</label>
        <CommonInput
            v-model="form.position"
            @labelStr=""
            placeholder=" ID를 입력해주세요 "
            :maxlength="Number(80)"
        />
      </div>

<!--      <div class="w-full">-->
<!--        <label class="text-xs font-bold text-slate-400 uppercase tracking-widest">Content</label>-->
<!--        <CommonTextarea-->
<!--            v-model="form.content"-->
<!--            :rows="Number(12)"-->
<!--            :maxLength="Number(300)"-->
<!--            placeholder="팁 게시판 내용을 입력해주세요"-->
<!--        />-->
<!--      </div>-->
    </form>
  </div>

  <CommonModal
      v-model="isShowModal"
      :title="tipBoardWriteModal.title"
      :message="tipBoardWriteModal.message"
      :confirmText="tipBoardWriteModal.confirmText"
      :cancelText="tipBoardWriteModal.cancelText"
      :outSideClose="tipBoardWriteModal.outSideClose"
      @cancel="tipBoardWriteModal.cancel"
      @confirm="tipBoardWriteModal.confirm"
      :type="tipBoardWriteModal.type"
  />
</template>

<style scoped>

</style>