<script setup>
  /** example */
  // const modalStore = useModalStore();
  // const { isShowModal, modalConfig } = storeToRefs(modalStore);
  // modalStore.openModal({
  //   title: '권한없음',
  //   message: '로그인 후 이용해 주세요',
  //   confirmText: '확인',
  //   cancelText: '',
  //   type: 'confirm',
  //   confirm: null,
  //   cancel: null,
  //   outSideClose: true
  // })
  // <CommonModal
  // v-model="isShowModal"
  // :title="modalConfig.title"
  // :message="modalConfig.message"
  // :confirmText="modalConfig.confirmText"
  // :cancelText="modalConfig.cancelText"
  // :outSideClose="modalConfig.outSideClose"
  // :type="modalConfig.type"
  // @confirm="modalConfig.confirm"
  // @cancel="modalConfig.cancel"
  //     />


  const props = defineProps({
    modelValue: Boolean,    // 모달 표시 여부
    title: String,          // 모달 제목
    message: String,        // 모달 본문 메시지
    outSideClose: { type: Boolean, default: true },
    confirmText: { type: String, default: '확인' },
    cancelText: { type: String, default: '취소' },
    type: { type: String, default: 'alert' } // 'alert' 또는 'confirm'
  })

  const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

  const fnClose = () => {
    if (!props.outSideClose) return;
    emit('update:modelValue', false);
  }

  const fnConfirm = () => {
    emit('confirm');
    emit('update:modelValue', false);
  }

  const fnCancel = () => {
    emit('cancel');
    emit('update:modelValue', false);
  }
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
      <div v-if="modelValue" class="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" @click="fnClose"></div>

        <div class="relative bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all">
          <div class="p-6 space-y-4">
            <div class="flex items-center gap-3">
<!--              <div class="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">-->
<!--                <span class="text-xl">🔔</span>-->
<!--              </div>-->
              <h3 class="text-lg font-bold text-slate-100">{{ title || '알림' }}</h3>
            </div>

            <p class="text-slate-400 text-sm leading-relaxed whitespace-pre-wrap">
              {{ message }}
            </p>
          </div>

          <div class="flex border-t border-slate-800">
            <button
                v-if="type === 'confirm'"
                @click="fnCancel"
                class="flex-1 px-4 py-4 text-sm font-medium text-slate-500 hover:bg-slate-800/50 transition-colors border-r border-slate-800"
            >
              {{ cancelText }}
            </button>
            <button
                @click="fnConfirm"
                class="flex-1 px-4 py-4 text-sm font-bold text-blue-400 hover:bg-blue-500/5 transition-colors"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>