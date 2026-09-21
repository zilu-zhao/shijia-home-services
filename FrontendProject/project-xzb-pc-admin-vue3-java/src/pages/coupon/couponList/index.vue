<!-- 调度订单 -->
<template>
  <!-- 新增编辑优惠券页router -->
  <router-view v-if="url !== '/coupon/couponList'"></router-view>
  <div v-else class="base-up-wapper bgTable min-h">
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
      :activeStatus="0"
      @handleClickAssign="handleClickAssign"
      @handleClickCancel="handleClickCancel"
      @onPageChange="onPageChange"
    ></tableList>
    <!-- end -->
  </div>
  <!-- 撤销优惠券 -->
  <Delete
    :title="'确认撤销'"
    :dialog-delete-visible="visible"
    :delete-text="'此操作将结束发放优惠券，未使用的优惠券将作废，用户将无法使用该优惠券'"
    @handle-delete="handleSubmit"
    @handle-close="handleClose"
  ></Delete>
  <!-- end -->
  <!-- 指派弹窗 -->
  <assignDialog
    :visible="assignDialogVisible"
    :title="title"
    :pagination="pagination2"
    :receiveData="receiveData"
    :data="DialogFormData"
    @onPageChange="onAssignPageChange"
    @handleClose="handleClose"
    @fetchData="fetchData"
  />
</template>

<script setup lang="ts">
import { ref, watch, watchEffect } from 'vue'
import {
  getCouponList,
  getCouponRecordList,
  deleteCoupon,
  getCouponDetail
} from '@/api/coupon'
import { useRoute } from 'vue-router'
import { MessagePlugin } from 'tdesign-vue-next'

import tableList from './components/TableList.vue' // 表格
import Delete from '@/components/Delete/index.vue' // 删除弹层
import searchFormBox from './components/SearchForm.vue' // 搜索框表单
import assignDialog from './components/assignDialog.vue'
const url = ref('') // 当前路由

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
// 列表的分页
const pagination = ref({
  defaultPageSize: 10,
  total: 0,
  defaultCurrent: 1 // 默认当前页
})
// 领取记录的分页
const pagination2 = ref({
  defaultPageSize: 10,
  total: 0,
  defaultCurrent: 1 // 默认当前页
}) //领取记录分页
const requestData = ref({
  id: null,
  name: null,
  status: null,
  type: null,
  pageNo: 1,
  pageSize: 10
}) // 请求参数
const resetData = ref({
  id: null,
  name: null,
  status: null,
  type: null,
  pageNo: 1,
  pageSize: 10
}) // 请求参数
const requestData2 = ref({
  activityId: null,
  pageNo: 1,
  pageSize: 10
})
// 领取记录数据
const receiveData = ref()
// 刷新按钮触发
watch(
  () => route.query,
  () => {
    pagination.value.defaultCurrent = 1
    pagination.value.defaultPageSize = 10
    fetchData(requestData.value)
  }
)
// 搜索功能
const handleSearch = (val) => {
  requestData.value.id = val.id
  requestData.value.name = val.name
  requestData.value.status = val.status
  requestData.value.type = val.type
  requestData.value.pageNo = 1
  requestData.value.pageSize = 10
  pagination.value.defaultCurrent = 1
  pagination.value.defaultPageSize = 10
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
  await getCouponList(val)
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
// 获取领取记录数据
const fetchData2 = async (val) => {
  dataLoading.value = true
  await getCouponRecordList(val)
    .then((res) => {
      if (res.code === 200) {
        DialogFormData.value = res.data.list
        pagination2.value.total = Number(res.data.total)
        dataLoading.value = false
      }
    })
    .catch((err) => {
      console.log(err)
    })
}
// 关闭弹窗
// 获取优惠券详情
const getCouponNumDetail = async (val) => {
  await getCouponDetail(val)
    .then((res) => {
      if (res.code === 200) {
        receiveData.value = res.data
      } else {
        MessagePlugin.error(res.msg)
      }
    })
    .catch((err) => {
      console.log(err)
    })
}
// 关闭弹窗
const handleClose = () => {
  visible.value = false // 关闭新增弹窗
  assignDialogVisible.value = false // 关闭指派弹窗
}
// 点击取消
const handleClickCancel = (row) => {
  visible.value = true
  refundId.value = row.id
  title.value = '请填写取消原因'
  label.value = '取消原因：'
}

// 确定提交
const handleSubmit = async () => {
  await deleteCoupon(refundId.value)
    .then((res) => {
      if (res.code === 200) {
        MessagePlugin.success('撤销成功')
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
// 翻页
const onPageChange = (val) => {
  requestData.value.pageNo = val.defaultCurrent
  requestData.value.pageSize = val.defaultPageSize
  fetchData(requestData.value)
}
// 调度里面的翻页
const onAssignPageChange = (val) => {
  requestData2.value.pageNo = val.defaultCurrent
  requestData2.value.pageSize = val.defaultPageSize
  fetchData2(requestData.value)
}
// 点击指派
const handleClickAssign = (row) => {
  assignDialogVisible.value = true
  title.value = '领取记录'
  requestData2.value.activityId = row.id
  getCouponNumDetail(row.id)
  fetchData2(requestData2.value)
}
// 三极路由监听，解决router-view不刷新问题
watchEffect(() => {
  url.value = route.path
  fetchData(resetData.value)
})
</script>
<style lang="less" scoped>
.min-h {
  min-height: 720px !important;
}
</style>
