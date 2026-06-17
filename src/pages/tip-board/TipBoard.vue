<script setup>

import {reactive, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import CommonSelectBox from "@/components/common/CommonSelectBox.vue";
import CommonInput from "@/components/common/CommonInput.vue";
import CommonButton from "@/components/common/CommonButton.vue";
import CommonDateFormat from "@/components/common/CommonDateFormat.vue";
import CommonPagiNation from "@/components/common/CommonPagiNation.vue";
import api from "@/api/index.js";

const route = useRoute();
const router = useRouter();
const isLoading = ref(false);
const tipBoards = ref([]);
const tipBoardTotalPage = ref(1);

const searchOption = [
  {label:'제목+내용', value: 'all'},
  {label:'제목', value: 'title'},
  {label:'내용' , value: 'content'}
]

const searchParams = reactive({
  p: Number(route.query.p) || 0,
  opt: route.query.opt || 'all',
  s: route.query.s || ''
})

const fnMoveTipBoardWrite = () => {
  router.push({
    path: '/tip-board/write',
    query: route.query
  })
};

const fnMoveTipBoardDetail = (tipBoardId) => {
  router.push({
    path: `/tip-board/${tipBoardId}`,
    query: route.query
  })
};

const fnSearchTipBoardList = (p) => {

  searchParams.p = (typeof (p) === 'number') ? Number(p) : 0;

  router.push({
    path: route.path,
    query: {...searchParams}
  })
}

const fnGetTipBoardList = async ({p = 1, opt = 'all', s = ''} = {}) => {
  if (isLoading.value) return;
  try {
    isLoading.value = true;

    const response = await api.get('/tip-board', {
      params: {
        page: p,
        size: 10,
        selectedOption: opt,
        searchValue: s
      }
    })
    tipBoards.value = response.data.content;
    tipBoardTotalPage.value = response.data.totalPages || 1
  } catch (e) {
    console.error(e);
  } finally {
    isLoading.value = false;
  }
}

watch(() => route.query, (newQuery) => {
  searchParams.p = Number(newQuery.p) || 0;
  searchParams.opt = newQuery.opt || 'all';
  searchParams.s = newQuery.s || '';

  fnGetTipBoardList({
    p: searchParams.p,
    opt: searchParams.opt,
    s: searchParams.s})
}, {immediate: true, deep: true})
</script>

<template>
  <div class="border-slate-800 space-y-8">
    <div class="flex flex-col justify-between items-center gap-4">
      <div class="flex w-full justify-between">
        <div class="flex w-2/3 gap-2">
          <CommonSelectBox
              v-model="searchParams.opt"
              :options="searchOption"
          />
          <CommonInput
              v-model="searchParams.s"
              label="검색어"
          />
          <CommonButton
              variant="gray"
              @click="fnSearchTipBoardList"
          >검색</CommonButton>
        </div>
        <CommonButton
            @click="fnMoveTipBoardWrite"
        >글작성</CommonButton>
      </div>
    </div>
    <div class="bg-slate-900/30 rounded-xl border border-slate-800 overflow-hidden">
      <table class="table-fixed w-full text-left border-collapse">
        <thead>
        <tr class="bg-slate-900/50 border-b border-slate-800">
          <th class="w-1/6 px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">제목</th>
          <th class="w-1/2 px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">내용</th>
          <th class="w-1/6 px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">작성일</th>
        </tr>
        </thead>
        <tbody class="divide-y divide-slate-800">
        <tr v-if="isLoading">
          <td colspan="4" class="px-6 py-10 text-center">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
            <p class="mt-2 text-slate-500">로딩 중...</p>
          </td>
        </tr>

        <tr v-if="!isLoading && tipBoards.length === 0">
          <td colspan="4" class="px-6 py-4 truncate text-center">
              <span class="text-lg">
                게시글이 존재하지 않습니다
              </span>
          </td>
        </tr>

        <tr v-if="!isLoading &&  tipBoards.length > 0" v-for="tipBoard in tipBoards" :key="tipBoard.id"
            @click="fnMoveTipBoardDetail(tipBoard.id)"
            class="hover:bg-slate-800/30 transition-colors cursor-pointer group"
        >
          <td class="px-6 py-4 truncate">
              <span class="text-sm font-semibold text-slate-200 group-hover:text-blue-400 transition-colors ">
                {{ tipBoard.title }}
              </span>
          </td>
          <td class="px-6 py-4 truncate">
              <span class="text-sm font-semibold text-slate-200 group-hover:text-blue-400 transition-colors ">
                {{ tipBoard.content }}
              </span>
          </td>
          <td class="px-6 py-4 text-xs text-slate-500 font-mono text-center">
            <CommonDateFormat
                :date="String(tipBoard.createdAt)"
            />
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <CommonPagiNation
        @click="fnSearchTipBoardList"
        :totalPage="tipBoardTotalPage"
        :current-page="searchParams.p"
    />
  </div>

</template>

<style scoped>

</style>