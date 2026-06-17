<script setup>

import {computed, ref} from "vue";

  const props = defineProps({
    modelValue: [String, Number],
    label: [String, Number],
    placeholder: [String, Number],
    maxlength: Number,
    widthClass: String,
    inputType: {
      type: String,
      default: 'text'
    },
    disabled: {
      type: Boolean,
      default: false
    },
  });

  const inputFocusRef = ref(null);
  defineExpose({
    focus: () => inputFocusRef.value?.focus()
  });

  const validLabel = computed(() => {
    return String(props.label).length < 7 ? String(props.label) : ''
  })
  const validPlaceholder = computed(() => {
    return props.placeholder ? props.placeholder : '검색어를 입력해 주세요';
  })

  const emit = defineEmits(['update:modelValue', 'input', 'enter']);

  const handleInput = (e) => {
    const value = e.target.value;

    emit('update:modelValue', value);

    emit('input', value);
  }
</script>

<template>
  <div class="relative flex-1" :class="widthClass">
    <span v-if="validLabel.length > 0" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">
      {{ validLabel }}:
    </span>
    <input
        :type="inputType"
        ref="inputFocusRef"
        :value="modelValue"
        @input="handleInput"
        @keyup.enter="emit('enter')"
        :placeholder="validPlaceholder"
        :maxlength="maxlength || 20"
        :disabled="disabled"
        :class="validLabel.length > 0 ? 'pl-16' : 'pl-4'"
        autoComplete="off"
        class="w-full bg-slate-950 border border-slate-800 rounded-lg py-2  pr-4 text-sm text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
    />
  </div>
</template>

<style scoped>

</style>