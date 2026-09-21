<!-- 漏斗图和双折线图 -->
<template>
  <div class="analysis">
    <div class="leftCard">
      <div class="title">
        <div class="tips">用户转化漏斗</div>
        <switchBar :data="tableBar" @changeId="changeId"></switchBar>
      </div>
      <div
        id="funnelContainer"
        ref="funnelContainer"
        class="dashboard-chart-container"
        :style="{ width: '99.6%', height: `${resizeTime * 400}px` }"
      />
    </div>
    <div class="rightCard">
      <div class="title">用户平均支付笔数</div>
      <div
        id="DoubleMonitorContainer"
        ref="DoubleMonitorContainer"
        class="dashboard-chart-container"
        :style="{ width: '99.6%', height: `${resizeTime * 400}px` }"
      />
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'DashboardBase'
}
</script>

<script setup lang="ts">
import { onMounted, ref, onUnmounted, nextTick, computed, watch } from 'vue'

import * as echarts from 'echarts/core'
import {
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from 'echarts/components'
import { FunnelChart, LineChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import { funnelData } from '@/utils/commonData' // 漏斗图数据
import { useSettingStore } from '@/store'
import { dateTag } from '@/utils/charts'
import switchBar from '@/components/switchBar/switchBar.vue'
import { getDoubleLineChartDataSet, getFunnelDataSet } from '../index'

echarts.use([
  TooltipComponent,
  LegendComponent,
  GridComponent,
  LineChart,
  CanvasRenderer,
  FunnelChart
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
let DoubleMonitorContainer: HTMLElement // 监控图表容器
let monitorChart: echarts.ECharts // 监控图表实例
let funnelContainer: HTMLElement // 漏斗图表容器
let funnelChart: echarts.ECharts // 漏斗图表实例

// 获取图表实例，初始化图表
const renderMonitorChart = () => {
  // 双折线图未渲染时，创建实例
  if (!DoubleMonitorContainer) {
    DoubleMonitorContainer = document.getElementById('DoubleMonitorContainer')
  }
  monitorChart = echarts.init(DoubleMonitorContainer)
  monitorChart.setOption(
    getDoubleLineChartDataSet({
      dateTime: dataTime[0].time,
      ...chartColors.value
    })
  )
  // 漏斗图未渲染，创建实例
  if (!funnelContainer) {
    funnelContainer = document.getElementById('funnelContainer')
  }
  funnelChart = echarts.init(funnelContainer)
  funnelChart.setOption(
    getFunnelDataSet({ count: funnelData[0], ...chartColors.value })
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
    resizeTime.value = Number(
      (document.documentElement.clientWidth / 1920).toFixed(2)
    )
  }
  monitorChart.resize({
    width: DoubleMonitorContainer.clientWidth,
    height: resizeTime.value * 400
  }),
    funnelChart.resize({
      width: funnelContainer.clientWidth,
      height: resizeTime.value * 400
    })
}

watch(
  () => props.middleChartData,
  () => {
    onCurrencyChange([],[],[])
  }
)
onMounted(() => {
  // 初始化图表
  renderMonitorChart()
  onCurrencyChange([],[],[])
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
        width: DoubleMonitorContainer.clientWidth + 160,
        height: resizeTime.value * 400
      })
      funnelChart.resize({
        width: funnelContainer.clientWidth + 160,
        height: resizeTime.value * 400
      })
    } else {
      monitorChart.resize({
        width: DoubleMonitorContainer.clientWidth - 160,
        height: resizeTime.value * 400
      })
      funnelChart.resize({
        width: funnelContainer.clientWidth - 160,
        height: resizeTime.value * 400
      })
    }
  }
)
const tableBar = [
  {
    id: 0,
    name: '全部 '
  },
  {
    id: 1,
    name: '新用户'
  },
  {
    id: 2,
    name: '老用户'
  }
]
// 切换tab
const changeId = (id: number) => {
  switch (id) {
    case 0:
      funnelChart.setOption(
        getFunnelDataSet({ count: funnelData[0], ...chartColors.value })
      )
      break
    case 1:
      funnelChart.setOption(
        getFunnelDataSet({ count: funnelData[1], ...chartColors.value })
      )
      break
    case 2:
      funnelChart.setOption(
        getFunnelDataSet({ count: funnelData[2], ...chartColors.value })
      )
      break
    default:
      break
  }
}
onUnmounted(() => {
  // 销毁图表
  window.removeEventListener('resize', updateContainer)
})

// 内容变化
const onCurrencyChange = (
  count: string[],
  count2: string[],
  countDate: string[]
) => {
  monitorChart.setOption(
    getDoubleLineChartDataSet({
      count,
      count2,
      countDate,
      ...chartColors.value
    })
  )
}
</script>

<style lang="less" scoped>
.leftCard,
.rightCard {
  padding: 18px 21px;
  background-color: #fff;
  width: calc((100% - 20px) * 0.5);
  height: calc(((100% - 20px) * 0.5) * 0.651);
  .title {
    margin-bottom: 25px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    font-size: 14px;
    height: 38px;
    color: var(--color-bk1);
    display: flex;
    align-items: center;
    position: relative;
    justify-content: space-between;
    :deep(.sw-box) {
      min-width: auto;
      .title {
        width: 58px;
      }
    }
  }
}
.leftCard {
  margin-right: 20px;
}
</style>
