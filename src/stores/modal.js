import { defineStore } from 'pinia';
import { ref, reactive } from 'vue';

export const useModalStore = defineStore('modal', () => {
    const isShowModal = ref(false);

    const modalConfig = reactive({
        title: '',
        message: '',
        confirmText: '확인',
        cancelText: '',
        type: 'alert',
        confirm: null,
        cancel: null,
        outSideClose: true
    });

    const openModal = (options) => {
        modalConfig.title = options.title || '';
        modalConfig.message = options.message || '';
        modalConfig.confirmText = options.confirmText || '확인';
        modalConfig.cancelText = options.cancelText || '취소';
        modalConfig.type = options.type || 'alert';
        modalConfig.outSideClose = typeof (options.outSideClose) === 'boolean' ? options.outSideClose : true;
        modalConfig.confirm = typeof (options.confirm) === 'function' ? options.confirm : null;
        modalConfig.cancel = typeof (options.cancel) === 'function' ? options.cancel : null;

        isShowModal.value = true;
    };

    return {
        isShowModal,
        modalConfig,
        openModal
    };
});