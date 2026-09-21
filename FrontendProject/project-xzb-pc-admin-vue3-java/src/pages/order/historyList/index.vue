<!-- 订单列表 -->
<template>
  <router-view v-if="url !== '/order/historyList'"></router-view>
  <div v-else class="base-up-wapper bgTable min-h">
    <!-- 搜索表单区域 -->
    <searchFormBox
      :initSearch="initSearch"
      :typeSelect="typeSelect"
      @handleSearch="handleSearch"
      @handleReset="handleReset"
    ></searchFormBox>
    <!-- end -->
    <!-- 表格 -->
    <tableList
      :list-data="listData"
      :pagination="pagination"
      @handleClickCancel="handleClickCancel"
      @fetchData="fetchData"
      @onPageChange="onPageChange"
      @handleClickRefund="handleClickRefund"
    ></tableList>
    <!-- end -->
    <!-- 新增，编辑弹窗 -->
    <DialogForm
      :visible="visible"
      :title="title"
      :label="label"
      :data="DialogFormData"
      @handleClose="handleClose"
      @fetchData="fetchData"
    />
    <!-- end -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { getHistoryOrderList } from '@/api/order'
import DialogForm from './components/DialogForm.vue' // 新增,编辑弹窗.
import tableList from './components/TableList.vue' // 表格
import searchFormBox from './components/SearchForm.vue' // 搜索框表单
import { MessagePlugin } from 'tdesign-vue-next'
import dayjs from 'dayjs'
const route = useRoute()
const visible = ref(false) // 新增，编辑弹窗
const listData = ref([]) // 列表数据
const label = ref('') // 弹窗label
const dataLoading = ref(false) // 列表数据加载loading
const DialogFormData = ref({}) // 弹窗表单内容
const title = ref('新建') // 弹窗标题
const url = ref('') // 当前路由
const initSearch = ref([
  // new Date(new Date().getFullYear() - 1, 0, 1)转换成年月日格式,近182天，昨天和昨天往前推182天
  dayjs().subtract(182, 'day').format('YYYY-MM-DD'),
  dayjs().subtract(1, 'day').format('YYYY-MM-DD')
]) // 条转过来的携带数据
const typeSelect = ref([]) // 服务类型下拉框数据
// 分页
const pagination = ref({
  defaultPageSize: 10,
  total: 0,
  defaultCurrent: 1, // 默认当前页
  current: 1
})
const requestData = ref({
  ordersStatus: null,
  id: null,
  serveProviderStaffPhone: null,
  maxSortTime: initSearch.value[1] + ' 23:59:59',
  minSortTime: initSearch.value[0] + ' 00:00:00',
  pageNo: 1,
  pageSize: 10,
  payStatus: '',
  refundStatus: ''
}) // 请求参数
const resetData = ref({
  ordersStatus: null,
  id: null,
  serveProviderStaffPhone: null,
  maxSortTime: initSearch.value[1] + ' 23:59:59',
  minSortTime: initSearch.value[0] + ' 00:00:00',
  pageNo: 1,
  pageSize: 10,
  payStatus: '',
  refundStatus: ''
}) // 默认请求参数
// 生命周期
onMounted(() => {
  fetchData(requestData.value)
})
// 搜索功能
const handleSearch = (val) => {
  requestData.value.id = val.id
  requestData.value.ordersStatus = val.ordersStatus
  requestData.value.serveProviderStaffPhone = val.serveProviderStaffPhone
  requestData.value.payStatus = val.payStatus
  requestData.value.refundStatus = val.refundStatus
  pagination.value.current = 1
  pagination.value.defaultCurrent = 1
  requestData.value.minSortTime = val.createTime[0] + ' 00:00:00'
  requestData.value.maxSortTime = val.createTime[1] + ' 23:59:59'
  requestData.value.pageNo = 1
  requestData.value.pageSize = 10
  if (val.createTime.length === 0) {
    requestData.value.maxSortTime = ''
    requestData.value.minSortTime = ''
  }
  fetchData(requestData.value)
}
// 分页

// 重置，清空搜索框
const handleReset = () => {
  // 清空搜索框的全部内容并且重新获取数据
  // 重置页码
  pagination.value.defaultCurrent = 1
  pagination.value.current = 1
  fetchData(requestData.value)
  // 重新渲染table
}
// 获取列表数据
const fetchData = async (val) => {
  dataLoading.value = true
  await getHistoryOrderList(val)
    .then((res) => {
      if (res.code === 200) {
        listData.value = res.data.list
        pagination.value.total = Number(res.data.total)
        dataLoading.value = false
      } else {
        dataLoading.value = false
        MessagePlugin.error(res.data.msg)
      }
    })
    .catch((err) => {
      console.log(err)
    })
}
// 关闭弹窗
const handleClose = () => {
  visible.value = false // 关闭新增弹窗
}
// 点击取消
const handleClickCancel = () => {
  visible.value = true
  title.value = '请填写取消原因'
  label.value = '取消原因：'
}
// 打开退款弹窗
const handleClickRefund = () => {
  visible.value = true
  title.value = '填写退款原因'
  label.value = '退款原因：'
}
// 翻页
const onPageChange = (val) => {
  requestData.value.pageNo = val.defaultCurrent
  requestData.value.pageSize = val.defaultPageSize
  fetchData(requestData.value)
}
watchEffect(() => {
  pagination.value.defaultCurrent = 1
  pagination.value.current = 1
  pagination.value.defaultPageSize = 10
  pagination.value.defaultPageSize = 10
  if (route.path === 'order/historyList') {
    requestData.value.ordersStatus = ''
  }
  url.value = route.path
  fetchData(resetData.value)
})
</script>
<style lang="less" scoped>
.min-h {
  min-height: 720px !important;
}
</style>
