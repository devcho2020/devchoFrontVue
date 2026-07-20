<script setup>
import {computed, onMounted, ref} from "vue";

  const props = defineProps({
    codeInfo: Object,
    selectedCode: String,
    searchValue: {
     type: String,
     default: ''
    },
    modalOpenCodeList: {
      type: Array,
      default: []
    }
  });

  const childrenList = props.codeInfo?.children;
  const isOpen = ref(false);

  const fnHandleDblclick = () => {
    emit('dblclick', props.codeInfo);
  }

  const emit = defineEmits(['dblclick', 'toggleOpen']);

  const upperCaseSearchValue = computed(() => props.searchValue.toUpperCase());
  const fnHighLightText = (text = '') => {

  const upperCaseText = text.toUpperCase();

  return text.slice(0, text.indexOf(upperCaseSearchValue.value))
     + `<span class="font-bold text-yellow-300">`
     + text.slice(text.indexOf(upperCaseSearchValue.value), text.indexOf(upperCaseSearchValue.value) + upperCaseSearchValue.value.length)
     + '</span>'
     + text.slice(text.indexOf(upperCaseSearchValue.value) + upperCaseSearchValue.value.length, upperCaseText.length)
  }

  const fnOpenCodeInfo = () => {
    isOpen.value = !isOpen.value;
    emit('toggleOpen', props.codeInfo.code, isOpen.value);
  };
  onMounted(() => {
    isOpen.value = props.modalOpenCodeList.indexOf(props.codeInfo.code) !== -1;
  })
</script>

<template>
  <details :open="isOpen"
      class="group transition-all duration-300 text-sm">
    <summary class="p-1 list-none"
             @click.prevent
             :class="childrenList.length > 0 ? 'cursor-pointer' : ''"
             @dblclick="fnHandleDblclick"
    >
      <div class="flex justify-start">
        <div class="overflow-hidden flex gap-4"
             :class="codeInfo.code === selectedCode ? 'text-blue-600' : 'text-white'">
          <label class="w-5 h-5  text-center text-white"
                 :class="childrenList.length > 0 ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/20 cursor-pointer' : 'bg-slate-800 text-slate-300'"
                 @click="fnOpenCodeInfo"
          >
            {{ isOpen ? '-' : childrenList.length > 0 ? '+' : '-' }}
          </label>
          <div class="underline">
            <span v-html="fnHighLightText(codeInfo.codeName)"></span>
            [<span v-html="fnHighLightText(codeInfo.code)"></span>]
          </div>
        </div>
        ({{ childrenList.length }})
      </div>
    </summary>
    <CodeInfoItems class="ml-4"
               v-for="subCodeInfo in childrenList"
               :key="subCodeInfo.code"
               :searchValue = "searchValue"
               :selectedCode="selectedCode"
               :codeInfo="subCodeInfo"
               :modalOpenCodeList="modalOpenCodeList"
               @toggleOpen="(code, isOpenChildren) => emit('toggleOpen', code, isOpenChildren)"
               @dblclick="(subCodeInfoDetail) => emit('dblclick', subCodeInfoDetail)"
    />
  </details>
</template>

<style scoped>

</style>