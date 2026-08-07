<script setup>
  import dayjs from "dayjs";
  import {computed, ref} from "vue";
  import isToday from 'dayjs/plugin/isToday.js'
  import isBetween from 'dayjs/plugin/isBetween.js'
  import 'dayjs/locale/ko.js'
  import CommonButton from "@/components/common/CommonButton.vue";

  dayjs.locale('ko');
  dayjs.extend(isToday);
  dayjs.extend(isBetween);

  const props = defineProps({
    modelValue: dayjs,
    pHolidayList : {
      type: Array,
      default: []
    },
    pScheduleList : {
      type: Array,
      default: []
    }
  });

  const emit = defineEmits(['update:modelValue', 'changeMonth', 'selectedDate']);

  const CALENDAR_MIN_DATE = dayjs('2000-01-01')
  const CALENDAR_MAX_DATE = dayjs('2499-12-31')
  const totalCells = 7*6;
  const dayOfWeekList = ['일', '월', '화', '수', '목', '금', '토'];
  const selectedDate = ref(dayjs(props.modelValue).isValid() ? dayjs(props.modelValue) : dayjs());
  const selectedMonth = ref(dayjs(props.modelValue).isValid() ? dayjs(props.modelValue) : dayjs());
  const selectedBeforeMonth = computed(() => selectedMonth.value.subtract(1, 'month'))
  const selectedAfterMonth = computed(() => selectedMonth.value.add(1, 'month'))
  const selectedMonthDayOfWeek = computed(() => selectedMonth.value.date(1).day());
  const selectedMonthLastDay = computed(() => selectedMonth.value.daysInMonth());
  const hoveredDateStr = ref(null);
  let hoverTimer = null;

  const calendarMonthList = computed(() => {

    const dateList = {};
    for (let date = 1; date <= totalCells; date++) {
      let setDate;                        // 날짜 정보
      let dateRelation;                   // 저번달, 이번달, 다음달 구분
      const tooltipInfoList = [];         // 툴팁 mouseEnter 시 보여질 정보
      let dotShowAt = false;              // 일정 dot 표시 여부
      let holidayDotShowAt = false;       // 휴일 일정 dot 표시 여부
      let arrowClass = '';                // 기간일정 화살표 방향 class
      let textColor = ''                  // text color

      if (date <= selectedMonthDayOfWeek.value) {
        dateRelation = 'before';
        textColor = 'text-gray-600';
        setDate = selectedBeforeMonth.value.date(selectedBeforeMonth.value.daysInMonth() - (selectedMonthDayOfWeek.value - date)).locale('ko');
      } else if (date > selectedMonthDayOfWeek.value && (date - selectedMonthDayOfWeek.value) <= selectedMonthLastDay.value) {
        dateRelation = 'now';
        setDate = selectedMonth.value.date(date - selectedMonthDayOfWeek.value).locale('ko');
        textColor = setDate.day() === 0 ? 'text-red-700'
                    : setDate.day() === 6 ? 'text-blue-700' : '';
      } else {
        dateRelation = 'after';
        textColor = 'text-gray-600';
        setDate = selectedAfterMonth.value.date(((date - selectedMonthDayOfWeek.value) - selectedMonthLastDay.value)).locale('ko');
      }

      // 스케줄 정리, arrowClass 및 툴팁 표시를 위해 저장

      props.pScheduleList.forEach((s) => {

        const sStart = dayjs(s.start);
        const sEnd = s.end ? dayjs(s.end) : sStart;

        // 기간스케줄, 하루스케줄 구분 시작,종료일에도 dot 표시
        if (s.end && setDate.isBetween(sStart, sEnd, 'day', '[]')) {
          if (setDate.isBetween(sStart, sEnd, 'day', '()')) {
            arrowClass = 'bg-arrow-middle';
          } else if (setDate.isSame(sStart, 'day')) {
            dotShowAt = true;
            arrowClass = arrowClass !== 'bg-arrow-middle' ? 'bg-arrow-left' : arrowClass;
          } else if (setDate.isSame(sEnd, 'day')) {
            dotShowAt = true;
            arrowClass = arrowClass !== 'bg-arrow-middle' ? 'bg-arrow-right' : arrowClass;
          }
          tooltipInfoList.push({
            'type' : 'scheduleTerm',
            'content' : s.title + sStart.format(': YY-MM-DD(ddd) ~') + sEnd.format(' YY-MM-DD(ddd)')
          })
        } else if (setDate.isSame(sStart, 'day')) {
          dotShowAt = true;
          tooltipInfoList.push({
            'type' : 'scheduleDay',
            'content' : s.title + sStart.format(': YYYY-MM-DD')
          })
        }
      })

      props.pHolidayList.forEach((h) => {
        const hDay = dayjs(h.locdate);
        if (hDay.isSame(setDate, 'day')) {
          holidayDotShowAt = true;
          textColor = textColor !== 'text-gray-600' ? 'text-red-700' : textColor;
          tooltipInfoList.push({
            'type' : 'holiday',
            'content' : h.title + hDay.format(': YYYY-MM-DD')
          })
        }
      })

      dateList[setDate.format('YYYY-MM-DD')] = {
        'date' : setDate,
        'day' : setDate.format('D'),
        'dateStr' : setDate.format('YYYY-MM-DD'),
        'dateRelation' : dateRelation,
        'arrowClass' : arrowClass,
        'dotShowAt' : dotShowAt,
        'holidayDotShowAt' : holidayDotShowAt,
        'textColor' : textColor,
        'tooltipInfoList' : tooltipInfoList
      }
    }
    return dateList;
  })

  const fnSelectedDate = (date) => {
    selectedDate.value = date;
    selectedMonth.value = date.date(1);
    emit('selectedDate', selectedDate.value);
  }

  const handleMoveMonth = (isBefore = true) => {

    const moveMonth = selectedMonth.value.add((isBefore ? -1 : 1), 'month');

    if (moveMonth.isBefore(CALENDAR_MIN_DATE, 'month')
      || moveMonth.isAfter(CALENDAR_MAX_DATE, 'month')) {
      return;
    }

    selectedMonth.value = selectedMonth.value.add((isBefore ? -1 : 1), 'month');
    emit('changeMonth', selectedMonth.value);
  }
  
  const handleMoveToday = () => {
    selectedMonth.value = dayjs().date(1);
    selectedDate.value = dayjs();
    emit('changeMonth', selectedMonth.value);
    emit('update:modelValue', selectedDate.value);
  };

  const handleMouseEnter = (dateObj) => {
    clearTimeout(hoverTimer);

    if (hoveredDateStr.value) return;

    hoverTimer = setTimeout(() => {
      hoveredDateStr.value = dateObj.dateStr;
    }, 500)
  };

  const handleMouseLeave = () => {
    clearTimeout(hoverTimer);
    hoveredDateStr.value = null
  };
