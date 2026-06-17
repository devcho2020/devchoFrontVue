<script setup>
  import {computed} from "vue";

  const props = defineProps({
    totalPage: {
      type: Number,
      default: 1
    },
    currentPage: {
      type: Number,
      default: 0
    }
  });

  const emit = defineEmits(['click']);

  const pageNumbers = computed(() => {
    const startPage = (Math.floor(props.currentPage/10) * 10);
    const pages = [];

    for (let p = startPage; p < startPage + 10 && p < props.totalPage; p++) {
      pages.push(p);
    }
    return pages;
  })

</script>

<template>
  <div class="flex justify-between pt-4">
    <div class="flex justify-end gap-2">
        <button v-if="totalPage > 10 && Math.floor((currentPage)/10) * 10 > 0"
                @click="emit('click', 0)"
                class="bg-slate-900 text-slate-500 border-slate-800 cursor-pointer w-8 h-8 rounded border text-xs flex items-center justify-center hover:border-blue-500 transition-colors"
        >
          <<
        </button>
        <button v-if="totalPage > 10 && Math.floor((currentPage)/10) * 10 > 0"
                @click="emit('click', Math.floor((currentPage-10)/10) * 10)"
                class="bg-slate-900 text-slate-500 border-slate-800 cursor-pointer w-8 h-8 rounded border text-xs flex items-center justify-center hover:border-blue-500 transition-colors"
        >
          <
        </button>
    </div>
    <div class="flex justify-center gap-2 ">
      <button v-for="p in pageNumbers" :key="p"
              @click="emit('click', p)"
              :disabled="p === currentPage"
              :class="p === currentPage? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-500 border-slate-800'"
              class="cursor-pointer w-8 h-8 rounded border text-xs flex items-center justify-center hover:border-blue-500 transition-colors">
        {{ p + 1 }}
      </button>
    </div>
    <div class="flex justify-start gap-2">
      <button v-if="totalPage > 10 && Math.floor((currentPage)/10) * 10 < Math.floor((totalPage)/10) * 10"
              @click="emit('click', Math.floor((currentPage+10)/10) * 10)"
              class="bg-slate-900 text-slate-500 border-slate-800 cursor-pointer w-8 h-8 rounded border text-xs flex items-center justify-center hover:border-blue-500 transition-colors"
      >
        >
      </button>
      <button v-if="totalPage > 10 && Math.floor((currentPage)/10) * 10 < Math.floor((totalPage)/10) * 10"
              @click="emit('click', totalPage -1)"
              class="bg-slate-900 text-slate-500 border-slate-800 cursor-pointer w-8 h-8 rounded border text-xs flex items-center justify-center hover:border-blue-500 transition-colors"
      >
        >>
      </button>
    </div>
  </div>
</template>

<style scoped>

</style>