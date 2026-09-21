<!-- 首页 -->
<template>
  <div class="container home-wrapper">
    <!-- 顶部 card  -->
    <top-panel :top-panel-data="topPanelData" />
    <!-- 经营分析 -->
      <Operate
      @fetchData="fetchData"
      @exportStatistics="exportStatistics"
    ></Operate>
    <!-- end -->
    <!-- 分析 -->
    <div class="analysis">
      <div class="leftCard">
        <div class="title">订单分析</div>
        <div class="cardBox">
          <div class="card">
            <div class="body">
              <div class="title">
                有效订单
                <div class="description">
                  <span class="beizhu"></span>
                  <span class="hover"
                    >在统计时间内，订单状态为已完成的订单数。（订单被取消、退款、关闭状态均不属于有效订单）</span
                  >
                </div>
              </div>
              <div class="num">
                {{ data?.effectiveOrderNum }}<span>笔</span>
              </div>
            </div>
            <div class="line"></div>
          </div>
          <div class="card">
            <div class="body">
              <div class="title">取消订单数</div>
              <div class="num">
                {{ data?.cancelOrderNum || 0 }}<span>笔</span>
              </div>
            </div>
            <div class="line"></div>
          </div>
          <div class="card">
            <div class="body">
              <div class="title">关闭订单数</div>
              <div class="num">{{ data?.closeOrderNum }}<span>笔</span></div>
            </div>
            <div class="line"></div>
          </div>
        </div>
      </div>
      <div class="rightCard">
        <div class="title">营业分析</div>
        <div class="cardBox">
          <div class="card">
            <div class="body">
              <div class="title">
                实付单均价
                <div class="description">
                  <span class="beizhu"></span>
                  <span class="hover"
                    >在统计时间内，平均每单实际支付额（不包含失效订单）</span
                  >
                </div>
              </div>
              <div class="num">
                {{ data?.realPayAveragePrice }}<span>元</span>
              </div>
            </div>
            <div class="line"></div>
          </div>
          <div class="card">
            <div class="body">
              <div class="title">
                有效订单总额
                <div class="description">
                  <span class="beizhu"></span>
                  <span class="hover"
                    >在统计时间内，有效订单的总订单交易额</span
                  >
                </div>
              </div>
              <div class="num">
                {{ data?.effectiveOrderTotalAmount }}<span>元</span>
              </div>
            </div>
            <div class="line"></div>
          </div>
        </div>
      </div>
    </div>
    <!-- 中部图表  -->
    <middle-chart
      class="row-container"
      :middle-chart-data="data?.ordersTrend"
    />
    <!-- 用户分析 -->
    <div class="operate">
      用户分析<span>{{ nowMonthTime[0] }} - {{ nowMonthTime[1] }}</span>
    </div>
    <!-- 用户分析-->
    <output-overview
      class="row-container"
      :output-overview-data="outputOverviewData"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import dayjs from 'dayjs'
import { getDashBoardData, exportStatisticsData } from '@/api/detail'
import TopPanel from './components/TopPanel.vue'
import MiddleChart from './components/MiddleChart.vue'
import OutputOverview from './components/OutputOverview.vue'
import Operate from './components/operate.vue'

import { MessagePlugin } from 'tdesign-vue-next'
const route = useRoute()
// 当月时间1号到最后一天
const nowMonthTime = ref([
  dayjs().startOf('month').format('YYYY-MM-DD'),
  dayjs().subtract(1, 'day').format('YYYY-MM-DD')
])
const data = ref() // 日期
const dateRange = ref([
  dayjs().subtract(1, 'month').format('YYYY-MM-DD') + ' 00:00:00',

  dayjs().subtract(0, 'day').format('YYYY-MM-DD') + ' 23:59:59'
])

const topPanelData = ref({
  evaluationCount: 0,
  yesterdayEvaluationCount: 0,
  replyCount: 0,
  goodLevelRate: '',
  yesterdayReplyCount: 0,
  auditPendingCount: 0
}) // 顶部card数据
const outputOverviewData = ref([]) // 综合评分详情概览数据

// 获取tab栏切换数据

// 生命周期
onMounted(() => {
  fetchData(dateRange.value)
})
// 刷新
watch(
  () => route.query,
  () => {
    fetchData(dateRange.value)
  }
)
// 获取数据
const fetchData = async (val) => {
  if (val[0].length <= 10) {
    val[0] = val[0] + ' 00:00:00'
    val[1] = val[1] + ' 23:59:59'
  }
  await getDashBoardData({
    maxTime: val[1],
    minTime: val[0]
  })
    .then((res) => {
      if (res.code === 200) {
        data.value = res.data
      } else {
        MessagePlugin.error(res.msg)
      }
    })
    .catch((err) => {
      console.log(err)
    })
}
// 导出统计数据
const exportStatistics = async (val) => {
  if (val[0].length <= 10) {
    val[0] = val[0] + ' 00:00:00'
    val[1] = val[1] + ' 23:59:59'
  }
  await exportStatisticsData({
    maxTime: val[1],
    minTime: val[0]
  }).then((res) => {
    let text = decodeURIComponent(res.headers['content-disposition'])
    const parts = text.split("utf-8''")
    const blob = new Blob([res.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })
    const objectUrl = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = objectUrl
    link.download = parts[1] // 设置文件名
    link.click()
    URL.revokeObjectURL(objectUrl)
  })
}

</script>
<style lang="less" scoped src="./index.less"></style>

