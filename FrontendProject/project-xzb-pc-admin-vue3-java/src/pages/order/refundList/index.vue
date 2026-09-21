<!-- 退款订单 -->
<template>
  <div class="base-up-wapper bgTable min-h">
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
      @handleClickDetail="handleClickDetail"
      @fetchData="fetchData"
      @changeTab="changeTab"
      @onPageChange="onPageChange"
      @handleSortChange="handleSortChange"
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
  <!-- 指派弹窗 -->
  <detailDialog
    :visible="detailDialogVisible"
    :title="title"
    :pagination="pagination"
    :data="DialogFormData"
    @handleClose="handleClose"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { getOrderList } from '@/api/order'
import { forEach } from 'lodash'
import { useRoute } from 'vue-router'
import DialogForm from './components/DialogForm.vue' // 新增,编辑弹窗.
import tableList from './components/TableList.vue' // 表格
import searchFormBox from './components/SearchForm.vue' // 搜索框表单
import detailDialog from './components/detailDialog.vue'

const visible = ref(false) // 新增，编辑弹窗
const detailDialogVisible = ref(false) // 指派弹窗
const listData = ref([]) // 列表数据
const label = ref('') // 弹窗label
const dataLoading = ref(false) // 列表数据加载loading
const DialogFormData = ref({}) // 弹窗表单内容
const title = ref('新建') // 弹窗标题
const route = useRoute()
const initSearch = ref() // 条转过来的携带数据
const typeSelect = ref([]) // 服务类型下拉框数据
// 分页
const pagination = ref({
  defaultPageSize: 10,
  total: 0,
  defaultCurrent: 1 // 默认当前页
})
const requestData = ref({
  ordersStatus: '',
  ordersCode: '',
  contactsName: '',
  minCreateTime: '',
  maxCreateTime: '',
  isAsc1: false,
  orderBy1: 'createTime',
  pageNo: 1,
  pageSize: 10
}) // 请求参数
const resetRequestData = ref({
  ordersStatus: '',
  ordersCode: '',
  contactsName: '',
  minCreateTime: '',
  maxCreateTime: '',
  isAsc1: false,
  orderBy1: 'createTime',
  pageNo: 1,
  pageSize: 10
}) // 重置请求参数
// 生命周期
onMounted(() => {
  fetchData(requestData.value)
})
watch(
  () => route.query,
  () => {
    fetchData(requestData.value)
  }
)
// 搜索功能
const handleSearch = (val) => {
  requestData.value.contactsName = val.contactsName
  requestData.value.ordersCode = val.ordersCode
  requestData.value.ordersStatus = val.ordersStatus
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
  detailDialogVisible.value = false // 关闭指派弹窗
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

// 翻页
const onPageChange = (val) => {
  requestData.value.pageNo = val.defaultCurrent
  requestData.value.pageSize = val.defaultPageSize
  fetchData(requestData.value)
}
// 点击详情
const handleClickDetail = (row) => {
  detailDialogVisible.value = true
  title.value = '查看退款记录'
  DialogFormData.value = row
}
// 切换tab时请求接口
const changeTab =(val)=>{
  // 重置pagination
  pagination.value = {
    defaultCurrent: 1,
    defaultPageSize: 10,
    total: 0,
  }
  requestData.value = JSON.parse(JSON.stringify(resetRequestData.value))
  // requestData.value.serveStatus = val
  fetchData(requestData.value)
}
</script>
<style lang="less" scoped>
.min-h {
  min-height: 720px !important;
}
</style>
