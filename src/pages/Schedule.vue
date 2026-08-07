<script setup>
  import { ref } from 'vue'
  import CommonCalendar from '@/components/common/CommonCalendar.vue'
  import dayjs from "dayjs";

  const selectedDate = ref(dayjs());
  const selectedMonth = ref(dayjs());

  const holidayList = ref([
    {'locdate' : '2026-08-15', 'title' : '광복절'},
    {'locdate' : '2026-08-15', 'title' : '휴가 테스트'},
    {'locdate' : '2026-08-17', 'title' : '대체공휴일'},
    {'locdate' : '2026-09-24', 'title' : '추석'},
    {'locdate' : '2026-09-25', 'title' : '추석'},
    {'locdate' : '2026-09-26', 'title' : '추석'},
  ])

  const scheduleList = ref([
    {'start' : '2026-07-30', 'end' : '2026-08-02', 'title' : '일정1', 'content': '일정1내용'},
    {'start' : '2026-08-04', 'end' : '2026-08-12', 'title' : '일정2', 'content': '일정2내용'},
    {'start' : '2026-08-11', 'end' : '2026-08-16', 'title' : '일정3', 'content': '일정3내용'},
    {'start' : '2026-08-20', 'end' : '2026-08-21', 'title' : '일정4', 'content': '일정4용'},
    {'start' : '2026-08-30', 'end' : '2026-09-06', 'title' : '일정5', 'content': '일정5내용'},
    {'start' : '2026-08-15', 'title' : '일정6', 'content': '일정6내용'},
    {'start' : '2026-08-11', 'title' : '일정7', 'content': '일정7내용'},
  ])

  const handleChangeMonth = (changeMonth) => {
    selectedDate.value = changeMonth;
  }

  const handleSelectedDate = (changeDate) => {
    selectedDate.value = changeDate;
  };

</script>

<template>
  <div class="w-full">
    <div class="flex gap-2 w-full h-100">
      <div class="w-3/4 border h-full">
        <CommonCalendar
            v-model="selectedDate"
            :pHolidayList="holidayList"
            :pScheduleList="scheduleList"
            :pSelectedMonth="selectedMonth"
            @changeMonth="handleChangeMonth"
            @selectedDate="handleSelectedDate"
        />
      </div>
      <div class="border w-1/4">

      </div>
    </div>
  </div>
</template>

<style scoped>
</style>

