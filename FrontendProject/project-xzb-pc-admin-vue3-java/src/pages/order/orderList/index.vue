<!-- 订单列表 -->
<template>
  <router-view v-if="url !== '/order/orderList'"></router-view>
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
      @fetchData="fetchData"
      @onPageChange="onPageChange"
      @handleClickRefund="handleClickRefund"
      @handleSortChange="handleSortChange"
    ></tableList>
    <!-- end -->
    <!-- 新增，编辑弹窗 -->
    <DialogForm
      :visible="visible"
      :title="title"
      :label="label"
      :data="DialogFormData"
      @handleSubmit="handleSubmit"
      @handleClose="handleClose"
      @fetchData="fetchData"
    />
    <!-- end -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { getOrderList, refundOrder } from '@/api/order'
import { forEach } from 'lodash'
import DialogForm from './components/DialogForm.vue' // 新增,编辑弹窗.
import tableList from './components/TableList.vue' // 表格
import searchFormBox from './components/SearchForm.vue' // 搜索框表单
import { MessagePlugin } from 'tdesign-vue-next'

const route = useRoute()
const visible = ref(false) // 新增，编辑弹窗
const listData = ref([]) // 列表数据
const label = ref('') // 弹窗label
const refundId = ref('') // 退款id
const dataLoading = ref(false) // 列表数据加载loading
const DialogFormData = ref({}) // 弹窗表单内容
const title = ref('新建') // 弹窗标题
const url = ref('') // 当前路由
const initSearch = ref() // 条转过来的携带数据
const typeSelect = ref([]) // 服务类型下拉框数据
// 分页
const pagination = ref({
  defaultPageSize: 10,
  total: 0,
  defaultCurrent: 1, // 默认当前页
  current: 1
})
const requestData = ref({
  ordersStatus: '',
  id: '',
  contactsPhone: '',
  minCreateTime: '',
  maxCreateTime: '',
  isAsc1: false,
  orderBy1: 'createTime',
  pageNo: 1,
  pageSize: 10,
  payStatus: '',
  refundStatus: ''
}) // 请求参数
const resetData = ref({
  ordersStatus: '',
  id: '',
  contactsPhone: '',
  minCreateTime: '',
  maxCreateTime: '',
  isAsc1: false,
  orderBy1: 'createTime',
  pageNo: 1,
  pageSize: 10,
  payStatus: '',
  refundStatus: ''
}) // 重置请求参数
// 生命周期
onMounted(() => {
  fetchData(requestData.value)
})
// 搜索功能
const handleSearch = (val) => {
  requestData.value.contactsPhone = val.contactsPhone
  requestData.value.payStatus = val.payStatus
  requestData.value.id = val.id
  requestData.value.ordersStatus = val.ordersStatus
  requestData.value.refundStatus = val.refundStatus
  requestData.value.pageNo = 1
  pagination.value.defaultCurrent = 1
  pagination.value.current = 1
  requestData.value.minCreateTime = val.createTime[0] + ' 00:00:00'
  requestData.value.maxCreateTime = val.createTime[1] + ' 23:59:59'
  if (val.createTime.length === 0) {
    requestData.value.minCreateTime = ''
    requestData.value.maxCreateTime = ''
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
  await getOrderList(val)
    .then((res) => {
      if (res.code === 200) {
        listData.value = res.data.list
        pagination.value.total = Number(res.data.total)
        dataLoading.value = false
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
// 确定提交
const handleSubmit = async (val) => {
  await refundOrder({
    id: refundId.value,
    cancelReason: val.description
  })
    .then((res) => {
      if (res.data.code === 200) {
        MessagePlugin.success('操作成功')
        visible.value = false
        fetchData(requestData.value)
      } else {
        MessagePlugin.error(res.data.msg)
      }
    })
    .catch((err) => {
      console.log(err)
    })
}
// 排序
const handleSortChange = (val) => {
  forEach(val, (item) => {
    if (item.sortBy === 'createTime') {
      if (item.descending === true) {
        requestData.value.isAsc1 = false
      } else {
        requestData.value.isAsc1 = true
      }
    }
  })
  fetchData(requestData.value)
}
// 打开退款弹窗
const handleClickRefund = (row) => {
  visible.value = true
  refundId.value = row.id
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
  if (route.path === 'order/orderList') {
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
