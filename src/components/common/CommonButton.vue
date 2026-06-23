<script setup>
  import {computed} from "vue";

  const props = defineProps({
    variant: {
      type: String,
      default: 'primary',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    buttonType: {
      type: String,
      default: 'button'
    },
    buttonWidthClass: {
      type: String,
      default: 'w-30'
    },
    buttonHeightClass: {
      type: String,
      default: 'h-10'
    }
  })
  const emit = defineEmits(['click']);

  const btnClass = computed(() => {
    switch (props.variant) {
      case 'primary':
        return 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/20';
      case 'secondary':
        return 'bg-slate-700 hover:bg-slate-600 shadow-slate-900/20';
      case 'danger':
        return 'bg-red-600 hover:bg-red-500 shadow-red-900/20';
      case 'gray':
        return 'bg-slate-800 hover:bg-slate-700 text-slate-300';
      default:
        return 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/20';
    }
  });

</script>

<template>
  <button
      @click="emit('click')"
      :type="buttonType"
      class="px-6 text-white rounded-lg text-sm font-bold shadow-lg
      transition-all flex items-center justify-center gap-2"
      :disabled="disabled"
      :class="[btnClass, buttonWidthClass, buttonHeightClass, disabled ? 'opacity-50 cursor-not-allowed grayscale-[0.5]' : 'cursor-pointer active:scale-95']"
  >
    <slot>Button</slot>
  </button>
</template>

<style scoped>

</style>