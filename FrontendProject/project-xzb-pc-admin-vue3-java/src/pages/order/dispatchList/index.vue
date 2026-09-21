<!-- 调度订单 -->
<template>
  <div class="base-up-wapper bgTable min-h">
    <!-- 搜索表单区域 -->
    <searchFormBox
      :initSearch="initSearch"
      :typeSelect="typeSelect"
      :cityList="cityList"
      @handleSearch="handleSearch"
      @handleReset="handleReset"
    ></searchFormBox>
    <!-- end -->
    <!-- 表格 -->
    <tableList
      :list-data="listData"
      :pagination="pagination"
      :isActive="0"
      @handleClickAssign="handleClickAssign"
      @handleClickCancel="handleClickCancel"
      @fetchData="fetchData"
      @onPageChange="onPageChange"
      @handleClickRefund="handleClickRefund"
      @handleSortChange="handleSortChange"
    ></tableList>
    <!-- end -->
    <!-- 退款-->
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
  <!-- 指派弹窗 -->
  <assignDialog
    :visible="assignDialogVisible"
    :title="title"
    :pagination="pagination"
    :data="DialogFormData"
    @onPageChange="onAssignPageChange"
    @handleClose="handleClose"
    @fetchData="fetchData"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { getOrderList, refundOrder } from '@/api/order'
import { forEach } from 'lodash'
import { useRoute } from 'vue-router'
import { MessagePlugin } from 'tdesign-vue-next'
import { serviceTypeSimpleList,regionOpenList } from '@/api/service'
import DialogForm from './components/DialogForm.vue' // 新增,编辑弹窗.
import tableList from './components/TableList.vue' // 表格
import searchFormBox from './components/SearchForm.vue' // 搜索框表单
import assignDialog from './components/assignDialog.vue'

const visible = ref(false) // 新增，编辑弹窗
const assignDialogVisible = ref(false) // 指派弹窗
const listData = ref([]) // 列表数据
const label = ref('') // 弹窗label
const dataLoading = ref(false) // 列表数据加载loading
const DialogFormData = ref({}) // 弹窗表单内容
const title = ref('新建') // 弹窗标题
const route = useRoute()
const initSearch = ref() // 条转过来的携带数据
const typeSelect = ref([]) // 服务类型下拉框数据
const refundId = ref('') // 退款id
const cityList = ref([]) // 城市下拉框数据
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
// 生命周期
onMounted(() => {
  fetchData(requestData.value)
  getServiceTypeSimpleList()
  getRegionOpenList()
})
watch(
  () => route.query,
  () => {
    fetchData(requestData.value)
    getServiceTypeSimpleList()
    getRegionOpenList()
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
const fetchData2 = async (val) => {
  dataLoading.value = true
  await getOrderList(val)
    .then((res) => {
      if (res.code === 200) {
        DialogFormData.value = res.data.list
        pagination.value.total = Number(res.data.total)
        dataLoading.value = false
      }
    })
    .catch((err) => {
      console.log(err)
    })
}
// 关闭弹窗
// 获取城市下拉框数据
const getRegionOpenList = async () => {
  await regionOpenList()
    .then((res) => {
      if (res.code === 200) {
        cityList.value = res.data
      } else {
        MessagePlugin.error(res.message)
      }
    })
    .catch((err) => {
      console.log(err)
    })
}
const handleClose = () => {
  visible.value = false // 关闭新增弹窗
  assignDialogVisible.value = false // 关闭指派弹窗
}
// 点击取消
const handleClickCancel = (row) => {
  visible.value = true
  title.value = '请填写取消原因'
  label.value = '取消原因：'
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
// 获取服务类型下拉框数据
const getServiceTypeSimpleList = async () => {
  await serviceTypeSimpleList()
    .then((res) => {
      if (res.code === 200) {
        typeSelect.value = res.data
      } else {
        MessagePlugin.error(res.message)
      }
    })
    .catch((err) => {
      console.log(err)
    })
}
// 打开退款弹窗
const handleClickRefund = (row) => {
  visible.value = true
  refundId.value = row.id
  title.value = '填写退款原因'
  label.value = '退款原因：'
}
// 确定提交
const handleSubmit = async (val) => {
  await refundOrder({
    id: refundId.value,
    cancelReason: val.description
  })
    .then((res) => {
      if (res.data.code === 200) {
        MessagePlugin.success('退款成功')
        visible.value = false
        fetchData(requestData.value)
      }else{
        MessagePlugin.error(res.data.msg)
      }
    })
    .catch((err) => {
      console.log(err)
    })
}
// 翻页
const onPageChange = (val) => {
  requestData.value.pageNo = val.defaultCurrent
  requestData.value.pageSize = val.defaultPageSize
  fetchData(requestData.value)
}
// 调度里面的翻页
const onAssignPageChange = (val) => {
  requestData.value.pageNo = val.defaultCurrent
  requestData.value.pageSize = val.defaultPageSize
  fetchData2(requestData.value)
}
// 点击指派
const handleClickAssign = (row) => {
  assignDialogVisible.value = true
  title.value = '订单指派'
  fetchData2(requestData.value)
}
</script>
<style lang="less" scoped>
.min-h {
  min-height: 720px !important;
}
</style>
