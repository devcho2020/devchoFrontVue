<script setup>
 import {computed} from "vue";

 const props = defineProps({
   modelValue: {
     type: Array,
     default: []
   },
   options: { // value, label
     type: Array,
     default: []
   }
 });

 const emit = defineEmits(['update:modelValue']);

 const checkedGroup = computed({
   get: () => props.modelValue,
   set: (newValue) => {
     emit('update:modelValue', newValue);
   }
 })
</script>

<template>
  <label v-for="option in options" :key="option.value" class="flex items-center gap-2.5 cursor-pointer group">
    <div class="relative flex items-center justify-center">
      <input
          type="checkbox"
          :value="option.value"
          v-model="checkedGroup"
          class="peer sr-only"
      />
      <div class="w-4 h-4 border border-slate-700 bg-slate-950 rounded-[4px] flex items-center justify-center transition-all duration-150
                      peer-checked:border-blue-600 peer-checked:bg-blue-600
                      group-hover:border-blue-600
                      text-[14px] font-black  text-slate-950 peer-checked:text-white leading-none"
      >✓</div>
      <span class="ml-2 text-xs text-slate-400 group-hover:text-slate-200 peer-checked:text-white">
          {{ option.label }}
      </span>
    </div>
  </label>
</template>

<style scoped>

</style>