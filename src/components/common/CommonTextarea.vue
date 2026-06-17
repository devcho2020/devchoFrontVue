<script setup>
  defineProps({
    modelValue: String,
    placeholder: [String, Number],
    rows: Number,
    maxLength: Number,
    disabled: {
      type: Boolean,
      default: false
    },
  })
  
  const emit = defineEmits(['update:modelValue', 'input', 'enter']);

  const handleTextarea = (e) => {
    const value = e.target.value;

    emit('update:modelValue', value);

    emit('input', value);
  }
</script>

<template>
  <textarea
      :value="modelValue"
      @input="handleTextarea"
      :rows="rows"
      :placeholder="placeholder"
      :maxlength="maxLength || 20"
      :disabled="disabled"
      class="w-full bg-slate-950 border border-slate-800 rounded-lg p-4 text-sm text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono resize-none"
  ></textarea>
</template>

<style scoped>

</style>