</script>

<template>
  <div class="w-full h-full flex flex-col select-none">
    <div class="w-full flex justify-between p-2 px-8 bg-pink-600 font-bold">
      <div class="cursor-pointer"
           @click="handleMoveMonth(true)"
      > < </div>
      <div class="cursor-pointer flex gap-4">
        {{ selectedMonth.format('YYYY년 M월') }}
        <CommonButton
            buttonWidthClass="w-20"
            buttonHeightClass="h-5"
            @click="handleMoveToday"
        >
          오늘
        </CommonButton>
      </div>
      <div class="cursor-pointer"
            @click="handleMoveMonth(false)"
      > > </div>
    </div>
    <div class="w-full flex-1 grid grid-cols-7">
      <div v-for="(day, i) in dayOfWeekList" :key="i"
          class="border border-pink-900/90 flex items-center justify-center">
        <span :class="{
          'text-red-700' : i === 0,
          'text-blue-700' : i === 6
        }">{{ day }}</span>
      </div>
      <template v-for="(date) in calendarMonthList" :key="date.dateStr">
        <div class="relative border border-pink-900/90 hover:bg-pink-600/40 text-center flex flex-col  items-center justify-center gap-1"
             @dblclick="fnSelectedDate(date.date)"
             @mouseenter="(date.tooltipInfoList && date.tooltipInfoList.length > 0) && handleMouseEnter(date)"
             @mouseleave="handleMouseLeave"
        >
          <div class="w-full h-8 py-2 flex items-center justify-center"
               :class="date.arrowClass"
          >
            <span class="w-7 h-7 rounded-full font-bold inline-flex items-center justify-center"
                  :class="[
                      selectedDate.isSame(date.date, 'day') ? 'bg-gray-600 text-white'
                      : dayjs().isSame(date.date, 'day') ? 'bg-blue-500 text-white' : '',
                      date.textColor
                  ]"
            >
              {{ date.day }}
            </span>
          </div>

          <div class="w-full h-3 flex items-center gap-1 justify-center">
              <span v-if="date.dotShowAt" class="w-2 h-2 bg-pink-500 rounded-full"></span>
              <span v-if="date.holidayDotShowAt" class="w-2 h-2 bg-red-600 rounded-full"></span>
          </div>

          <Transition name="tooltip-fade">
            <div v-if="hoveredDateStr === date.dateStr"
                 class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2.5 rounded-lg bg-gray-900/95 text-white text-xs shadow-xl border border-pink-500/40 backdrop-blur-sm z-50 pointer-events-none flex flex-col gap-1.5 text-left"
            >
              <!-- 툴팁 헤더: 날짜 -->
              <div class="font-bold border-b border-gray-700/80 pb-1 text-gray-200 flex justify-between items-center">
                <span>{{ date.date.format('YYYY.MM.DD (ddd)') }}</span>
              </div>

              <!-- 툴팁 바디: 공휴일 & 일정 리스트 -->
              <div class="flex flex-col gap-1 max-h-32 overflow-y-auto">
                <!-- 공휴일 -->
                <template v-if="date.tooltipInfoList && date.tooltipInfoList.length > 0">
                  <div v-for="(tooltopInfo, idx) in date.tooltipInfoList" :key="'h-' + idx"
                       class="flex items-center gap-1.5 text-red-400 font-semibold"
                  >
                    <div class="w-5 flex justify-center items-center">
                      <span v-if="tooltopInfo.type === 'holiday'" class="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0"/>
                      <span v-if="tooltopInfo.type === 'scheduleDay'" class="w-1.5 h-1.5 bg-pink-500 rounded-full shrink-0"/>
                      <span v-if="tooltopInfo.type === 'scheduleTerm'" class="min-w-5 w-2 h-1.5 bg-pink-500"/>
                    </div>
                    <span class="truncate">{{ tooltopInfo.content }}</span>
                  </div>
                </template>
              </div>

              <div class="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-4 border-transparent border-t-gray-900/95"></div>
            </div>
          </Transition>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>

.bg-arrow-left {
  clip-path: polygon(15% 0%, 100% 0%, 100% 100%, 15% 100%, 0% 50%);
  background-color: var(--color-pink-200);
  opacity: 80%;
  position: relative;
  color: var(--color-gray-900);
}

.bg-arrow-right {
  opacity: 80%;
  clip-path: polygon(0% 0%, 85% 0%, 100% 50%, 85% 100%, 0% 100%);
  background-color: var(--color-pink-200);
  color: var(--color-gray-900);
}

.bg-arrow-middle {
  opacity: 80%;
  background-color: var(--color-pink-200);
  color: var(--color-gray-900);
}

.bg-rounded {
  opacity: 80%;
  background-color: var(--color-pink-200);
  clip-path: circle(14px at 50% 50%);
  color: var(--color-gray-900);
}

</style>