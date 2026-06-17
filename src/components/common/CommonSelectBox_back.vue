<script setup>
defineProps({
  modelValue: [String, Number],
  options: {
    type: Array,
    required: true,
  }
});


defineEmits(['update:modelValue']);
</script>

<template>
  <div class="relative min-w-[120px]">

    <select
        :value="modelValue"
        @change="$emit('update:modelValue', $event.target.value)"
        class="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 pr-10 text-sm text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none cursor-pointer font-mono"
        :class="label ? 'pl-16' : 'pl-4'"
    >
      <option v-for="opt in options" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>

    <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <path d="m6 9 6 6 6-6"/>
      </svg>
    </div>
  </div>
</template>