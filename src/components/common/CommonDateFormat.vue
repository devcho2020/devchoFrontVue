<script setup>
  import dayjs from "dayjs";
  import isToday from 'dayjs/plugin/isToday.js'
  import relativeTime from 'dayjs/plugin/relativeTime'
  import ko from 'dayjs/locale/ko.js'

  dayjs.locale(ko);
  dayjs.extend(isToday);
  dayjs.extend(relativeTime);

  const props = defineProps({
    date: String,
    option: {
      type: String,
      default: 'format'
    },
    format: {
      type: String,
      default: 'YYYY-MM-DD'
    }
  })

  const fnFormatDate = (date) => {
    const dateDayjs = dayjs(date);

    if (!dateDayjs.isValid()) return '-';

    return dateDayjs.isToday() ? dateDayjs.fromNow() : dateDayjs.format(props.format);
  }

</script>

<template>
    <span>
      {{ fnFormatDate(date) }}
    </span>
</template>

<style scoped>

</style>