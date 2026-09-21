<template>
  <div class="operate">经营分析</div>
  <div class="statistics">
<!--    <div class="tips">
      <span></span
      >此数据统计的订单为统计时间内，已结束订单15个自然日之后的数据（已结束订单包含已取消、已关闭、已完成订单）
    </div>-->
    <div class="export">
      <t-date-range-picker
        ref="datePicker"
        v-model="dateRange"
        class="card-date-picker-container"
        theme="primary"
        mode="date"
        allow-input
        :disable-date="{
          after: endTime
        }"
        clearable
        @change="onCurrencyChange"
      />
      <div class="bt" @click="exportStatistics">导出明细</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import dayjs from 'dayjs'

// 表格内时间
const dateRange = ref([
  dayjs().subtract(1, 'month').format('YYYY-MM-DD') + ' 00:00:00',
  dayjs().subtract(0, 'day').format('YYYY-MM-DD') + ' 23:59:59'
])
// 时间选择器最大时间
const endTime = ref(dayjs().subtract(0, 'day').format('YYYY-MM-DD'))

const emit = defineEmits(['fetchData', 'exportStatistics'])

// 切换时间
const onCurrencyChange = (val) => {
  if (dayjs(val[1]).diff(dayjs(val[0]), 'day') > 365) {
    // dateRange.value = []
    MessagePlugin.error('时间间隔不能大于365天')
  } else {
    emit('fetchData', dateRange.value)
  }
}
// 触发导出数据
const exportStatistics = () => {
  emit('exportStatistics', dateRange.value)
}
</script>
<style lang="less" scoped src="../index.less"></style>

