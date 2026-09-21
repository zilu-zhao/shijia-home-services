<template>
  <t-row :gutter="16" class="row-container">
    <t-col :xs="12" :xl="12">
      <t-card title="订单数趋势" class="dashboard-chart-card">
        <div
          id="monitorContainer"
          ref="monitorContainer"
          class="dashboard-chart-container"
          :style="{ width: '99.6%', height: `${resizeTime * 326}px` }"
        />
      </t-card>
    </t-col>
  </t-row>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted, nextTick, computed, watch } from 'vue'

import * as echarts from 'echarts/core'
import {
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import { LineChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import { useSettingStore } from '@/store'
import { dateTag } from '@/utils/charts'
import { getLineChartDataSet } from '../index'

echarts.use([
  TooltipComponent,
  LegendComponent,
  GridComponent,
  LineChart,
  CanvasRenderer
])
// 接收父组件传递的数据
const props = defineProps({
  middleChartData: {
    type: Array,
    default: () => {
      return []
    }
  }
})
// 深拷贝
const dataTime = JSON.parse(JSON.stringify(dateTag))
const store = useSettingStore()
// 触发父组件方法
const emit = defineEmits(['changeLineData'])
// 大小变化比例
const resizeTime = ref(1)
// 颜色
const chartColors = computed(() => store.chartColors)

// monitorChart
let monitorContainer: HTMLElement // 监控图表容器
let monitorChart: echarts.ECharts // 监控图表实例


// 获取图表实例，初始化图表
const renderMonitorChart = () => {
  if (!monitorContainer) {
    monitorContainer = document.getElementById('monitorContainer')
  }
  monitorChart = echarts.init(monitorContainer)
  monitorChart.setOption(
    getLineChartDataSet({ dateTime: dataTime[0].time, ...chartColors.value })
  )
}

// chartSize update
const updateContainer = () => {
  if (
    document.documentElement.clientWidth >= 1400 &&
    document.documentElement.clientWidth < 1920
  ) {
    resizeTime.value = Number(
      (document.documentElement.clientWidth / 2280).toFixed(2)
    )
  } else if (document.documentElement.clientWidth < 1080) {
    resizeTime.value = Number(
      (document.documentElement.clientWidth / 1080).toFixed(2)
    )
  } else {
    resizeTime.value = 1
  }
  monitorChart.resize({
    width: monitorContainer.clientWidth,
    height: resizeTime.value * 326
  })
}
// 传入的数据变化是重新渲染图表
watch(
  () => props.middleChartData,
  () => {
    const count = (props.middleChartData as { count: number }[]).map((item) => item.count)
    const countDate = (props.middleChartData as { dateTime: string }[]).map((item) => item.dateTime)
    onCurrencyChange(count , countDate)
  }
)
onMounted(() => {
  const count = (props.middleChartData as { count: number }[]).map((item) => item.count)
  const countDate = (props.middleChartData as { dateTime: string }[]).map((item) => item.dateTime)
  // 初始化图表
  renderMonitorChart()
  onCurrencyChange(count , countDate)
  nextTick(() => {
    // 初始化图表大小
    updateContainer()
  })
  // 初始化时间
  // dateRange.value = dateTag[0].time
  // 监听窗口大小变化
  window.addEventListener('resize', updateContainer, false)
})
watch(
  () => store.isSidebarCompact,
  () => {
    if (store.isSidebarCompact) {
      monitorChart.resize({
        width: monitorContainer.clientWidth + 160,
        height: resizeTime.value * 326
      })
    } else {
      monitorChart.resize({
        width: monitorContainer.clientWidth - 160,
        height: resizeTime.value * 326
      })
    }
  }
)
onUnmounted(() => {
  // 销毁图表
  window.removeEventListener('resize', updateContainer)
})

// 内容变化
const onCurrencyChange = (count: string[] | number[], countDate: string[]) => {
  monitorChart.setOption(
    getLineChartDataSet({ count, countDate, ...chartColors.value })
  )
}

</script>

<style lang="less" scoped>
.dashboard-chart-card {
  padding: var(--td-comp-paddingTB-l) var(--td-comp-paddingLR-xl);
  padding-top: 0;
  padding-right: 15px;

  :deep(.t-card__header) {
    padding-bottom: 24px;
    padding-left: 0;
  }

  :deep(.t-card__title) {
    font-size: 20px;
    font-weight: 500;
    margin-right: 0;
  }
}
.rightHead {
  display: flex;
  align-items: center;
  .active {
    background-color: var(--color-main) !important;
    color: var(--color-white) !important;
  }
  .card {
    margin-right: 20px;
    font-size: 14px;
    padding: 5px 10px;
    background-color: var(--color-bk7);
    border-radius: 5px;
    white-space: nowrap;
    color: var(--color-bk3);
    cursor: pointer;
    &:hover {
      background-color: var(--color-main);
      color: var(--color-white);
    }
  }
}
:deep(.t-card__body) {
  padding: 0;
}
:deep(.t-card__subtitle) {
  font-size: 16px;
}
</style>
